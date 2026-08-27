import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  Library,
  LogOut,
  MapPin,
  Menu,
  RotateCcw,
  ShieldCheck,
  Store,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addressEvidence,
  appointmentDays,
  appointmentSlots,
  bookletChoices,
  bookletDifference,
  bookletFee,
  categoryGuidance,
  centres,
  chapterRanges,
  defaultDraft,
  documentRequirements,
  formatBirthDate,
  nameFormatNotes,
  passportNamePreview,
  readinessItems,
  steps,
  type ApplicationDraft,
  type DocumentRequirement,
  type DocumentSourceValue,
  type EvidenceState,
  type SaveState,
  type View,
} from "./passport-domain";
import heroImage from "./assets/passport-hero.png";
import "./App.css";

const STORAGE_KEY = "passport-journey-draft-v3";
const PROGRESS_KEY = "passport-journey-progress-v3";

function PrototypeNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? "prototype-note compact" : "prototype-note"}
      role="note"
    >
      <strong>Independent prototype</strong>
      <span>
        Not a Government of India service. Use synthetic information only.
      </span>
    </div>
  );
}

function Brand({
  small = false,
  onDark = false,
}: {
  small?: boolean;
  onDark?: boolean;
}) {
  return (
    <div
      className={["brand", small && "small", onDark && "on-dark"]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="brand-mark" aria-hidden="true">
        PJ
      </span>
      <span>
        <strong>Passport Journey</strong>
        <small>First-time application support</small>
      </span>
    </div>
  );
}

function loadDraft(): ApplicationDraft {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultDraft, ...JSON.parse(stored) } : defaultDraft;
  } catch {
    return defaultDraft;
  }
}

function useDraft() {
  const [draft, setDraft] = useState<ApplicationDraft>(loadDraft);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  useEffect(() => {
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft]);
  return { draft, setDraft, saveState };
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <div className="field-label-row">
        <Label>{label}</Label>
        {help && <FieldHelp label={label} help={help} />}
      </div>
      {children}
    </div>
  );
}

/**
 * The formatting notes sit behind the icon rather than under the input. They
 * are worth reading once and then in the way, so they stay reachable without
 * holding a line of vertical space on every field. The trigger is a real
 * button so focus and Escape work, and it sits outside the <label> so that
 * pressing it does not also activate the input.
 */
function FieldHelp({ label, help }: { label: string; help: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="field-help-tip"
          aria-label={`What to enter for ${label}`}
        >
          <CircleHelp aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="field-help-content">{help}</TooltipContent>
    </Tooltip>
  );
}

