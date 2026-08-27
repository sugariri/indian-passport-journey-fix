# Make the entry screen task-first

Written against: unavailable (workspace is not a Git repository)

## Evidence chain

- Surface: `passport-journey` start screen rendered at `/`
- Problem: The route-selection task is visually secondary to a large marketing-style headline and benefits column.
- Design evidence: `passport-journey/src/App.tsx` `StartScreen`; `passport-journey/src/App.css` `.start-main`, `.service-intro`, `.route-card`; accepted Modern Civic Utility direction.
- Owner: `passport-journey/src/App.tsx` `StartScreen`
- Scope and affected surfaces: Start screen only; desktop and mobile responsive branches.
- Uncertainty: None.

## Design decision

Lead with the service-routing question and its two choices. Supporting benefits should follow the routing task so the first viewport answers what the user can do instead of marketing the prototype.

## Reuse

- Existing `Card`, `CardHeader`, `CardContent`, `Alert`, and `Button` components.
- Existing `.route-card`, `.route-options`, `.route-option`, `.service-facts`, and `.route-footer` styles.
- Exemplar: The application steps in `ApplicationShell`, where the stage title immediately precedes the task card.

## Changes

1. `passport-journey/src/App.tsx`
   - Change: Recompose `StartScreen` as a single task column. Promote “What do you need to do?” to the page `h1`, place `.route-card` immediately beneath its short explanation, and move `.service-facts` below the route card as supporting preparation information.
   - Preserve: Both route choices, selected-state behavior, reissue disabled behavior, alert content, prototype language, and `begin` callback.
   - Verify: The route question and both choices appear before the benefits at desktop and mobile widths.
2. `passport-journey/src/App.css`
   - Change: Replace the two-column `.start-main` composition with a constrained single-column task layout; adjust `.service-intro` and `.service-facts` for their supporting position without creating new card styling.
   - Preserve: Existing IBM-style font overrides, navy/gold palette, borders, spacing tokens, and responsive breakpoints.
   - Verify: The start screen remains centered, has no horizontal overflow, and does not resemble a split marketing hero.

## Scope

- Inherit: Start-screen desktop and mobile layouts.
- Verify: Header, route selection, alert, CTA, and footer placement.
- Exclude: Sign-in, dashboard, application steps, data model, and navigation behavior.

## Validation

- Product: Select “My first ordinary passport” and start the application; routing behavior remains unchanged.
- Interface: Inspect 1440×1000, 768×1024, and 390×844; the task precedes supporting benefits and fits without clipping.
- System: Confirm the implementation reuses the current Card/Button/Alert components and adds no parallel entry-card primitive.
- Repository: `npm run build` from `passport-journey` → successful Vite production build.

## Stop conditions

- Stop if the large editorial hero is an explicitly required portfolio deliverable rather than a service entry page.

## Design documentation

- After acceptance and validation: record “Service-routing tasks precede promotional or explanatory content” in the governing DESIGN.md when one is established.
