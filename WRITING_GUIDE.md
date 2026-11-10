# Bitlyst Writing Guide

Bitlyst exists for one reason: **make technical ideas simple enough to remember and explain.** After reading a post, someone should be able to explain the idea to a teammate, and answer it in an interview, without opening the post again.

The model posts are the early ones: [Docker in 2 minutes](docs/docker-in-2-minutes.mdx), [SOLID Principles](docs/solid-principles.mdx). They are short, have one clear picture, and end with something you can memorize.

> **The test:** can a reader close the tab and explain it in 30 seconds? If not, the post isn't done.

---

## 1. The shape of a post

| Part | What it does | Length |
|------|--------------|--------|
| **1. Hook** | One concrete moment: a weird output, a bug, a question people get asked. No "In this post we will…". | 1–3 lines |
| **2. The mental model** | The whole idea in one picture: an analogy or one plain sentence. This is the line people remember. | 1–3 sentences |
| **3. How it works** | The idea unpacked in small steps, plain words first, jargon second. Minimal code. | the core |
| **4. In practice** | When it matters, what to do, before → after. Include the honest stakes: how often you'll actually hit it. | short |
| **5. Say it in an interview** | A 2–4 sentence answer you could say out loud. Put it in a pull quote. | 2–4 sentences |
| **6. Cheat sheet** | A small table or 3–5 bullet TL;DR: the facts to remember. | short |
| **7. Going deeper** *(optional, `<DeepDive>`)* | For readers who want the internals: full measurements and method, edge cases, caveats, further reading. | any |

**Length:** aim for 400–800 words for parts 1–6. If the core goes past ~900 words, it probably holds two ideas: split it, or make it a series part. "Going deeper" doesn't count toward the limit.

### The "Going deeper" section

- Always the last section, after the TL;DR, wrapped in `<DeepDive>` (see `components/DeepDive.tsx`). The component draws the separate panel, the "Advanced · optional" label, the `Going deeper` heading and the "this is optional" line, so don't write those yourself, and don't put a `---` before it. Leave blank lines around the content:
  ```mdx
  <DeepDive>

  ### Full measurements
  ...

  </DeepDive>
  ```
- Split into `###` subsections that each stand alone: full benchmark tables and how they were measured, edge cases and traps, what isn't proven, further reading.
- The core never depends on it. A reader who stops at the TL;DR must not miss anything they need.
- Add it only when there's real depth worth reading. Beginner posts usually skip it.
- This is where long tables, exact flags, engine details and honest caveats go, so the core can stay simple.

**Story is seasoning, not structure.** A short real story makes a post stick, but it has to be short. Don't spend a whole section on a "wrong turn" unless the wrong guess *is* the lesson (as with `[10, 9, 1].sort()`).

---

## 2. Making it memorable

1. **One mental model per post.** Find the picture first, write second. Good examples: "an image is the recipe, a container is the dish"; "a hidden class is a seating chart for an object". If you can't find one sentence for the idea, the topic is too big.
2. **Plain words before jargon.** "JavaScript turns both numbers into text and compares them letter by letter", *then* "lexicographic order". Every term gets a one-line meaning the first time.
3. **Use the same picture all the way through.** If the hook uses a seating chart, the explanation and the cheat sheet use it too. Don't switch analogies halfway.
4. **Fewer facts, said twice.** It's better to teach three things well than ten things once. The key fact can appear in the mental model, the interview answer *and* the cheat sheet. Repetition is how people remember.
5. **Numbers only when they are the point.** One measured number that shows the effect ("about 2× slower") beats a table of ten rows. Full benchmark tables belong in "Going deeper", not the core of the post.
6. **Write for intermediate devs.** Assume they know the language, not engine internals. Even an "advanced" topic should read as easy.

---

## 3. Voice rules

1. **First person only for things that really happened.** Made-up scenarios use "picture…" and "you". Never invent people, quotes or events.
2. **Short paragraphs.** 1–3 sentences.
3. **Explain like a colleague.** Use "you". No "one must", "it is important to note", "simply", "just", "obviously".
4. **Be honest about stakes.** If it only matters in hot loops, say so plainly.
5. **Back claims with evidence.** Numbers come from a measurement (say what, where, how), a spec link, or a runnable snippet. Never invent figures.

---

## 4. Formatting rules

- **Headings:** plain words that say what the section teaches ("How V8 reads a property", not "Chapter 3"). No emoji. `##` for parts, `###` rarely.
- **Emoji:** at most one or two per post, in the body. Never in headings.
- **Bold:** the one thing per paragraph you'd underline. If everything is bold, nothing is.
- **Pull quotes (`>`):** the interview answer, plus at most one other line.
- **Tables:** for comparisons and cheat sheets. Keep them under ~6 rows.
- **Code:** the smallest snippet that shows the behavior, with the surprising output in a comment on the same line:
  ```js
  [10, 9, 1].sort(); // [1, 10, 9]  ← surprise
  ```
