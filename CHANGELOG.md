v0.2.3
------
- Update dependencies
- Behave better in projects that have Flow's `experimental.const_params`
  setting turned on

v0.2.2
------
- Fix bug where annotateField() did not work on missing keys

v0.2.1
------
- Declare library to be side effect free (to help optimize webpack v4 builds)

v0.2.0
------
**Breaking changes:** 

- Dropped support for annotating object keys

**New features:**

- Reworked the internal Annotation data structures to be more robust and
  type-safe
- Add new serializers optimized for web/JSON output.
  * For full inline annotated objects, use `serialize()`
  * For less verbose output (a list of errors and their locations, not the
    entire data structure echoed back), use `summarize()`
- 💯  100% code coverage achieved!


v0.1.0
------
Mark first version stable and production ready.


v0.0.1 - v0.0.9
---------------
Barely anything yet.
