# Rehearsal notes

Stages built on the stageshow kit (`kit/`, MIT, see `LICENSE` and `NOTICE.md`).

## AutomationStage (What we automate)

- Started from the kit's `payout-flow` example: a cursorless system story played once in view.
- Changed: the product (an agency's incoming item and the queue it is routed to), the look
  (Jupitex orange accent, Inter, the page's grey ground), five data-driven scenes, a compact
  design for the phone column, and callbacks so the page's step list follows the beats.
- Filmed with `scripts/film.mjs --gate` at 1280 and 390 wide.
  - Fixed from its findings: text landing on a transform, a count appearing with no entrance,
    uneven insets on the "Found" row and the log line, a dead corner under the item card.
  - Still reported: `uneven gutters` on the item card (24px left and top, the queue to its right).
  - Still reported, not ours: six `kit override` lines on `.ss-phone*`. The check recognises kit
    stylesheets by `/kit/` in their URL; Next bundles all CSS into one chunk, so the kit's own
    phone rules are read as overrides. No phone is used.
- Not checked: Safari, real phones, the dark theme (the stage is always light).

## FeatureTiles (Services and Why Jupitex cards)

- Six 366 x 240 tiles in one figure language; `play="hover"`, once in view on touch screens.
- Filmed with `--gate --hover`. Fixed: uneven pane padding, touching count and label, uneven
  node insets, a figure whose digits popped in. Only the `kit override` lines above remain.
