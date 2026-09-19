# Research decision graph

```mermaid
flowchart TD
  A[Recurring problem candidates] --> B{Financially measurable pain?}
  B -- no --> X[Drop]
  B -- yes --> C{Existing paid behavior / strong cost impact?}
  C -- no --> X
  C -- yes --> D{Can a ₹3k product solve it with low vendor compute?}
  D -- no --> X
  D -- yes --> E{Self-serve discovery channel?}
  E -- no --> X
  E -- yes --> F{Competitive whitespace?}
  F -- no --> G[Change angle or drop]
  G --> F
  F -- yes --> H[Build MVP]

  I[AI crawler audit] -->|crowded + disputed signals| X
  J[Reactive Actions dashboard] -->|category validated, crowded| G
  G --> K[Preventive PR cost gate]
  K --> H
  H --> L[MinuteShield]
```

## Why the selected branch survived

- The pain is recurring and denominated in real compute spend.
- Current GitHub pricing makes runner choice, runtime, matrix size, and trigger frequency economically meaningful.
- Existing static linters and historical dashboards validate demand but leave room for a calibrated pre-merge dollar delta.
- GitHub Marketplace plus search-oriented calculator/docs supports self-serve discovery.
- The free product can run on customer compute, keeping vendor infrastructure near zero during validation.
