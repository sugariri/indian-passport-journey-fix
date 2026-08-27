import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  FileText,
  MapPin,
  NotebookPen,
  ShieldCheck,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react"

export type StepId =
  | "personal-history"
  | "family"
  | "contacts-legal"
  | "address-office"
  | "passport-options"
  | "documents"
  | "review-submit"
  | "appointment"
  | "ready"

export type EvidenceState = "ready" | "attention" | "review"
export type SaveState = "saving" | "saved" | "error"
export type View = "start" | "signin" | "application" | "dashboard"
export type PaymentState = "idle" | "processing" | "failed" | "paid"

export interface JourneyStep {
  id: StepId
  label: string
  short: string
  chapter: "About you" | "Address & evidence" | "Review & submit" | "Appointment"
  icon: LucideIcon
}

export interface ApplicationDraft {
  givenName: string
  surname: string
  dateOfBirth: string
  placeOfBirth: string
  employment: string
  heldOrdinaryPassport: "no" | "yes" | "unsure"
  heldOtherPassport: "no" | "yes" | "unsure"
  priorApplication: "no" | "yes" | "unsure"
  fatherName: string
  motherName: string
  familySituation: "standard" | "guardian" | "help"
  emergencyName: string
  emergencyPhone: string
  referenceOne: string
  referenceTwo: string
  legalCheck: "no" | "yes" | "help"
  address: string
  city: string
  pin: string
  addressProof: "match" | "rent" | "different" | "unsure"
  highestEducation: "graduate" | "school" | "another" | "unsure"
  employmentAbroad: "no" | "yes" | "unsure"
  booklet: "36" | "60"
  birthDocument: "shared" | "carry"
  educationDocument: "shared" | "carry" | "missing"
  declaration: boolean
  centre: number | null
  day: number | null
  slot: number | null
  payment: PaymentState
  submitted: boolean
}

export interface GuidanceResult {
  state: EvidenceState
  label: string
  detail: string
}

export interface DocumentRequirement {
  id: string
  title: string
  purpose: string
  state: EvidenceState
  digitalStatus: "Shared through DigiLocker" | "Not digitally shared" | "Needs a decision"
  appointmentAction: string
}

export interface AddressEvidence {
  state: EvidenceState
  title: string
  detail: string
}

export interface Centre {
  name: string
  type: "PSK" | "POPSK"
  district: string
  rpo: string
  earliest: string
  distance: string
  address: string
}

export interface ReadinessItem {
  title: string
  state: EvidenceState
  detail: string
  action: string
  step: number
  blocking: boolean
}

export const steps: JourneyStep[] = [
  { id: "personal-history", label: "Personal & history", short: "Personal", chapter: "About you", icon: FileText },
  { id: "family", label: "Family details", short: "Family", chapter: "About you", icon: Users },
  { id: "contacts-legal", label: "Contacts & legal", short: "Contacts", chapter: "About you", icon: NotebookPen },
  { id: "address-office", label: "Address & office", short: "Address", chapter: "Address & evidence", icon: MapPin },
  { id: "passport-options", label: "Passport options", short: "Options", chapter: "Address & evidence", icon: BookOpenCheck },
  { id: "documents", label: "Documents", short: "Documents", chapter: "Address & evidence", icon: Store },
  { id: "review-submit", label: "Review & submit", short: "Review", chapter: "Review & submit", icon: BadgeCheck },
  { id: "appointment", label: "Appointment", short: "Appointment", chapter: "Appointment", icon: CalendarDays },
  { id: "ready", label: "Ready", short: "Ready", chapter: "Appointment", icon: ShieldCheck },
]

export const applicationReference = "FP-MOCK-2026-0148"

export const chapterRanges = [
  { label: "About you", start: 0, end: 2 },
  { label: "Address & evidence", start: 3, end: 5 },
  { label: "Review & submit", start: 6, end: 6 },
  { label: "Appointment", start: 7, end: 8 },
] as const

