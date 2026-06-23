**Execution — npm Workflow · Node.js**

``` console
npm ci
```

Run tests:

``` console
npm test
```

Run only ESLint:

``` console
npm run lint
```

Check formatting (Prettier, non-destructive):

``` console
npm run format:check
```

**Pre-commit gate**

Run before every commit:

``` console
set -o pipefail
make ci 2>&1 | tee /tmp/ci.log; echo "EXIT:$?"
```

Auto-format source files:

``` console
npm run format
```

Run tests with coverage report:

``` console
npm run test:coverage
```
