# Raise supporting text to a civic-service reading scale

Written against: unavailable (workspace is not a Git repository)

## Evidence chain

- Surface: Full fresh-passport journey, including navigation, form help, evidence states, readiness, appointment selection, and prototype notices.
- Problem: Important guidance and state labels are repeatedly rendered at `.58rem`–`.78rem`, below the existing 15px body scale.
- Design evidence: `passport-journey/src/App.css` `.field-help`, `.progress-item`, `.status-badge`, `.evidence-copy`, `.readiness-row`, `.centre-*`, `.day`, `.slot`, `.prototype-footer`, and `.chapter-label`; accepted accessibility-first direction.
- Owner: `passport-journey/src/App.css` typography rules consumed by `passport-journey/src/App.tsx`.
- Scope and affected surfaces: All user-facing guidance and state text in the fresh-passport journey.
- Uncertainty: Compact draft IDs and numeric stage markers may remain metadata-sized if they are not required to understand or complete the task.

## Design decision

Use the existing 15px body scale for instructional and status-bearing copy. Use 14px as the compact supporting scale. Reserve smaller mono text only for nonessential identifiers and numeric markers.

## Reuse

- Existing body owner: `body { font-size: 15px; line-height: 1.5; }` in `passport-journey/src/App.css`.
- Existing sans family: Public Sans / current IBM Plex Sans override layer.
- Existing semantic colors and status components.
- Exemplar: `.service-intro > p` and `.dashboard-lede` demonstrate readable supporting copy.

## Changes

1. `passport-journey/src/App.css`
   - Change: Set instructional copy, field help, route descriptions, progress labels, alert descriptions, evidence details, declaration copy, readiness actions, centre details, appointment labels, and persistent prototype notice to either 15px body or 14px compact supporting text according to importance. Keep line-height at least 1.4.
   - Preserve: Visual hierarchy through weight, color, spacing, and mono treatment rather than sub-12px sizing.
   - Verify: No information needed to choose, understand, correct, or continue a task renders below 14px.
2. `passport-journey/src/App.css`
   - Change: Limit sub-14px text to `.mono` draft identifiers, route/stage numbers, and purely decorative eyebrow labels; ensure adjacent accessible labels communicate the same state.
   - Preserve: Compact information density in the desktop rail and appointment picker.
   - Verify: Increasing supporting copy does not clip badges, centre cards, route options, or mobile navigation.

## Scope

- Inherit: All screens using the affected CSS owners.
- Verify: Long guidance strings, “Needs attention” badges, centre metadata, unavailable slots, mobile progress, and footer details.
- Exclude: A wholesale font-family replacement, color redesign, or changes to application content and logic.

## Validation

- Product: Complete the application path and confirm all guidance, validation, and status content remains present and understandable.
- Interface: Inspect 1440×1000, 768×1024, 390×844, and 320×568 with browser zoom at 100% and 200%; confirm wrapping without overlap or horizontal scrolling.
- System: Search the journey stylesheet for remaining sub-14px user-facing rules and verify each survivor is nonessential metadata.
- Repository: `npm run build` from `passport-journey` → successful Vite production build.

## Stop conditions

- Stop if increasing text exposes a component whose fixed dimensions cannot accommodate wrapping; widen the affected scope and resolve that owner before shipping partial overrides.

## Design documentation

- After acceptance and validation: record the 15px body / 14px compact minimum and metadata exception in the governing DESIGN.md when one is established.
