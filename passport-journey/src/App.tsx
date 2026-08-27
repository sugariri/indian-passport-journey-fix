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
  addressEvidence,
  appointmentDays,
  appointmentSlots,
  bookletFee,
  categoryGuidance,
  centres,
  chapterRanges,
  defaultDraft,
  documentRequirements,
  readinessItems,
  steps,
  type ApplicationDraft,
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

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? "brand small" : "brand"}>
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
      <Label>{label}</Label>
      {children}
      {help && (
        <p className="field-help">
          <CircleHelp />
          {help}
        </p>
      )}
    </div>
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
            Start application
          </a>
          <button onClick={resume}>Resume application</button>
          <a href="#other">Other services</a>
        </nav>
        <div className="public-actions">
          <button onClick={resume}>Sign in</button>
          <Badge variant="outline">Independent prototype</Badge>
        </div>
      </header>
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
              <CardTitle><h2>What do you need help with?</h2></CardTitle>
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
                    <strong>Special services</strong>
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
        <section className="prepare-section">
          <div>
            <span className="eyebrow">Before you start</span>
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
      <PrototypeNotice />
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
      <header className="gateway-header">
        <Brand />
        <Badge variant="outline">Independent prototype</Badge>
      </header>
      <main className="gateway-main">
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
        <Card className="signin-card">
          <CardHeader>
            <CardTitle><h2>Sign in to continue</h2></CardTitle>
            <CardDescription>
              This prototype uses a simulated account. No password, OTP, or
              government system is used.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="split-actions">
            <Button variant="outline" onClick={back}>
              <ArrowLeft />
              Back
            </Button>
            <Button onClick={proceed}>
              Continue with mock sign-in <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </main>
      <PrototypeNotice />
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
  documents,
  help,
}: {
  current: number;
  saveExit: () => void;
  dashboard: () => void;
  documents: () => void;
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
        <button onClick={documents}>
          <Store />
          Documents
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
  documents,
  saveExit,
  children,
}: {
  current: number;
  furthest: number;
  saveState: SaveState;
  onStep: (n: number) => void;
  dashboard: () => void;
  documents: () => void;
  saveExit: () => void;
  children: ReactNode;
}) {
  const [help, setHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="workspace">
      <Rail
        current={current}
        dashboard={dashboard}
        documents={documents}
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
            <Button variant="ghost" onClick={documents}>
              <Store />
              Documents
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
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  back?: () => void;
  next?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
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
          <CardFooter className="step-actions">
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
                <ArrowRight />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </>
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
    <div className="inline-question">
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

function PersonalStep({ draft, update, next, back }: StepProps) {
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
        <div className="section-heading">
          <h2>Personal details</h2>
          <p>
            Use the spelling and dates from the supporting records you plan to
            provide.
          </p>
        </div>
        <div className="form-grid">
          <Field label="Given name">
            <Input
              value={draft.givenName}
              onChange={(e) => update("givenName", e.target.value)}
            />
          </Field>
          <Field
            label="Surname"
            help="Leave blank only if it is blank on your record."
          >
            <Input
              value={draft.surname}
              onChange={(e) => update("surname", e.target.value)}
            />
          </Field>
          <Field label="Date of birth">
            <Input
              type="date"
              value={draft.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field label="Place of birth">
            <Input
              value={draft.placeOfBirth}
              onChange={(e) => update("placeOfBirth", e.target.value)}
            />
          </Field>
        </div>
      </section>
      <Separator />
      <section className="form-section">
        <div className="section-heading">
          <h2>Passport history</h2>
          <p>
            Fresh applicants can still have other passport or application
            history, so these questions remain conditional.
          </p>
        </div>
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
              Return to service discovery and choose the re-issue route instead
              of forcing a fresh application.
            </AlertDescription>
          </Alert>
        )}
      </section>
    </StepFrame>
  );
}

function FamilyStep({ draft, update, next, back }: StepProps) {
  return (
    <StepFrame
      eyebrow="About you · 2 of 3"
      title="Family details"
      intro="Provide the family information required for this application. Alternative situations stay visible instead of being hidden in notes."
      back={back}
      next={next}
      nextDisabled={!draft.fatherName || !draft.motherName}
    >
      <div className="form-grid">
        <Field label="Father or legal parent name">
          <Input
            value={draft.fatherName}
            onChange={(e) => update("fatherName", e.target.value)}
          />
        </Field>
        <Field label="Mother or legal parent name">
          <Input
            value={draft.motherName}
            onChange={(e) => update("motherName", e.target.value)}
          />
        </Field>
      </div>
      <Separator />
      <Field label="Does the standard parent-details route apply to you?">
        <RadioCards
          name="Family situation"
          value={draft.familySituation}
          onChange={(v) =>
            update("familySituation", v as ApplicationDraft["familySituation"])
          }
          options={[
            { value: "standard", title: "Yes" },
            { value: "guardian", title: "I need the guardian route" },
            { value: "help", title: "I need help answering" },
          ]}
        />
      </Field>
      {draft.familySituation !== "standard" && (
        <Alert>
          <CircleHelp />
          <AlertTitle>Assisted route needed</AlertTitle>
          <AlertDescription>
            A production service should reveal the official fields and support
            for this situation. This prototype does not invent those rules.
          </AlertDescription>
        </Alert>
      )}
    </StepFrame>
  );
}

