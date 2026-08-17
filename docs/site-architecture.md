# Site and Curriculum Architecture

## Purpose

Waldorf English Pathway is a grade-targeted English-as-a-foreign-language learning site. It begins with Grade 7 and grows only when a new grade has a coherent course map and enough lessons to be genuinely useful.

## Navigation

```
Home
├── How it works
├── Courses
│   ├── Lower Grades — overview
│   ├── Grade 7 — active
│   └── Grade 8 — planned
├── Writing Studio
├── My progress
└── About
```

Future grades may be shown in planning documentation and course-plan pages. Public navigation should distinguish complete practice courses from overview or planning pages.

## Reusable content schema

Every lesson should be saved in a consistent format so the website can render any grade without one-off page designs.

```yaml
id: g7-u1-l01
grade: 7
unit: 1
title: Observe & Describe
duration_minutes: 35
level: A2-B1
themes:
  - observation
  - descriptive-writing
learning_objectives:
  - Use precise nouns, colours, sizes, and texture words.
support_levels:
  guided: true
  core: true
  stretch: true
portfolio_item: natural-object-description
```

Lesson sections:

1. Opening
2. Listen / Read
3. Notice
4. Learn
5. Practise
6. Create
7. Check & Reflect

## Grade 7 content outline

| Unit | Working title | Main outcome |
|---|---|---|
| 0 | Start Here | learner profile and placement support |
| 1 | Observe & Describe | precise natural-object description |
| 2 | Wishes & Choices | supported personal-response paragraph |
| 3 | Poetry & Word Pictures | small illustrated poetry collection |
| 4 | Stories with Shape | structured nine-sentence story |
| 5 | Read, Think & Respond | evidence-based literary response |
| 6 | Evidence, Discovery & Clear Writing | factual, historical, and science-context writing |

Unit 1 is the first build target. Grade 7 content remains modular: each unit can be released as it is completed without changing the structure for future grades.

## Grade 8 planned outline

Grade 8 follows the same lesson pattern as Grade 7, but uses Jamie York's Grade 8 mathematics themes as the main content context for English practice:

| Unit | Working title | Main outcome |
|---|---|---|
| 0 | Start Here | learner profile and first short explanation |
| 1 | Numbers in Different Worlds | illustrated explanation of a number system or algorithm |
| 2 | Growth, Percent & Real-World Change | factual paragraph explaining increase, decrease, or growth |
| 3 | Ratios, Rates & Proportions | problem-solving report that shows reasoning |
| 4 | Measurement, Units & Dimensional Analysis | practical conversion guide or mini-report |
| 5 | Algebra as Clear Structure | worked examples with explanations |
| 6 | Mensuration: Area, Volume & Surface | visual math explanation connecting formula, diagram, and reasoning |
| 7 | Stereometry & Loci | descriptive and analytical portfolio piece about a solid or curve |
| 8 | Clear Reasoning, Research & Portfolio | final mathematical explanation, comparison, report, and reflection |

The detailed map lives at `content/grade-8/course-map.md`. Public navigation should continue to present Grade 8 as planned until at least the introduction and first unit are usable.

## Lower grades overview

The lower-grades page maps Grades 1–6 before full interactive lessons are built:

| Grade band | Emphasis | Site direction |
|---|---|---|
| 1–3 | Oral language, imitation, songs, verses, stories, gesture, games | Teacher-led or parent-supported prompts, audio, picture cards, and printable material |
| 4 | Literacy bridge from known oral material to reading and copywork | First independent lower-grade web practice |
| 5–6 | Connected sentences, grammar in context, retellings, letters, summaries, and reports | Self-paced units using the Grade 7 lesson pattern with lighter language load |

## Shared platform components

- Course map and lesson reader
- Bilingual glossary
- Optional audio and transcript
- Interactive language practice
- Writing Studio with draft and revise flow
- Portfolio
- Progress tracking
- Optional audio recorder

The first release should prioritise the course map, lesson reader, bilingual support, writing studio, portfolio, and basic saved progress. Teacher dashboards and advanced analytics are later work.

## Expansion rule

When adding a grade:

1. Create `content/grade-N/`.
2. Write its `course-map.md`.
3. Reuse the same unit and lesson schema.
4. Add the grade to public navigation only after the introduction and first unit are ready.
5. Reuse components; do not fork the website design per grade.

## Rights and safety

- Use public-domain poetry in full only where jurisdiction and source are verified.
- Prefer short excerpts, paraphrases, original exercises, and attributed source links for copyrighted material.
- Do not collect more student information than is needed for accounts and progress.
