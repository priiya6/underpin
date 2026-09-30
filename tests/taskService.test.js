const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => taskService._reset());

  test('creates and finds a task, and returns a copy from getAll', () => {
    const task = taskService.create({ title: 'Write tests' });

    expect(task.title).toBe('Write tests');
    expect(task.status).toBe('todo');
    expect(taskService.findById(task.id)).toEqual(task);
    expect(taskService.getAll()).toEqual([task]);
    expect(taskService.getAll()).not.toBe(taskService.getAll());
  });

  test('filters by exact status and paginates from page one', () => {
    taskService.create({ title: 'First', status: 'todo' });
    taskService.create({ title: 'Second', status: 'in_progress' });
    taskService.create({ title: 'Third', status: 'todo' });

    expect(taskService.getByStatus('todo').map((task) => task.title)).toEqual(['First', 'Third']);
    expect(taskService.getByStatus('do')).toEqual([]);
    expect(taskService.getPaginated(1, 2).map((task) => task.title)).toEqual(['First', 'Second']);
    expect(taskService.getPaginated(2, 2).map((task) => task.title)).toEqual(['Third']);
  });

  test('updates and removes tasks, returning null or false for unknown IDs', () => {
    const task = taskService.create({ title: 'Original' });
    expect(taskService.update(task.id, { priority: 'high' }).priority).toBe('high');
    expect(taskService.update('missing', { title: 'Nope' })).toBeNull();
    expect(taskService.remove(task.id)).toBe(true);
    expect(taskService.remove(task.id)).toBe(false);
  });

  test('completes and assigns a task, including reassignment', () => {
    const task = taskService.create({ title: 'Ship assignment', priority: 'high' });
    const completed = taskService.completeTask(task.id);
    expect(completed).toMatchObject({ status: 'done', priority: 'medium' });
    expect(completed.completedAt).toEqual(expect.any(String));
    expect(taskService.completeTask('missing')).toBeNull();

    expect(taskService.assignTask(task.id, 'Priya')).toMatchObject({ assignee: 'Priya' });
    expect(taskService.assignTask(task.id, 'Alex')).toMatchObject({ assignee: 'Alex' });
    expect(taskService.assignTask('missing', 'Alex')).toBeNull();
  });

  test('calculates status counts and overdue tasks', () => {
    taskService.create({ title: 'Todo', dueDate: '2000-01-01' });
    taskService.create({ title: 'Progress', status: 'in_progress' });
    taskService.create({ title: 'Done', status: 'done', dueDate: '2000-01-01' });

    expect(taskService.getStats()).toEqual({ todo: 1, in_progress: 1, done: 1, overdue: 1 });
  });
});
