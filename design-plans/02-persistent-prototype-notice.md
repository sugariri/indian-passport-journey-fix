# Make prototype status persistent and unmistakable

Written against: unavailable (workspace is not a Git repository)

## Evidence chain

- Surface: Start, sign-in, application hub, saved dashboard, document overlay, and application shell.
- Problem: The non-official status is split between a small header badge and footer copy, while the interface uses government-service visual cues and passport terminology.
- Design evidence: `passport-journey/src/App.tsx` repeated `.prototype-badge` and `.prototype-footer` content; `passport-journey/src/App.css` `.prototype-badge` and `.prototype-footer`; explicit independent-prototype exception.
- Owner: Shared page shells currently composed directly in `passport-journey/src/App.tsx`.
- Scope and affected surfaces: Every prototype screen.
- Uncertainty: None.

## Design decision

Use one persistent notice directly below the primary header: “Independent prototype — not a Government of India service.” Keep contextual simulation details in the footer, but do not rely on the footer to establish identity.

## Reuse

- Existing `Alert` component and the current navy, neutral, border, and typography tokens.
- Existing `.prototype-badge` and `.prototype-footer` content as migration sources.
- Exemplar: Existing inline Alert compositions used for eligibility and safety guidance.

## Changes

1. `passport-journey/src/App.tsx`
   - Change: Add one shared `PrototypeNotice` composition below the header in `StartScreen`, `SignInScreen`, `ApplicationHub`, `DraftDashboard`, the document view, and `ApplicationShell`. Use the exact primary sentence above; retain screen-specific simulation details in their current content area or footer.
   - Preserve: “Passport Journey” branding, independent-prototype framing, screen-specific disclaimers, and all navigation.
   - Verify: Every reachable screen communicates its non-official status without scrolling.
2. `passport-journey/src/App.css`
   - Change: Style the shared notice as a full-width, high-contrast information band with normal body-size text and a visible border; remove visual reliance on the tiny pill treatment.
   - Preserve: Existing IBM-style square geometry and restrained palette.
   - Verify: The notice is distinct from error/warning states, wraps cleanly on mobile, and does not obscure controls.

## Scope

- Inherit: All page shells in `App.tsx`.
- Verify: Start, sign-in, hub, first application step, document checklist, and saved dashboard.
- Exclude: Claims of government affiliation, official seals, external links, authentication, or legal copy beyond the accepted sentence.

## Validation

- Product: Traverse start → sign-in → hub → application → save and exit; the notice remains visible on every screen.
- Interface: Inspect 1440×1000 and 390×844; notice is visible without horizontal overflow and does not compete with the primary task.
- System: Confirm one shared composition owns the notice and no screen retains a contradictory badge-only treatment.
- Repository: `npm run build` from `passport-journey` → successful Vite production build.

## Stop conditions

- Stop if legal or research stakeholders provide mandatory disclaimer wording; use that wording instead of inventing a variant.

## Design documentation

- After acceptance and validation: document the shared prototype-notice placement and exact approved wording in the governing DESIGN.md when one is established.
