<h1 align="center">
    <img width="256" src="packages/digital-core/logo.png">
</h1>
<p align="center">
    Digital.Net JavaScript libraries — a pnpm workspace.
</p>

---

## Overview

`digital-net.js` is the JavaScript companion to the [Digital.Net](https://github.com/digital-net-org/Digital.Net.Api)
backend. It ships as a pnpm workspace with three publishable packages:

| Package                                                 | Role                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [`digital-core`](packages/digital-core/README.md)       | Framework-agnostic utilities (events, URL resolver, helpers) |
| [`digital-api-sdk`](packages/digital-api-sdk/README.md) | Typed HTTP SDK for the Digital.Net REST API                  |
| [`digital-office`](packages/digital-office/README.md)   | React components, layouts and theme for office applications  |

All packages are published to the private GitHub npm registry under the
`@digital-net-org/*` scope.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 10+

### Install

```bash
pnpm install
```

### Common scripts

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `pnpm -r build`      | Build every package (emits `dist/` + type files). |
| `pnpm -r test`       | Run every vitest suite.                           |
| `pnpm build:core`    | Build `digital-core` only.                        |
| `pnpm build:api-sdk` | Build `digital-api-sdk` only.                     |
| `pnpm build:office`  | Build `digital-office` only.                      |
| `pnpm test:core`     | Test `digital-core` only.                         |
| `pnpm test:api-sdk`  | Test `digital-api-sdk` only.                      |
| `pnpm lint`          | Run ESLint over every `.ts` file.                 |
| `pnpm format`        | Run Prettier over the workspace.                  |

### Publishing

Packages ship to `https://npm.pkg.github.com` under `@digital-net-org/*`.
Consumers need a GitHub token with `read:packages` and the following
`.npmrc`:

```
@digital-net-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

