<!-- THIS FILE IS AUTO-GENERATED. Edit AGENTS-source.adoc instead. -->

# Purpose

This repository is a fork of
[wikimedia/oojs-ui](https://github.com/wikimedia/oojs-ui). It adds a
custom OOUI theme named **SemanticCore** alongside the upstream themes.
The fork is maintained as a thin customization layer on top of upstream
releases.

# Repository Structure

The only files added or modified compared to upstream are:

| Path                               | Type     | Description                                                                                   |
|------------------------------------|----------|-----------------------------------------------------------------------------------------------|
| `src/themes/semanticcore/`         | new      | SemanticCore theme source (Less files)                                                        |
| `php/themes/SemanticCoreTheme.php` | new      | PHP theme class                                                                               |
| `Gruntfile.js`                     | modified | 1-line addition: `semanticcore: 'SemanticCore'` in the `themes` object                        |
| `package.json`                     | modified | Adds `gesinn-it-ui-base` dependency (custom Less variable base replacing `wikimedia-ui-base`) |

Everything else is unmodified upstream code.

## Patch-Based Theme Architecture

SemanticCore is a **minimal patch** on top of wikimediaui, not a full
copy. `src/themes/semanticcore/theme.less` is the authoritative
declaration of what we own:

``` less
@import 'common.less';      // our variables (gesinn-it-ui-base)
@import 'elements.less';    // our overrides (~55 changed lines)
@import 'layouts.less';     // managed copy of wikimediaui — no SemanticCore changes
@import 'tools.less';       // managed copy of wikimediaui — no SemanticCore changes
@import 'widgets.less';     // our overrides (~26 changed lines + compat fix)
@import 'windows.less';     // our overrides (1 changed line)
```

`layouts.less` and `tools.less` cannot import directly from
`../wikimediaui/` because Less resolves nested `@import 'common.less'`
relative to the wikimediaui/ directory, overriding our gesinn-it-ui-base
variable values. A drift-detection script guards these copies:
`scripts/check-theme-copies.sh`

Files imported from `../wikimediaui/` receive upstream changes
automatically on rebase. Only `elements.less`, `widgets.less`,
`windows.less`, and the 2 managed copies require manual review during
upgrades.

# Branch Model

    upstream/master  (wikimedia/oojs-ui — read-only reference remote)
         │
         ├─ v0.46.1 ─── v0.51.x ─── v0.53.x   (upstream tags, mirrored to fork master)
                  \
                   customizations branch
                   └── [1 squashed commit] feat(theme): add SemanticCore theme
                       tag: 0.46.1-1 / 0.51.x-1 / ...

- `master` mirrors a specific upstream tag exactly — no custom code
  lives here.

- `customizations` carries exactly **one squashed commit** on top of the
  upstream tag.

- Fork tags use the pattern `{upstream-version}-{patch}`, e.g.
  `0.51.2-1`. The patch counter increments only when the theme itself
  changes at the same upstream base.

# Build

Only two Grunt targets are needed for production artifacts:

``` bash
npm install
npx grunt build-styling   # produces dist/*-semanticcore.css + image copies
npx grunt build-code      # produces dist/oojs-ui-semanticcore.js
```

The `demos` target requires Composer and is not part of the production
build.

Produced dist files relevant for deployment:

- `dist/oojs-ui-core-semanticcore.css`

- `dist/oojs-ui-images-semanticcore.css`

- `dist/oojs-ui-toolbars-semanticcore.css`

- `dist/oojs-ui-widgets-semanticcore.css`

- `dist/oojs-ui-windows-semanticcore.css`

- `dist/oojs-ui-semanticcore.js` (+ `.js.map.json`)

- `dist/themes/semanticcore/images/` (icons and indicators)

# Upgrade Workflow

Run these steps when upgrading to a new upstream OOUI release:

## 1. Pre-Flight Assessment

``` bash
git fetch upstream

# Check for changes to files we touch
git diff v{old}..v{new} -- Gruntfile.js build/modules.js

# Check for variable changes in the base theme
git diff v{old}..v{new} -- src/themes/wikimediaui/common.less

# Check for new .less files added to wikimediaui (potential coverage gaps)
git diff v{old}..v{new} --name-status -- src/themes/wikimediaui/ | grep "^A.*\.less"

# Check if upstream bumped wikimedia-ui-base or switched to codex-design-tokens
git diff v{old}..v{new} -- package.json | grep -E "wikimedia-ui-base|codex-design-tokens"
```

## 2. Rebase

``` bash
git checkout customizations
git rebase v{new}
# Expected conflicts: Gruntfile.js (re-apply 1-line addition) and package.json (re-apply gesinn-it-ui-base)
```

## 3. Check Managed Copies for Drift

``` bash
bash scripts/check-theme-copies.sh
```

If drift is reported: copy the upstream file over the semanticcore copy,
restore the header comment block, then re-run to confirm.

## 4. Build Gate (mandatory before tagging)

``` bash
npm install
npx grunt build-styling build-code 2>&1 | grep -E "error|Error|Done"
```

A Less compilation error means a variable was renamed or removed
upstream. Inspect the error, find the variable in
`src/themes/wikimediaui/common.less`, and update
`src/themes/semanticcore/common.less` accordingly.

## 5. Gap Detection Checklist

After the build succeeds, check manually:

1.  **New Less files in wikimediaui** — new files = new widget families:

    ``` bash
    git diff v{old}..v{new} --name-status -- src/themes/wikimediaui/ | grep "^A.*\.less"
    ```

2.  **New icon JSON manifests** — new icons have no SVG in semanticcore
    and will fall back or be invisible:

    ``` bash
    git diff v{old}..v{new} --name-status -- src/themes/wikimediaui/ | grep "^A.*icons.*\.json"
    ```

3.  **CSS class renames** — rare but possible. Cross-check `History.md`
    entries mentioning "rename" or "class".

4.  **Visual smoke test** — open a MediaWiki page with forms, dialogs,
    toolbars, and dropdowns after deployment.

## 6. Tag and Push

``` bash
git tag {new-version}-1
git push origin customizations --tags
```

# Tagging and Release Convention

- Tag format: `{upstream-semver}-{N}` where N starts at 1, e.g.
  `0.51.2-1`

- Increment N (e.g. `0.51.2-2`) when theme-only changes are made without
  an upstream bump

- Squashed customizations commit message:
  `feat(theme): add SemanticCore theme`

- Version bump commits: `prepared x.y.z-N [skip ci]`

# Key Dependency: gesinn-it-ui-base

`src/themes/semanticcore/common.less` imports from
`gesinn-it-ui-base/wikimedia-ui-base.less` instead of the upstream
`wikimedia-ui-base` package:

``` less
@import ( reference ) '../../../node_modules/gesinn-it-ui-base/wikimedia-ui-base.less';
```

Starting with upstream v0.51.x, `wikimedia-ui-base` was replaced by
`@wikimedia/codex-design-tokens`. Before upgrading to any upstream
version that drops `wikimedia-ui-base`, verify that `gesinn-it-ui-base`
provides the required Less variables, or update `common.less` to import
from codex-design-tokens instead.

# Commit Convention

# Conventional Commits Policy

**Commit Convention — Conventional Commits**

Commit messages follow the [Conventional Commits
specification](https://www.conventionalcommits.org/).

Commit format:

`type(scope): short description`

The scope is optional and should describe the affected subsystem,
module, or dependency when useful.

Examples:

- feat(api): add autocomplete endpoint

- fix(parser): handle empty token lists

- docs(readme): explain input architecture

- refactor(parser): simplify token parsing

- deps(smw): bump from 5.1.0 to 5.2.0

- ci(github): update workflow configuration

- test(api): add autocomplete tests

Recommended commit types:

- `feat` — new functionality

- `fix` — bug fixes

- `deps` — dependency updates

- `docs` — documentation changes

- `refactor` — internal code changes without behavioral change

- `test` — tests added or updated

- `ci` — changes to continuous integration configuration

- `chore` — repository maintenance tasks without impact on runtime
  behavior

Dependency updates:

- Use the `deps` type for dependency upgrades

- The scope should identify the dependency being updated

- Include the version change when applicable

Example:

- deps(smw): bump from 5.1.0 to 5.2.0

Guidelines:

- Use the imperative mood (e.g. "add feature", not "added feature")

- Keep the subject line concise

- Use the commit body to explain **why**, not only **what**

- Scopes should be short, lowercase identifiers (e.g. `api`, `parser`,
  `smw`, `mediawiki`, `docker`)

- Use `chore` only for repository maintenance tasks that do not affect
  runtime behavior, dependencies, CI configuration, or tests

- Do **not** add a `Co-Authored-By:` trailer or any agent attribution
  line to the commit message

Changelog:

- After committing a `feat`, `fix`, `deps`, `refactor`, or `docs`
  change, add a corresponding entry to the `[Unreleased]` section of
  `CHANGELOG.md` — do not wait until release time.

# Versioning

# Versioning and Releases

**Versioning Convention — Semantic Versioning**

This project follows [Semantic Versioning](https://semver.org/).

Version numbers follow the format:

`MAJOR.MINOR.PATCH`

Version increment rules:

- MAJOR — incompatible or breaking changes

- MINOR — backwards-compatible feature additions

- PATCH — backwards-compatible bug fixes

Breaking changes include (but are not limited to):

- incompatible API changes

- removal or renaming of public interfaces

- behavior changes that may break existing integrations

- increased minimum runtime or dependency requirements

- incompatible configuration or data format changes

- dependency upgrades that introduce breaking changes for users

Breaking changes must always increment the MAJOR version.