export const defaultDraft: ApplicationDraft = {
  givenName: "Aditi",
  surname: "Sharma",
  dateOfBirth: "1998-07-18",
  placeOfBirth: "Bengaluru, Karnataka",
  employment: "Private-sector employee",
  heldOrdinaryPassport: "no",
  heldOtherPassport: "no",
  priorApplication: "no",
  fatherName: "Rajesh Sharma",
  motherName: "Meena Sharma",
  familySituation: "standard",
  emergencyName: "Neha Sharma",
  emergencyPhone: "9876543210",
  referenceOne: "Arjun Rao",
  referenceTwo: "Kavya Menon",
  legalCheck: "no",
  address: "14, 2nd Cross, Indiranagar",
  city: "Bengaluru",
  pin: "560038",
  addressProof: "match",
  highestEducation: "graduate",
  employmentAbroad: "no",
  booklet: "36",
  birthDocument: "shared",
  educationDocument: "shared",
  declaration: false,
  centre: null,
  day: null,
  slot: null,
  payment: "idle",
  submitted: false,
}

export const centres: Centre[] = [
  {
    name: "PSK Bengaluru, Lalbagh",
    type: "PSK",
    district: "Bengaluru Urban",
    rpo: "Bengaluru",
    earliest: "03 Sep 2026",
    distance: "4.8 km away",
    address: "Lalbagh Main Road, Bengaluru 560027",
  },
  {
    name: "PSK Bengaluru, Sai Arcade",
    type: "PSK",
    district: "Bengaluru Urban",
    rpo: "Bengaluru",
    earliest: "05 Sep 2026",
    distance: "8.1 km away",
    address: "Outer Ring Road, Bengaluru 560103",
  },
  {
    name: "POPSK Bengaluru, Yelahanka",
    type: "POPSK",
    district: "Bengaluru Urban",
    rpo: "Bengaluru",
    earliest: "09 Sep 2026",
    distance: "16.4 km away",
    address: "Head Post Office, Yelahanka 560064",
  },
]

export const appointmentDays = ["Thu, 03 Sep", "Fri, 04 Sep", "Sat, 05 Sep"]
export const appointmentSlots = [
  { time: "09:30", available: true },
  { time: "10:15", available: true },
  { time: "11:00", available: false },
  { time: "11:45", available: true },
]

export function categoryGuidance(draft: ApplicationDraft): GuidanceResult {
  if (draft.highestEducation === "graduate" && draft.employmentAbroad !== "unsure") {
    return {
      state: "ready",
      label: "Your answers point to the Non-ECR category",
      detail: "This is preparation guidance based on the information provided. Review the supporting evidence before submission; the official process makes the final determination.",
    }
  }
  if (draft.highestEducation === "unsure" || draft.employmentAbroad === "unsure") {
    return {
      state: "review",
      label: "More information is needed to suggest a category",
      detail: "Not sure is a valid answer. Review the official category guidance or ask for help instead of guessing.",
    }
  }
  return {
    state: "attention",
    label: "Review the category and supporting evidence",
    detail: "The answers in this mock journey do not produce a confident suggestion. Check the official criteria before declaring.",
  }
}

export function addressEvidence(draft: ApplicationDraft): AddressEvidence {
  if (draft.addressProof === "match" || draft.addressProof === "rent") {
    return {
      state: "ready",
      title: "The selected proof appears to support the address entered",
      detail: "This is a preparation check, not official verification. The official process checks the document at the appropriate stage.",
    }
  }
  if (draft.addressProof === "different") {
    return {
      state: "attention",
      title: "The selected proof shows a different address",
      detail: "Choose an accepted proof that supports the present address entered before submission. This does not claim the wording must match character-for-character.",
    }
  }
  return {
    state: "review",
    title: "Check the address document before continuing",
    detail: "Save the draft and return after checking which accepted proof supports the present address.",
  }
}

