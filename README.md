# Waldorf English Pathway

A self-paced, Waldorf-inspired English programme for Brazilian learners.

## Current focus

**Grade 7** is the pilot course. It adapts Waldorf language arts for English as a foreign language (EFL), for learners around ages 12-13. **Lower Grades** now include an overview for Grades 1-6 plus actual lesson outlines for Grades 1-5, growing from oral foundations into written practice. A **Grade 8** course map is planned around Jamie York's Grade 8 mathematics themes, using number systems, growth, proportions, mensuration, stereometry, and loci as contexts for English explanation and writing.

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

The 40-practice pilot moves from concrete observation to formal literary and factual writing:

1. Observation & descriptive writing
2. Sentence combining & paragraph flow
3. Wishes, choices & personal response
4. Poetry, imagery & figurative language
5. Storytelling & narrative structure
6. Literature response & progressive essays
7. Evidence, discovery & clear writing through Grade 7 Renaissance, science, astronomy, and geometry themes

The final portfolio brings together descriptive, poetic, narrative, analytical, and factual work. The Grade 7 source curriculum is the main organising context; BNCC-compatible skills such as summaries, biographies, chronology, source awareness, and connected writing are woven in only where they strengthen the English learning.

## Grade 8 plan

The planned Grade 8 pathway keeps the same reinforcement pattern while moving into clearer reasoning and technical explanation:

1. Number systems, algorithms, binary, hexadecimal, and codes
2. Percents, growth, graphs, and responsible claims
3. Ratios, rates, proportions, and problem-solving reports
4. Measurement, unit conversions, dimensional analysis, and density
5. Algebraic structure and worked-example explanations
6. Mensuration: area, volume, surface area, and Pythagorean calculations
7. Stereometry, Platonic and Archimedean solids, orthogonal views, loci, and conic sections
8. Research, algorithm writing, presentation, and final portfolio reflection

The Grade 8 map is based on Jamie York Press curriculum overviews for Grade 8 mathematics, but all learner-facing English materials should be original.

## Repository structure

```
/
├── docs/                   # decisions, content standards, course plans
├── content/
│   ├── grade-7/            # first active curriculum
│   │   ├── course-map.md
│   │   └── units/
│   ├── lower-grades/       # overview for Grades 1-6
│   └── grade-8/            # planned Jamie York-aligned Grade 8 course map
├── index.html              # public website home page
├── lower-lessons.html      # actual Grade 1-5 lower-grade lesson outlines
├── grade-7.html            # active Grade 7 course page
├── grade-8.html            # planned Grade 8 course page
├── lesson-look-closely.html # first interactive Grade 7 lesson
├── assets/                 # shared CSS and browser-based lesson interactions
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
8. Grade 8 course map
9. Lower Grades practice, beginning with Grade 1-5 lesson outlines and a Grade 4 literacy bridge
10. Additional grades, one complete course at a time

## Content principles

- Waldorf-inspired, not an official Waldorf curriculum.
- EFL-appropriate: language is scaffolded and never assumes native-speaker fluency.
- Age-appropriate, interesting, and suited to independent learners.
- Brazilian context and Portuguese support where it helps learning.
- Use original material, public-domain works, licensed content, or short attributed excerpts only.
