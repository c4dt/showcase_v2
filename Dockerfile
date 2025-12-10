FROM oven/bun:1 AS build
# define build arguments with default values
# https://docs.docker.com/build/building/variables/#env-usage-example
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN mkdir -p /temp
WORKDIR /temp
COPY . .
RUN bun install
RUN bun nuxt generate

FROM joseluisq/static-web-server:2
COPY --from=build /temp/.output/public public
