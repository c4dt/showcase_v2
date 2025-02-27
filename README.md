# Center for Digital Trust (C4DT) Showcase

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

### updates types

If you do any changes to any of the schemas, make sure to run this command

```bash
bunx json2ts utils/schemas -o ./types
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
