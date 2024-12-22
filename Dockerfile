# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.0.0
ARG PNPM_VERSION=9.9.0

FROM node:${NODE_VERSION}-alpine3.18

ENV NODE_ENV production

# Install pnpm globally using cache to speed up installs.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /usr/src/app

# Copy package files and install dependencies.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy all files, including the .env file.
COPY . .

# Expose port.
EXPOSE 3000

# Run the application as a non-root user.
USER node

# Run the application.
CMD ["pnpm", "start"]