- **Diagrams (optional):** only when a mechanism or timeline is faster to see than to read. Use `<FlowDiagram>` for "what happens, in order" and `<ParallelFlow>` for "what happens over time". Every diagram gets a `title`, and `notes` when a step isn't obvious. If a list next to it says the same thing, cut the diagram.
- **Images:** every post has at least one image besides the cover. Use free-to-use photos (check the license) or AI-generated art, and never pass off an illustration as a real screenshot. Save in `public/assets/` as `<post-topic>-<name>.jpg`, about 1200px wide: `![Photo: name on Pexels](/assets/file.jpg)`.
- **Image captions:** alt text shows as the caption. Use it for the credit or for a point the image can't make alone. Don't describe the image.
- **Cover image (every post):** `cover: /assets/<post-topic>-cover.jpg` in frontmatter. It's the hero image, card thumbnail and share image. Don't repeat it in the body. Same template for every post:
  - **Style:** flat editorial AI illustration with light grain. No stock photos, no text, no logos.
  - **Color:** solid saturated royal-blue background (about `#1a2fd6`), figures in light blues and soft whites, **one** warm gold/orange accent.
  - **Layout:** scene centered and filling most of the frame, with a calm margin around it. No empty half: the site never puts text on the cover, and the card thumbnail is only 88–120px wide, so the subject must read at that size. One or two figures or objects that act out the mental model.
  - **File:** 1200×630 JPEG, about 80–150 KB.
  - **Caption:** `coverAlt: "AI-generated illustration. <one line that adds the post's point>"`.
  - **Prompt starter:** "Flat editorial vector illustration with subtle grain texture, wide banner. Solid saturated royal blue background. Palette of light blues and soft whites with a single warm gold accent glow. Centered composition, subject large and filling most of the frame with a calm margin: `<scene>`. Calm, modern tech-blog hero style, soft lighting, no text, no logos."

---

## 5. Titles and summaries

- **Title = the topic people search for, plus a hook.** Readers should know what they'll learn *and* want to click.
  - ✅ `Hidden Classes in V8: Why Object Shape Changes Speed`
  - ✅ `Debounce vs Throttle, Explained With an Elevator`
  - ❌ `A Fifth Object Shape Made the Same Loop Twice as Slow` (clever, but nobody knows the topic)
  - ❌ `Array.prototype.sort` (topic, no reason to click)
- Summary: one or two sentences, under ~160 characters, says what the reader will be able to explain by the end.

---

## 6. Series

Posts can belong to a series (registered in `lib/series.ts`):

```yaml
series: "js-plot-twists"
seriesOrder: 1
```

- **JavaScript Plot Twists** — surprising JS behaviors that follow the spec. Each part: one surprise, why it happens, the rule that prevents it.
- **Next.js Field Notes** — tricks and traps from production App Router apps.
- **Under the Benchmark** — performance ideas made simple. Each part: one mental model of what the engine or hardware does, one measured number that proves it, and when it actually matters.

When a part is published, remove its title from `upcoming` in `lib/series.ts`.

---

## 7. Articles (soft-skill and opinion posts)

Career, teamwork and opinion posts (for example `ai-is-your-junior-developer.mdx`, `feedback-with-evidence-not-drama.mdx`) are **articles**, not concept posts. They don't need the mental-model / interview / cheat-sheet shape or the length limit. Voice, honesty, image, cover and caption rules still apply.

---

## 8. Pre-publish checklist (technical posts)

- [ ] The mental model is stated in 1–3 sentences near the top.
- [ ] A reader could explain the idea in 30 seconds after reading.
- [ ] One concept only; roughly 400–800 words before "Going deeper".
- [ ] Deep details (full tables, flags, internals, caveats) are in an optional `<DeepDive>` at the end, and the core makes sense without it.
- [ ] Every term is explained in plain words the first time.
- [ ] Ends with "Say it in an interview" (pull quote) and a cheat sheet / TL;DR.
- [ ] Numbers are measured or sourced, and only the ones that make the point.
- [ ] Anything told as "I" really happened; made-up scenarios use "picture…" / "you".
- [ ] No emoji in headings; ≤2 emoji total.
- [ ] Code snippets are minimal and show the surprising output.
- [ ] Any diagram earns its place and has a `title`.
- [ ] Cover follows the template; post has at least one more image with a useful caption.
- [ ] Title has the searchable topic plus a hook.
- [ ] Frontmatter: `title`, `summary`, `publishedTime`, `level`, `tags` (+ `series`, `seriesOrder`; + `publishOrder` if another post shares the date, higher shows first and the newest written gets the highest; + `cover`, `coverAlt`).
