<h1 align="center">
    <img width="256" src="https://raw.githubusercontent.com/digital-net-org/digital-net.js/refs/heads/master/packages/digital-core/logo.png">
</h1>
<h2 align="center">
    JavaScript basic utilities and helpers
</h2>

---

## Overview

`@digital-net-org/digital-core` is a framework-agnostic toolbox used across the
Digital.Net JavaScript stack. It provides:

- `DigitalEvent` — a typed pub/sub event bus
- `URLResolver` — URL building and path composition
- `DigitalError` — structured error type matching the `Result<T>` API convention
- Small helpers for arrays, objects, strings, JSON parsing, and async delay

No dependencies on React or any UI framework.

## Getting Started

### Prerequisites

- **Node.js** 20+

### Install

**1. Authenticate with the GitHub Packages registry**

`@digital-net-org/*` packages are published to GitHub Packages, which requires
authentication. Create (or append to) a `.npmrc` file at the root of your
project with the following content, and export a `GITHUB_TOKEN` environment
variable with at least the `read:packages` scope:

```
@digital-net-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**2. Install the package**

```bash
npm install @digital-net-org/digital-core
# or
pnpm add @digital-net-org/digital-core
```

### Usage

```ts
import { URLResolver, DigitalEvent } from '@digital-net-org/digital-core';

const url = URLResolver.build('https://api.example.com', '/users/:id', { id: 42 });

const bus = new DigitalEvent<{ userLoggedIn: { id: number } }>();
bus.on('userLoggedIn', ({ id }) => console.log('logged in', id));
bus.emit('userLoggedIn', { id: 42 });
```

## Scripts

| Command      | What it does                 |
| ------------ | ---------------------------- |
| `pnpm build` | Build the library with Vite. |
| `pnpm test`  | Run the vitest suite.        |
