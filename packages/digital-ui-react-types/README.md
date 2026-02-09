<h1 align="center">
    <img width="256" src="https://raw.githubusercontent.com/digital-net-org/digital-net.js/refs/heads/master/packages/digital-ui-react-types/logo.png">
</h1>
<h2 align="center">
    React types definition for Digital.Net components library
</h2>

---

## Installation
Github package registry is always private, so you need to authenticate before installing the package.
You can do this by creating a `.npmrc` file in your project root with the following content:
```
@digital-net-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
Then use your favorite package manager to install the package.
```bash
npm install @digital-net-org/digital-ui-react-types
```

## Usage
Update your `tsconfig.json` to include the package types.
```json
{
  "compilerOptions": {
    "types": ["@digital-net-org/digital-ui-react-types"]
  }
}
```
