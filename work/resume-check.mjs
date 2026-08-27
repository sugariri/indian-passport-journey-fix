const pages = await fetch("http://127.0.0.1:9223/json/list").then((response) => response.json());
const page = pages.find((item) => item.type === "page");
if (!page) throw new Error("No Chrome page is available");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    console.error("BROWSER_EXCEPTION", message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  }
  if (!message.id) return;
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message));
  else handler.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, timeout = 5000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function clickButton(label, exact = true) {
  const encoded = JSON.stringify(label);
  const comparison = exact ? `=== ${encoded}` : `.includes(${encoded})`;
  try {
    await waitFor(`Array.from(document.querySelectorAll("button")).some((button) => button.textContent.replace(/\\s+/g, " ").trim() ${comparison})`);
  } catch (error) {
    const state = await evaluate(`({ heading: document.querySelector("h1")?.textContent.trim(), buttons: Array.from(document.querySelectorAll("button")).map((button) => button.textContent.replace(/\\s+/g, " ").trim()) })`);
    throw new Error(`${error.message}; current state: ${JSON.stringify(state)}`);
  }
  const clicked = await evaluate(`(() => {
    const matches = Array.from(document.querySelectorAll("button")).filter((item) => item.textContent.replace(/\\s+/g, " ").trim() ${comparison});
    const button = matches.at(-1);
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Could not click: ${label}`);
  await new Promise((resolve) => setTimeout(resolve, 80));
}

await command("Page.enable");
await command("Runtime.enable");
await command("Page.navigate", { url: "http://127.0.0.1:5174/" });
await waitFor(`document.readyState === "complete"`);
await evaluate(`localStorage.clear()`);
await command("Page.reload", { ignoreCache: true });
await waitFor(`document.readyState === "complete"`);

await clickButton("My first ordinary passport", false);
await clickButton("Sign in");
const transitions = [
  "Continue to family details",
  "Continue to other details",
  "Continue to address and proof",
  "Continue to eligibility guidance",
  "Continue to documents",
  "Continue to review",
];
for (const transition of transitions) {
  await waitFor(`document.querySelector('button[aria-label=${JSON.stringify(transition)}]') !== null`);
  if (transition === "Continue to documents") {
    const copy = await evaluate(`document.body.innerText`);
    if (copy.includes("may be eligible")) throw new Error("Eligibility copy still presents a verdict");
  }
  await clickButton("Continue");
}
await waitFor(`document.querySelector("h1")?.textContent.trim() === "Check before you submit"`);

await command("Page.reload", { ignoreCache: true });
await waitFor(`document.readyState === "complete"`);
const heading = await evaluate(`document.querySelector("h1")?.textContent.trim() || ""`);
if (heading !== "Check before you submit") {
  const body = await evaluate(`document.body.innerText.slice(0, 500)`);
  console.error(`FAIL: expected reload to resume at "Check before you submit", received "${heading}"; body: ${JSON.stringify(body)}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: reload resumed at "${heading}"`);
}
socket.close();
