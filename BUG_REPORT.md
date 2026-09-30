# Bug report

## 1. Page-one pagination skipped the first page

- **Location:** `src/services/taskService.js`, `getPaginated`.
- **Expected:** `page=1&limit=2` returns the first two tasks.
- **Actual:** The offset was calculated as `page * limit`, so page 1 started at index 2.
- **Discovery:** The pagination unit/integration test created two tasks and checked the page-one result.
- **Fix:** Calculate the zero-based offset as `(page - 1) * limit`.

## 2. Status filtering matched partial values

- **Location:** `src/services/taskService.js`, `getByStatus`.
- **Expected:** A status filter matches one valid status exactly; an invalid status should not return tasks.
- **Actual:** `status.includes(...)` caused a value such as `do` to match `todo`.
- **Discovery:** The service test checked that `getByStatus('do')` returns no tasks.
- **Suggested fix:** Compare statuses with strict equality. This fix is included.

## 3. Invalid pagination values were silently accepted

- **Location:** `src/routes/tasks.js`, paginated `GET /tasks` branch.
- **Expected:** Page and limit should be positive integers, with a clear 400 response for invalid values.
- **Actual:** `parseInt(...) || default` converted values such as `page=abc` to page 1 and accepted zero/negative values.
- **Discovery:** Integration tests exercised invalid page and limit values.
- **Suggested fix:** Validate positive integer query parameters before calling the service. This fix is included.

## Assignment design decision

`PATCH /tasks/:id/assign` accepts a trimmed, non-empty string. Reassignment is allowed and replaces the previous assignee, which keeps the endpoint simple and predictable. Unknown IDs return 404 and invalid request bodies return 400.
