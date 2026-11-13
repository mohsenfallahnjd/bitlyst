# Post ideas

Backlog of post ideas. When you start one, move it to **Writing**. When it's published, move it to **Published** with its slug.

Each idea: working title, the mental model (one line), and why it's worth writing.

## Backlog

- [ ] **Deoptimization: why V8 throws away your fast code**
  - Model: the optimizer made a bet about your types and lost.
  - Why: sequel to the hidden-classes and V8 tiers posts. Fits *Under the Benchmark*.
- [ ] **The prototype chain in 2 minutes**
  - Model: why `[].map` exists when you never wrote it. Lookups walk up a chain of parents.
  - Why: classic interview question. Pairs with `javascript-classes-are-functions`.
- [ ] **Hoisting and the TDZ: why `let` throws but `var` gives `undefined`**
  - Model: both are hoisted, but `let` stays behind a "do not touch" line until its declaration runs.
  - Why: very common interview question, short post. Could join *JavaScript Plot Twists*.
- [ ] **HTTP caching: `Cache-Control`, `ETag` and `304`**
  - Model: the browser asks "still fresh?" before downloading again.
  - Why: completes `cdn-explained-nextjs` and the Next.js caching posts.
- [ ] **XSS vs CSRF: two attacks, two different fixes**
  - Model: XSS runs the attacker's code on your page; CSRF makes your browser send a request you didn't mean to.
  - Why: completes a security trio with `httpOnly-cookies-guide` and `cors-explained-simple`. Asked in almost every frontend interview.

### Book Bites (book briefs, see BOOK_BRIEF_GUIDE.md)

- [ ] **The Pragmatic Programmer** (Hunt & Thomas): broad habits, many short ideas; pick the 5 that still hold up.
- [ ] **Refactoring** (Martin Fowler): small safe steps; code smells as a vocabulary.
- [ ] **Designing Data-Intensive Applications** (Martin Kleppmann): big book; brief it as "what every frontend dev should know about the backend".
- [ ] **Clean Code** (Robert C. Martin): pairs with the APOSD brief and their public debate; brief it fairly, with its weak spots.

## Writing

- [ ] **A Philosophy of Software Design** (Book Bites #1) → `a-philosophy-of-software-design-book-summary`

- [ ] **How V8 makes JS fast: Ignition, Sparkplug, Maglev, TurboFan** → `v8-compiler-tiers`
- [ ] **Why React needs `key`** → `react-keys-reconciliation`
- [ ] **React Server Components vs `"use client"`** → `react-server-components-vs-use-client`

## Published

