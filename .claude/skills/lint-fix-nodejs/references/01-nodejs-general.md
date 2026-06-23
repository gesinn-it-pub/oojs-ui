**Coding Conventions — Node.js**

Tooling: [ESLint v9](https://eslint.org/) (code quality) +
[Prettier](https://prettier.io/) (formatting). Run locally:
`npm run lint` / `npm run format:check` (or `npm test`).

Target: Node.js 20+. Declare in `package.json`:

``` json
"engines": { "node": ">=20.0.0" }
```

**Module system**

- New projects: ES Modules (`import` / `export`) with `"type": "module"`
  in `package.json`

- Existing CommonJS code (`require` / `module.exports`) does not need to
  migrate

- One concern per file; filename reflects its exported symbol
  (`BotRequest.js` for class `BotRequest`)
