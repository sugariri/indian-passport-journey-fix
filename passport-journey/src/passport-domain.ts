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
      purpose: "Supports the date of birth entered in Personal & history.",
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
      purpose: "Supports the category guidance shown in Passport options.",
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

export function bookletFee(booklet: ApplicationDraft["booklet"]) {
  return booklet === "60" ? "₹2,000" : "₹1,500"
}
