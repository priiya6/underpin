# Submission notes

## What I'd test next if I had more time

I would add tests for malformed JSON, boundary values for pagination, and concurrent updates to the in-memory task list. I would also test how the API should behave when the process restarts, since all task data currently disappears.

## Anything that surprised me in the codebase

The API was small and straightforward, but pagination had an off-by-one error that caused page 1 to skip the first set of tasks. I also found that status filtering used partial matching, so an invalid value such as `do` could match `todo`.

## Questions I'd ask before shipping this to production

- Should tasks be stored in a database, and what persistence or migration requirements are expected?
- Who is allowed to update, complete, delete, or assign tasks, and what authentication or authorization rules apply?
- What monitoring, structured logging, and error-reporting requirements should the API meet in production?
