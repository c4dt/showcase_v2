# Center for Digital Trust (C4DT) Showcase

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## License

This project is licensed under the terms of the GNU Affero General Public License Version 3 or later.

## Devbox

You can use the devbox bundler for the bun-bundler.

1. [Install Devbox](https://www.jetify.com/docs/devbox/installing_devbox/)
2. Run `devbox run dev` to start the server listening at <http://localhost:3000>

### Pre-Commit

This also installs `pre-commit`, so you can use the following to commit your code:

`devbox run git commit -am "your messge"`

This will run the `pre-commit` hooks defined by [husky](https://github.com/typicode/husky).

### Prettier

If `prettier` complains that one or more of your files don't follow its formatting, you
can update all the files like this:

`devbox run prettier`

## Setup

Make sure to install the dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on <http://localhost:3000>:

```bash
# bun
bun run dev
```

### updates types

If you do any changes to any of the schemas, make sure to run this command

```bash
bunx json2ts utils/schemas -o ./types
```

## Playwright

If you have never used [Playwright](https://playwright.dev/) before, you need to run `bun playwright install`
to install the browsers Playwright uses for testing. If your system does not meet the
[Playwright's system requirements](https://playwright.dev/docs/intro#system-requirements), you need to run
it with the `--with-deps` flag (requires administrator privileges).

To run Playwright, either run

```
bun playwright:test [file]
devbox run playwright:test [file]
```

(with `file` for a specific file, or without to run all) to run it in the command-line, or

```
bun playwright:test-ui
devbox run playwright:test-ui
```

to run it in a GUI.

### MacOS

If you're running Playwright on macOS, the command-line tests are currently flaky, but running
in a GUI seems to yield consistent results.

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

## Docker

The CI builds and pushes a Docker image to ghcr.io/c4dt/showcase_v2. If you want to run it locally, either pull
it from there, or build it yourself

```
docker build -t ghcr.io/c4dt/showcase_v2:<X.Y> .
```

and then run it

```
docker run --rm -p 127.0.0.1:3000:80 ghcr.io/c4dt/showcase_v2:<X.Y>
```
