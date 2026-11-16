# Post ideas

Backlog of post ideas. When you start one, move it to **Writing**. When it's published, move it to **Published** with its slug.

Each idea: working title, **series** (slug from `lib/series.ts`, or —), the mental model (one line), and why it's worth writing.

## Backlog

- [ ] **Deoptimization: why V8 throws away your fast code** — `under-the-benchmark`
  - Model: the optimizer made a bet about your types and lost.
  - Why: sequel to the hidden-classes and V8 tiers posts.
- [ ] **The prototype chain in 2 minutes** — —
  - Model: why `[].map` exists when you never wrote it. Lookups walk up a chain of parents.
  - Why: classic interview question. Pairs with `javascript-classes-are-functions`.
- [ ] **HTTP caching: `Cache-Control`, `ETag` and `304`** — `nextjs-field-notes`
  - Model: the browser asks "still fresh?" before downloading again.
  - Why: completes `cdn-explained-nextjs` and the Next.js caching posts.
- [ ] **JavaScript memory leaks: the four usual suspects** — `under-the-benchmark`
  - Model: a leak is not lost memory, it is memory something still points at (timers, listeners, closures, caches).
  - Why: direct sequel to `how-garbage-collection-works`.
- [ ] **WeakMap and WeakRef: references that don't keep things alive** — `under-the-benchmark`
  - Model: a sticky note on an object instead of a rope tied to it.
  - Why: short follow-up to the GC posts, and the fix for the cache leak in the memory-leaks post.
- [ ] **Sessions vs JWT: where does the login actually live?** — `engineering`
  - Model: a session is a coat-check ticket (server keeps the coat); a JWT is a signed wristband (you carry the proof).
  - Why: completes the security set with `httpOnly-cookies-guide`, `xss-vs-csrf` and `cors-explained-simple`.
- [ ] **What happens when you type a URL and press Enter** — `engineering`
  - Model: a relay race: DNS → TCP/TLS → HTTP → parse → render.
  - Why: the most asked frontend interview question.
- [ ] **`async` vs `defer`: why script order breaks your page** — —
  - Model: both download in parallel; `async` runs the moment it lands, `defer` waits in line until the HTML is parsed.
  - Why: short, visual (fits `<ParallelFlow>`), asked often.
- [ ] **Why `z-index: 9999` does nothing: stacking contexts** — —
  - Model: z-index only competes inside its own folder; a child can never climb above its parent's folder.
  - Why: everyone hits it, few can explain it. First CSS post on the blog.
- [ ] **`==` vs `===`: the coercion rules in one table** — `js-plot-twists`
  - Model: `==` converts first, then compares; `===` refuses to convert.
  - Why: joins the plot-twists posts next to `javascript-map-parseint` and the sort post.
- [ ] **`any` vs `unknown` vs `never` in TypeScript** — —
  - Model: `any` switches the checker off, `unknown` says "check before use", `never` says "this cannot happen".
  - Why: only one TypeScript post so far (`typescript-enums-vs-alternatives`); common interview question.
- [ ] **WebSockets vs SSE vs polling: three ways to get live data** — `engineering`
  - Model: polling is asking "anything new?" on repeat, SSE is a radio broadcast, a WebSocket is a phone call.
  - Why: system-design interview staple; pairs with `broadcastchannel-api`.
- [ ] **List virtualization: render 10,000 rows by rendering 20** — `under-the-benchmark`
  - Model: a window sliding over a long scroll; only what is in the window exists in the DOM.
  - Why: practical performance post with real measurements.

### Common mistakes (`common-mistakes`)

- [ ] **You don't need that `useEffect`: derived state in React**
  - Model: if you can calculate it from props or state, it is not state.
  - Why: the most common React mistake in code review; pairs with `react-useeffect-dependencies`.
- [ ] **`forEach` ignores your `await`**
  - Model: `forEach` fires every callback and walks away; nobody waits for the promises.
  - Why: classic bug, short post. Pairs with `async-await-not-parallel`.
- [ ] **`try/catch` doesn't catch what you think: lost promise errors**
  - Model: `try` only guards what you `await`; a promise you don't await fails somewhere else, later.
  - Why: explains unhandled rejections and swallowed errors in one go.
- [ ] **`new Date("2026-11-16")` is yesterday in some time zones** — `js-plot-twists`
  - Model: a date-only string is read as UTC midnight, then shown in local time.
  - Why: real production bug everyone meets once.
