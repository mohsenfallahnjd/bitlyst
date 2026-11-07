# Bitlyst Writing Guide

How every Bitlyst post is written. The voice is **a developer telling a friend what happened** — a real bug, a wrong guess, the moment it clicked — and the concept is taught *through* that story, not before it.

---

## 1. The shape of a post

Every post follows the same five beats. The headings change; the beats don't.

| Beat | What happens | Length |
|------|--------------|--------|
| **1. The hook** | Drop the reader into a moment: a bug report, a weird console output, a failing test. No definitions, no "In this post we will…". | 2–5 short paragraphs |
| **2. The wrong turn** | What you (or a reasonable dev) assumed first, and why it seemed right. Readers learn most from a believable mistake. | 1–2 sections |
| **3. The reveal** | What JavaScript / React / Next.js is *actually* doing. This is where the concept is taught, with a diagram and minimal code. | the core |
| **4. The fix** | The smallest change that solves it, and why it works. Show before → after. | 1 section |
| **5. The takeaway** | The rule you'd tell a teammate, in one or two sentences. Then a short TL;DR list. | short |

**Test:** if you deleted every heading, would the post still read like a story with a beginning, middle and end? If not, rewrite.

---

## 2. Voice rules

1. **First person only for things that really happened.** If the bug, the conversation or the experiment is real, tell it as "I": "I clicked the button and nothing happened." If the scenario is made up to carry the lesson, frame it as hypothetical with "picture…" and "you": "Picture a table that remembers your selection…". Never invent people, quotes from real colleagues, or events and present them as your own experience. The explanation itself is always present tense: "`sort()` compares strings, not numbers."
2. **Start in the middle of the action.** First sentence = a concrete event, quote, or output.
   - ✅ `The leaderboard said 9 points beat 10.`
   - ❌ `Sorting is a fundamental operation in programming.`
3. **One concept per post.** If a second concept shows up, it becomes the next post (or a series part).
4. **Short paragraphs.** 1–4 sentences. A one-line paragraph is allowed for impact — at most once or twice per post.
5. **Explain like a colleague, not a textbook.** Use "you" and "I". No "one must", "it is important to note", "simply", "just", "obviously".
6. **Be honest about stakes.** If the perf gain is 0.3 µs, say so. If you got it wrong first, say so. Credibility beats looking clever.
7. **Back claims with evidence.** Numbers come from a measurement (say what, where, how), a spec link, or a runnable snippet. Never invent figures.
8. **Name the "why" in plain words before the jargon.** Say "JavaScript turns both numbers into text and compares them letter by letter" — *then* introduce "lexicographic order".

---

## 3. Formatting rules

- **Headings:** plain words, no emoji. Story-style chapter titles are welcome ("Chapter 2: I fixed the bug and made it slower"). Use `##` for beats, `###` sparingly.
- **Emoji:** at most one or two per post, in the body, only when they add tone. Never in headings.
- **Bold:** max one bolded phrase per paragraph — the thing you'd underline. If everything is bold, nothing is.
- **Pull quotes (`>`):** once or twice per post, for the single line you want people to screenshot.
- **Tables:** only for real comparisons (before/after, version A vs B, measurements). Not as decoration.
- **Code:** the smallest snippet that shows the behavior. Put the surprising output in a comment on the same line:
  ```js
  [10, 9, 1].sort(); // [1, 10, 9]  ← surprise
  ```
