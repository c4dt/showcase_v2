# AGENTS.md

## Setup commands

- If `devbox` is installed, use `devbox` to run any commands
- Run `bun install` followed by `bun playwright install`

## Code style

- ESLint's TypeScript

## Dev environment tips

The directory structure is as follows:

```bash
.
├── assets
│   ├── css
│   └── img
├── components
│   ├── homepage
│   └── projects
├── composables
├── data
│   ├── AIMM
│   ├── C4DT
│   ├── COMPSEC
│   ├── DCL
│   ├── DCSL
│   ├── DEDIS
│   ├── DLAB
│   ├── DSLAB
│   ├── ESL
│   ├── HexHive
│   ├── INDY
│   ├── IVRL
│   ├── LAMP
│   ├── LAP
│   ├── LARA
│   ├── LASEC
│   ├── LCA2
│   ├── LDS
│   ├── LIA
│   ├── LIONS
│   ├── LSI
│   ├── LSIR
│   ├── LTS4
│   ├── MLO
│   ├── MMSPG
│   ├── NAL
│   ├── NLP
│   ├── PARSA
│   ├── projectTabs
│   │   ├── app
│   │   ├── demo
│   │   ├── details
│   │   ├── hands-on
│   │   ├── pilot
│   │   └── presentation
│   ├── RS3LAB
│   ├── SACS
│   ├── SalatheLab
│   ├── SPRING
│   ├── SystemF
│   ├── VCA
│   └── VLSC
├── e2e
│   └── data
│       ├── C4DT
│       └── projectTabs
│           ├── app
│           ├── demo
│           ├── details
│           ├── hands-on
│           ├── pilot
│           └── presentation
├── mockups
├── pages
│   └── projects
├── plugins
├── public
│   ├── labs
│   └── products
│       ├── icons
│       └── images
│           ├── at2
│           ├── calypso
│           ├── crowdnotifier
│           ├── dela
│           ├── disco
│           ├── dp3t
│           ├── drand
│           ├── drynx
│           ├── d-voting
│           ├── freegaen
│           ├── garfield
│           ├── hippiepug
│           ├── index
│           ├── innosuisse-eid
│           ├── lightarti
│           ├── medco
│           ├── odyssey
│           ├── omniledger
│           ├── regelk
│           ├── seal-digiinov
│           ├── seal-phishing
│           ├── spindle
│           ├── stainless
│           ├── tandem_monero
│           └── trickster
├── test
│   └── nuxt
├── types
└── utils
    └── schemas
```

- `data/` contains the currently-known projects of the labs, with one folder per lab
- It also contains `projectTabs/`, which contains additional content for some of the labs' projects' pages
- `e2e/` contains the end-to-end tests
- `test/nuxt/` contains the unit tests
- `utils/` contains utility code, e.g. for the schema verification of the labs' project files
- The rest of the directories follow the typical structure of Vue.js projects

## Testing instructions

- Add or update tests for the code you change
- You can use `bun vitest` to run `vitest`
- If you use it without additional arguments, all tests will be executed
- Pass `vitest`'s usual additional arguments to limit the tests to run
- You can use `playwright:test` to run `playwright`
- If you use it without additional arguments, all tests will be executed
- Pass `playwright`'s usual additional arguments to limit the tests to run
- Fix any errors until all the tests pass
- Use `bun lint` and `bun format` to check the style/formatting
- Fix any style/formatting errors until all the style/formatting checks pass
- When adding or modifying projects in data/\*, always run
  `bun utils/validate-data.ts` afterwards

## Adding a new project

- Use the data/template.yaml as a basis for any new project
- Put it in the corresponding data/LABNAME/projects.yaml file
- Fill out both tech_desc and layman_desc
