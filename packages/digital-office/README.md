<h1 align="center">
    <img width="256" src="./logo.png">
</h1>
<h2 align="center">
    React components, layouts and MUI theme for Digital office applications
</h2>

---

## Overview

`@digital-net-org/digital-office` bundles everything needed to build a Digital.Net
back-office UI in a single package:

- A ready-to-use **application shell** (`DigitalOfficeProvider`)
- The **UI component library** built on top of Material UI — buttons, inputs,
  dialogs, drawers, breadcrumbs, menus, entity tables, etc.
- A tuned **MUI theme** (`DnThemeProvider`) with typography, palette and
  component overrides

## Getting Started

### Prerequisites

- **Node.js** 20+
- A running **Digital.Net API** (see
  [`@digital-net-org/digital-api-sdk`](../digital-api-sdk/README.md))

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

**2. Install the peer dependencies**

```bash
npm install react react-dom \
    @mui/material @mui/icons-material \
    @emotion/react @emotion/styled \
    @tanstack/react-query react-router
```

**3. Install digital-office and the API SDK**

```bash
npm install @digital-net-org/digital-office @digital-net-org/digital-api-sdk
```

### Usage

```tsx
import { DigitalApi } from '@digital-net-org/digital-api-sdk';
import { DigitalOfficeProvider, DigitalOfficeRouter } from '@digital-net-org/digital-office';

const api = new DigitalApi({ 
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  keyPrefix: 'MYDOMAINOFFICE_',
});

export function App() {
    return (
        <DigitalOfficeProvider api={api}>
            <DigitalOfficeRouter />
        </DigitalOfficeProvider>
    );
}
```

## Scripts

| Command          | What it does                    |
|------------------|---------------------------------|
| `pnpm build`     | Build the package with Vite.    |
| `pnpm test`      | Run the vitest suite.           |

## Related documentation
- [Digital API SDK](../digital-api-sdk/README.md)
- [Digital Core](../digital-core/README.md)
