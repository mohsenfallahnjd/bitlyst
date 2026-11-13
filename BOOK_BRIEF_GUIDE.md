# Book Bites Writing Guide

**Book Bites** is the Bitlyst series of book briefs: one post per book, covering the few ideas worth keeping and how to use them on Monday.

A brief is **not a chapter-by-chapter summary** and **not a replacement for the book**. A reader should finish it able to explain the book's big idea in 30 seconds, use two or three of its ideas at work, and decide whether to read the whole thing.

Everything in [WRITING_GUIDE.md](WRITING_GUIDE.md) still applies (voice, formatting, images, cover, honesty). This file covers only what's different for a book.

> **The test:** could someone who read only this brief explain the book's main idea to a teammate and apply one idea tomorrow? And would they know whether the book is worth their weekend?

---

## 1. The shape of a brief

| Part | What it does | Length |
|------|--------------|--------|
| **1. Hook** | The problem the book solves, as a moment the reader knows. Then one line on the book: title, author, why they're worth hearing. | 2–4 lines |
| **2. The book in one sentence** | The whole book as one idea, in a pull quote. This is the line people remember. | 1 sentence |
| **3. The big ideas** | **3–5 ideas**, each its own `##`. Each one: the idea in plain words, one picture or example, and a one-line "use it" takeaway. | the core |
| **4. Where it's weak** | Honest limits: what the book gets wrong, overstates, leaves out, or where well-known people disagree. | short |
| **5. Use it on Monday** | 3–5 concrete actions a reader can take this week. | short |
| **6. Say it in an interview** | A 2–4 sentence answer to a question the book prepares you for. Pull quote. | 2–4 sentences |
| **7. Cheat sheet** | Table: each big idea in one line. | ≤6 rows |
| **8. Should you read it?** | Who it's for, how long it takes, what to read first if short on time, who can skip it. | short |
| **9. Going deeper** *(optional, `<DeepDive>`)* | Chapter map, edition differences, related debates, further reading. | any |

**Length:** 700–1,100 words for parts 1–8. A book holds more ideas than a concept post, so the limit is higher, but the rule is the same: fewer ideas, explained better. If you need more than five big ideas, you've chosen the wrong five.

---

## 2. Choosing the big ideas

1. **Pick the ideas that change how someone works**, not the ones that fill the most pages. A short chapter can matter more than a long one.
2. **Find the one picture for each idea.** The book's own examples are fine. Where the book uses Java or C++, a short JavaScript/TypeScript example usually lands better with Bitlyst readers. Say when an example is yours, not the book's.
3. **Connect the ideas.** The "book in one sentence" should explain why these ideas belong together. Every big idea should serve it.
4. **Skip the obvious.** If an idea is something every developer already says, leave it out or give it one line.

---

## 3. Honesty and copyright rules

These matter more for briefs than for normal posts, because the content belongs to someone else.

1. **Paraphrase. Don't copy.** Explain ideas in your own words and examples. Never reproduce passages, chapter structure in detail, or the book's lists word for word.
2. **Quotes: at most two, each under ~25 words,** and only when the exact wording is verified from the book or the author's own published text. If you can't verify the wording, paraphrase and don't use quotation marks.
3. **Name the author's terms.** Use the book's vocabulary ("deep modules", "tactical tornado") and credit it as the author's. That's the vocabulary readers will search for and hear in interviews.
4. **Facts about the book must be checked:** author, edition, year, publisher. Use the author's or publisher's site. No invented page numbers, chapter numbers or sales claims.
5. **First person only if it really happened.** "I applied this on a project" only when the blog owner did. Otherwise use "you" and "picture…". Never imply the brief's writer read the book unless that's true.
6. **Fair critique.** "Where it's weak" must be about the book's actual claims. When citing someone who disagrees, link to what they said.
7. **No book cover images.** Publisher cover art is copyrighted. Use the blue-template AI cover and licensed photos only.
8. **Link the source.** Link the author's or publisher's page for the book in "Should you read it?". No affiliate links unless the blog owner adds them.

---

## 4. Frontmatter and format

```yaml
title: "<Book Title> Summary: <the big idea as a hook>"
summary: "<what the reader will be able to explain, under ~160 characters>"
publishedTime: "YYYY-MM-DD"
level: "beginner" | "intermediate"
series: "book-bites"
seriesOrder: <n>
cover: "/assets/<book-slug>-cover.jpg"
coverAlt: "AI-generated illustration. <the book's point in one line>"
tags: ["books", "<topic>", ...]
```

- **Slug:** `<book-title-slug>-book-summary`, for example `a-philosophy-of-software-design-book-summary`.
- **Title:** include the book's full title and the word "Summary": that's what people search for. Then a hook with the big idea. ✅ `A Philosophy of Software Design Summary: Deep Modules Beat Small Ones`
- **Book facts line:** right after the hook, one italic line: *Book: Title, Author (edition, year).*
- **Cover:** blue template from WRITING_GUIDE.md. The scene acts out the book's one-sentence idea, never the book itself.
- **Images:** at least one licensed photo or AI image in the body, as for every post.

---

## 5. Pre-publish checklist

- [ ] The book in one sentence is a pull quote near the top.
- [ ] 3–5 big ideas, each with a picture/example and a "use it" line.
- [ ] Ideas are paraphrased; at most two short verified quotes.
- [ ] Book facts (author, edition, year) checked against the author's or publisher's site.
- [ ] "Where it's weak" is honest and cites any named disagreement.
- [ ] "Use it on Monday" has concrete actions, not slogans.
- [ ] Ends with interview pull quote, cheat sheet and "Should you read it?" with a link to the book's page.
- [ ] 700–1,100 words before "Going deeper".
- [ ] No book cover art; blue-template cover plus one licensed body image.
- [ ] `series: "book-bites"` + `seriesOrder`; the book removed from `upcoming` in `lib/series.ts` if it was listed.
