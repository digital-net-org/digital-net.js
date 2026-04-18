<h1 align="center">
    <img width="256" src="./logo.png">
</h1>
<h2 align="center">
    TypeScript SDK for the Digital.Net API
</h2>

---

## Overview

`@digital-net-org/digital-api-sdk` is a vanilla TypeScript client that wraps the
[Digital.Net](https://github.com/digital-net-org/Digital.Net.Api) REST API. It
handles authentication (JWT + refresh), request serialization, response
unwrapping (`Result<T>` convention), and exposes typed entity catalogs
(users, sessions, files, CMS, …).

It has no React dependency and works both in the browser and in Node.js.

## Getting Started

### Prerequisites

- **Node.js** 20+ (for server-side use) or a modern browser
- A reachable Digital.Net API instance

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

**2. Install the SDK**

```bash
npm install @digital-net-org/digital-api-sdk
```

### Usage

```ts
import { DigitalApi } from '@digital-net-org/digital-api-sdk';

const api = new DigitalApi({
    baseUrl: 'https://api.example.com',
});

// Authenticate
await api.catalog.auth.login({ login: 'alice', password: '••••••' });

// Read paginated entities
const users = await api.catalog.user.list({ index: 1, size: 25 });
```

The `api.catalog.*` surface is fully typed and mirrors the backend's endpoint
hierarchy.

## Scripts

| Command          | What it does                    |
|------------------|---------------------------------|
| `pnpm build`     | Build the SDK with Vite.        |
| `pnpm test`      | Run the vitest suite.           |

## Related documentation
- [Digital.Net backend](https://github.com/digital-net-org/Digital.Net.Api)
