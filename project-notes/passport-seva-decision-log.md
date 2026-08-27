# Passport Seva redesign — research and decision log

**Competition scope:** Solve one problem in the first-time, fresh ordinary-passport journey: applicants must work out their own eligibility and evidence requirements from unfamiliar government terminology, disconnected tools, and delayed feedback. The prototype uses the full journey from application entry through appointment readiness to make eligibility and readiness understandable before commitment; it does not claim to redesign every Passport Seva service.

**North-star outcome:** An applicant should know what to enter, what supports it, what remains unresolved, which centre they are choosing, and what to carry before they commit.

## Evidence taxonomy

| Label | Meaning |
|---|---|
| `SCREEN` | Observed in user-supplied Passport Seva screenshots. |
| `OFFICIAL` | Passport Seva / MEA page, FAQ, RPO page, or official PDF. |
| `UX ASSUMPTION` | A proposed interaction or usability inference; not policy. |

## Stable product thesis

> Passport Seva asks applicants to supply vocabulary, reasoning, verification, and sequencing that the service should supply itself—and gives little confidence that the applicant has got it right.

## Root causes retained for the redesign

1. **Vocabulary** — government terms are presented before the user has enough context.
2. **Labour** — applicants manually perform reasoning or repeat information the service can help derive.
3. **Judgment** — the service gives field-completion feedback, not readiness confidence.
4. **Commitment before information** — evidence, availability, and consequences arrive after a consequential choice.
5. **Attention** — global navigation and quick links compete with the active application.

## Current-state evidence

