const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('task API', () => {
  beforeEach(() => taskService._reset());

  const createTask = (overrides = {}) => request(app).post('/tasks').send({ title: 'Test task', ...overrides });

  test('lists tasks, filters by status, paginates, and returns stats', async () => {
    await createTask({ status: 'todo' });
    await createTask({ title: 'In progress', status: 'in_progress' });

    expect((await request(app).get('/tasks')).status).toBe(200);
    expect((await request(app).get('/tasks?status=todo')).body).toHaveLength(1);
    expect((await request(app).get('/tasks?page=1&limit=1')).body).toHaveLength(1);
    expect((await request(app).get('/tasks/stats')).body).toMatchObject({ todo: 1, in_progress: 1, done: 0 });
  });

  test('rejects invalid status and pagination values', async () => {
    expect((await request(app).get('/tasks?status=unknown')).status).toBe(400);
    expect((await request(app).get('/tasks?page=0&limit=10')).status).toBe(400);
    expect((await request(app).get('/tasks?page=abc')).status).toBe(400);
  });

  test('creates and updates a task', async () => {
    const created = await createTask({ description: 'A description' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ title: 'Test task', description: 'A description' });

    const updated = await request(app).put(`/tasks/${created.body.id}`).send({ title: 'Updated', priority: 'high' });
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ title: 'Updated', priority: 'high' });
    expect((await request(app).put('/tasks/missing')).status).toBe(404);
  });

  test('rejects invalid create and update input', async () => {
    expect((await request(app).post('/tasks').send({ title: ' ' })).status).toBe(400);
    expect((await request(app).post('/tasks').send({ title: 'Bad', status: 'unknown' })).status).toBe(400);
    expect((await request(app).put('/tasks/missing').send({ title: '' })).status).toBe(400);
  });

  test('completes and deletes tasks, including unknown IDs', async () => {
    const created = await createTask({ priority: 'high' });
    const completed = await request(app).patch(`/tasks/${created.body.id}/complete`);
    expect(completed.status).toBe(200);
    expect(completed.body).toMatchObject({ status: 'done', priority: 'medium' });
    expect((await request(app).patch('/tasks/missing/complete')).status).toBe(404);

    expect((await request(app).delete(`/tasks/${created.body.id}`)).status).toBe(204);
    expect((await request(app).delete('/tasks/missing')).status).toBe(404);
  });

  test('assigns, validates, and reassigns a task', async () => {
    const created = await createTask();
    const path = `/tasks/${created.body.id}/assign`;

    const assigned = await request(app).patch(path).send({ assignee: ' Priya ' });
    expect(assigned.status).toBe(200);
    expect(assigned.body.assignee).toBe('Priya');

    const reassigned = await request(app).patch(path).send({ assignee: 'Alex' });
    expect(reassigned.status).toBe(200);
    expect(reassigned.body.assignee).toBe('Alex');
    expect((await request(app).patch(path).send({ assignee: ' ' })).status).toBe(400);
    expect((await request(app).patch(path).send({ assignee: 42 })).status).toBe(400);
    expect((await request(app).patch('/tasks/missing/assign').send({ assignee: 'Alex' })).status).toBe(404);
  });
});
