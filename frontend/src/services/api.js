const LOCAL_STORAGE_KEY = 'builder_tasks_db';
const MIGRATION_KEY = 'builder_db_two_tasks_v2';

// One-time database seed/migration to pre-populate exactly two example tasks
if (!localStorage.getItem(MIGRATION_KEY)) {
  const initialTasks = [
    {
      _id: 'local_init_1',
      title: 'example 1 : something...',
      description: 'A pre-configured example task to demonstrate the Kanban card functionality.',
      status: 'Pending',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'local_init_2',
      title: 'ex2: saf',
      description: 'A second pre-configured example task for verifying board status changes and drag triggers.',
      status: 'In Progress',
      priority: 'Low',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
  localStorage.setItem(MIGRATION_KEY, 'true');
}

// Simulated Network Latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalTasks = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const defaultTasks = [
      {
        _id: 'local_init_1',
        title: 'example 1 : something...',
        description: 'A pre-configured example task to demonstrate the Kanban card functionality.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'local_init_2',
        title: 'ex2: saf',
        description: 'A second pre-configured example task for verifying board status changes and drag triggers.',
        status: 'In Progress',
        priority: 'Low',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
  }
  return JSON.parse(data);
};

const saveLocalTasks = (tasks) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  // Fetch all tasks with filters, search, sorting, and pagination locally
  getTasks: async (params = {}) => {
    await delay(150); // Simulate API call overhead
    let filteredTasks = getLocalTasks();

    // 1. Full-text / Query search (title & description)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        task => 
          (task.title && task.title.toLowerCase().includes(searchLower)) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // 2. Status filter
    if (params.status && params.status !== 'All') {
      filteredTasks = filteredTasks.filter(task => task.status === params.status);
    }

    // 3. Priority filter
    if (params.priority && params.priority !== 'All') {
      filteredTasks = filteredTasks.filter(task => task.priority === params.priority);
    }

    // 4. Sorting logic
    if (params.sortBy) {
      const [field, order] = params.sortBy.split(':');
      const multiplier = order === 'desc' ? -1 : 1;

      filteredTasks.sort((a, b) => {
        let valA = a[field] || '';
        let valB = b[field] || '';

        // Handle string date parsing comparison
        if (field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
          return (new Date(valA) - new Date(valB)) * multiplier;
        }

        if (typeof valA === 'string') {
          return valA.localeCompare(valB) * multiplier;
        }
        return (valA - valB) * multiplier;
      });
    }

    // 5. Pagination
    const totalRecords = filteredTasks.length;
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 6;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedTasks,
      pagination: {
        total: totalRecords,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  // Fetch a single task by ID
  getTaskById: async (id) => {
    await delay(100);
    const tasks = getLocalTasks();
    const task = tasks.find(t => t._id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { success: true, data: task };
  },

  // Create a new task
  createTask: async (taskData) => {
    await delay(150);
    const tasks = getLocalTasks();
    const newTask = {
      ...taskData,
      _id: 'local_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveLocalTasks(tasks);
    return { success: true, data: newTask };
  },

  // Update a task by ID
  updateTask: async (id, taskData) => {
    await delay(150);
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    tasks[index] = updatedTask;
    saveLocalTasks(tasks);
    return { success: true, data: updatedTask };
  },

  // Delete a task by ID
  deleteTask: async (id) => {
    await delay(150);
    const tasks = getLocalTasks();
    const filteredTasks = tasks.filter(t => t._id !== id);
    saveLocalTasks(filteredTasks);
    return { success: true, message: 'Task deleted successfully' };
  },

  // Get task summary statistics
  getStats: async () => {
    await delay(100);
    const tasks = getLocalTasks();
    
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const progress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    return {
      success: true,
      data: {
        total,
        Pending: pending,
        'In Progress': progress,
        Completed: completed
      }
    };
  }
};

export default taskService;