| Observation | Evidence | Design implication |
|---|---|---|
| The in-progress application shows a nine-step progress tracker, full left navigation, and right-side quick links including Apply and Track. | `SCREEN` — application screenshots, 22 Aug 2026 | Replace portal-style chrome with an application workspace while the applicant is mid-task. |
| Saving is represented as **Save and Next**; drafts can be returned to through My Applications. | `SCREEN`; `OFFICIAL` — [Apply guidance](https://www.passportindia.gov.in/psp/Apply) says an application may be saved and resumed. | Do not claim save/resume is absent. Improve clarity: autosave/draft status, safe-to-leave reassurance, and precise resume point. |
| Fresh and re-issue are offered as peer radio buttons inside a shared application. | `SCREEN`; `OFFICIAL` — [Application FAQ](https://www.passportindia.gov.in/psp/FaqApplicationForm) distinguishes fresh from re-issue cases. | Begin with the applicant's situation, then route to Fresh or Re-issue. The prototype builds the Fresh route only. |
| Address is entered at Step 04; proof of present residential address is selected later at Details Verification. | `SCREEN` | Connect address entry to the intended proof before submission. |
| Details Verification is three proof dropdowns plus a declaration. | `SCREEN` | Replace with a readiness checkpoint that shows status, explanation, and next action. |
| The current screen says documents not shared through DigiLocker need to be submitted at PSK/Passport Office. | `SCREEN`; `OFFICIAL` — [Tatkaal undertaking](https://www.passportindia.gov.in/AppOnlineProject/pdf/Undertaking_for_Tatkaal_Scheme_English.pdf) accepts specified e-documents shared/uploaded through DigiLocker. | Use per-document states; do not state that every digitally shared document also requires a physical original. |
| RPO is selected before the application; centre-specific dates are shown later during scheduling. | `SCREEN`; `OFFICIAL` — [appointment availability](https://www.passportindia.gov.in/psp/CheckAppointmentAvailibility) | Explain State → RPO → PSK/POPSK and expose indicative availability before final commitment wherever existing availability data permits. |
| The applicant is asked whether they are eligible for Non-ECR, but the active form does not explain the category at the decision point. | `SCREEN` — Step 02 Applicant Details capture; `OFFICIAL` — [Document Advisor](https://www.passportindia.gov.in/psp/docAdvisor/attachmentAdvFreshInp) asks the same category in a separate journey. | Ask circumstances in plain language, derive or suggest the category, explain the result, and let the applicant review it. |

## Address evidence and decision

### What official material supports

- At least one document should match the address entered in the application; official material does **not** define this as word-for-word or character-for-character matching. `OFFICIAL` — [Tatkaal undertaking](https://www.passportindia.gov.in/AppOnlineProject/pdf/Undertaking_for_Tatkaal_Scheme_English.pdf)
- If an applicant finds an error in the printed online form, the official FAQ directs them to ask the Citizen Service Executive at Counter A at PSK/POPSK to make the required changes. `OFFICIAL` — [Application Form FAQ](https://www.passportindia.gov.in/psp/FaqApplicationForm)
- Regional Passport Office notices warn that a subsequently reported change of residential address may result in closure of the application and fee forfeiture. `OFFICIAL` — [RPO Delhi](https://services1.passportindia.gov.in/psp/RPO/DelhiRPO), [RPO Mumbai](https://www.passportindia.gov.in/psp/RPO/MumbaiRPO)

### Design conclusion

Do not promise that the user can edit their address at any time. Distinguish:

1. **Before submission:** freely edit and validate the selected proof against the stated current address.
2. **Error noticed before or at appointment:** explain the Counter A correction route; do not guarantee the outcome.
3. **Genuinely changed residence after applying:** warn that it may affect or close the application; do not portray this as a routine edit.

### Open question

The official FAQ confirms the Counter A correction route but does not document which specific address corrections are accepted or the backend procedure. Do not claim a guaranteed online or in-centre edit flow without further official evidence.

## Proposed fresh-passport information architecture

1. Choose situation — first ordinary passport / previously held passport.
2. Application workspace — progress, draft status, contextual help.
3. About you — plain-language questions and derived category explanation.
4. Present address and proof — current address, supporting-proof selection, confidence state.
5. Personalised documents — document-level DigiLocker / physical-document statuses.
6. Readiness review — ready items, unresolved items, what to carry.
7. Preview and declaration — only after readiness information is visible.
8. Explore appointment availability — location hierarchy and indicative dates.
9. Submit, pay, and book — preserve official payment/booking policy.
10. Appointment-ready summary — centre, time, documents, and correction/help route.

## Deliberate exclusions

- Full Re-issue, Tatkaal, minor, lost/damaged, and diplomatic/official flows.
- Changing policy, eligibility rules, appointment capacity, fees, or legal declarations.
- Redesigning police verification operations.

## Full-flow audit synthesis (provisional)

**Observed pattern:** `SCREEN` — the 23-step screenshot-backed journey repeatedly asks the applicant to supply a category, choose evidence, sign a declaration, or commit money/location before the service has made the choice understandable or checked.

| Journey stage | Existing failure | Proposed ordering principle |
|---|---|---|
| Entry | Service catalogue is presented before intent; Fresh/Re-issue is an unexplained category. | Begin with the applicant's situation and route them. |
| Start | RPO is selected and later locked before the applicant sees centre context or dates. | Gather a rough location first; show explanatory, indicative centre context before a binding choice. |
| Personal details | ECR/Non-ECR, booklet, names, and legal fields are presented as applicant decisions. | Ask plain-language circumstances; derive, explain, and let the applicant review the resulting category. |
| Address | Address is entered without its intended proof. | Treat present address and its supporting proof as one decision. |
| Documents | Document Advisor is separate; Details Verification is late and does not verify. | Carry a personalised checklist in the application and produce a readiness state before declaration. |
| Declaration | The applicant attests before seeing whether evidence supports what they entered. | Place legal declaration after the readiness review; preserve legal text but add a plain-language summary. |
| Appointment | Availability arrives after RPO lock and at payment/scheduling. | Allow informational availability exploration before commitment; retain booking/payment rules in the mocked flow. |
| Completion | ARN receipt confirms booking, not citizen readiness. | End with an appointment-ready summary and a safe correction/help route. |

**What not to redesign:** login/captcha, emergency contact, payment gateway mechanics, appointment capacity, police-verification operations, and legal declarations themselves. Improve their placement or explanation only where necessary to the citizen journey.

**Provisional unifying problem:** First-time applicants cannot tell whether they are eligible, evidence-ready, and making a workable appointment choice before they are asked to commit.

## Competition constraints

- The build must demonstrate a complete citizen journey, not a static redesign.
- Use only mock or synthetic personal data, payments, authentication, appointment availability, and integrations.
- Do not access live government systems, imply official approval, or present the prototype as an official government product.
- Clearly disclose mocked behaviour and policy-dependent assumptions in the prototype and submission materials.

## Public-service design acceptance criteria

The prototype should only claim to improve the flow if it meets all of these checks:

1. **Comprehension before action:** no unfamiliar category or consequential option is presented without a plain-language explanation at the point of decision.
2. **Evidence before attestation:** the applicant sees whether their selected information and evidence are ready before making the declaration.
3. **Reversibility and consequence clarity:** users can safely pause while drafting; when a choice cannot be safely edited later, explain the consequence before it is made.
4. **Human-service handoff:** where the PSK/Counter A must resolve something, say so plainly; do not simulate certainty the online service cannot provide.
5. **Inclusive operation:** support low confidence, slower connections, mobile screens, plain English/Hindi-ready content, and no requirement to understand government acronyms.
6. **Operational honesty:** show mock data as mock data, retain existing policy constraints, and do not imply a live government integration or endorsement.

## Change history

### 25 Aug 2026 — Journey simplification after UI review

- `USER REVIEW` — The accumulated public-service catalogue, post-authentication hub, nine-step sidebar, and readiness score made the prototype harder to understand than the citizen problem it was meant to solve.
- Revision: reduced the entry to one routing question, preserved sign-in only as a necessary boundary, and moved signed-in users directly into the application rather than through a second dashboard.
- Revision: replaced the persistent application rail and readiness score with a compact step label and progress bar. Documents and safe exit remain available without competing with the active question.
- Added a persistent, above-the-fold independent-prototype notice and raised instructional/status copy to the existing body scale.
- Preserved the full evidence-led journey: plain-language eligibility, address-to-proof connection, personalised documents, readiness before declaration, indicative appointment context, and appointment-ready summary.
- Validation: TypeScript/Vite production build passes; oxlint reports only existing generated-component Fast Refresh warnings; desktop entry rendering checked at 1440 × 1000.

### 24 Aug 2026 — Evidence consolidation

- Added the complete user-supplied screenshot sequence as current-state interface evidence.
- Revised the save/resume claim: the capability exists; the experience lacks visible continuity and reassurance.
- Revised the address claim: "word-for-word" is not supported by the official source. The supported finding is that the service fails to reveal and check the proof-to-address requirement before submission.
- Elevated the address-correction warning to a core issue: a Counter A correction path is published in the FAQ, while RPO notices warn that a later actual change of residence may close the application.

### 24 Aug 2026 — Competition-scope correction

- `OFFICIAL / COMPETITION BRIEF` — The hackathon asks for one real citizen problem and a complete working journey, not a broad service redesign.
- Revision: address-proof confidence is a flagship instance, not the complete problem. The one problem is **first-time applicants being required to self-interpret eligibility and document readiness**.
- Evidence: `SCREEN` — Non-ECR is presented as an unexplained category in the main form; address proof is selected later than address entry; Document Advisor is separate; Details Verification gives no readiness outcome.
- Decision: entry routing, draft reassurance, plain-language eligibility, address-proof confidence, personalised documents, readiness, availability context, and the correction route all remain in scope because each removes a different part of the same self-interpretation burden.
- Constraint: all personal data, payment, availability, and government integrations must be mocked; branding must not imply government endorsement.

### 24 Aug 2026 — Prototype implementation

- Built an interactive, standalone mock journey in `prototype.html`: situation routing, plain-language Non-ECR explanation, address-and-proof confidence state, integrated documents, pre-declaration readiness review, indicative appointment choice, mock payment, and an appointment-ready summary.
- `UX ASSUMPTION` — the address confidence result is a transparent prototype aid, not an online government verification claim. It explicitly directs final verification to the official process.
- `UX ASSUMPTION` — appointment availability is informational before booking; all availability, document-sharing and payment data in the prototype is synthetic.
- Validation: desktop and iPhone-sized screenshot capture completed. Automated end-to-end browser interaction testing is still pending because the local Playwright package is not available to a Node script.

### 24 Aug 2026 — Information-architecture correction

- `SCREEN / USER REVIEW` — The first build over-compressed the real application by omitting personal details, family details, other legal details, workspace navigation, safe exit/resume, and a document-store view.
- Revision: expanded the prototype to a nine-stage first-time flow: Personal → Eligibility → Family → Address → Documents → Other details → Readiness → Appointment → Ready.
- Added a persistent, task-appropriate workspace navigation: My application, Documents, Save & exit, Account/help, and an explicit safe-sign-out state. The global portal links that distract from an active form remain excluded.
- Kept Previous Passport fields intentionally collapsed for the first-time route, with an explicit explanation of why they are not required.

### 24 Aug 2026 — React visual rebuild

- Replaced the static mock with a Vite + React + TypeScript prototype using shadcn/ui primitives and typed synthetic application data. The app is in `passport-journey/` and is intentionally branded **Passport Journey**, not Passport Seva.
- `UX ASSUMPTION` — The visual system takes limited cues from the existing service (navy/gold utility surfaces, application-stage record, compact service navigation) while deliberately excluding the official emblem, name, and any endorsement implication.
- `SCREEN` — The original application combines a persistent portal rail and quick links with the active task. Revision: desktop uses an application-only rail; mobile uses a compact stage summary plus a navigable drawer.
- `UX ASSUMPTION` — A persistent readiness indicator is preparation guidance, never a claim that the application has passed government verification.
- `UX ASSUMPTION` — All draft persistence is browser-local and synthetic. It demonstrates safe pause/resume interaction only; it is not a proposed production storage/security implementation.
- Validation: production build passes. In-browser checks completed for the full fresh-applicant happy path, a blocked proof-address mismatch, draft/resume routes, and a 390 px mobile layout. Mock availability and payment disclosure remains visible.

### 24 Aug 2026 — Public-to-authenticated information architecture

- `SCREEN` — The public home exposes **Apply For Passport**, then a separate service directory, then a login boundary, then a generic logged-in application dashboard. The selected service is not carried visibly across those surfaces.
- Revision: the prototype now preserves the selected first-ordinary-passport route through the sequence: public service discovery → sign-in explanation → authenticated application hub → guided workspace.
- `UX ASSUMPTION` — Sign-in remains necessary for protected draft/resume behaviour. The redesign improves the handoff and context; it does not remove authentication or claim access to a government account system.
- The active workspace is now grouped by citizen purpose rather than nine visually equal form steps: **Your application**; **Address, eligibility & evidence**; **Check before you submit**; **Book your visit**. Individual fields remain accessible inside these chapters.
- Validation: browser interaction confirms the selected fresh-passport route appears before sign-in and on the post-sign-in hub, and the grouped navigation renders in the application workspace.

### 24 Aug 2026 — Visual-direction correction

- `SCREEN / USER REVIEW` — The React rebuild introduced a separate product identity ("Passport Journey" with a seal-like mark), an editorial opening screen, and a dark dashboard rail. This made the prototype feel like several unrelated products rather than a credible improvement of the current service.
- Revision: the public discovery, sign-in handoff, authenticated hub, and active workspace will use one restrained public-service system: white utility header, civic navy as the structural colour, muted gold only for status/selection, practical form surfaces, hairline dividers, and low-radius controls. Global portal distractions remain absent once the user has started an application.
- `UX ASSUMPTION` — An Intercom design reference was added for operational patterns only (quiet hierarchy, neutral-dominant surfaces, clear primary action, and contextual state). Its branding, orange palette, marketing composition, and customer-support conventions are not being copied.
- Constraint: retain the independent-prototype disclosure and do not use the official name, emblem, or an affiliation claim.

### 24 Aug 2026 — Visual reference revision

- Replaced the Intercom reference with an IBM / Carbon reference in `passport-journey/docs/ibm-DESIGN.md`.
- Rationale: the Carbon system's structured navigation, flat form controls, dense readable layout, visible focus states, and task-first data presentation better fit a high-scale civic service than an editorial support-product reference.
- `UX ASSUMPTION` — The prototype may take only system-level cues from this reference: four-pixel spacing rhythm, light surfaces, high-contrast text, hairline structure, and explicit status colours. It will retain its own navy/gold civic palette and must not resemble or imply an IBM service.

### 24 Aug 2026 — Carbon token implementation

- Implemented IBM Plex Sans and an IBM / Carbon-inspired visual token system in the React prototype: white and Gray-10 working surfaces, charcoal content structure, IBM Blue (`#0F62FE`) as the sole interactive accent, square controls, hairline borders, and blue focus/selection treatment.
- Revision: the earlier navy/gold accent pair was removed from the app so that selection and action do not compete. The form’s information architecture and all independent-prototype disclosures are unchanged.
- Validation: production build passes and the initial service-routing screen was visually checked in the in-app browser.

### 24 Aug 2026 — Public entry composition revision

- `USER REVIEW / SCREEN` — The two-column entry screen placed a large explanatory block and route selector beside one another. It competed with its own task and was less clear than the cleaner public-service reference supplied by the user.
- Revision: the entry now has a single visual field with an original illustrative travel-document image and one compact shadcn Tabs-based task panel. The panel alone presents first passport / re-issue, states the route consequence, and contains the continuation action.
- `UX ASSUMPTION` — The hero image is contextual orientation only; it introduces no policy information and is explicitly non-official. The task panel remains readable without the image through its dark scrim and semantic controls.
- Validation: installed and used shadcn Tabs, production build passes, and the revised entry is visually checked in the in-app browser.

### 24 Aug 2026 — Public service discovery correction

- `SCREEN / USER REVIEW` — The current public service directory visibly offers Fresh/Re-issue Ordinary, Tatkaal, Diplomatic/Official, Identity Certificate, and abroad routes. The prior prototype showed only first passport and re-issue, incorrectly narrowing the discovery screen before the user could see the service landscape.
- Revision: the public entry now displays all comparable service routes before sign-in. "My first ordinary passport" is the primary route; renewal/replacement, Tatkaal, diplomatic/official, identity certificate, and abroad are visible secondary routes with a plain-language one-line explanation.
- Scope boundary: selecting a non-primary route transparently identifies it as outside this prototype; the first-time ordinary route remains the only complete, working journey.
- Validation: the production build passes and the revised service-discovery state was visually checked in the in-app browser.

### 24 Aug 2026 — Service relationship correction

- `SCREEN / USER REVIEW` — Although all public options were visible, the first revision made them appear as six equivalent application types. This obscured key relationships already present in the current service: first application versus existing passport, India versus abroad, Tatkaal as a conditional route, and specialised services.
- Revision: discovery is now ordered as **application location** → **first passport / have-or-had passport** → **Tatkaal guidance check** → **special services**. Resume and tracking are visible returning-applicant actions, not competing application choices.
- `OFFICIAL / UX ASSUMPTION` — Tatkaal is presented as “check whether Tatkaal may apply,” because its own official eligibility and document conditions apply. The prototype does not decide eligibility or invent those conditions.
- Scope boundary: first ordinary passport remains the only route that continues into a full working journey. Abroad, existing-passport, Tatkaal, diplomatic/official, identity-certificate, and tracking states explicitly explain their handoff or limitation.
- Implementation: added the shadcn Toggle Group primitive to make the location choice explicit; replaced non-functional public-header links with functional start, resume, and guidance actions.
- Validation: `npm run build` passes, and the updated discovery screen was checked in the in-app browser at the active local URL.

### 24 Aug 2026 — Discovery-form visual hierarchy

- `USER REVIEW / SCREEN` — The location switch had an unclear dark active state, the question/helper-text hierarchy was too compressed, and the Tatkaal guidance panel carried the same blue-tinted emphasis as the primary fresh-passport choice.
- Revision: selected location is now IBM Blue with white text; question labels, supporting guidance, card title, and section spacing follow a clearer scale; Tatkaal now uses a neutral gray surface and white secondary action to communicate conditional guidance rather than a primary route.
- Validation: production build passes and the revised India-location state was visually checked in the in-app browser.

### 25 Aug 2026 — Entry-page action cleanup

- `USER REVIEW / SCREEN` — The footer combined draft reassurance, resume, and tracking beneath an unsubmitted route-discovery form. It had no clear task role and distracted from the service decision.
- Revision: removed the footer action strip entirely. Resume remains an authenticated returning-applicant action in the public header. “Help me choose” was replaced with functional **Other services** navigation that brings the user to the specialised-service options already present on the page.
- Validation: production build passes and the service-discovery accessibility snapshot confirms the footer actions are absent while all route choices remain available.

### 25 Aug 2026 — Authentication-boundary rebuild

- `USER REVIEW / SCREEN` — The prior sign-in page used a different “Passport Journey” identity and old display typography, falsely said the selected service was already saved, and exposed only a vague “continue with mock sign-in” button. It did not explain what authentication changes in the journey.
- Revision: the page now uses the public-entry identity and is structured as **selected route (not yet an application)** → **sign in or create account** → **protected draft begins**. A selected-service summary includes a change-route action; a short three-step expectation list explains the next stages; the account card supports Sign in and Create account modes.
- Mock boundary: credentials fields are deliberately labelled prototype-only and request synthetic values. The prototype collects no credentials, OTPs, or personal data and does not represent a real government authentication system.
- Validation: `npm run build` passes; selecting “My first passport” and inspecting the rebuilt sign-in state was completed in the in-app browser.

### 25 Aug 2026 — Shadcn account composition

- `USER REVIEW` — The account switch still looked like a custom segmented control despite using shadcn primitives, and the page did not clearly demonstrate independent account panels.
- Revision: replaced the account Toggle Group with shadcn **Tabs**, **TabsList**, **TabsTrigger**, and **TabsContent**. Sign in and Create account now have separate semantic panels with their respective shadcn Input, Label, Card, Alert, and Button compositions.
- Validation: the in-app browser accessibility snapshot confirms the tablist, selected tab, and sign-in tabpanel; production build passes.

### 25 Aug 2026 — Active-application workspace correction

- `USER REVIEW / SCREEN` — The active application used a minimal “Step 1 of 9” strip, hid the complete form sequence, duplicated the saved-draft message, and placed Documents and Save & exit as unexplained global header actions. The selected first-time route was also repeated as an alert on Personal details even though the choice had already been made before sign-in.
- Revision: the application now uses a focused hybrid workspace: an application rail containing **My applications**, **Documents**, contextual **Help**, and **Save & exit**; a horizontal, named nine-step navigator visible at a glance; and a main panel devoted to the current task. Only reached steps can be reopened; later steps stay visible but unavailable.
- `UX ASSUMPTION` — “Save & exit” is retained as an explicit pause action because users may need to gather evidence or stop on a shared/slow device. Its outcome is made explicit in My applications: the synthetic draft is saved locally and resumes from the exact current step. This does not make a policy claim about production draft security.
- `UX ASSUMPTION` — Documents is a destination within the active application, not a global utility. Help is contextual and remains in the current task rather than redirecting the citizen to a general portal.
- Accessibility: the current stage is exposed with `aria-current="step"`; unavailable future stages use disabled buttons with explanatory accessible labels; on mobile, application actions move to an accessible shadcn Sheet drawer and the full stage navigator becomes horizontally scrollable.
- Validation: `npm run build` passes. Live desktop/mobile interaction verification remains to be completed after the layout check.

### 27 Aug 2026 — Flow remap locked with nine visible stages

- `USER DECISION / UX ARCHITECTURE` — Locked the journey as **entry plus four application chapters**, while preserving nine named workspace stages: **Personal · Family · Other / Address · Eligibility · Documents / Review / Appointment · Ready**. Chapters provide the conceptual model; stages provide exact progress and navigation.
- Revision: Tatkaal remains a distinct, discoverable entry option with a transparent handoff outside the prototype’s completed route. Sign-in is described as an existing service boundary, not a policy claim. Eligibility guidance is derived from relevant plain-language answers without asking the applicant to self-classify as ECR/Non-ECR.
- Revision: legal questions remain together in a visibly separate subsection. Address and supporting proof are treated as one preparation decision; personalised document status and readiness precede declaration; appointment exploration and the Ready summary complete the journey.
- `SCREEN-SUPPORTED CORRECTION` — The supplied fresh-route tracker clearly shows **Emergency Contact** as a named stage. It does not show a separate **References** stage; whether reference fields occur inside another screen remains unverified. The remap must not label “Emergency Contact & References” as steps 05–06 or call them policy-mandated without official evidence.
- `UX ASSUMPTION` — Blocking declaration should apply only to unresolved critical requirements or required fields. Informational guidance and non-blocking warnings should remain visible without being treated as hard gates.
- Source of architecture: `project-notes/passport-flow-remap.html`; source of current-state sequence: user-supplied Passport Seva screenshots.

### 27 Aug 2026 — Senior product/founder audit reopens three architecture decisions

- `TARGET USER` — Narrow the working prototype to an adult first-time **ordinary** passport applicant applying in India under the Normal route, especially someone with limited procedural knowledge, intermittent connectivity, or low confidence with government terminology. Minor, Tatkaal, re-issue, overseas, diplomatic and official journeys remain discoverable handoffs, not simulated end-to-end routes.
- `PROBLEM FRAME` — The single problem is not “the website has many bad screens.” It is that a first-time applicant can complete fields without knowing whether their category, address evidence, document set and appointment plan are ready. Navigation, plain language, evidence checks and commitment timing are supporting parts of that one readiness problem.
- `OFFICIAL CORRECTION` — A person can be applying for a fresh ordinary passport while having held a diplomatic/official passport, and the official form also asks about prior passport applications. Therefore, answering “I have never held an ordinary passport” cannot eliminate all previous-passport/application questions. The redesign should conditionally ask whether the applicant has ever held another passport type or previously applied but was not issued one.
- `OFFICIAL CORRECTION` — RPO/PSK eligibility is jurisdiction-shaped. Present address/PIN should establish or explain the eligible Passport Office and centre constraints during the Address stage; the redesign must not postpone all jurisdiction logic until booking. Indicative public availability may be previewed earlier.
- `OFFICIAL CORRECTION` — Online payment is mandatory for booking. The prototype may show public/indicative centre availability before payment, but must not promise an exact date or slot before payment. Formal centre/date booking remains after submission and payment in the appointment stage.
- `OFFICIAL EVIDENCE` — Emergency contact and two local references are present in the passport application form/rules, even though the online progress tracker exposes Emergency Contact as the named stage. Reinstate them as fields, not as two invented tracker stages. Rename the vague redesigned “Other” stage to **Contacts & legal** if the navigation is revised.
- `PRODUCT DECISION` — Keep the public Document Advisor and Fee Calculator as preparation tools backed by the same source-of-truth rules/content used inside the application. Integrate their answers into the journey; do not remove their public utility.
- `PRODUCT DECISION` — Correction guidance must appear before declaration as well as in the final Ready summary. Required unresolved fields/evidence may block submission; confidence warnings must not masquerade as official validation or block without a verified rule.
- `PRODUCT DECISION` — The post-login dashboard is not globally eliminated. A new applicant with a carried route can enter the application directly; a returning applicant or someone with multiple drafts/submitted applications needs My applications as a real destination.
- `OPEN IMPLEMENTATION DECISION` — Place the 36/60-page booklet choice before declaration and beside its fee consequence. Do not move it after declaration solely to preserve the chapter model.
- Official sources checked: Passport Seva Apply guidance and form sequence; Passport Rules/form fields; Appointment Availability jurisdiction note; Fee Payment/Getting Started guidance.

### 27 Aug 2026 — Final-architecture lock conditions

- `UX ARCHITECTURE` — Retain the four chapters and nine visible stages, with the revised sequence **Personal & history · Family · Contacts & legal / Address & office · Passport options / Documents / Review & submit / Appointment / Ready**. “Passport options” is the preferred citizen-facing label over “Passport details” because this stage explains the derived ECR/Non-ECR category, booklet choice and fee; “details” could be mistaken for an existing passport number or record.
- `UX ARCHITECTURE` — **Discover service** and **understand route** are outcomes of one pre-sign-in decision surface, not two mandatory screens. A separate explanation is shown progressively only when a person is unsure or selects a conditional/special route.
- `COMPETITION REQUIREMENT / USER-SUPPLIED BRIEF` — Mobile responsiveness, slower-connection resilience, limited-digital-confidence support and accessibility are prototype acceptance criteria, not roadmap-only enhancements. The build must therefore include responsive navigation, keyboard/focus support, plain language, lightweight assets, interruption-safe draft behaviour, and honest save/error states. Full multilingual coverage may remain future work, but the content and layout must be language-ready.
- `PRODUCT GOVERNANCE` — The remap is the current implementation baseline, not an immutable source of truth. Official evidence, usability testing or prototype failure may revise it; changes must be appended to this log rather than silently replacing prior reasoning.
- `SCOPE` — Build one complete end-to-end route for an adult, India-based, first ordinary-passport applicant using the Normal service. Tatkaal, re-issue, overseas, diplomatic/official, Identity Certificate and minor journeys remain discoverable handoffs. Within the main route, implement recovery branches for uncertainty, evidence mismatch, save/resume, correction before submission and appointment choice; do not represent those branches as separate full products.

### 27 Aug 2026 — Passport-service benchmark review

- `OFFICIAL / INDIA` — The official Passport Seva mobile app is the only verified Indian mobile product that can cover the formal transaction boundary; Passport Seva describes registration, application, payment, appointment scheduling, centre search, fees, status and Document Advisor functions. The official portal also warns against fraudulent third-party passport websites and apps. Therefore private assistance products are not safe policy or transaction benchmarks.
- `BENCHMARK / UX INFERENCE` — The Passport Seva app is a capability benchmark, not evidence of a superior citizen journey: its published feature set largely mirrors the portal’s service inventory. The redesign should not copy that menu structure.
- `OFFICIAL / INTERNATIONAL BENCHMARK` — GOV.UK’s first-adult-passport guidance makes prerequisites, documents, price and post-submission identity confirmation visible before starting. New Zealand Passports groups Apply, What you need, Continue/check, cost/timeframes and photo checking as clear citizen intents; its photo checker gives actionable pre-submission feedback. Ireland’s Passport Online demonstrates a concise online journey across phone, tablet and desktop and keeps document requirements and tracking adjacent to applying.
- `DESIGN DECISION` — Borrow patterns, not foreign policy: preparation checklist before entry, situation-based routing, actionable input/evidence checks, visible price/timing, save/continue, and a concise next-steps summary. Preserve Indian Passport Seva rules, appointment model, DigiLocker distinctions and jurisdiction behaviour.

### 27 Aug 2026 — Benchmark set locked before implementation

- `PRIMARY INTERACTION BASELINE / INDIA` — Use the Government of India’s UX4G patterns for application progress, form validation, document upload, save/resume, submission acknowledgement, payment failure recovery, My Applications, tracking, feedback, language switching and assisted-service handoffs. This makes the prototype structurally credible for possible government adoption without copying Passport Seva’s current information hierarchy.
- `CONTENT AND REVIEW BASELINE` — Use GOV.UK patterns for start pages, one clear primary question where reasoning is difficult, task grouping, check-answers summaries, editable answers and confirmation pages. Do not force every simple field onto its own page; group low-comprehension-cost fields when this reduces effort.
- `PREPARATION AND CONTINUITY BASELINE` — Use New Zealand Passports as the reference for a visible “what you need” preparation surface, continue/check actions and actionable pre-submission checking. Its photo checker is not copied as a passport stage because Indian ordinary-passport applicants are photographed at the PSK; the reusable principle is actionable quality feedback for uploaded evidence.
- `CONCISION BENCHMARK` — Use Ireland Passport Online as evidence that a high-stakes passport transaction can remain focused across phone, tablet and desktop. Do not adopt “under ten minutes” as a target for the more complex Indian first-time route; measure successful readiness rather than raw completion speed.
- `ONLINE/OFFLINE SERVICE BLUEPRINT` — Use the GOV.UK joined-channel standard and India’s CSC/PSK reality to connect digital preparation with the in-person appointment. The Ready summary, printable/shareable carry list, correction guidance and accessible human-help route must use the same versioned content as the online application. Do not build a separate second-class “assisted” application.
- `APPOINTMENT AND PAYMENT` — Use UX4G payment, confirmation and failure-recovery patterns and the simple hierarchy seen in public appointment services: eligible office/centre → indicative availability → submit → mock payment → confirmed date/slot → receipt. Passport Seva’s official ordering and capacity remain authoritative.
- `EXPLICIT REJECTIONS` — Do not copy foreign eligibility rules, photo requirements, identity referees, payment/refund policy, visual branding or service promises. Do not use consumer-fintech/KYC dashboards as the primary aesthetic; they would make the prototype feel like generic SaaS rather than an Indian civic service.
- `ARCHITECTURE EFFECT` — This benchmark pass does not add or reorder stages. It locks interaction behaviour within the existing four chapters and nine stages. Any later structural change requires either official evidence, a failed usability test or a demonstrated end-to-end blocker, recorded as a revision in this log.

### 27 Aug 2026 — Live walkthrough corrections and interruption-safe resume

- `USER REVIEW / LIVE PROTOTYPE` — A walkthrough reached **Check before you submit**, then a reload returned to the entry/sign-in path and the explicit resume route reopened Step 1. The interface simultaneously promised “Draft saved · resume anytime” and an exact resume point.
- `VERIFIED IMPLEMENTATION CAUSE` — The draft answers were written to browser storage, but the active view and current stage existed only in React memory. A deterministic headless-browser check reproduced the failure: after reaching Review and reloading, the heading was “What are you applying for?” rather than “Check before you submit.”
- Revision: persist the active stage and surface with a versioned browser-storage key, migrate the draft to a versioned key, and resume the selected stage after reload or mock sign-in. Restart still returns the prototype to the entry state and default synthetic draft.
- `USER REVIEW / IMPLEMENTATION CORRECTION` — Transition labels belonged to an older stage order. Labels now follow the locked sequence: Personal → Family → Other → Address → Eligibility → Documents → Review → Appointment → Ready.
- `UX GUARDRAIL` — Replaced “You may be eligible for Non-ECR” with “Your answers point to the Non-ECR category,” followed by an explicit statement that this is preparation guidance rather than an eligibility decision. This changes prototype framing, not official policy.
- `USER REVIEW / DESIGN DECISION` — Added an answers preview before declaration with direct edit links for Personal, Family, Other, and Address. Readiness status remains separate from the applicant’s factual answers so the declaration is not made against an opaque checklist.
- Validation: the automated walkthrough now reaches Review, verifies every transition label and the non-verdict category language, reloads, and passes with `PASS: reload resumed at "Check before you submit"`.

## 2026-08-27 — Screen-content architecture reopened after prototype walkthrough

- **Observed:** The implemented nine-stage journey still groups some fields by system taxonomy rather than by one coherent citizen question. The clearest example is `Passport options`, where booklet size (a user preference) appears beside ECR/Non-ECR guidance (a system-derived classification). The Personal screen also under-explains how first, middle, and surname components map to the official form.
- **Evidence:** Official Passport Seva Instruction Booklet, Column 2.1, defines `Given Name` as first name followed by middle name (if any), requires initials to be expanded, permits a blank surname when the applicant does not use one, and asks for the full name as it should appear on the passport. Official Passport Rules show booklet choice separately under passport type. Source: https://passportindia.gov.in/AppOnlineProject/pdf/ApplicationformInstructionBooklet-V3.0.pdf and https://passportindia.gov.in/AppOnlineProject/pdf/Passport_Rules_1980.pdf.
- **Proposed UX decision (pending user lock):** Reframe the nine input stages as: Passport request; Your identity; Family; Contacts; Address & office; Background details; Documents & readiness; Review & submit; Appointment. `Ready` becomes the result of Appointment, not an additional input stage. Move category derivation out of Passport request and into Documents & readiness, based on plain-language answers collected in Background details.
- **Name-entry decision:** Use `Given name(s)` with explicit “first name + middle name, if any” help, a separate optional `Surname`, no invented middle-name field, and an immediate “This is how your name will appear” preview. Reveal alias and previous-name fields only after their official yes/no questions.
- **Classification:** Official name-field semantics plus explicit UX restructuring assumption. This does not change passport policy or automate final eligibility.
- **Open question:** Confirm this content architecture before changing the running prototype; UI styling remains out of scope for this decision.

## 2026-08-27 — Screen-content fix applied in place; nine-stage rebuild rejected

- **User review (verbatim intent):** each screen's contents do not fully make sense; the name fields invite a surname/middle-name mistake, and `Passport options` puts booklet choice, category and identity together with no stated reason. UI/visual work explicitly out of scope for this pass.
- **Diagnosis accepted:** the previous entry's read is correct. `Passport options` mixed four different *kinds* of thing — a choice the applicant makes, facts they report, a result the system derives, and the evidence behind it — and presented them as equivalent.
- **Prescription rejected:** the proposed nine-stage rename/reorder (`Passport request / Your identity / Family details / Contacts / Address and office / Background details / Documents and readiness / Review and submit / Appointment`) is a structural change. It would move history out of Personal & history, move legal out of Contacts & legal, delete the Ready stage, duplicate the existing entry surface as a new stage, and rename the locked `Passport options`. `ARCHITECTURE FROZEN` permits structural change only on official evidence, a real user-testing failure, or an uncompletable end-to-end interaction. None applies: the complaint is about within-stage grouping and copy, which the same lock assigns to content/component design. Stage list, stage names and chapters therefore unchanged.
- `DESIGN DECISION — BLOCK-KIND VOCABULARY` — Every block on a stage now declares its kind above the heading: **Your choice** (`choice`), **Your information** (`information`), **Worked out from your answers** (`derived`), **Supporting document** (`evidence`). Blocks are ordered causally: what you choose, then the facts used, then what follows from them, then the evidence. This is the answer to "why is all of this together?" — the grouping is defensible once the kinds are named and sequenced.
- `PASSPORT OPTIONS` — Rebuilt as three labelled blocks under the locked heading *Passport category, booklet and fee*: `choice` → Booklet size (36/60 with its indicative fee); `information` → the two facts used to work out the category, stated as facts about the person rather than a self-classification; `derived` → what those two answers point to, with the supporting documents deferred to the next stage.
- `NAME ENTRY` — `Given name(s)` with the official rule stated (first name followed by the complete middle name; no initials, no titles) and no invented middle-name field. `Surname` help corrected: leave blank only if you do not use one, in which case the complete name goes under Given name(s). Added a live uppercase print-order preview (*Your passport would read* — Surname, then Given name(s)) and non-blocking format notes that fire on full stops, titles, or a blank surname. Notes are advisory: the prototype flags formatting, it does not decide whether a name is acceptable.
- `OTHER STAGES` — Family now asks the situation question *before* the name fields, because the answer decides which fields the official form requires; non-standard situations hand off instead of collecting unusable data. Contacts states why each of the two contact kinds is requested and separates the legal declaration visually. Address runs address → proof → office as an explicit `information → evidence → derived` chain. Documents states that every row is evidence for something already entered, and each row names which answer it supports. Review splits *What you chose* from *What was worked out for you*, prints the name in passport order, and shows the date of birth in written form.
- `DELIBERATELY NOT BUILT` — Alias / previous-name fields, gender, permanent address, and period of residence are not added in this pass. Each needs its official field semantics confirmed before it appears; the prototype does not invent official rules. Flagged for the user's decision.
- Validation: `tsc -b` clean, no new lint findings, Playwright 3/3 passing, and every rewritten stage confirmed in the running prototype including the name-note branch and the guardian handoff.

## 2026-08-27 — UI pass: button placement and block treatment

- **User review (verbatim intent):** architecture and information now make sense, but the UI breaks — where Back and Submit sit, how the boxes look, and whether consistency across different boxes is even needed. Asked for before committing.
- **Answer to the design question:** consistency of *system* is required; sameness of *appearance* is not. A box may look different only where it *means* something different. Arbitrary difference is the defect, not difference itself.
- `RULE 1 — SAME MEANING, SAME TREATMENT` — A block's look comes from its kind, never from which screen it happens to sit on. Two blocks were the same `derived` kind with two unrelated looks (the name preview and the office-context row). Equivalent boxes carried five different paddings (`0.8 / 1 / 1.15 / 1.25 / 2rem`) and one off-palette hardcoded grey (`#cfd5dc`).
- `RULE 2 — FORWARD MOTION LIVES IN THE FOOTER` — One primary per screen, in one place. Back was already consistent (all nine stages share `StepFrame`); *forward* motion had escaped the footer twice. Appointment had a body primary competing with a disabled footer primary; Ready had two body outlines and a footer holding only Back. Both now put the forward action in the footer, and Restart is demoted to `ghost`.
- `RULE 3 — DIFFERENCE MUST BE EARNED` — Kept deliberately different, each because it encodes something: the legal declaration is heavier than the information around it (`block--emphasis`, navy bar) and the copy says so; Documents rows stay plain because when *every* row on a page is evidence the page states it once, and six green bars would be noise; readiness items keep state bars because state is a different axis; radio cards stay distinct because they are interactive controls, not content blocks; the start CTA stays `size="lg"` because a start page legitimately has one big entry point. Submit is treated as terminal rather than a ninth *Continue* — wider, bolder, and with no forward arrow.
- `RULE 4 — KIND AND STATE ARE SEPARATE AXES` — The worst defect found: `.evidence-review` (a *state*) was pixel-identical to `.block--choice` (a *kind*), and `.evidence-attention` identical to `.block--derived`. Two different meanings sharing one palette. Fixed by splitting the encodings — **kind = a left accent bar on a neutral surface**, **state = a filled tint plus an icon** — so a block can now carry both signals at once without ambiguity. Address & office demonstrates it: a green state alert and a gold derived bar on one screen, unambiguous.
- **Implementation:** a `.block` base plus four kind modifiers, driven by two shared geometry tokens (`--block-pad`, `--accent-bar`) so boxes cannot drift by accident; the kind modifiers reuse the same palette as the matching `.kind-*` tag, so the label above a block and the block itself always agree. `.legal-section`, `.name-preview`'s base rule and the `.office-context, .indicative` group were deleted rather than left as dead overrides. Radio-card selection uses an inset ring instead of a wider border, which was shifting the label by a pixel on every click. `.kind-tag` gained `justify-self: start` — as a grid item it had been stretching to the full column instead of hugging its text.
- **Also corrected:** every `derived` block now carries the same pill (one had a bare `<span>`, one had no label at all); the Review screen's two edit affordances are now labelled so the difference between *a prompt to go fix something* and *edit this answer* is stated rather than accidental; the appointment availability copy no longer points at a payment button that is gone once paid; one unspaced em dash brought in line with the other four.
- `ALERT IS NOT A BLOCK` — A neutral `Alert` deliberately has no kind pill. An Alert is the app *speaking* — a notice at a moment; a `.block` is what the screen is *made of*. Giving alerts kind pills would imply they are content blocks and weaken the vocabulary.
- Validation: `tsc -b` clean, no new lint findings, Playwright 3/3, Prettier clean. Computed styles verified on Address, Personal, Options, Review, Appointment and Ready at desktop and at 375px, confirming one footer primary per screen (`bodyPrimaries: []`), `--block-pad` 20px and 4px kind bars applied from the tokens, and the mobile `block--row` collapse.

## 2026-08-28 — Annotation rounds 2 and 3: entry hierarchy, prepare steps, option provenance

- **User review (verbatim):** on the start page — "if i click this, show the sign in page no?" (header *Sign in*), "fix the hirerachy of buttons" (route card), "show be upfront easy to check more like 3 steps" (prepare section); on Family details — "are these actual options or we created?", "Do we need this explaination? if so fix it shorter/..", "Fix the hirerchy".
- `SIGN-IN IS ONE DOOR, TWO ERRANDS` — the header *Sign in* went straight to the dashboard, skipping the gateway it named. Both entry points now reach `SignInScreen`, which is told which errand it is serving (`SignInIntent`): a route card *begins* an application and resolves onward into the flow; the header *resumes* and resolves to the saved applications. Only the destination differs, so the gateway is never bypassed by the control that advertises it. The redundant `Independent prototype` badge in the gateway header was removed — it sat directly above a notice bar opening with the same two words.
- `EMPHASIS BELONGS TO THE ACTION, NOT THE FILTER` — inside the route card the *only* saturated fill was the selected location segment, so a filter outranked the thing to press. The segment now reads as *answered* (tinted, navy, inset rule) and the recommended route carries the lift instead. Measured order, loudest to quietest: recommended route (2px blue, tint, shadow) → answered filter (tint, flat) → sibling routes (white, 1px) → Tatkaal text link.
- `PREPARATION MUST BE CHECKABLE, NOT DESCRIBED` — the three preparation cards were prose panels held open by a 13rem floor, which was most of what pushed the section to y≈951 on a 1019px viewport. They are now a numbered `<ol>` of three checks, each phrased as something you can confirm. Measured at 1698×1019: section top y=721, height 271 — fully above the fold, where "before you start" has to be to mean anything.
- `PROVENANCE IS A DESIGN QUESTION` — asked whether the family-situation options were official or ours, the honest answer is that this log holds **no `OFFICIAL` citation** for the three options. Two of them describe structure the form does carry (both parents; legal guardian); the third, *I need help answering*, is not a form field at all — it is a handoff this prototype invented. That one now carries an `Added by this prototype` marker. **Absence of the marker is deliberately not a claim of officialness** — the code says so at both the type and the stylesheet. `TO VERIFY` — the parents/guardian field structure still needs a cited source before any screen implies the wording is the form's own.
- `FOUR RUNGS, NOT TWO` — the stage title rendered near 52px at weight 400 directly above a 20px section heading: far enough apart to stop reading as one ladder, while shouting over the form it introduced. Rescaled to a measured 12 / 36 / 16 / 20 / 14px ladder (eyebrow · title · intro · section heading · rationale), and the rationale gained a `62ch` measure so a single line no longer runs the full card width. The Family rationale itself is now one clause: "Your answer decides which name fields the official form requires."
- Validation: `tsc --noEmit` clean, `vite build` green, Playwright 6/6 passing, and every claim above measured in the running prototype at 1698×1019 rather than inferred from the stylesheet.
- **Process note:** the TSX half of this pass was committed by a concurrent session inside `5cb8836` ("Open the document library as a page beside the rail"), which left the matching CSS uncommitted — that branch briefly carried the new markup with no rules to style it. Recorded because the fix is a commit-boundary discipline, not a code defect.

## 2026-08-28 — OFFICIAL: the form needs one parent's name, not both

- **Origin:** Ritika's question on the family-situation cards — "are these actual options or we created?" — had no `OFFICIAL`-cited answer anywhere in this log. Answering it honestly turned up a factual error in our own screen.
- `OFFICIAL` — [Announcement of new Passport Rules, MEA, 23 December 2016](https://passportindia.gov.in/AppOnlineProject/pdf/PressRelease_PassportRule.pdf), para 3(i), verbatim: *"The online passport application form now requires the applicant to provide the name of father or mother or legal guardian, i.e., only one parent and not both. This would enable single parents to apply for passports for their children and to also issue passports where the name of either the father or the mother is not required to be printed at the request of the applicant."* Verified by extracting the text directly from the government-hosted PDF, not from a secondary summary or a subagent's paraphrase.
- `CORRECTION 1 — WE BLOCKED THE CASE THE RULE EXISTS TO ENABLE` — Family gated *Continue* on `!draft.fatherName || !draft.motherName`, requiring both parents. That is stricter than the official form and refuses precisely the single-parent applicant the 2016 change was written to admit. Now gated on **at least one** (`!fatherName && !motherName`). Measured: both blank blocks; father-only passes; mother-only passes. The field help says a name may be left blank if it should not be printed, which is the applicant's stated right under the same paragraph.
- `CORRECTION 2 — WE ATTRIBUTED OUR OWN QUESTION TO THE FORM` — the rationale read "Your answer decides which name fields the official form requires." The official form has **no situation question at all**: its Family Details block is headed *"Family Details (Father/Mother/Legal Guardian details; at least one is mandatory.)"* and simply shows three name pairs at once. The screen now says the form lists all three and needs at least one, and that **the question is ours**.
- `PROVENANCE, STATED PER OPTION` — *A legal guardian applies* maps to a real official field pair, "Legal Guardian's Given Name (if applicable)" / "Surname", so it carries **no** prototype marker; its detail now says it is a real field we have not built rather than implying different official fields are triggered. *I need help answering* is not a field on any official form and keeps the `Added by this prototype` marker. *Both parents' details apply* was renamed to *A parent's details apply* because the old title asserted the very requirement the 2016 rule removed.
- **Rule established:** absence of the prototype marker is **not** a claim of officialness. Only a marker's *presence* claims anything, and only about us. Stated in the code at both the type and the stylesheet so the next person cannot read the empty case as an assertion.
- `TO VERIFY` — the field-level wording of Family Details is cited here to the 2016 rules announcement. The form and instruction booklet URLs surfaced during this pass were not opened by me and are therefore **not** treated as verified; no screen copy depends on them.
- Validation: `tsc --noEmit` clean, `vite build` green, Playwright 6/6, and the at-least-one gate exercised in the running prototype across all four combinations.
