# Run the project on Windows

## Prerequisites

- Node.js 18 or newer
- VS Code with the extracted project folder open
- PowerShell

## Install and run

Open the VS Code terminal (`Terminal > New Terminal`) and run:

```powershell
cd task-api
npm install
npm start
```

The API runs at `http://localhost:3000`. Leave this terminal running. Use a second terminal for tests or requests.

## Tests and coverage

From the `task-api` folder:

```powershell
npm test
npm run coverage
```

The test command runs the unit and Supertest integration suites. Coverage is written to `task-api\coverage`; the summary is also printed in the terminal. The current suite has 11 passing tests and 94.37% overall statement coverage.

## Try the API in PowerShell

Create a task and save its ID from the response:

```powershell
$task = Invoke-RestMethod -Method Post -Uri http://localhost:3000/tasks -ContentType 'application/json' -Body '{"title":"Write tests","priority":"high"}'
$task.id
```

Then try the endpoints:

```powershell
Invoke-RestMethod http://localhost:3000/tasks
Invoke-RestMethod 'http://localhost:3000/tasks?status=todo'
Invoke-RestMethod 'http://localhost:3000/tasks?page=1&limit=10'
Invoke-RestMethod -Method Put -Uri "http://localhost:3000/tasks/$($task.id)" -ContentType 'application/json' -Body '{"title":"Updated title"}'
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/tasks/$($task.id)/assign" -ContentType 'application/json' -Body '{"assignee":"Priya"}'
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/tasks/$($task.id)/complete"
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/tasks/$($task.id)"
Invoke-RestMethod http://localhost:3000/tasks/stats
```

Assignment expects a non-empty string. For example, `{ "assignee": "Priya" }` is valid; an empty string returns HTTP 400. Unknown task IDs return HTTP 404. DELETE succeeds with HTTP 204 and no response body.

## Troubleshooting

- If `npm` is not recognized, install Node.js 18+ and reopen VS Code.
- If port 3000 is busy, stop the other process or run `$env:PORT=3001; npm start`, then use `http://localhost:3001`.
- If Jest is not recognized, run `npm install` from `task-api` and retry.
- The data store is in memory, so restarting the server removes all tasks.