- [ ] **`NEXT_PUBLIC_` means public: leaking secrets into the bundle**
  - Model: anything the browser can read, everyone can read; the prefix is a copy-to-client switch.
  - Why: common and costly mistake; joins the security set.
- [ ] **A `<div onClick>` is not a button**
  - Model: a button comes with keyboard, focus and screen-reader support for free; a div comes with none.
  - Why: first accessibility post; very common review comment.
- [ ] **Your benchmark is lying: microbenchmark mistakes** — `under-the-benchmark`
  - Model: you measured the warm-up, or code the optimizer deleted.
  - Why: explains the method behind *Under the Benchmark*; builds on `v8-compiler-tiers`.

### Engineering (`engineering`)

- [ ] **Idempotency: why retrying a payment must not charge twice**
  - Model: pressing the lift button five times still calls one lift.
  - Why: system-design staple; explains idempotency keys and PUT vs POST.
- [ ] **Feature flags: deploy is not release**
  - Model: the code ships dark; a switch turns it on.
  - Why: core idea behind trunk-based development and safe rollouts.
- [ ] **The N+1 query problem**
  - Model: one trip to the shop per item instead of one trip with a list.
  - Why: the most common backend performance bug; frontend devs hit it in server components too.
- [ ] **Database indexes in 2 minutes**
  - Model: the index at the back of a book; fast to look up, costs pages and upkeep.
  - Why: asked in every full-stack interview; same shape as `docker-in-2-minutes`.
- [ ] **Rate limiting: the token bucket**
  - Model: a bucket refills at a fixed rate; each request spends a token, an empty bucket means 429.
  - Why: pairs with `debounce-vs-throttle` (client side vs server side).
- [ ] **Semver and lockfiles: why "works on my machine" happens**
  - Model: `package.json` is the wish list, the lockfile is the receipt.
  - Why: explains `^` vs `~` and why to commit the lockfile; pairs with the Bun/npm post.
- [ ] **Logs, metrics, traces: the three questions of observability**
  - Model: what happened, how often, and where the time went.
  - Why: senior-interview topic with a simple frame.
- [ ] **Technical debt is a loan, not a mess** (article)
  - Model: borrowing speed now and paying interest on every change later.
  - Why: gives words for arguing about refactoring time; soft-skill article.
- [ ] **The wrong abstraction costs more than duplication** (article)
  - Model: DRY is about knowledge, not about lines that look alike.
  - Why: opinion piece; pairs with `solid-principles` and the APOSD brief.
- [ ] **How to review a pull request** (article)
  - Model: review the design first, the details last.
  - Why: pairs with `feedback-with-evidence-not-drama`.

### Book Bites (`book-bites`)

- [ ] **The Pragmatic Programmer** (Hunt & Thomas): broad habits, many short ideas; pick the 5 that still hold up.
- [ ] **Refactoring** (Martin Fowler): small safe steps; code smells as a vocabulary.
- [ ] **Designing Data-Intensive Applications** (Martin Kleppmann): big book; brief it as "what every frontend dev should know about the backend".
- [ ] **Clean Code** (Robert C. Martin): pairs with the APOSD brief and their public debate; brief it fairly, with its weak spots.
- [ ] **Don't Make Me Think** (Steve Krug): usability in a few rules; short book, very usable on Monday for frontend devs.
- [ ] **The Staff Engineer's Path** (Tanya Reilly): what "senior" means beyond code; pairs with the soft-skill articles.

## Writing

- [ ] **A Philosophy of Software Design** (Book Bites #1) → `a-philosophy-of-software-design-book-summary`

- [ ] **How V8 makes JS fast: Ignition, Sparkplug, Maglev, TurboFan** → `v8-compiler-tiers`
- [ ] **Why React needs `key`** → `react-keys-reconciliation`
- [ ] **React Server Components vs `"use client"`** → `react-server-components-vs-use-client`

## Published

- [x] **XSS vs CSRF: two attacks, two different fixes** → `xss-vs-csrf`
- [x] **useEffect vs useLayoutEffect: why the tooltip flashes, then jumps** → `useeffect-vs-uselayouteffect`
- [x] **How garbage collection works: it never looks for unused memory** → `how-garbage-collection-works`
- [x] **Hoisting and the TDZ: why `let` throws but `var` gives `undefined`** → `hoisting-and-tdz`
- [x] **Barrel files: the `index.ts` that slows your build** → `barrel-files-index-ts`