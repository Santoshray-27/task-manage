import Task from '../models/Task.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Public
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate
    });

    return sendSuccess(res, 'Task created successfully', task, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with filtering, search, sorting, and pagination
 * @route   GET /api/v1/tasks
 * @access  Public
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, page = 1, limit = 10 } = req.query;

    // Convert pagination parameters to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search by title or description (regex partial match, case insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort options
    let sort = { createdAt: -1 }; // default sorting: newest first
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort = { [field]: order === 'desc' ? -1 : 1 };
    }

    // Fetch tasks & total count
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    return sendPaginated(res, 'Tasks fetched successfully', tasks, pageNum, limitNum, total);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single task
 * @route   GET /api/v1/tasks/:id
 * @access  Public
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    return sendSuccess(res, 'Task details fetched successfully', task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/v1/tasks/:id
 * @access  Public
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    return sendSuccess(res, 'Task updated successfully', updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Public
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    await task.deleteOne();

    return sendSuccess(res, 'Task deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks summary statistics
 * @route   GET /api/v1/tasks/stats/summary
 * @access  Public
 */
export const getTaskStats = async (req, res, next) => {
  try {
    // Run an aggregation to count status distributions
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats for easy consumption on frontend
    const formatStats = {
      total: 0,
      Pending: 0,
      'In Progress': 0,
      Completed: 0
    };

    stats.forEach(item => {
      formatStats[item._id] = item.count;
      formatStats.total += item.count;
    });

    return sendSuccess(res, 'Task statistics fetched successfully', formatStats);
  } catch (error) {
    next(error);
  }
};
