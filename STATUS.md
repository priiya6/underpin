# Project status

## Current project status

Complete locally. The exact `npm test` and `npm run coverage` commands pass. The project is not connected to a local Git repository; no GitHub push has been performed.

## Files inspected

- `package.json`, `package-lock.json`, `jest.config.js`
- `src/app.js`
- `src/routes/tasks.js`
- `src/services/taskService.js`
- `src/utils/validators.js`
- `README.md`, `ASSIGNMENT.md`

## Completed tasks

- Installed the existing npm dependencies.
- Added unit tests for `taskService.js`.
- Added Supertest integration tests for every required endpoint.
- Added and tested `PATCH /tasks/:id/assign`.
- Added validation for assignment, status filters, and pagination values.
- Updated the existing Jest scripts to run serially so the standard commands work in this restricted Windows environment.
- Created `BUG_REPORT.md` and `RUN_PROJECT.md`.

## Tasks remaining

- Commit and push the completed project to `https://github.com/priiya6/underpin` manually, unless Git metadata/authentication is provided.
- Add a live deployment only if desired; local assignment requirements are complete.

## Bugs discovered

- Page-one pagination skipped the first `limit` tasks.
- Status filtering matched partial values.
- Invalid pagination values were silently coerced to defaults.

Details are in `BUG_REPORT.md`.

## Bugs fixed

- Fixed pagination offset to use `(page - 1) * limit`.
- Changed status filtering to exact equality.
- Added 400 validation for non-positive or non-integer page/limit values.

## Tests written and results

- `tests/taskService.test.js`: service behavior, pagination regression, stats, update/remove, completion, assignment.
- `tests/tasks.integration.test.js`: all required routes, validation, unknown IDs, and reassignment.
- Result: **2 suites passed, 11 tests passed** with `npm test`.

## Coverage results

`npm run coverage`: **94.37% statements, 88.29% branches, 93.33% functions, 93.83% lines**.

## Current errors and debugging attempts

- The first test run failed because dependencies were not installed. Running `npm install` initially hit an offline cache miss for `uuid`; retrying with network access installed the declared dependencies successfully.
- Plain Jest initially failed with `spawn EPERM` when it attempted worker processes. The existing npm scripts now pass `--runInBand`, and the exact documented commands pass.
- npm reported existing deprecation/audit warnings; no dependency upgrade was needed for this assignment.

## Exact next steps

1. Review the changed files and `BUG_REPORT.md`.
2. If submitting to GitHub, initialize/connect Git without overwriting history, then commit and push the project.
