# Waldorf English Pathway

A self-paced, Waldorf-inspired English programme for Brazilian learners.

## Current focus

**Grade 7** is the pilot course. It adapts Waldorf language arts for English as a foreign language (EFL), for learners around ages 12–13.

The course is designed for independent study, with bilingual support, practical writing guidance, and progress tracking. The site will use GitHub Pages for the public learning experience and Supabase's free tier for learner accounts and saved progress.

## Course model

```
Programme
└── Grade
    └── Course map
        └── Unit
            └── Lesson
                ├── Opening
                ├── Listen / Read
                ├── Notice
                ├── Learn
                ├── Practise
                ├── Create
                └── Check & Reflect
```

The same model will be reused for every future grade. Support levels change the amount of help, not the central topic:

- **Guided (A2):** sentence frames, bilingual glossary, smaller output.
- **Core (B1):** normal Grade-level task.
- **Stretch (B1+/B2):** greater independence and deeper analysis.

## Grade 7 pilot

The 30-lesson pilot moves from concrete observation to formal literary writing:

1. Observation & descriptive writing
2. Sentence combining & paragraph flow
3. Wishes, choices & personal response
4. Poetry, imagery & figurative language
5. Storytelling & narrative structure
6. Literature response & progressive essays

The final portfolio brings together descriptive, poetic, narrative, and analytical work.

## Repository structure

```
/
├── docs/                   # decisions, content standards, course plans
├── content/
│   ├── grade-7/            # first active curriculum
│   │   ├── course-map.md
│   │   └── units/
│   ├── grade-6/            # added only when its course is ready
│   └── grade-8/
├── src/                    # future website application
├── public/                 # future static assets
└── README.md
```

See [the site and curriculum architecture](docs/site-architecture.md) for the expansion rules and build order.

## Build order

1. Learner profile and placement check
2. Grade 7 course map
3. Grade 7 Unit 1: Observe & Describe
4. Writing Studio and portfolio
5. Grade 7 Unit 2: Wishes & Choices
6. Account and progress tracking with Supabase
7. Remaining Grade 7 units
8. Additional grades, one complete course at a time

## Content principles

- Waldorf-inspired, not an official Waldorf curriculum.
- EFL-appropriate: language is scaffolded and never assumes native-speaker fluency.
- Age-appropriate, interesting, and suited to independent learners.
- Brazilian context and Portuguese support where it helps learning.
- Use original material, public-domain works, licensed content, or short attributed excerpts only.
