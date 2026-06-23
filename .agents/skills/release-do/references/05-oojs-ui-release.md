**Project-Specific Override — OOUI SemanticCore Fork**

The general release procedure above applies with the following
differences. These rules take precedence in all cases of conflict.

**This is a fork, not a standalone project.** The version number is
always `{upstream-semver}-{N}` (e.g. `0.51.2-1`), not plain SemVer. The
SemVer rules from the general procedure do **not** apply to version
bumping here.

**Version number rules:**

- The upstream part (`{upstream-semver}`) mirrors the upstream OOUI tag
  the `customizations` branch is rebased onto.

- `N` starts at `1` and increments only when the SemanticCore theme
  itself changes without an upstream base change.

- Example progression: `0.51.2-1` → `0.51.2-2` (theme fix, same base) →
  `0.53.1-1` (rebased onto upstream v0.53.1).

**Branch model:**

- Releases are always tagged from the `customizations` branch.

- `master` mirrors a specific upstream tag exactly — no custom code
  lives there.

- There is exactly **one squashed commit** on `customizations` on top of
  the upstream base: `feat(theme): add SemanticCore theme`.

**Version file:**

- There is no version file to bump. The version is expressed only via
  the git tag.

- Skip the "bump version file" step from the general procedure entirely.

**CHANGELOG:**

- Update `CHANGELOG.md` as usual, but use the fork tag format in
  headings and compare links (e.g. `[0.51.2-1]`).

**Build gate — mandatory before tagging:**

Run the build and confirm it succeeds before creating the tag:

``` console
npm install
npx grunt build-styling build-code 2>&1 | grep -E "error|Error|Done"
```

A Less compilation error means a variable was renamed upstream. Do not
tag until the build is green.

**Tagging and pushing:**

``` console
git tag {upstream-semver}-{N}
git push origin customizations --tags
```

**GitHub release:**

``` console
gh release create {upstream-semver}-{N} --title "{upstream-semver}-{N}" --notes "<approved changelog section>"
```
