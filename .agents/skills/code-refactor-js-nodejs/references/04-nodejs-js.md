**Coding Conventions — JavaScript · Node.js**

Tooling: [ESLint v9](https://eslint.org/) (code quality) +
[Prettier](https://prettier.io/) (formatting). Run locally:
`npm run lint` / `npm run format:check` (or `npm test`).

Target: Node.js 20+. Declare in `package.json`:

``` json
"engines": { "node": ">=20.0.0" }
```

**ESLint — flat config (v9+)**

New repositories use [flat
config](https://eslint.org/docs/latest/use/configure/configuration-files)
(`eslint.config.js`). Install:
`npm install --save-dev eslint @eslint/js globals eslint-config-prettier`

``` js
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: globals.node,
            ecmaVersion: 2022,
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'prefer-const': 'error',
        },
    },
    prettier, // disables ESLint rules that conflict with Prettier
];
```

<div class="note">

Projects with `"type": "commonjs"` in `package.json` must use CJS syntax
in `eslint.config.js` (`require` / `module.exports`).

</div>

Run: `npm run lint` (`eslint src/ test/`).

**Prettier — code formatting**

Formatting (indentation, quotes, line length) is owned by Prettier, not
ESLint rules. Install: `npm install --save-dev --save-exact prettier`

``` json
// .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 4,
  "printWidth": 120,
  "trailingComma": "es5"
}
```

Format: `prettier --write src/ test/`  
Check (CI): `prettier --check src/ test/`

**Naming**

- Variables and functions: lowerCamelCase

- Constructors / classes: UpperCamelCase

- Constants: `ALL_CAPS`

- Acronyms as single words: `getHtmlSource`, not `getHTMLSource`

**Code style**

- `const` and `let` — never `var`

- `===` and `!==` always; no Yoda conditions

- Arrow functions for callbacks; async/await over raw Promise chains

- Optional chaining (`?.`) and nullish coalescing (`??`) over manual
  null checks

- Early returns over deeply nested `if` blocks

- JSDoc type annotations on public API functions encouraged
