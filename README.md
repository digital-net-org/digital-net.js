<h1>
    <img width="300" src="https://raw.githubusercontent.com/digital-net-org/.github/refs/heads/master/assets/logo_v2025-2.svg">
</h1>
<div justify="center">
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Typescript-blue.svg?color=3178c6"></a>
    <a href="https://puckeditor.com/"><img src="https://img.shields.io/badge/Puck-black.svg?color=111111"></a>
</div>

_@digital-net-org/digital-net.js_

A collection of packages that provide a set of tools and utilities to build Digital.Net **React/NextJs** applications.

**Digital.Net** is a Backoffice that allows users to create and edit website pages/blog articles through an intuitive
interface using the
Puck library.

## 🏗️ Configuration

### Submodules

This package is a submodule. To use it, you need to clone the repository with submodules and resolve the path in your
**vite configuration**. The modules must be accessible in the folder `@digital-net/*`.

### Environment variables

| Variable          | Type   | Description                      |
|-------------------|--------|----------------------------------|
| `DIGITAL_API_URL` | string | The base URL of the Digital API. |

### Dependencies

Submodules uses the following dependencies:

```json
{
  "devDependencies": {
    "@eslint/js": "latest",
    "@types/node": "latest",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.3",
    "@vitejs/plugin-react": "latest",
    "digital-lint": "github:digital-net-org/lint#1.1.1",
    "eslint": "^9.26.0",
    "eslint-config-prettier": "^10.1.2",
    "eslint-plugin-import": "latest",
    "eslint-plugin-react": "latest",
    "eslint-plugin-react-hooks": "latest",
    "happy-dom": "latest",
    "jsdom": "latest",
    "prettier": "^3.5.3",
    "rollup-plugin-dts": "latest",
    "rollup-plugin-preserve-directives": "latest",
    "typescript": "latest",
    "typescript-eslint": "latest",
    "vite-plugin-checker": "latest"
  },
  "dependencies": {
    "@fontsource-variable/noto-serif": "latest",
    "@fontsource/noto-color-emoji": "latest",
    "@fontsource/roboto": "latest",
    "@fontsource/roboto-mono": "latest",
    "@measured/puck": "latest",
    "@storybook/addon-essentials": "^8.6.12",
    "@storybook/addon-links": "^8.6.12",
    "@storybook/blocks": "^8.6.12",
    "@storybook/react": "^8.6.12",
    "@storybook/react-vite": "^8.6.12",
    "@storybook/test": "^8.6.12",
    "@tanstack/react-query": "latest",
    "@testing-library/dom": "latest",
    "@testing-library/react": "latest",
    "axios": "latest",
    "i18next-browser-languagedetector": "^8.1.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-i18next": "^15.5.1",
    "react-router-dom": "^6.30.0",
    "storybook": "^8.6.12",
    "vite": "latest",
    "vitest": "latest"
  }
}
```