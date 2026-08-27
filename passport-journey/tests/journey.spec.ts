import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/")
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test("completes the first-passport happy path", async ({ page }) => {
  await page.getByRole("button", { name: /start first-passport application/i }).click()
  await expect(page.getByRole("heading", { name: "Sign in to continue" })).toBeVisible()
  await page.getByRole("button", { name: /continue with mock sign-in/i }).click()
  const continueButton = page.getByRole("button", { name: /^continue/i })
  for (const heading of ["Personal & history", "Family details", "Contacts & legal", "Address & office", "Passport options", "Documents"]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible()
    await continueButton.click()
  }
  await expect(page.getByRole("heading", { name: "Review your application" })).toBeVisible()
  await page.getByText("I have reviewed the application and the official declaration.").click()
  await page.getByRole("button", { name: /submit mock application/i }).click()
  await expect(page.getByRole("heading", { name: "Choose an appointment" })).toBeVisible()
  await page.getByRole("button", { name: /PSK Bengaluru, Lalbagh/i }).click()
  await page.getByRole("button", { name: /continue to mock payment/i }).click()
  const selects = page.locator(".payment-content [data-slot='select-trigger']")
  await selects.nth(0).click()
  await page.getByRole("option", { name: "Thu, 03 Sep" }).click()
  await selects.nth(1).click()
  await page.getByRole("option", { name: "09:30" }).click()
  await page.getByRole("button", { name: /pay mock fee and confirm/i }).click()
  await expect(page.getByText("Mock payment failed")).toBeVisible()
  await page.getByRole("button", { name: /retry mock payment/i }).click()
  await expect(page.getByRole("button", { name: /view appointment summary/i })).toBeEnabled()
  await page.getByRole("button", { name: /view appointment summary/i }).click()
  await expect(page.getByRole("heading", { name: "Prepared for your appointment" })).toBeVisible()
})

test("saves, exits, and resumes at the correct stage", async ({ page }) => {
  await page.getByRole("button", { name: /start first-passport application/i }).click()
  await page.getByRole("button", { name: /continue with mock sign-in/i }).click()
  await page.getByRole("button", { name: /^continue/i }).click()
  await page.getByRole("button", { name: "Save & exit" }).click()
  await expect(page.getByRole("heading", { name: "Continue where you left off." })).toBeVisible()
  await expect(page.getByText("Family details")).toBeVisible()
  await page.getByRole("button", { name: /resume family/i }).click()
  await expect(page.getByRole("heading", { name: "Family details" })).toBeVisible()
})

test("mobile exposes application navigation in a drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: /start first-passport application/i }).click()
  await page.getByRole("button", { name: /continue with mock sign-in/i }).click()
  await page.getByRole("button", { name: "Open application menu" }).click()
  for (const name of ["My applications", "Documents", "Help for this stage", "Save & exit"]) {
    await expect(page.getByRole("button", { name })).toBeVisible()
  }
})
