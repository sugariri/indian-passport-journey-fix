import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  LayoutGrid,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  ShieldCheck,
  Store,
  Table2,
  UserRound,
  WalletCards,
  type LucideIcon,
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
  applicationFilters,
  appointmentDays,
  appointmentSlots,
  applicationReference,
  bookletChoices,
  bookletDifference,
  bookletFee,
  categoryGuidance,
  centres,
  chapterRanges,
  defaultDraft,
  documentRequirements,
  formatBirthDate,
  liveApplication,
  nameFormatNotes,
  passportNamePreview,
  readinessItems,
  sampleApplications,
  steps,
  type ApplicationDraft,
  type ApplicationFilterId,
  type ApplicationRecord,
  type ApplicationTone,
  type EvidenceState,
  type SaveState,
  type View,
} from "./passport-domain";
import heroImage from "./assets/passport-hero.png";
import "./App.css";

const STORAGE_KEY = "passport-journey-draft-v3";
const PROGRESS_KEY = "passport-journey-progress-v3";
const RAIL_KEY = "passport-journey-rail-v1";

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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M6.5 3.5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-10z" />
          <path d="M6.5 3.5a1.6 1.6 0 0 0 0 17" />
          <circle cx="12.5" cy="12" r="4" />
          <path d="M8.5 12h8" />
          <path d="M12.5 8c1.4 2.4 1.4 5.6 0 8" />
          <path d="M12.5 8c-1.4 2.4-1.4 5.6 0 8" />
        </svg>
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
  const [handoff, setHandoff] = useState<string | null>(null);
  return (
    <div className="public-page">
      <PrototypeNotice compact />
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
          <button className="signin-link" onClick={resume}>
            Sign in
          </button>
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
                    <p>Choose your answer to continue. Sign-in comes later.</p>
                    <div className="route-options">
                      <button className="route primary" onClick={begin}>
                        <FileText />
                        <span>
                          <b>My first passport</b>
                          <small>
                            I have not previously held an ordinary Indian
                            passport.
                          </small>
                          <em>Start application</em>
                        </span>
                        <ArrowRight />
                      </button>
                      <button
                        className="route"
                        onClick={() =>
                          setHandoff("Re-issue of an existing passport")
                        }
                      >
                        <BookOpen />
                        <span>
                          <b>I have or had a passport</b>
                          <small>
                            Renew, replace, or update an existing passport.
                          </small>
                          <em>Not simulated in this prototype</em>
                        </span>
                        <ChevronRight />
                      </button>
                    </div>
                  </section>
                  <footer className="card-footnote">
                    <p>
                      <strong>Need it urgently?</strong> Tatkaal has separate
                      conditions and document requirements; it is not a blanket
                      faster route.
                    </p>
                    <button onClick={() => setHandoff("Tatkaal guidance")}>
                      Check Tatkaal guidance <ChevronRight />
                    </button>
                  </footer>
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
        <section className="special-services" id="other">
          <div>
            <span className="eyebrow">Other services</span>
            <h2>Special services</h2>
            <p>
              These stay discoverable, but sit outside the first
              ordinary-passport journey completed in this prototype.
            </p>
          </div>
          <div className="route-options">
            <button
              className="route"
              onClick={() => setHandoff("Diplomatic or official passport")}
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
      </main>
      <footer className="public-footer">
        <Brand small />
        <p>
          Prototype for design review only. No official passport service, data,
          or decision is provided here.
        </p>
      </footer>
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
            <CardTitle>
              <h2>Sign in to continue</h2>
            </CardTitle>
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
          <CardFooter className="step-actions">
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

function StackTrail({
  current,
  furthest,
  onStep,
  dashboard,
}: {
  current: number;
  furthest: number;
  onStep: (index: number) => void;
  dashboard: () => void;
}) {
  const chapter =
    chapterRanges.find((entry) => current >= entry.start && current <= entry.end) ??
    chapterRanges[0];
  return (
    <nav className="stack-trail" aria-label="You are here">
      <button onClick={dashboard}>My applications</button>
      <ChevronRight aria-hidden="true" />
      {chapter.label !== steps[current].label && (
        <>
          <button
            onClick={() => onStep(chapter.start)}
            disabled={chapter.start > furthest}
          >
            {chapter.label}
          </button>
          <ChevronRight aria-hidden="true" />
        </>
      )}
      <b aria-current="step">{steps[current].label}</b>
      <small>
        Stage {current + 1} of {steps.length}
      </small>
    </nav>
  );
}

function StageStack({
  current,
  furthest,
  onStep,
}: {
  current: number;
  furthest: number;
  onStep: (index: number) => void;
}) {
  const track = useRef<HTMLElement>(null);
  useEffect(() => {
    track.current
      ?.querySelector<HTMLElement>('[aria-current="step"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [current]);
  return (
    <nav ref={track} className="stage-stack" aria-label="Application stages">
      {chapterRanges.map((entry) => {
        const stages = steps.slice(entry.start, entry.end + 1);
        const done = stages.filter(
          (_, offset) => entry.start + offset < current,
        ).length;
        const active = current >= entry.start && current <= entry.end;
        return (
          <section
            key={entry.label}
            className={`stack-chapter${active ? " active" : ""}${
              done === stages.length ? " complete" : ""
            }`}
            style={{ flexGrow: stages.length }}
          >
            <p className="stack-chapter-head">
              <b>{entry.label}</b>
              <small>
                {done} of {stages.length}
              </small>
            </p>
            <div className="stack-stages">
              {stages.map((step, offset) => {
                const index = entry.start + offset;
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
                    title={`Stage ${index + 1} · ${step.label}`}
                  >
                    <span aria-hidden="true">
                      {index < current ? <Check /> : <Icon />}
                    </span>
                    <b>{step.short}</b>
                    <small>{index + 1}</small>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </nav>
  );
}

type RailItem = {
  id: string;
  label: string;
  hint: string;
  detail?: string;
  icon: LucideIcon;
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
};

function Rail({
  view,
  current,
  furthest,
  submitted,
  applicant,
  collapsed,
  toggleCollapsed,
  dashboard,
  resume,
  documents,
  appointment,
  help,
  signOut,
}: {
  view: View;
  current: number;
  furthest: number;
  submitted: boolean;
  applicant: string;
  collapsed: boolean;
  toggleCollapsed: () => void;
  dashboard: () => void;
  resume: () => void;
  documents: () => void;
  appointment: () => void;
  help: () => void;
  signOut: () => void;
}) {
  const inApplication = view === "application";
  const applicationItems: RailItem[] = [
    {
      id: "current",
      label: "Current stage",
      hint: `Return to ${steps[current].label}`,
      detail: `Stage ${current + 1} of ${steps.length} · ${steps[current].label}`,
      icon: FileText,
      onClick: resume,
      active: inApplication && current !== 5 && current !== 7,
    },
    {
      id: "documents",
      label: "Documents",
      hint: "Checklist and digital-sharing status",
      icon: Store,
      onClick: documents,
      active: inApplication && current === 5,
    },
    {
      id: "appointment",
      label: "Appointment",
      hint:
        furthest < 7
          ? "Opens after the mock submission"
          : "Centre, day and slot",
      icon: CalendarDays,
      onClick: appointment,
      active: inApplication && current === 7,
      disabled: furthest < 7,
    },
    {
      id: "help",
      label: "Help for this stage",
      hint: inApplication
        ? `Guidance for ${steps[current].label}`
        : "Open an application for stage guidance",
      icon: HelpCircle,
      onClick: help,
      active: false,
      disabled: !inApplication,
    },
  ];
  const initials =
    applicant
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "MA";
  const renderItem = (item: RailItem) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={item.onClick}
        disabled={item.disabled}
        className={item.active ? "active" : undefined}
        aria-current={item.active ? "page" : undefined}
        aria-label={item.label}
        title={collapsed ? `${item.label} — ${item.hint}` : item.hint}
      >
        <Icon aria-hidden="true" />
        <span className="rail-label">
          {item.label}
          {item.detail && <small>{item.detail}</small>}
        </span>
      </button>
    );
  };
  return (
    <aside className={collapsed ? "app-rail collapsed" : "app-rail"}>
      <div className="rail-head">
        <Brand small />
        <button
          className="rail-collapse"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
          title={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
      </div>
      <div className="application-summary">
        <span>Fresh ordinary passport</span>
        <strong>
          {submitted ? "Submitted" : "Draft"} · Stage {current + 1} of{" "}
          {steps.length}
        </strong>
      </div>
      <nav aria-label="Quick access">
        {renderItem({
          id: "applications",
          label: "My applications",
          hint: "Every application with its status and stage",
          icon: Home,
          onClick: dashboard,
          active: view === "dashboard",
        })}
        <p className="rail-group">This application</p>
        {applicationItems.map(renderItem)}
      </nav>
      <div className="rail-bottom">
        <div className="rail-account" title={`${applicant} · mock account`}>
          <span className="rail-avatar" aria-hidden="true">
            {initials}
          </span>
          <span className="rail-label">
            {applicant}
            <small>Mock account</small>
          </span>
        </div>
        <button
          onClick={signOut}
          aria-label="Sign out"
          title="Sign out of the mock account"
        >
          <LogOut aria-hidden="true" />
          <span className="rail-label">Sign out</span>
        </button>
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
  view,
  current,
  furthest,
  saveState,
  submitted,
  applicant,
  onStep,
  dashboard,
  documents,
  saveExit,
  signOut,
  children,
}: {
  view: View;
  current: number;
  furthest: number;
  saveState: SaveState;
  submitted: boolean;
  applicant: string;
  onStep: (n: number) => void;
  dashboard: () => void;
  documents: () => void;
  saveExit: () => void;
  signOut: () => void;
  children: ReactNode;
}) {
  const [help, setHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(RAIL_KEY) === "collapsed",
  );
  useEffect(() => {
    localStorage.setItem(RAIL_KEY, collapsed ? "collapsed" : "expanded");
  }, [collapsed]);
  const inApplication = view === "application";
  const closeAnd = (action: () => void) => () => {
    setMenuOpen(false);
    action();
  };
  return (
    <div className={collapsed ? "workspace rail-collapsed" : "workspace"}>
      <Rail
        view={view}
        current={current}
        furthest={furthest}
        submitted={submitted}
        applicant={applicant}
        collapsed={collapsed}
        toggleCollapsed={() => setCollapsed((old) => !old)}
        dashboard={dashboard}
        resume={() => onStep(current)}
        documents={documents}
        appointment={() => onStep(7)}
        help={() => setHelp(true)}
        signOut={signOut}
      />
      <div className="workspace-body">
        <header className="workspace-header">
          <div className="header-top">
            <div className="mobile-brand">
              <Brand small />
            </div>
            {inApplication ? (
              <StackTrail
                current={current}
                furthest={furthest}
                onStep={onStep}
                dashboard={dashboard}
              />
            ) : (
              <nav className="stack-trail" aria-label="You are here">
                <b aria-current="page">My applications</b>
                <small>Mock account · {applicant}</small>
              </nav>
            )}
            <div className="header-state">
              {inApplication ? (
                <>
                  <div
                    className={
                      submitted ? "reference-block" : "reference-block pending"
                    }
                  >
                    <span>
                      {submitted ? "Application reference" : "Draft application"}
                    </span>
                    <strong>
                      {submitted
                        ? applicationReference
                        : "Reference issued on submission"}
                    </strong>
                  </div>
                  <SaveStatus state={saveState} />
                  <Button variant="outline" size="sm" onClick={saveExit}>
                    <LogOut />
                    Save &amp; exit
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => onStep(current)}>
                  Resume {steps[current].short}
                  <ArrowRight />
                </Button>
              )}
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
          </div>
          {inApplication && (
            <StageStack current={current} furthest={furthest} onStep={onStep} />
          )}
        </header>
        <PrototypeNotice compact />
        <main
          id="main-content"
          className={inApplication ? "step-main" : "list-main"}
        >
          {children}
        </main>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Application menu</SheetTitle>
            <SheetDescription>
              {submitted ? "Submitted" : "Draft"} · Stage {current + 1} of{" "}
              {steps.length}
            </SheetDescription>
          </SheetHeader>
          <div className="mobile-nav">
            <Button variant="ghost" onClick={closeAnd(dashboard)}>
              <Home />
              My applications
            </Button>
            <Button variant="ghost" onClick={closeAnd(() => onStep(current))}>
              <FileText />
              Current stage
            </Button>
            <Button variant="ghost" onClick={closeAnd(documents)}>
              <Store />
              Documents
            </Button>
            <Button
              variant="ghost"
              disabled={furthest < 7}
              onClick={closeAnd(() => onStep(7))}
            >
              <CalendarDays />
              Appointment
            </Button>
            <Button
              variant="ghost"
              disabled={!inApplication}
              onClick={closeAnd(() => setHelp(true))}
            >
              <HelpCircle />
              Help for this stage
            </Button>
            {inApplication && (
              <Button variant="ghost" onClick={closeAnd(saveExit)}>
                <LogOut />
                Save &amp; exit
              </Button>
            )}
            <Separator />
            <Button variant="ghost" onClick={closeAnd(signOut)}>
              <UserRound />
              Sign out
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

function NamePreview({ draft }: { draft: ApplicationDraft }) {
  const preview = passportNamePreview(draft);
  const notes = nameFormatNotes(draft);
  if (preview.isEmpty) return null;
  return (
    <div className="name-preview block block--derived">
      <span className="kind-tag kind-derived">{blockKindLabel.derived}</span>
      <strong>Your passport would read</strong>
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
        Check this against the record you will carry. A name split across the
        wrong field is corrected at the passport office, not here.
      </p>
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
        <SectionHeading kind="information" title="Your name">
          The official form uses two name fields, not three. There is no
          separate middle-name box, which is where most name mistakes start.
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
          This is asked before the name fields, because the answer decides which
          fields the official form actually requires.
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
              detail: "Different official fields are required.",
            },
            {
              value: "help",
              title: "I need help answering",
              detail: "Single-parent, adoption or other situations.",
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
        <Alert>
          <CircleHelp />
          <AlertTitle>This situation needs the assisted route</AlertTitle>
          <AlertDescription>
            A production service reveals the official fields and support for
            this situation here. This prototype does not invent those rules, so
            the route stops at this point. Select the first option to continue
            the demonstrated journey.
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
          reach you. This is not a reference and is not contacted for checks.
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
          A different purpose from the emergency contact: these are two people
          near your present address who appear as required fields on the
          official fresh-passport form. They are kept for that reason, not
          because the redesign wants them.
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

function OptionsStep({ draft, update, next, back }: StepProps) {
  const guidance = categoryGuidance(draft);
  return (
    <StepFrame
      eyebrow="Address & evidence · 2 of 3"
      title="Passport options"
      intro="One thing on this page is yours to choose. The other is worked out from two facts about you — you are not asked to classify yourself."
      back={back}
      next={next}
      nextDisabled={guidance.state !== "ready"}
    >
      <section className="form-section">
        <SectionHeading kind="choice" title="Booklet size">
          {bookletDifference}
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
      </section>
      <Separator />
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
          A result, not an option. The documents that have to support it are
          listed on the next page.
        </SectionHeading>
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
      intro="Every row here is evidence for something you already entered. Nothing on this page is a new decision about your passport."
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
  const name = passportNamePreview(draft);
  const nameNotes = nameFormatNotes(draft);
  const blocked =
    items.some((item) => item.blocking) || draft.legalCheck !== "no";
  const submit = () => {
    update("submitted", true);
    toast.success(
      `Mock application submitted. Reference ${applicationReference} issued.`,
    );
    next();
  };
  return (
    <StepFrame
      eyebrow="Review & submit"
      title="Review your application"
      intro="What you chose and what was worked out for you are listed separately, so a mistake in either one is visible before the declaration appears."
      back={back}
      next={submit}
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
            <strong>
              Fresh ordinary · Normal · {draft.booklet}-page booklet
            </strong>
            <p>Mock indicative fee {bookletFee(draft.booklet)}.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => jump(4)}>
            Edit
          </Button>
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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const paid = draft.payment === "paid";
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
      next={paid ? next : () => setPaymentOpen(true)}
      nextLabel={paid ? "View appointment summary" : "Continue to mock payment"}
      nextDisabled={draft.centre === null}
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
                ? "Your confirmed date and time are on the appointment summary."
                : "The exact slot is selected in the mock payment step, using the button below."}
            </p>
          </div>
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
              <dd>{applicationReference}</dd>
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

function StatusPill({
  tone,
  children,
}: {
  tone: ApplicationTone;
  children: ReactNode;
}) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function StageCell({ record }: { record: ApplicationRecord }) {
  if (record.stageIndex === null)
    return (
      <span className="stage-cell">
        <b>{record.stage}</b>
        <small>No stage remains</small>
      </span>
    );
  return (
    <span className="stage-cell">
      <b>{record.stage}</b>
      <small>
        Stage {record.stageIndex + 1} of {record.totalStages}
      </small>
      <span className="stage-meter" aria-hidden="true">
        <span
          style={{
            width: `${((record.stageIndex + 1) / record.totalStages) * 100}%`,
          }}
        />
      </span>
    </span>
  );
}

function ApplicationsView({
  draft,
  current,
  open,
  newApplication,
}: {
  draft: ApplicationDraft;
  current: number;
  open: (record: ApplicationRecord) => void;
  newApplication: () => void;
}) {
  const [filter, setFilter] = useState<ApplicationFilterId>("all");
  const [layout, setLayout] = useState<"table" | "cards">("table");
  const records = useMemo(
    () => [liveApplication(draft, current), ...sampleApplications],
    [draft, current],
  );
  const shown =
    filter === "all"
      ? records
      : records.filter((record) => record.group === filter);
  return (
    <div className="applications">
      <div className="applications-heading">
        <div>
          <span className="eyebrow">My applications</span>
          <h1>Everything you have started.</h1>
          <p>
            Status, stage and the office handling each application. The fresh
            ordinary passport is your working draft; the other rows are sample
            records in this prototype.
          </p>
        </div>
        <Button variant="outline" onClick={newApplication}>
          <Plus />
          Start another application
        </Button>
      </div>
      <div className="applications-toolbar">
        <div className="filter-chips" role="group" aria-label="Filter applications">
          {applicationFilters.map((entry) => {
            const count =
              entry.id === "all"
                ? records.length
                : records.filter((record) => record.group === entry.id).length;
            return (
              <button
                key={entry.id}
                className={filter === entry.id ? "selected" : ""}
                aria-pressed={filter === entry.id}
                onClick={() => setFilter(entry.id)}
              >
                {entry.label}
                <small>{count}</small>
              </button>
            );
          })}
        </div>
        <div className="segmented" role="group" aria-label="List layout">
          <button
            className={layout === "table" ? "selected" : ""}
            aria-pressed={layout === "table"}
            onClick={() => setLayout("table")}
          >
            <Table2 />
            Table
          </button>
          <button
            className={layout === "cards" ? "selected" : ""}
            aria-pressed={layout === "cards"}
            onClick={() => setLayout("cards")}
          >
            <LayoutGrid />
            Cards
          </button>
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="applications-empty">
          No applications in this view. Choose another filter.
        </p>
      ) : layout === "table" ? (
        <div className="table-wrap">
          <table className="applications-table">
            <caption className="sr-only">
              Applications with status, stage, appointment, office and next
              action
            </caption>
            <thead>
              <tr>
                <th scope="col">Application</th>
                <th scope="col">Status</th>
                <th scope="col">Stage</th>
                <th scope="col">Appointment</th>
                <th scope="col">Office &amp; contact</th>
                <th scope="col">Next action</th>
                <th scope="col">
                  <span className="sr-only">Open application</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((record) => (
                <tr key={record.id} className={record.live ? "live" : undefined}>
                  <th scope="row">
                    <b>{record.service}</b>
                    <small>
                      {record.applicant}
                      {record.relation ? ` · ${record.relation}` : ""}
                    </small>
                    <small className="muted">
                      {record.reference ?? "Reference issued on submission"}
                    </small>
                  </th>
                  <td>
                    <StatusPill tone={record.tone}>{record.status}</StatusPill>
                    <small className="muted">{record.updated}</small>
                  </td>
                  <td>
                    <StageCell record={record} />
                  </td>
                  <td>
                    {record.appointment ?? (
                      <span className="muted">Not booked</span>
                    )}
                  </td>
                  <td>
                    <b>{record.office}</b>
                    <small className="muted">{record.contact}</small>
                  </td>
                  <td>{record.nextAction}</td>
                  <td className="row-action">
                    {record.live ? (
                      <Button size="sm" onClick={() => open(record)}>
                        Resume
                        <ArrowRight />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => open(record)}
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="applications-cards">
          {shown.map((record) => (
            <Card
              key={record.id}
              className={record.live ? "application-card live" : "application-card"}
            >
              <CardHeader>
                <div>
                  <StatusPill tone={record.tone}>{record.status}</StatusPill>
                  <CardTitle>
                    <h2>{record.service}</h2>
                  </CardTitle>
                  <CardDescription>
                    {record.applicant}
                    {record.relation ? ` · ${record.relation}` : ""} ·{" "}
                    {record.reference ?? "Reference issued on submission"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <StageCell record={record} />
                <dl className="record-facts">
                  <div>
                    <dt>Appointment</dt>
                    <dd>{record.appointment ?? "Not booked"}</dd>
                  </div>
                  <div>
                    <dt>Office &amp; contact</dt>
                    <dd>
                      {record.office}
                      <small>{record.contact}</small>
                    </dd>
                  </div>
                  <div>
                    <dt>Next action</dt>
                    <dd>{record.nextAction}</dd>
                  </div>
                  <div>
                    <dt>Last update</dt>
                    <dd>{record.updated}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                {record.live ? (
                  <Button onClick={() => open(record)}>
                    Resume {steps[current].short}
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => open(record)}>
                    View sample record
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <section className="dashboard-help">
        <h2>What can I do here?</h2>
        <div>
          <article>
            <Store />
            <b>Resume safely</b>
            <p>Return to the exact application stage shown in the list.</p>
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
  const openApplication = (record: ApplicationRecord) => {
    if (record.live) {
      go(current);
      return;
    }
    toast.info(
      `${record.service} is a sample record. Only the fresh ordinary passport draft is interactive in this prototype.`,
    );
  };
  const applicant =
    `${draft.givenName} ${draft.surname}`.trim() || "Mock applicant";
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
  let content: ReactNode;
  if (view === "dashboard") {
    content = (
      <ApplicationsView
        draft={draft}
        current={current}
        open={openApplication}
        newApplication={() =>
          toast.info(
            "This prototype carries one working application. A production service would start a new one here.",
          )
        }
      />
    );
  } else {
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
  }
  return (
    <>
      <ApplicationShell
        view={view}
        current={current}
        furthest={furthest}
        saveState={saveState}
        submitted={draft.submitted}
        applicant={applicant}
        onStep={(n) => go(n)}
        dashboard={() => setView("dashboard")}
        documents={() => go(5)}
        saveExit={saveExit}
        signOut={restart}
      >
        {content}
      </ApplicationShell>
      <Toaster />
    </>
  );
}