function ContactsStep({ draft, update, next, back }: StepProps) {
  return (
    <StepFrame
      eyebrow="About you · 3 of 3"
      title="Contacts & legal"
      intro="Add the people who can be contacted, then answer the legal-history prompt separately from ordinary personal details."
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
        <div className="section-heading">
          <h2>Emergency contact</h2>
          <p>Someone the service can contact if needed.</p>
        </div>
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
        <div className="section-heading">
          <h2>Local references</h2>
          <p>
            Two references are retained because they appear in the official
            fresh-passport form.
          </p>
        </div>
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
      <Field label="Do any of the legal-history conditions in the official form apply?">
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
      </Field>
      {draft.legalCheck !== "no" && (
        <Alert>
          <CircleHelp />
          <AlertTitle>Do not guess here</AlertTitle>
          <AlertDescription>
            Review the unchanged official questions or use assisted support. The
            prototype does not determine legal eligibility.
          </AlertDescription>
        </Alert>
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
      intro="Enter the present address first, then compare it with an accepted proof before submission."
      back={back}
      next={next}
      nextDisabled={
        !draft.address || draft.pin.length !== 6 || evidence.state !== "ready"
      }
    >
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
      <Separator />
      <section className="form-section">
        <div className="section-heading">
          <h2>Address confidence check</h2>
          <p>
            Does the proof you plan to use support the present address entered
            above?
          </p>
        </div>
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
        <section className="office-context">
          <Landmark />
          <div>
            <span>Derived office context</span>
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

function OptionsStep({ draft, update, next, back }: StepProps) {
  const guidance = categoryGuidance(draft);
  return (
    <StepFrame
      eyebrow="Address & evidence · 2 of 3"
      title="Passport options"
      intro="Choose the booklet you need and answer plain-language questions used to suggest the passport category."
      back={back}
      next={next}
      nextDisabled={guidance.state !== "ready"}
    >
      <section className="form-section">
        <div className="section-heading">
          <h2>Passport booklet</h2>
          <p>Fresh ordinary passport · Normal application</p>
        </div>
        <RadioCards
          name="Booklet"
          value={draft.booklet}
          onChange={(v) => update("booklet", v as ApplicationDraft["booklet"])}
          options={[
            {
              value: "36",
              title: "36 pages",
              detail: `Mock indicative fee ${bookletFee("36")}`,
            },
            {
              value: "60",
              title: "60 pages",
              detail: `Mock indicative fee ${bookletFee("60")}`,
            },
          ]}
        />
      </section>
      <Separator />
      <section className="form-section">
        <div className="section-heading">
          <h2>Category guidance</h2>
          <p>
            You do not need to know what ECR or Non-ECR means before answering.
          </p>
        </div>
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
        <Alert className={`evidence-${guidance.state}`}>
          <StateIcon state={guidance.state} />
          <AlertTitle>{guidance.label}</AlertTitle>
          <AlertDescription>{guidance.detail}</AlertDescription>
        </Alert>
      </section>
    </StepFrame>
  );
}

function DocumentsStep({ draft, update, next, back }: StepProps) {
  const docs = documentRequirements(draft);
  const blocked = docs.some((doc) => doc.state !== "ready");
  return (
    <StepFrame
      eyebrow="Address & evidence · 3 of 3"
      title="Documents"
      intro="A personalised checklist shows why each document is needed, its digital-sharing status, and what still needs attention."
      back={back}
      next={next}
      nextDisabled={blocked}
    >
      {docs.map((doc) => (
        <article className="document-row" key={doc.id}>
          <StateIcon state={doc.state} />
          <div>
            <div className="document-title">
              <h2>{doc.title}</h2>
              <Badge
                variant={
                  doc.digitalStatus === "Shared through DigiLocker"
                    ? "default"
                    : "outline"
                }
              >
                {doc.digitalStatus}
              </Badge>
            </div>
            <p>{doc.purpose}</p>
            <strong>{doc.appointmentAction}</strong>
            {doc.id === "birth" && (
              <Select
                value={draft.birthDocument}
                onValueChange={(v) =>
                  update(
                    "birthDocument",
                    v as ApplicationDraft["birthDocument"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">
                    Mock shared through DigiLocker
                  </SelectItem>
                  <SelectItem value="carry">Not digitally shared</SelectItem>
                </SelectContent>
              </Select>
            )}
            {doc.id === "category" && (
              <Select
                value={draft.educationDocument}
                onValueChange={(v) =>
                  update(
                    "educationDocument",
                    v as ApplicationDraft["educationDocument"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">
                    Mock shared through DigiLocker
                  </SelectItem>
                  <SelectItem value="carry">Not digitally shared</SelectItem>
                  <SelectItem value="missing">
                    I do not have it ready
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </article>
      ))}
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
  const blocked =
    items.some((item) => item.blocking) || draft.legalCheck !== "no";
  return (
    <StepFrame
      eyebrow="Review & submit"
      title="Review your application"
      intro="Check the consequential details and resolve preparation issues before the declaration appears."
      back={back}
      next={next}
      nextLabel="Submit mock application"
      nextDisabled={blocked || !draft.declaration}
    >
      <div className="readiness-grid">
        {items.map((item) => (
          <article key={item.title} className={`readiness-item ${item.state}`}>
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
      <Separator />
      <section className="answers-review">
        <div>
          <span>Applicant</span>
          <strong>
            {draft.givenName} {draft.surname}
          </strong>
          <p>
            {draft.dateOfBirth} · {draft.placeOfBirth}
          </p>
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
          <span>Passport request</span>
          <strong>Fresh ordinary · Normal · {draft.booklet} pages</strong>
          <p>{categoryGuidance(draft).label}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => jump(4)}>
          Edit
        </Button>
      </section>
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const pay = () => {
    update("payment", "processing");
    window.setTimeout(() => update("payment", "failed"), 700);
  };
  const retry = () => {
    update("payment", "processing");
    window.setTimeout(() => {
      update("payment", "paid");
      setPaymentOpen(false);
      toast.success("Mock payment completed. Appointment confirmed.");
    }, 700);
  };
  return (
    <StepFrame
      eyebrow="Appointment · 1 of 2"
      title="Choose an appointment"
      intro="See office hierarchy and indicative availability first. An exact date and time is confirmed only after mock payment."
      back={back}
      next={next}
      nextLabel="View appointment summary"
      nextDisabled={draft.payment !== "paid"}
    >
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
        <section className="indicative">
          <CalendarDays />
          <div>
            <strong>
              Indicative availability at {centres[draft.centre].name}
            </strong>
            <p>
              Earliest shown: {centres[draft.centre].earliest}. The exact slot
              is selected in the mock payment step.
            </p>
          </div>
          <Button onClick={() => setPaymentOpen(true)}>
            Continue to mock payment
          </Button>
        </section>
      )}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mock payment and slot</DialogTitle>
            <DialogDescription>
              No real payment or government appointment is made. Every date,
              slot, and transaction is synthetic.
            </DialogDescription>
          </DialogHeader>
          <div className="payment-content">
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
            <div className="fee-row">
              <span>Mock application fee</span>
              <strong>{bookletFee(draft.booklet)}</strong>
            </div>
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
          </div>
          <DialogFooter>
            {draft.payment === "failed" ? (
              <Button onClick={retry}>Retry mock payment</Button>
            ) : (
              <Button
                onClick={pay}
                disabled={
                  draft.day === null ||
                  draft.slot === null ||
                  draft.payment === "processing"
                }
              >
                {draft.payment === "processing"
                  ? "Processing…"
                  : "Pay mock fee and confirm"}
                <WalletCards />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <AlertTitle>Preparation summary—not approval</AlertTitle>
        <AlertDescription>
          The prototype can say you are prepared based on the information
          provided. It cannot say verified, approved, or guaranteed.
        </AlertDescription>
      </Alert>
      <div className="ready-actions">
        <Button variant="outline" onClick={() => window.print()}>
          Print summary
        </Button>
        <Button variant="outline" onClick={restart}>
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
  restart,
}: {
  current: number;
  resume: () => void;
  documents: () => void;
  restart: () => void;
}) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Brand />
        <Button variant="ghost" onClick={restart}>
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
              <CardTitle><h2>Fresh ordinary passport</h2></CardTitle>
              <CardDescription>FP-MOCK-2026-0148</CardDescription>
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
              <Button variant="outline" onClick={documents}>
                <Store />
                View document checklist
              </Button>
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
  const props = useMemo(
    () => ({ draft, update, next, back, jump: (n: number) => go(n) }),
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
          restart={restart}
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
        documents={() => go(5)}
        saveExit={saveExit}
      >
        {content}
      </ApplicationShell>
      <Toaster />
    </>
  );
}
