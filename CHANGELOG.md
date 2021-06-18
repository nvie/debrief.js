## v1.5.0

-   Drop support for Node 13.x (unstable)
-   Add support for Flow 0.153.x

## v1.4.3

-   Include an error code with every FlowFixMe suppression (Flow 0.132.x
    compatibility)

## v1.4.2

-   Republication of 1.4.1 as 1.4.2

## v1.4.1

-   Fix compatibility with standardized `$FlowFixMe` syntax format (since Flow
    0.127.0)

## v1.4.0

-   Fix bug where self-referential structures would cause infinite recursion when
    being annotated

-   **Breaking changes**
    -   Removed from public API:
        -   `annotateField()`
        -   `annotatePairs()`
    -   Remove internal `hasAnnotation` field from Annotation types

## v1.3.0

-   Fix bug when Flow setting `exact_by_default` is enabled

## v1.2.9

-   Fix bug introduced in v1.2.8 for TypeScript users trying to import from
    submodules, like 'debrief/ast'.

## v1.2.8

-   Improved TypeScript setup
    -   Added TypeScript linter (`dtslint`)
    -   Reorganization of TypeScript declarations

## v1.2.7

-   Fix serialization of values that are or include functions. Thanks,
    @ebuckthal!

## v1.2.6

-   Fix minor implementation detail that caused Flow issues since 0.101.1

## v1.2.5

-   New build system
-   Cleaner package output

## v1.2.4

-   Minor: make Flow lint overrides less intrusive

## v1.2.3

-   Fix bug where invalid dates were not accurately serialized
    (e.g. new Date('not a date'))

## v1.2.2

-   Don't expose private helper function (fixes a TypeScript bug)

## v1.2.1

-   Drop dependency on babel-runtime to reduce bundle size

## v1.2.0

-   Add TypeScript support

## v1.1.0

-   Drop support for Node 7

## v1.0.0

-   Make debrief.js fully [Flow Strict](https://flow.org/en/docs/strict/)
-   Bump to 1.0.0 to indicate stability

## v0.2.3

-   Update dependencies
-   Behave better in projects that have Flow's `experimental.const_params`
    setting turned on

## v0.2.2

-   Fix bug where annotateField() did not work on missing keys

## v0.2.1

-   Declare library to be side effect free (to help optimize webpack v4 builds)

## v0.2.0

**Breaking changes:**

-   Dropped support for annotating object keys

**New features:**

-   Reworked the internal Annotation data structures to be more robust and
    type-safe
-   Add new serializers optimized for web/JSON output.
    -   For full inline annotated objects, use `serialize()`
    -   For less verbose output (a list of errors and their locations, not the
        entire data structure echoed back), use `summarize()`
-   💯 100% code coverage achieved!

## v0.1.0

Mark first version stable and production ready.

## v0.0.1 - v0.0.9

Barely anything yet.