export function documentRequirements(draft: ApplicationDraft): DocumentRequirement[] {
  const address = addressEvidence(draft)
  const category = categoryGuidance(draft)
  return [
    {
      id: "birth",
      title: "Proof of date of birth",
      purpose: "Supports the date of birth you entered in Personal & history.",
      state: "ready",
      digitalStatus: draft.birthDocument === "shared" ? "Shared through DigiLocker" : "Not digitally shared",
      appointmentAction: draft.birthDocument === "shared" ? "Digitally shared in this mock journey" : "Keep the selected document ready for verification",
    },
    {
      id: "address",
      title: "Proof of present address",
      purpose: "Supports the present residential address used for this application.",
      state: address.state,
      digitalStatus: address.state === "ready" ? "Not digitally shared" : "Needs a decision",
      appointmentAction: address.state === "ready" ? "Keep the chosen proof ready for verification if required" : "Choose or check a proof that supports the address entered",
    },
    {
      id: "category",
      title: "Evidence for passport category",
      purpose: `Supports the category worked out from your education and employment answers. Current guidance: ${category.label}.`,
      state: draft.educationDocument === "missing" ? "attention" : category.state,
      digitalStatus:
        draft.educationDocument === "shared"
          ? "Shared through DigiLocker"
          : draft.educationDocument === "carry"
            ? "Not digitally shared"
            : "Needs a decision",
      appointmentAction:
        draft.educationDocument === "shared"
          ? "Digitally shared in this mock journey"
          : draft.educationDocument === "carry"
            ? "Keep the selected evidence ready for verification"
            : "Select supporting evidence before submission",
    },
  ]
}

export function readinessItems(draft: ApplicationDraft): ReadinessItem[] {
  const category = categoryGuidance(draft)
  const address = addressEvidence(draft)
  const docs = documentRequirements(draft)
  const documentsState: EvidenceState = docs.some((item) => item.state === "attention")
    ? "attention"
    : docs.some((item) => item.state === "review")
      ? "review"
      : "ready"

  return [
    { title: "Passport category", state: category.state, detail: category.label, action: "Review Passport options", step: 4, blocking: category.state !== "ready" },
    { title: "Present address", state: address.state, detail: address.title, action: "Review Address & office", step: 3, blocking: address.state !== "ready" },
    { title: "Supporting documents", state: documentsState, detail: documentsState === "ready" ? "Every required mock document has a preparation status" : "One or more documents still need a decision", action: "Open Documents", step: 5, blocking: documentsState !== "ready" },
  ]
}

export const bookletChoices = [
  {
    value: "36" as const,
    title: "36 pages",
    detail: "Enough blank pages for occasional travel.",
  },
  {
    value: "60" as const,
    title: "60 pages",
    detail: "More blank pages for visas and entry stamps.",
  },
]

export const bookletDifference =
  "Only the number of blank pages and the fee differ. Choose 60 pages if you expect frequent travel before the passport is renewed."

/**
 * The official form prints a passport name as two lines: Surname, then Given
 * Name(s) — where Given Name(s) means the first name followed by the complete
 * middle name. This preview exists so a formatting mistake is visible while it
 * can still be corrected, not after printing.
 */
/** Reviewing an ISO date for mistakes is harder than reading a written one. */
export function formatBirthDate(value: string) {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const name = months[Number(month) - 1]
  if (!name) return value
  return `${Number(day)} ${name} ${year}`
}

export function passportNamePreview(draft: ApplicationDraft) {
  const surname = draft.surname.trim().replace(/\s+/g, " ").toUpperCase()
  const given = draft.givenName.trim().replace(/\s+/g, " ").toUpperCase()
  return {
    surname,
    given,
    hasSurname: surname.length > 0,
    isEmpty: surname.length === 0 && given.length === 0,
  }
}

/**
 * Formatting notes only. These repeat instructions printed on the official
 * form; they do not determine whether a name is acceptable.
 */
export function nameFormatNotes(draft: ApplicationDraft): string[] {
  const given = draft.givenName.trim()
  const surname = draft.surname.trim()
  const notes: string[] = []
  if (given.includes(".") || surname.includes(".")) {
    notes.push("Remove full stops. Write every name in full instead of an initial.")
  }
  if (/^(mr|mrs|ms|miss|dr|shri|smt|sri|kum)\b/i.test(given)) {
    notes.push("Remove titles such as Mr, Mrs, Dr or Shri. Enter names only.")
  }
  if (given && !surname) {
    notes.push("With Surname left blank, your complete name must appear under Given name(s).")
  }
  return notes
}

export function bookletFee(booklet: ApplicationDraft["booklet"]) {
  return booklet === "60" ? "₹2,000" : "₹1,500"
}

export type ApplicationGroup = "progress" | "waiting" | "closed"
export type ApplicationTone = "draft" | "waiting" | "attention" | "done"