function RadioCards({
  value,
  onChange,
  options,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; title: string; detail?: string }[];
  name: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="radio-cards"
      aria-label={name}
    >
      {options.map((option) => (
        <Label
          key={option.value}
          className="radio-card"
          data-checked={value === option.value}
        >
          <RadioGroupItem value={option.value} />
          <span>
            <strong>{option.title}</strong>
            {option.detail && <small>{option.detail}</small>}
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function StateIcon({ state }: { state: EvidenceState }) {
  if (state === "ready") return <CheckCircle2 className="state-ready" />;
  if (state === "attention") return <AlertCircle className="state-attention" />;
  return <CircleHelp className="state-review" />;
}

/**
 * Every block on a stage is one of four kinds. Screens felt arbitrary because a
 * choice the applicant makes, a fact they report, a result the system works out
 * and the evidence behind it were all presented as equivalent. Naming the kind
 * is what makes a grouping defensible.
 */
type BlockKind = "choice" | "information" | "derived" | "evidence";

const blockKindLabel: Record<BlockKind, string> = {
  choice: "Your choice",
  information: "Your information",
  derived: "Worked out from your answers",
  evidence: "Supporting document",
};

function SectionHeading({
  kind,
  title,
  children,
}: {
  kind: BlockKind;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <span className={`kind-tag kind-${kind}`}>{blockKindLabel[kind]}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function StartScreen({
  begin,
  resume,
}: {
  begin: () => void;
  resume: () => void;
}) {
  const [location, setLocation] = useState("india");
  const [history, setHistory] = useState("first");
  const [handoff, setHandoff] = useState<string | null>(null);
  return (
    <div className="public-page">
      <header className="public-header">
        <Brand />
        <nav aria-label="Public service navigation">
          <a href="#services" className="active">
            Find your service
          </a>
          <a href="#prepare">What to expect</a>
          <a href="#other">Other passport services</a>
        </nav>
        <div className="public-actions">
          <Button variant="outline" onClick={resume}>
            Sign in
          </Button>
          <Badge variant="outline">Independent prototype</Badge>
        </div>
      </header>
      {/*
        Design plan 02 puts this directly below the primary header so status is
        established without scrolling. It used to sit after </main>, which put
        it 1,283px down the start page - past everything it was meant to frame.
      */}
      <PrototypeNotice />
      <main>
        <section className="service-hero" id="services">
          <img src={heroImage} alt="" />
          <div className="hero-copy">
            <span>Passport services</span>
            <h1>Find the right route first.</h1>
            <p>
              Explore the service that fits your situation, then sign in only
              when you know where to begin.
            </p>
          </div>
          <Card className="route-card">
            <CardHeader>
              <CardTitle>
                <h2>What do you need help with?</h2>
              </CardTitle>
              <CardDescription>
                Answer two simple questions to find the passport service that
                applies to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <section className="route-question">
                <div>
                  <strong>Where are you applying from?</strong>
                  <p>Location changes the service route.</p>
                </div>
                <div className="segmented">
                  <button
                    className={location === "india" ? "selected" : ""}
                    onClick={() => setLocation("india")}
                  >
                    From India
                  </button>
                  <button
                    className={location === "outside" ? "selected" : ""}
                    onClick={() => setLocation("outside")}
                  >
                    From outside India
                  </button>
                </div>
              </section>
              <Separator />
              {location === "outside" ? (
                <Alert>
                  <MapPin />
                  <AlertTitle>
                    Apply through an Indian Mission or Consulate
                  </AlertTitle>
                  <AlertDescription>
                    This service uses a different channel. The completed
                    prototype route is for an applicant applying from India.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <section className="route-section">
                    <strong>
                      Have you ever held an ordinary Indian passport?
                    </strong>
                    <div className="route-options">
                      <button
                        className={
                          history === "first" ? "route selected" : "route"
                        }
                        onClick={() => setHistory("first")}
                      >
                        <FileText />
                        <span>
                          <b>My first passport</b>
                          <small>
                            I have not previously held an ordinary Indian
                            passport.
                          </small>
                        </span>
                        <ChevronRight />
                      </button>
                      <button
                        className={
                          history === "existing" ? "route selected" : "route"
                        }
                        onClick={() => setHistory("existing")}
                      >
                        <BookOpen />
                        <span>
                          <b>I have or had a passport</b>
                          <small>
                            Renew, replace, or update an existing passport.
                          </small>
                        </span>
                        <ChevronRight />
                      </button>
                    </div>
                  </section>
                  {history === "existing" ? (
                    <Alert>
                      <ArrowRight />
                      <AlertTitle>Use the re-issue route</AlertTitle>
                      <AlertDescription>
                        This prototype keeps that service visible but does not
                        simulate it. Return to the official service to renew,
                        replace, or update a passport.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Button size="lg" className="start-route" onClick={begin}>
                      Start first-passport application <ArrowRight />
                    </Button>
                  )}
                  <section className="tatkaal-panel">
                    <div>
                      <span>Need it urgently?</span>
                      <strong>Check whether Tatkaal may apply</strong>
                      <p>
                        Tatkaal has separate conditions and document
                        requirements; it is not a blanket faster route.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setHandoff("Tatkaal guidance")}
                    >
                      Check Tatkaal guidance <ChevronRight />
                    </Button>
                  </section>
                  <section className="special-services" id="other">
                    <strong>Other passport services</strong>
                    <div className="route-options">
                      <button
                        className="route"
                        onClick={() =>
                          setHandoff("Diplomatic or official passport")
                        }
                      >
                        <ShieldCheck />
                        <span>
                          <b>Diplomatic or official passport</b>
                          <small>For eligible official travel.</small>
                        </span>
                        <ChevronRight />
                      </button>
                      <button
                        className="route"
                        onClick={() => setHandoff("Identity Certificate")}
                      >
                        <BadgeCheck />
                        <span>
                          <b>Identity Certificate</b>
                          <small>
                            A separate document service, not a regular passport.
                          </small>
                        </span>
                        <ChevronRight />
                      </button>
                    </div>
                  </section>
                </>
              )}
            </CardContent>
          </Card>
        </section>
        <section className="prepare-section" id="prepare">
          <div>
            <span className="eyebrow">What to expect</span>
            <h2>Know what the journey asks of you.</h2>
            <p>
              Preparation appears before commitment: expected information, draft
              saving, evidence checks, and indicative appointment availability.
            </p>
          </div>
          <div className="prepare-grid">
            <article>
              <FileCheck2 />
              <b>Prepare evidence</b>
              <p>
                See why each document is needed and whether it was digitally
                shared.
              </p>
            </article>
            <article>
              <Store />
              <b>Pause safely</b>
              <p>
                Your synthetic draft saves as you go and resumes at the last
                stage.
              </p>
            </article>
            <article>
              <CalendarDays />
              <b>Plan the visit</b>
              <p>
                Explore indicative centre availability before mock submission
                and payment.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Dialog open={Boolean(handoff)} onOpenChange={() => setHandoff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{handoff}</DialogTitle>
            <DialogDescription>
              This public service remains discoverable, but sits outside the
              completed first ordinary-passport journey in this prototype.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setHandoff(null)}>
              Return to route finder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignInScreen({
  proceed,
  back,
}: {
  proceed: () => void;
  back: () => void;
}) {
  return (
    <div className="gateway-page">
      {/* Split gateway: the visual half carries the brand and the route the
          applicant just chose, the form half carries only the account step. */}
      <aside className="gateway-visual">
        <img src={heroImage} alt="" aria-hidden="true" />
        <div className="gateway-visual-body">
          <Brand onDark />
          <section className="gateway-context">
            <span className="eyebrow">Selected service</span>
            <h1>First ordinary passport</h1>
            <p>
              Your route is ready. Sign in or create an account to start a draft
              that can be resumed later.
            </p>
            <ul>
              <li>
                <Check />
                Applying from India
              </li>
              <li>
                <Check />
                First ordinary passport
              </li>
              <li>
                <Check />
                Normal application route
              </li>
            </ul>
          </section>
          <p className="gateway-visual-foot">
            A saved draft stays on this device. Nothing is submitted anywhere.
          </p>
        </div>
      </aside>
      <main className="gateway-form">
        {/* Design plan 02: the notice heads the column the applicant is
            working in, so status is established without scrolling. */}
        <PrototypeNotice compact />
        <div className="gateway-form-body">
          <div className="gateway-form-heading">
            <h2>Sign in to continue</h2>
            <p>
              This prototype uses a simulated account. No password, OTP, or
              government system is used.
            </p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="create">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="signin-fields">
              <Field label="Email or login ID">
                <Input defaultValue="aditi.demo@example.in" />
              </Field>
              <Field label="Password">
                <Input type="password" defaultValue="prototype" />
              </Field>
            </TabsContent>
            <TabsContent value="create" className="signin-fields">
              <Field label="Email">
                <Input defaultValue="aditi.demo@example.in" />
              </Field>
              <Field label="Mobile number">
                <Input defaultValue="9876543210" />
              </Field>
            </TabsContent>
          </Tabs>
          <div className="gateway-form-actions">
            <Button variant="outline" onClick={back}>
              <ArrowLeft />
              Back
            </Button>
            <Button onClick={proceed}>
              Continue with mock sign-in <ArrowRight />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SaveStatus({ state }: { state: SaveState }) {
  return (
    <span className={`save-state ${state}`} aria-live="polite">
      {state === "saving" ? (
        <Clock3 />
      ) : state === "saved" ? (
        <CheckCircle2 />
      ) : (
        <AlertCircle />
      )}
      {state === "saving"
        ? "Saving…"
        : state === "saved"
          ? "Draft saved"
          : "Could not save"}
    </span>
  );
}

function ProgressNavigator({
  current,
  furthest,
  onStep,
}: {
  current: number;
  furthest: number;
  onStep: (index: number) => void;
}) {
  return (
    <div className="progress-wrap">
      <div className="chapters" aria-hidden="true">
        {chapterRanges.map((chapter) => (
          <span
            key={chapter.label}
            style={{ gridColumn: `${chapter.start + 1}/${chapter.end + 2}` }}
          >
            {chapter.label}
          </span>
        ))}
      </div>
      <nav className="step-nav" aria-label="Application stages">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              className={
                index === current
                  ? "current"
                  : index < current
                    ? "complete"
                    : ""
              }
              disabled={index > furthest}
              onClick={() => onStep(index)}
              aria-current={index === current ? "step" : undefined}
            >
              <span>{index < current ? <Check /> : <Icon />}</span>
              <b>{step.short}</b>
              <small>{index + 1}</small>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Rail({
  current,
  saveExit,
  dashboard,
  library,
  help,
}: {
  current: number;
  saveExit: () => void;
  dashboard: () => void;
  library: () => void;
  help: () => void;
}) {
  return (
    <aside className="app-rail">
      <Brand small />
      <div className="application-summary">
        <span>Fresh ordinary passport</span>
        <strong>Draft · Stage {current + 1} of 9</strong>
      </div>
      <nav aria-label="Application navigation">
        <button onClick={dashboard}>
          <Home />
          My applications
        </button>
        {/* Reference, not the stage — see DocumentLibrary. */}
        <button onClick={library}>
          <Library />
          Document library
        </button>
        <button onClick={help}>
          <HelpCircle />
          Help for this stage
        </button>
      </nav>
      <div className="rail-bottom">
        <button onClick={saveExit}>
          <LogOut />
          Save & exit
        </button>
        <p>Your draft is saved before you leave.</p>
      </div>
    </aside>
  );
}

/* Which stage each proof supports. The document *decision* is always made on
   the Documents stage; this maps a document to the answer it stands behind,
   which is the thing the library is for. */
const documentSupports: Record<DocumentRequirement["id"], number> = {
  birth: 0,
  address: 3,
  category: 4,
};

const documentSourceReference = [
  {
    title: "Shared through DigiLocker",
    detail:
      "Provided digitally in this mock journey. Digital sharing is shown separately from what still has to be produced in person.",
  },
  {
    title: "Uploaded to this application",
    detail:
      "Attached here. This prototype records only that you attached something — no file is sent anywhere.",
  },
  {
    title: "Original carried to the appointment",
    detail: "Not shared digitally, so the document itself has to be with you.",
  },
  {
    title: "Not decided yet",
    detail:
      "Every proof needs one of the routes above before the declaration stage will let you through.",
  },
];

/*
  The rail's entry opens this, not the Documents stage. They answer different
  questions: the stage asks "where does each document come from for this
  application", the library answers "what documents does this journey involve
  at all, and what does each one stand behind". Reference, not a form.

  What it deliberately does not contain: the accepted-document lists. The
  prototype does not reproduce those anywhere, and a library is exactly where
  inventing them would look most authoritative.
*/
function DocumentLibrary({
  open,
  onOpenChange,
  draft,
  openStage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ApplicationDraft;
  openStage: (n: number) => void;
}) {
  const docs = documentRequirements(draft);
  const outstanding = docs.filter((doc) => doc.state !== "ready").length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doc-library">
        <DialogHeader>
          <DialogTitle>Document library</DialogTitle>
          <DialogDescription>
            Every document this application can involve, what each one stands
            behind, and where it is decided.{" "}
            {outstanding === 0
              ? "All three have a preparation status."
              : `${outstanding} of ${docs.length} still needs a decision.`}
          </DialogDescription>
        </DialogHeader>

        <section className="doc-library-section">
          <h3>What this application asks you to support</h3>
          {docs.map((doc) => {
            const supports = documentSupports[doc.id];
            return (
              <article className="doc-library-item" key={doc.id}>
                <StateIcon state={doc.state} />
                <div>
                  <div className="doc-library-head">
                    <strong>{doc.title}</strong>
                    <Badge
                      variant={
                        doc.source === "shared" || doc.source === "upload"
                          ? "default"
                          : "outline"
                      }
                    >
                      {doc.digitalStatus}
                    </Badge>
                  </div>
                  <p>{doc.purpose}</p>
                  <dl>
                    <div>
                      <dt>Stands behind</dt>
                      <dd>{steps[supports].label}</dd>
                    </div>
                    <div>
                      <dt>Decided on</dt>
                      <dd>{steps[5].label}</dd>
                    </div>
                    <div>
                      <dt>At the appointment</dt>
                      <dd>{doc.appointmentAction}</dd>
                    </div>
                  </dl>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      openStage(supports);
                    }}
                  >
                    Open {steps[supports].label}
                    <ChevronRight />
                  </Button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="doc-library-section">
          <h3>How a document can be provided</h3>
          <p className="doc-library-lead">
            The same four routes apply to every proof above, so the wording on
            each row means the same thing everywhere.
          </p>
          <dl className="doc-library-routes">
            {documentSourceReference.map((route) => (
              <div key={route.title}>
                <dt>{route.title}</dt>
                <dd>{route.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Alert>
          <ShieldCheck />
          <AlertTitle>Which specific documents count</AlertTitle>
          <AlertDescription>
            The official accepted-document lists decide that, and they are the
            authority. This prototype points at them rather than reproducing
            them, because reproducing them wrongly would be worse than not
            carrying them here at all. Check the official list for each proof
            before your appointment.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              openStage(5);
            }}
          >
            Set how each is provided
            <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HelpDialog({
  open,
  onOpenChange,
  current,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: number;
}) {
  const help = [
    "Use names and dates from the supporting records you plan to use.",
    "Family questions follow the official fresh-application structure; ask for assistance rather than guessing.",
    "Emergency contact and local references support this application; legal answers remain separate.",
    "Enter your present address and compare it with an accepted proof. A correction is different from a changed residence.",
    "Answer plain-language questions; the interface suggests a category instead of asking you to self-classify.",
    "Each document shows its purpose, digital-sharing state, and what remains for the appointment.",
    "Resolve every needs-attention item before the declaration and mock submission.",
    "Indicative availability is planning information. A slot is selected only in the mock payment step.",
    "Use this summary to prepare for the appointment; it is not an approval or guarantee.",
  ][current];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help with {steps[current].label}</DialogTitle>
          <DialogDescription>{help}</DialogDescription>
        </DialogHeader>
        <Alert>
          <CircleHelp />
          <AlertTitle>Need human help?</AlertTitle>
          <AlertDescription>
            A production service should offer assisted support, language choice,
            and an accessible contact route here.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Return to application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationShell({
  current,
  furthest,
  saveState,
  onStep,
  dashboard,
  draft,
  saveExit,
  signOut,
  children,
}: {
  current: number;
  furthest: number;
  saveState: SaveState;
  onStep: (n: number) => void;
  dashboard: () => void;
  draft: ApplicationDraft;
  saveExit: () => void;
  signOut: () => void;
  children: ReactNode;
}) {
  const [help, setHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [library, setLibrary] = useState(false);
  return (
    <div className="workspace">
      <Rail
        current={current}
        dashboard={dashboard}
        library={() => setLibrary(true)}
        help={() => setHelp(true)}
        saveExit={saveExit}
      />
      <div className="workspace-body">
        <header className="workspace-header">
          <div className="mobile-brand">
            <Brand small />
          </div>
          <Button
            className="mobile-menu"
            variant="outline"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Open application menu"
          >
            <Menu />
          </Button>
          <div>
            <span>Application reference</span>
            <strong>FP-MOCK-2026-0148</strong>
          </div>
          <SaveStatus state={saveState} />
          <div className="user-menu">
            <button
              className="user-chip"
              onClick={() => setUserOpen((open) => !open)}
              aria-expanded={userOpen}
              aria-haspopup="true"
            >
              <span className="user-initial" aria-hidden="true">
                A
              </span>
              <span className="user-mail">aditi.demo@example.in</span>
            </button>
            {userOpen && (
              <div className="user-pop" role="menu">
                <div>
                  <strong>Aditi Demo</strong>
                  <small>aditi.demo@example.in · mock account</small>
                </div>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </header>
        <PrototypeNotice compact />
        <ProgressNavigator
          current={current}
          furthest={furthest}
          onStep={onStep}
        />
        <main id="main-content" className="step-main">
          {children}
        </main>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Application menu</SheetTitle>
            <SheetDescription>
              Draft · Stage {current + 1} of 9
            </SheetDescription>
          </SheetHeader>
          <div className="mobile-nav">
            <Button variant="ghost" onClick={dashboard}>
              <Home />
              My applications
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMenuOpen(false);
                setLibrary(true);
              }}
            >
              <Library />
              Document library
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMenuOpen(false);
                setHelp(true);
              }}
            >
              <HelpCircle />
              Help for this stage
            </Button>
            <Button variant="ghost" onClick={saveExit}>
              <LogOut />
              Save & exit
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <HelpDialog open={help} onOpenChange={setHelp} current={current} />
      <DocumentLibrary
        open={library}
        onOpenChange={setLibrary}
        draft={draft}
        openStage={onStep}
      />
    </div>
  );
}

type StepProps = {
  draft: ApplicationDraft;
  update: <K extends keyof ApplicationDraft>(
    key: K,
    value: ApplicationDraft[K],
  ) => void;
  next: () => void;
  back: () => void;
  jump: (n: number) => void;
  /** Save the draft and leave to My applications — the exit every declared stop offers. */
  exit: () => void;
  /** Leave to the public services list, for stops that belong to a different service. */
  services: () => void;
};

function StepFrame({
  eyebrow,
  title,
  intro,
  children,
  back,
  next,
  nextLabel = "Continue",
  nextDisabled = false,
  submit = false,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  back?: () => void;
  next?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Terminal action rather than forward navigation: no arrow, heavier weight. */
  submit?: boolean;
}) {
  return (
    <>
      <header className="step-heading">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <Card className="form-card">
        <CardContent>{children}</CardContent>
        {(back || next) && (
          <CardFooter
            className={`step-actions${submit ? " step-actions--submit" : ""}`}
          >
            {back ? (
              <Button variant="outline" onClick={back}>
                <ArrowLeft />
                Back
              </Button>
            ) : (
              <span />
            )}
            {next && (
              <Button onClick={next} disabled={nextDisabled}>
                {nextLabel}
                {!submit && <ArrowRight />}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </>
  );
}

/**
 * A declared stop. The register's complaint about the dead ends was never that
 * they exist — it is that they were undeclared and offered no way out. This
 * keeps the stop, names it, and gives it a real exit. Forward motion still
 * lives only in the footer; this is a link out, not a second primary.
 */
function DeadEnd({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <Alert>
      <CircleHelp />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {children}
        <Button variant="link" className="dead-end-exit" onClick={onAction}>
          {actionLabel}
          <ChevronRight />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function HistoryQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-question inline-question--compact">
      <Label>{label}</Label>
      <RadioCards
        name={label}
        value={value}
        onChange={onChange}
        options={[
          { value: "no", title: "No" },
          { value: "yes", title: "Yes" },
          { value: "unsure", title: "Not sure" },
        ]}
      />
    </div>
  );
}

function NamePreview({ draft }: { draft: ApplicationDraft }) {
  const preview = passportNamePreview(draft);
  const notes = nameFormatNotes(draft);
  if (preview.isEmpty) return null;
  return (
    <div className="name-preview block block--derived">
      {/*
        Everything except the result folds away, so the closed state is one row
        - a preview nobody opens is not a preview, but a block that costs six
        lines while agreeing with you is not worth them either.

        The "derived" kind is still declared while closed: the gold left accent
        bar carries that axis on its own (see the two-axis note above the
        .block-- rules), so the pill, which is the same axis in words, can fold
        with the detail. Format warnings stay outside the fold - see below.
      */}
      <Accordion type="single" collapsible className="name-preview-fold">
        <AccordionItem value="name">
          <AccordionTrigger>
            <span className="name-preview-head">
              <strong>Your passport would read</strong>
              <span className="name-preview-line">
                {preview.hasSurname ? `${preview.surname}, ` : ""}
                {preview.given || "not entered yet"}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <span className="kind-tag kind-derived">
              {blockKindLabel.derived}
            </span>
            <dl>
              <div>
                <dt>Surname</dt>
                <dd>
                  {preview.hasSurname ? (
                    preview.surname
                  ) : (
                    <em>blank — you do not use a surname</em>
                  )}
                </dd>
              </div>
              <div>
                <dt>Given name(s)</dt>
                <dd>{preview.given || <em>not entered yet</em>}</dd>
              </div>
            </dl>
            <p>
              Check this against the record you will carry. A name split across
              the wrong field is corrected at the passport office, not here.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {notes.length > 0 && (
        <Alert className="evidence-attention">
          <AlertCircle />
          <AlertTitle>Check how the name is written</AlertTitle>
          <AlertDescription>
            <ul>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function PersonalStep({ draft, update, next, back, services }: StepProps) {
  const blocked =
    !draft.givenName ||
    !draft.dateOfBirth ||
    draft.heldOrdinaryPassport !== "no";
  return (
    <StepFrame
      eyebrow="About you · 1 of 3"
      title="Personal & history"
      intro="Tell us who the passport is for, then answer only the history questions relevant to a fresh application."
      back={back}
      next={next}
      nextDisabled={blocked}
    >
      <section className="form-section">
        <SectionHeading kind="information" title="Your name">
          Two name fields, not three — there is no separate middle-name box.
        </SectionHeading>
        <div className="form-grid">
          <Field
            label="Given name(s)"
            help="Your first name followed by your complete middle name, if you have one. Write names in full — no initials, no titles."
          >
            <Input
              value={draft.givenName}
              onChange={(e) => update("givenName", e.target.value)}
            />
          </Field>
          <Field
            label="Surname"
            help="Leave this blank only if you do not use a surname. In that case your complete name goes under Given name(s)."
          >
            <Input
              value={draft.surname}
              onChange={(e) => update("surname", e.target.value)}
            />
          </Field>
        </div>
        <NamePreview draft={draft} />
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Birth details">
          Use the date and place exactly as they appear on the record you plan
          to provide as proof of date of birth.
        </SectionHeading>
        <div className="form-grid">
          <Field label="Date of birth">
            <Input
              type="date"
              value={draft.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field
            label="Place of birth"
            help="Written exactly as on the record you will provide. If your records disagree about place of birth, that is worth resolving before applying — it can be checked against your documents."
          >
            <Input
              value={draft.placeOfBirth}
              onChange={(e) => update("placeOfBirth", e.target.value)}
            />
          </Field>
        </div>
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Passport history">
          Three questions, because a fresh applicant can still have other
          passport or application history. Answering No to all three keeps you
          on this route.
        </SectionHeading>
        <HistoryQuestion
          label="Have you ever held an ordinary Indian passport?"
          value={draft.heldOrdinaryPassport}
          onChange={(v) =>
            update(
              "heldOrdinaryPassport",
              v as ApplicationDraft["heldOrdinaryPassport"],
            )
          }
        />
        <HistoryQuestion
          label="Have you held a diplomatic or official passport?"
          value={draft.heldOtherPassport}
          onChange={(v) =>
            update(
              "heldOtherPassport",
              v as ApplicationDraft["heldOtherPassport"],
            )
          }
        />
        <HistoryQuestion
          label="Have you applied before but not received a passport?"
          value={draft.priorApplication}
          onChange={(v) =>
            update(
              "priorApplication",
              v as ApplicationDraft["priorApplication"],
            )
          }
        />
        {draft.heldOrdinaryPassport !== "no" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>This may not be a fresh-passport route</AlertTitle>
            <AlertDescription>
              A passport you hold or held makes this a re-issue, not a fresh
              application. Your draft stays saved if you leave.
              <Button
                variant="link"
                className="dead-end-exit"
                onClick={services}
              >
                See the passport services list
                <ChevronRight />
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </section>
    </StepFrame>
  );
}

function FamilyStep({ draft, update, next, back, exit }: StepProps) {
  return (
    <StepFrame
      eyebrow="About you · 2 of 3"
      title="Family details"
      intro="Answer which situation applies first. Only the fields that belong to that situation are then shown."
      back={back}
      next={next}
      nextDisabled={
        draft.familySituation !== "standard" ||
        !draft.fatherName ||
        !draft.motherName
      }
    >
      <section className="form-section">
        <SectionHeading
          kind="information"
          title="Which situation applies to you?"
        >
          Asked before the name fields because it decides which of them this
          prototype then shows. The official form requires both parents'
          details; which fields a different situation needs is not something
          this prototype knows.
        </SectionHeading>
        <RadioCards
          name="Family situation"
          value={draft.familySituation}
          onChange={(v) =>
            update("familySituation", v as ApplicationDraft["familySituation"])
          }
          options={[
            {
              value: "standard",
              title: "Both parents' details apply",
              detail: "The route demonstrated in this prototype.",
            },
            {
              value: "guardian",
              title: "A legal guardian applies",
              detail: "This prototype does not carry the guardian route.",
            },
            {
              value: "help",
              title: "I need help answering",
              detail:
                "Single-parent, adoption or other situations. Not an option on the official form - it is ours, and it leads to help rather than onward.",
            },
          ]}
        />
      </section>
      {draft.familySituation === "standard" ? (
        <>
          <Separator />
          <section className="form-section">
            <SectionHeading kind="information" title="Parents' names">
              Each name follows the same two-field rule as your own: given
              name(s) first, including any middle name, then the surname.
            </SectionHeading>
            <div className="form-grid">
              <Field
                label="Father's name"
                help="Given name(s) followed by surname, written in full."
              >
                <Input
                  value={draft.fatherName}
                  onChange={(e) => update("fatherName", e.target.value)}
                />
              </Field>
              <Field
                label="Mother's name"
                help="Given name(s) followed by surname, written in full."
              >
                <Input
                  value={draft.motherName}
                  onChange={(e) => update("motherName", e.target.value)}
                />
              </Field>
            </div>
          </section>
        </>
      ) : (
        <DeadEnd
          title={
            draft.familySituation === "guardian"
              ? "The guardian route is not built in this prototype"
              : "This situation needs the assisted route"
          }
          actionLabel="Save and return to My applications"
          onAction={exit}
        >
          A production service reveals the official fields and support for
          this situation here. This prototype does not invent those rules, so
          the route ends here rather than pretending to continue. Everything
          you have entered is saved.
        </DeadEnd>
      )}
    </StepFrame>
  );
}

function ContactsStep({ draft, update, next, back, exit }: StepProps) {
  return (
    <StepFrame
      eyebrow="About you · 3 of 3"
      title="Contacts & legal"
      intro="Two kinds of contact are requested for two different reasons. The legal-history declaration is kept separate from both."
      back={back}
      next={next}
      nextDisabled={
        !draft.emergencyName ||
        draft.emergencyPhone.length < 10 ||
        !draft.referenceOne ||
        !draft.referenceTwo ||
        draft.legalCheck !== "no"
      }
    >
      <section className="form-section">
        <SectionHeading kind="information" title="Emergency contact">
          One person the service can reach about your application if it cannot
          reach you. Separate from the two references below.
        </SectionHeading>
        <div className="form-grid">
          <Field label="Full name">
            <Input
              value={draft.emergencyName}
              onChange={(e) => update("emergencyName", e.target.value)}
            />
          </Field>
          <Field label="Mobile number">
            <Input
              inputMode="numeric"
              value={draft.emergencyPhone}
              onChange={(e) => update("emergencyPhone", e.target.value)}
            />
          </Field>
        </div>
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Two local references">
          A different purpose from the emergency contact: two people who appear
          as required fields on the official fresh-passport form. They are kept
          for that reason, not because the redesign wants them.
        </SectionHeading>
        <div className="form-grid">
          <Field label="Reference 1">
            <Input
              value={draft.referenceOne}
              onChange={(e) => update("referenceOne", e.target.value)}
            />
          </Field>
          <Field label="Reference 2">
            <Input
              value={draft.referenceTwo}
              onChange={(e) => update("referenceTwo", e.target.value)}
            />
          </Field>
        </div>
      </section>
      <Separator />
      <section className="form-section block block--information block--emphasis">
        <SectionHeading kind="information" title="Legal history">
          A different weight from everything above. The official form asks a set
          of legal-history questions with real consequences, so this stays a
          separate declaration rather than another field in the contact list.
        </SectionHeading>
        <div className="inline-question">
          <Label>
            Do any of the legal-history conditions in the official form apply to
            you?
          </Label>
          <RadioCards
            name="Legal history"
            value={draft.legalCheck}
            onChange={(v) =>
              update("legalCheck", v as ApplicationDraft["legalCheck"])
            }
            options={[
              { value: "no", title: "No" },
              { value: "yes", title: "Yes" },
              { value: "help", title: "I need help" },
            ]}
          />
        </div>
      </section>
      {draft.legalCheck !== "no" && (
        <DeadEnd
          title="Do not guess here"
          actionLabel="Save and return to My applications"
          onAction={exit}
        >
          Review the unchanged official questions or use assisted support. The
          prototype does not determine legal eligibility. Your draft is saved
          while you check.
        </DeadEnd>
      )}
    </StepFrame>
  );
}

function AddressStep({ draft, update, next, back }: StepProps) {
  const evidence = addressEvidence(draft);
  return (
    <StepFrame
      eyebrow="Address & evidence · 1 of 3"
      title="Address & office"
      intro="Three separate things in order: the address you report, the document that supports it, and the office that follows from it."
      back={back}
      next={next}
      nextDisabled={
        !draft.address || draft.pin.length !== 6 || evidence.state !== "ready"
      }
    >
      <section className="form-section">
        <SectionHeading kind="information" title="Present address">
          Where you currently live. This is the address the application is
          processed against — not a postal address for correspondence.
        </SectionHeading>
        <div className="form-grid">
          <Field label="House number and street">
            <Input
              value={draft.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </Field>
          <Field label="Town or city">
            <Input
              value={draft.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </Field>
          <Field
            label="PIN code"
            help="Used in this mock journey to show the relevant RPO and nearby centres."
          >
            <Input
              inputMode="numeric"
              value={draft.pin}
              onChange={(e) => update("pin", e.target.value)}
            />
          </Field>
        </div>
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="evidence" title="Proof for that address">
          A separate thing from the address itself: which document you will
          actually show. Does the proof you plan to use support the address
          entered above?
        </SectionHeading>
        <RadioCards
          name="Address proof"
          value={draft.addressProof}
          onChange={(v) =>
            update("addressProof", v as ApplicationDraft["addressProof"])
          }
          options={[
            {
              value: "match",
              title: "Yes, it supports this address",
              detail:
                "The wording may be formatted differently; this is not a character-for-character claim.",
            },
            { value: "rent", title: "I use an accepted rental document" },
            { value: "different", title: "It shows a different address" },
            { value: "unsure", title: "I need to check" },
          ]}
        />
        <Alert className={`evidence-${evidence.state}`}>
          <StateIcon state={evidence.state} />
          <AlertTitle>{evidence.title}</AlertTitle>
          <AlertDescription>{evidence.detail}</AlertDescription>
        </Alert>
      </section>
      {draft.pin.length === 6 && (
        <section className="block block--derived block--row">
          <Landmark />
          <div>
            <span className="kind-tag kind-derived">
              {blockKindLabel.derived}
            </span>
            <strong>Regional Passport Office: Bengaluru</strong>
            <p>
              PSK and POPSK are appointment centres under an RPO. Eligible
              centres are shown later from the present-address context.
            </p>
          </div>
        </section>
      )}
      <Accordion type="single" collapsible>
        <AccordionItem value="correction">
          <AccordionTrigger>
            What if I notice an address mistake later?
          </AccordionTrigger>
          <AccordionContent>
            A typo found in the printed form may have an in-centre correction
            route. A changed residential address can have different
            consequences, including closure and fee loss in some official
            notices. The redesign exposes this distinction before submission
            rather than promising that every address change can be fixed.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StepFrame>
  );
}

const educationLabels: Record<ApplicationDraft["highestEducation"], string> = {
  graduate: "Graduate or above",
  school: "School education",
  another: "Another qualification",
  unsure: "Not sure",
};

const abroadLabels: Record<ApplicationDraft["employmentAbroad"], string> = {
  no: "No",
  yes: "Yes",
  unsure: "Not sure",
};

function OptionsStep({ draft, update, next, back }: StepProps) {
  const guidance = categoryGuidance(draft);
  return (
    <StepFrame
      eyebrow="Address & evidence · 2 of 3"
      title="Passport options"
      intro="Nothing on this page is a decision you make. It records two facts about you and shows what they point to — you are not asked to classify yourself."
      back={back}
      next={next}
    >
      <section className="form-section">
        <SectionHeading
          kind="information"
          title="Two facts used to work out your category"
        >
          These two are not choices about your passport. They are facts about
          you, and the official rules use them to decide whether emigration
          check requirements apply. You do not need to know what ECR or Non-ECR
          means to answer them.
        </SectionHeading>
        <Field label="What is your highest completed education?">
          <Select
            value={draft.highestEducation}
            onValueChange={(v) =>
              update(
                "highestEducation",
                v as ApplicationDraft["highestEducation"],
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="graduate">Graduate or above</SelectItem>
              <SelectItem value="school">School education</SelectItem>
              <SelectItem value="another">Another qualification</SelectItem>
              <SelectItem value="unsure">Not sure</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Are you applying for employment in a country where emigration clearance may apply?">
          <RadioCards
            name="Employment abroad"
            value={draft.employmentAbroad}
            onChange={(v) =>
              update(
                "employmentAbroad",
                v as ApplicationDraft["employmentAbroad"],
              )
            }
            options={[
              { value: "no", title: "No" },
              { value: "yes", title: "Yes" },
              { value: "unsure", title: "Not sure" },
            ]}
          />
        </Field>
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="derived" title="What those two answers point to">
          A result, not an option — worked out from exactly the two answers
          shown here, and nothing else.
        </SectionHeading>
        <div className="derivation-trace">
          <div>
            <span>Highest completed education</span>
            <strong>{educationLabels[draft.highestEducation]}</strong>
          </div>
          <div>
            <span>Employment where clearance may apply</span>
            <strong>{abroadLabels[draft.employmentAbroad]}</strong>
          </div>
        </div>
        <Alert className={`evidence-${guidance.state}`}>
          <StateIcon state={guidance.state} />
          <AlertTitle>{guidance.label}</AlertTitle>
          <AlertDescription>{guidance.detail}</AlertDescription>
        </Alert>
        {guidance.state !== "ready" && (
          <p className="override-note">
            This does not stop you. You can continue and come back — the review
            stage lists anything still open, and the official process makes the
            final determination.
          </p>
        )}
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Booklet size and fee">
          Chosen at the payment stage, where the price decision actually lands
          — not here. The two sizes and their mock fees appear next to the
          payment button.
        </SectionHeading>
      </section>
    </StepFrame>
  );
}

const documentDraftKeys = {
  birth: ["birthDocument", "birthDocumentName"],
  address: ["addressDocument", "addressDocumentName"],
  category: ["educationDocument", "educationDocumentName"],
} as const;

function DocumentsStep({ draft, update, next, back }: StepProps) {
  const docs = documentRequirements(draft);
  const blocked = docs.some((doc) => doc.state !== "ready");
  return (
    <StepFrame
      eyebrow="Address & evidence · 3 of 3"
      title="Documents"
      intro="Every row here is evidence for something you already entered. The only question each row asks is where the document comes from."
      back={back}
      next={next}
      nextDisabled={blocked}
    >
      {docs.map((doc) => {
        const [sourceKey, nameKey] = documentDraftKeys[doc.id];
        return (
          <article className="document-row" key={doc.id}>
            <StateIcon state={doc.state} />
            <div>
              <div className="document-title">
                <h2>{doc.title}</h2>
                <Badge
                  variant={
                    doc.source === "shared" || doc.source === "upload"
                      ? "default"
                      : "outline"
                  }
                >
                  {doc.digitalStatus}
                </Badge>
              </div>
              <p>{doc.purpose}</p>
              <strong>{doc.appointmentAction}</strong>
              <Select
                value={draft[sourceKey]}
                onValueChange={(v) =>
                  update(sourceKey, v as DocumentSourceValue)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">
                    Mock shared through DigiLocker
                  </SelectItem>
                  <SelectItem value="upload">
                    Upload from this device
                  </SelectItem>
                  <SelectItem value="carry">
                    Carry the original to the appointment
                  </SelectItem>
                  <SelectItem value="missing">
                    I do not have it ready
                  </SelectItem>
                </SelectContent>
              </Select>
              {draft[sourceKey] === "upload" && (
                <div className="mock-upload">
                  <Input
                    type="file"
                    aria-label={`Attach a file as ${doc.title.toLowerCase()}`}
                    onChange={(e) =>
                      update(nameKey, e.target.files?.[0]?.name ?? "")
                    }
                  />
                  <small>
                    {draft[nameKey] ? `Attached: ${draft[nameKey]}. ` : ""}
                    The file itself is not sent anywhere — this prototype
                    records only that you attached it.
                  </small>
                </div>
              )}
              <Accordion type="single" collapsible className="doc-proof">
                <AccordionItem value="accepted">
                  <AccordionTrigger>
                    Which documents are accepted as this proof?
                  </AccordionTrigger>
                  <AccordionContent>
                    The official accepted-document list applies here. This
                    prototype does not reproduce that list, because reproducing
                    it wrongly is worse than pointing at it. Check the official
                    list for this proof before the appointment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </article>
        );
      })}
      <Alert>
        <ShieldCheck />
        <AlertTitle>What DigiLocker changes</AlertTitle>
        <AlertDescription>
          Documents shown as digitally shared are distinguished from documents
          that still need to be kept ready for verification. This prototype does
          not claim that every shared document is exempt from every in-person
          check.
        </AlertDescription>
      </Alert>
    </StepFrame>
  );
}

function ReviewStep({ draft, update, next, back, jump }: StepProps) {
  const items = readinessItems(draft);
  const name = passportNamePreview(draft);
  const nameNotes = nameFormatNotes(draft);
  const blocked =
    items.some((item) => item.blocking) || draft.legalCheck !== "no";
  return (
    <StepFrame
      eyebrow="Review & submit"
      title="Review your application"
      intro="What you chose and what was worked out for you are listed separately, so a mistake in either one is visible before the declaration appears."
      back={back}
      next={next}
      nextLabel="Submit mock application"
      nextDisabled={blocked || !draft.declaration}
      submit
    >
      <section className="form-section">
        <SectionHeading kind="derived" title="Readiness checks">
          Worked out from what you have entered so far. Anything still open is
          shown with the action that closes it.
        </SectionHeading>
        <div className="readiness-grid">
          {items.map((item) => (
            <article
              key={item.title}
              className={`readiness-item ${item.state}`}
            >
              <StateIcon state={item.state} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
                <Button variant="link" onClick={() => jump(item.step)}>
                  {item.action}
                  <ChevronRight />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Your answers">
          Complete and editable. Use Edit to change any answer before the
          declaration.
        </SectionHeading>
        <div className="answers-review">
          <div>
            <span>Name as the passport would print it</span>
            <strong>
              {name.hasSurname ? name.surname : "(no surname)"} /{" "}
              {name.given || "(not entered)"}
            </strong>
            <p>Surname first, then given name(s) including any middle name.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => jump(0)}>
            Edit
          </Button>
          <div>
            <span>Birth details</span>
            <strong>{formatBirthDate(draft.dateOfBirth)}</strong>
            <p>{draft.placeOfBirth}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => jump(0)}>
            Edit
          </Button>
          <div>
            <span>Present address</span>
            <strong>{draft.address}</strong>
            <p>
              {draft.city} · {draft.pin}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => jump(3)}>
            Edit
          </Button>
          <div>
            <span>What you chose</span>
            <strong>Fresh ordinary · Normal route</strong>
            <p>
              Booklet size and fee are chosen at the payment stage, after this
              review — where the price decision actually lands.
            </p>
          </div>
          <span aria-hidden="true" />
          <div>
            <span>What was worked out for you</span>
            <strong>{categoryGuidance(draft).label}</strong>
            <p>
              Not a choice you made. The official process makes the final
              determination.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => jump(4)}>
            Edit
          </Button>
        </div>
      </section>
      {nameNotes.length > 0 && (
        <Alert className="evidence-attention">
          <AlertCircle />
          <AlertTitle>
            Check how the name is written before submitting
          </AlertTitle>
          <AlertDescription>
            <ul>
              {nameNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {!blocked && (
        <Label className="declaration-check">
          <Checkbox
            checked={draft.declaration}
            onCheckedChange={(checked) =>
              update("declaration", checked === true)
            }
          />
          <span>
            <strong>
              I have reviewed the application and the official declaration.
            </strong>
            <small>
              In a production service, the statutory declaration must appear
              here unchanged. This synthetic prototype records only a mock
              acknowledgement.
            </small>
          </span>
        </Label>
      )}
    </StepFrame>
  );
}

function AppointmentStep({ draft, update, next, back }: StepProps) {
  const paid = draft.payment === "paid";
  const pay = () => {
    update("payment", "processing");
    window.setTimeout(() => update("payment", "failed"), 700);
  };
  const retry = () => {
    update("payment", "processing");
    window.setTimeout(() => {
      update("payment", "paid");
      toast.success("Mock payment completed. Appointment confirmed.");
    }, 700);
  };
  return (
    <StepFrame
      eyebrow="Appointment · 1 of 2"
      title="Choose an appointment"
      intro="Booklet, centre, payment, then the exact slot — in that order, because payment is what confirms the appointment. The same order as the official flow."
      back={back}
      next={next}
      nextLabel="View appointment summary"
      nextDisabled={!paid || draft.day === null || draft.slot === null}
    >
      <section className="form-section">
        <SectionHeading kind="choice" title="Booklet size">
          {bookletDifference} This choice sits here, next to the payment,
          because this is where its price lands.
        </SectionHeading>
        <RadioCards
          name="Booklet"
          value={draft.booklet}
          onChange={(v) => update("booklet", v as ApplicationDraft["booklet"])}
          options={bookletChoices.map((choice) => ({
            value: choice.value,
            title: choice.title,
            detail: `${choice.detail} Mock indicative fee ${bookletFee(choice.value)}.`,
          }))}
        />
        <div className="fee-row">
          <span>Mock application fee</span>
          <strong>{bookletFee(draft.booklet)}</strong>
        </div>
      </section>
      <Separator />
      <Alert>
        <MapPin />
        <AlertTitle>How the locations relate</AlertTitle>
        <AlertDescription>
          Present address 560038 → RPO Bengaluru → eligible PSK/POPSK
          appointment centres. PSK and POPSK are service-centre types, not
          states or RPOs.
        </AlertDescription>
      </Alert>
      <section className="centre-list">
        <div className="section-heading">
          <h2>Select a centre</h2>
          <p>Availability below is synthetic and indicative until payment.</p>
        </div>
        {centres.map((centre, index) => (
          <button
            key={centre.name}
            className={draft.centre === index ? "centre selected" : "centre"}
            onClick={() => update("centre", index)}
          >
            <span className="centre-type">{centre.type}</span>
            <span>
              <strong>{centre.name}</strong>
              <small>{centre.address}</small>
              <small>
                {centre.rpo} RPO · {centre.distance}
              </small>
            </span>
            <span className="earliest">
              Indicative
              <br />
              <b>{centre.earliest}</b>
            </span>
          </button>
        ))}
      </section>
      {draft.centre !== null && (
        <section className="block block--derived block--row">
          <CalendarDays />
          <div>
            <span className="kind-tag kind-derived">
              {blockKindLabel.derived}
            </span>
            <strong>
              Indicative availability at {centres[draft.centre].name}
            </strong>
            <p>
              Earliest shown: {centres[draft.centre].earliest}.{" "}
              {paid
                ? "Your confirmed date and time are selected below."
                : "The exact slot unlocks after the mock payment below."}
            </p>
          </div>
        </section>
      )}
      <Separator />
      <section className="form-section">
        <SectionHeading kind="information" title="Mock payment">
          Payment confirms the appointment, so it comes before the exact slot —
          the same order as the official flow. No real payment is made and no
          government appointment exists.
        </SectionHeading>
        {draft.payment === "failed" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Mock payment failed</AlertTitle>
            <AlertDescription>
              No money was charged and your draft is safe. Retry without
              re-entering the application.
            </AlertDescription>
          </Alert>
        )}
        {paid ? (
          <Alert className="evidence-ready">
            <CheckCircle2 />
            <AlertTitle>Mock payment completed</AlertTitle>
            <AlertDescription>
              The fee of {bookletFee(draft.booklet)} is recorded as paid.
              Choose the exact date and time below.
            </AlertDescription>
          </Alert>
        ) : draft.payment === "failed" ? (
          <Button className="pay-action" onClick={retry}>
            Retry mock payment
          </Button>
        ) : (
          <Button
            className="pay-action"
            onClick={pay}
            disabled={draft.centre === null || draft.payment === "processing"}
          >
            {draft.payment === "processing"
              ? "Processing…"
              : `Pay mock fee ${bookletFee(draft.booklet)}`}
            <WalletCards />
          </Button>
        )}
        {draft.centre === null && !paid && (
          <p className="override-note">
            Select a centre first — the payment is tied to it.
          </p>
        )}
      </section>
      {paid && (
        <>
          <Separator />
          <section className="form-section">
            <SectionHeading kind="choice" title="Exact date and time">
              Confirmed by the payment above. Every date and slot is synthetic.
            </SectionHeading>
            <div className="form-grid">
              <Field label="Select date">
                <Select
                  value={draft.day === null ? "" : String(draft.day)}
                  onValueChange={(v) => update("day", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mock date" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentDays.map((day, i) => (
                      <SelectItem key={day} value={String(i)}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Select time">
                <Select
                  value={draft.slot === null ? "" : String(draft.slot)}
                  onValueChange={(v) => update("slot", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mock time" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentSlots.map((slot, i) => (
                      <SelectItem
                        key={slot.time}
                        value={String(i)}
                        disabled={!slot.available}
                      >
                        {slot.time}
                        {!slot.available && " · unavailable"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>
        </>
      )}
    </StepFrame>
  );
}

function ReadyStep({
  draft,
  back,
  restart,
}: StepProps & { restart: () => void }) {
  const centre = centres[draft.centre ?? 0];
  const day = appointmentDays[draft.day ?? 0];
  const slot = appointmentSlots[draft.slot ?? 0];
  return (
    <StepFrame
      eyebrow="Appointment · 2 of 2"
      title="Prepared for your appointment"
      intro="This summary brings the confirmed mock visit, document actions, and next steps into one place."
      back={back}
      next={() => window.print()}
      nextLabel="Print summary"
      submit
    >
      <div className="ready-banner">
        <BadgeCheck />
        <div>
          <span>Mock appointment confirmed</span>
          <strong>
            {day} at {slot.time}
          </strong>
          <p>
            {centre.name} · {centre.address}
          </p>
        </div>
      </div>
      <section className="ready-grid">
        <article>
          <h2>Application</h2>
          <dl>
            <div>
              <dt>Reference</dt>
              <dd>FP-MOCK-2026-0148</dd>
            </div>
            <div>
              <dt>Applicant</dt>
              <dd>
                {draft.givenName} {draft.surname}
              </dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>Fresh ordinary passport</dd>
            </div>
            <div>
              <dt>Booklet</dt>
              <dd>{draft.booklet} pages</dd>
            </div>
          </dl>
        </article>
        <article>
          <h2>Document actions</h2>
          {documentRequirements(draft).map((doc) => (
            <div className="ready-document" key={doc.id}>
              <Check />
              <span>
                <strong>{doc.title}</strong>
                <small>{doc.appointmentAction}</small>
              </span>
            </div>
          ))}
        </article>
      </section>
      <Alert>
        <ShieldCheck />
        <AlertTitle>Preparation summary — not approval</AlertTitle>
        <AlertDescription>
          The prototype can say you are prepared based on the information
          provided. It cannot say verified, approved, or guaranteed.
        </AlertDescription>
      </Alert>
      <div className="ready-actions">
        <Button variant="ghost" onClick={restart}>
          <RotateCcw />
          Restart prototype
        </Button>
      </div>
    </StepFrame>
  );
}

function Dashboard({
  current,
  resume,
  documents,
  signOut,
}: {
  current: number;
  resume: () => void;
  documents: () => void;
  signOut: () => void;
}) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Brand />
        <Button variant="ghost" onClick={signOut}>
          <LogOut />
          Sign out
        </Button>
      </header>
      <PrototypeNotice compact />
      <main className="dashboard-main">
        <div className="dashboard-heading">
          <span className="eyebrow">My applications</span>
          <h1>Continue where you left off.</h1>
          <p>Your synthetic draft is stored on this device only.</p>
        </div>
        <Card className="draft-card">
          <CardHeader>
            <div>
              <Badge>Draft</Badge>
              <CardTitle>
                <h2>Fresh ordinary passport</h2>
              </CardTitle>
              <CardDescription>
                FP-MOCK-2026-0148 · started 12 Aug 2026 (mock)
              </CardDescription>
            </div>
            <span className="draft-step">
              Stage {current + 1} of 9<br />
              <strong>{steps[current].label}</strong>
            </span>
          </CardHeader>
          <CardContent>
            <div className="dashboard-progress">
              <div
                style={{ width: `${((current + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="dashboard-actions">
              <Button onClick={resume}>
                Resume {steps[current].short}
                <ArrowRight />
              </Button>
              {/* Goes to the stage, so it says so. The reference view is the
                  Document library, reached from the rail inside the shell. */}
              <Button variant="outline" onClick={documents}>
                <Store />
                Prepare documents
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="preflight-card">
          <CardHeader>
            <div>
              <Badge variant="outline">Before you sit down</Badge>
              <CardTitle>
                <h2>What this application will ask of you</h2>
              </CardTitle>
              <CardDescription>
                The whole journey, visible before you enter it — so nothing
                inside is a surprise.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="preflight-grid">
              <div className="preflight-stages">
                <h3>The stages</h3>
                <ol>
                  {chapterRanges.map((chapter) => (
                    <li key={chapter.label}>
                      <strong>{chapter.label}</strong>
                      <span>
                        {steps
                          .slice(chapter.start, chapter.end + 1)
                          .map((step) => step.short)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="preflight-evidence">
                <h3>Evidence it will ask about</h3>
                <ul>
                  <li>Proof of date and place of birth</li>
                  <li>Proof of your present address</li>
                  <li>
                    Education record, used for the emigration-check category
                  </li>
                </ul>
                <p>
                  The exact accepted documents come from the official lists,
                  which this prototype points to rather than reproduces.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <section className="dashboard-help">
          <h2>What can I do here?</h2>
          <div>
            <article>
              <Store />
              <b>Resume safely</b>
              <p>Return to the exact application stage shown above.</p>
            </article>
            <article>
              <FileCheck2 />
              <b>Prepare documents</b>
              <p>See document status without searching a separate advisor.</p>
            </article>
            <article>
              <CircleHelp />
              <b>Get help</b>
              <p>Contextual guidance stays attached to each stage.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const { draft, setDraft, saveState } = useDraft();
  const [view, setView] = useState<View>("start");
  const [current, setCurrent] = useState(() =>
    Number(localStorage.getItem(PROGRESS_KEY) || 0),
  );
  const [furthest, setFurthest] = useState(() =>
    Number(localStorage.getItem(PROGRESS_KEY) || 0),
  );
  const update = <K extends keyof ApplicationDraft>(
    key: K,
    value: ApplicationDraft[K],
  ) => setDraft((previous) => ({ ...previous, [key]: value }));
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, String(furthest));
  }, [furthest]);
  const go = (index: number, advance = false) => {
    const target = Math.max(0, Math.min(8, index));
    setCurrent(target);
    if (advance) setFurthest((old) => Math.max(old, target));
    setView("application");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => go(current + 1, true);
  const back = () => (current === 0 ? setView("dashboard") : go(current - 1));
  const saveExit = () => {
    setView("dashboard");
    toast.success("Your draft is saved. Resume from My applications.");
  };
  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setDraft(defaultDraft);
    setCurrent(0);
    setFurthest(0);
    setView("start");
  };
  const signOut = () => setView("start");
  const props = useMemo(
    () => ({
      draft,
      update,
      next,
      back,
      jump: (n: number) => go(n),
      exit: saveExit,
      services: signOut,
    }),
    [draft, current],
  );

  if (view === "start")
    return (
      <>
        <StartScreen
          begin={() => setView("signin")}
          resume={() => setView("dashboard")}
        />
        <Toaster />
      </>
    );
  if (view === "signin")
    return (
      <>
        <SignInScreen
          proceed={() => go(current)}
          back={() => setView("start")}
        />
        <Toaster />
      </>
    );
  if (view === "dashboard")
    return (
      <>
        <Dashboard
          current={current}
          resume={() => go(current)}
          documents={() => go(5)}
          signOut={signOut}
        />
        <Toaster />
      </>
    );
  let content: ReactNode;
  switch (current) {
    case 0:
      content = <PersonalStep {...props} />;
      break;
    case 1:
      content = <FamilyStep {...props} />;
      break;
    case 2:
      content = <ContactsStep {...props} />;
      break;
    case 3:
      content = <AddressStep {...props} />;
      break;
    case 4:
      content = <OptionsStep {...props} />;
      break;
    case 5:
      content = <DocumentsStep {...props} />;
      break;
    case 6:
      content = <ReviewStep {...props} />;
      break;
    case 7:
      content = <AppointmentStep {...props} />;
      break;
    default:
      content = <ReadyStep {...props} restart={restart} />;
  }
  return (
    <>
      <ApplicationShell
        current={current}
        furthest={furthest}
        saveState={saveState}
        onStep={(n) => go(n)}
        dashboard={() => setView("dashboard")}
        draft={draft}
        saveExit={saveExit}
        signOut={signOut}
      >
        {content}
      </ApplicationShell>
      <Toaster />
    </>
  );
}
