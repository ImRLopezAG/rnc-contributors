# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.0.0
ARG PNPM_VERSION=9.9.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN pnpm run build

FROM base as final

ENV NODE_ENV production

COPY package.json .


COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/lib ./lib
COPY --from=build /usr/src/app/.env ./.env
COPY ./src/db/data.db /usr/src/app/src/db/data.db

# Create a volume for the database to persist
VOLUME ["/usr/src/app/src/db"]

# Fix permissions for the database file (if needed)
RUN chmod 777 /usr/src/app/src/db/data.db

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD pnpm start