- **Diagrams (optional):** most posts don't need one. Add one only when it explains a mechanism or timeline faster than the text can, which usually means technical flows, not career or soft-skill posts. Use `<FlowDiagram>` for "what happens, in order" and `<ParallelFlow>` for "what happens over time". Every diagram gets a `title`, and `notes` when a step isn't obvious. If a list right next to it says the same thing, cut the diagram.
- **Images:** posts should include images. Long posts usually need 2–3, placed where the reader needs a visual break. Use photos from free-to-use sites (check the license) or AI-generated art, and never pass off an illustration as a real screenshot. Save them in `public/assets/` as `<post-topic>-<name>.jpg`, about 1200px wide, and add them with `![Photo: name on Pexels](/assets/file.jpg)`.
- **Cover image (every post):** set `cover: /assets/<post-topic>-cover.jpg` in frontmatter. It shows as the main image under the post header, the thumbnail on post cards, and the share image on social sites (replacing the generated card). Don't repeat the cover as the first image in the body. Every cover uses the same template, so the post list looks like one set:
  - **Style:** flat editorial AI illustration with light grain. No stock photos, no text, no logos.
  - **Color:** solid saturated royal-blue background (about `#1a2fd6`). Figures and objects in light blues and soft whites, with **one** warm gold/orange accent (a glow, a coin, a check mark).
  - **Layout:** left half empty, scene on the right half. One or two figures or objects that act out the post's surprise. Show the idea, not a literal screenshot.
  - **File:** 1200×630 JPEG, about 80–150 KB.
  - **Caption:** `coverAlt: "AI-generated illustration. <one line that adds the post's point>"`, following the caption rules below.
  - **Prompt starter:** "Flat editorial vector illustration with subtle grain texture, wide banner. Solid saturated royal blue background, empty on the left half. Palette of light blues and soft whites with a single warm gold accent glow. On the right half: `<scene>`. Calm, modern tech-blog hero style, soft lighting, no text, no logos."
- **Image captions:** alt text shows on the page as the caption. Use it for the credit, or for a point the reader can't get from the image. Don't describe what's in the image.
- **End with** a `## TL;DR` of 3–5 bullets, each a full sentence.

---

## 4. Titles and summaries

- **Title = the surprise or the outcome**, not the topic.
  - ✅ `The Leaderboard That Ranked 9 Above 10`
  - ✅ `I Optimized a Button From O(n) to O(1). The Speed Didn't Matter.`
  - ❌ `Array.prototype.sort Explained`
- Avoid the "X — Y" pattern for every title; mix it up.
- Put the searchable term in the **summary** (and tags) if it doesn't fit the title naturally: "Why JavaScript's `sort()` compares numbers as strings, and how to sort numbers correctly."
- Summary: one or two sentences, under ~160 characters, describes what the reader will understand by the end.

---

## 5. Series

Posts can belong to a series (registered in `lib/series.ts`):

```yaml
series: "js-plot-twists"
seriesOrder: 1
```

- **JavaScript Plot Twists** — real bugs caused by JS doing exactly what the spec says. Each part: one surprising behavior, one real-world bug it caused, the rule that prevents it.
- **Next.js Field Notes** — tricks and traps from production App Router apps.
- **Under the Benchmark** — same code, wildly different speed. Each part: one measured surprise, what the engine or hardware is really doing, and the honest stakes.

When a part is published, remove its title from `upcoming` in `lib/series.ts`.

---

## 6. Pre-publish checklist

- [ ] First sentence is a concrete moment, not a definition.
- [ ] Anything told as "I" really happened; made-up scenarios are framed as "picture…" / "you", with no invented names.
- [ ] There's a wrong turn before the reveal.
- [ ] One concept only.
- [ ] Every number is measured or sourced.
- [ ] No emoji in headings; ≤2 emoji total.
- [ ] Code snippets are minimal and show the surprising output.
- [ ] Any diagram earns its place (not a repeat of nearby text) and has a `title` (and `notes` where needed).
- [ ] Cover follows the template: blue AI illustration, scene on the right, one gold accent, 1200×630, caption starts "AI-generated illustration."
- [ ] Post has images, with licenses checked and captions that don't only describe the image.
- [ ] Title is the surprise/outcome; summary contains the search term.
- [ ] Ends with a one-line rule + TL;DR.
- [ ] Frontmatter: `title`, `summary`, `publishedTime`, `level`, `tags` (+ `series`, `seriesOrder` if part of one, + `publishOrder` if another post has the same date: higher number shows first, and the newest written post gets the highest number; + `cover`, `coverAlt`).