export interface ApplicationRecord {
  id: string
  service: string
  applicant: string
  relation: string | null
  reference: string | null
  status: string
  tone: ApplicationTone
  group: ApplicationGroup
  stage: string
  stageIndex: number | null
  totalStages: number
  office: string
  officeType: "PSK" | "POPSK" | "RPO"
  contact: string
  appointment: string | null
  updated: string
  nextAction: string
  live: boolean
}

export const applicationFilters = [
  { id: "all", label: "All" },
  { id: "progress", label: "In progress" },
  { id: "waiting", label: "With the office" },
  { id: "closed", label: "Completed" },
] as const

export type ApplicationFilterId = (typeof applicationFilters)[number]["id"]

export function liveApplication(draft: ApplicationDraft, current: number): ApplicationRecord {
  const step = steps[Math.max(0, Math.min(steps.length - 1, current))]
  const centre = draft.centre === null ? null : centres[draft.centre]
  const booked =
    centre && draft.day !== null && draft.slot !== null && draft.payment === "paid"
      ? `${appointmentDays[draft.day]} 2026 · ${appointmentSlots[draft.slot].time}`
      : null
  return {
    id: "live",
    service: "Fresh ordinary passport",
    applicant: `${draft.givenName} ${draft.surname}`.trim() || "You",
    relation: null,
    reference: draft.submitted ? applicationReference : null,
    status: draft.submitted
      ? booked
        ? "Appointment booked"
        : "Submitted · appointment to be chosen"
      : "Draft in progress",
    tone: draft.submitted ? (booked ? "waiting" : "attention") : "draft",
    group: draft.submitted && booked ? "waiting" : "progress",
    stage: step.label,
    stageIndex: current,
    totalStages: steps.length,
    office: centre ? centre.name : "Not chosen yet",
    officeType: centre ? centre.type : "RPO",
    contact: centre ? `RPO ${centre.rpo} · 1800 258 1800` : "RPO Bengaluru · 1800 258 1800",
    appointment: booked,
    updated: "Saved on this device just now",
    nextAction: draft.submitted
      ? booked
        ? "Prepare the documents listed for the appointment"
        : "Choose an appointment slot"
      : `Continue at ${step.label}`,
    live: true,
  }
}

export const sampleApplications: ApplicationRecord[] = [
  {
    id: "sample-minor",
    service: "Fresh ordinary passport — minor",
    applicant: "Aarav Sharma",
    relation: "Linked minor",
    reference: "FP-MOCK-2026-0092",
    status: "Appointment booked",
    tone: "waiting",
    group: "waiting",
    stage: "Appointment",
    stageIndex: 7,
    totalStages: steps.length,
    office: "PSK Bengaluru, Lalbagh",
    officeType: "PSK",
    contact: "RPO Bengaluru · 1800 258 1800",
    appointment: "Fri, 04 Sep 2026 · 10:15",
    updated: "Updated 24 Aug 2026",
    nextAction: "Both parents attend with the original documents",
  },
  {
    id: "sample-reissue",
    service: "Re-issue — change of address",
    applicant: "Rajesh Sharma",
    relation: "Linked family member",
    reference: null,
    status: "Needs attention",
    tone: "attention",
    group: "progress",
    stage: "Address & office",
    stageIndex: 3,
    totalStages: steps.length,
    office: "POPSK Bengaluru, Yelahanka",
    officeType: "POPSK",
    contact: "RPO Bengaluru · 1800 258 1800",
    appointment: null,
    updated: "Updated 21 Aug 2026",
    nextAction: "The selected proof shows a different address",
  },
  {
    id: "sample-pcc",
    service: "Police clearance certificate",
    applicant: "Meena Sharma",
    relation: "Linked family member",
    reference: "PCC-MOCK-2026-0031",
    status: "Completed",
    tone: "done",
    group: "closed",
    stage: "Closed",
    stageIndex: null,
    totalStages: steps.length,
    office: "PSK Bengaluru, Sai Arcade",
    officeType: "PSK",
    contact: "RPO Bengaluru · 1800 258 1800",
    appointment: "Attended 12 Aug 2026",
    updated: "Closed 12 Aug 2026",
    nextAction: "No action remains in this mock record",
  },
].map((record) => ({ ...record, live: false })) as ApplicationRecord[]
