import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { taskCreateValidator, taskUpdateValidator } from '../middleware/validator.js';

const router = express.Router();

// Stats summary route (must be defined BEFORE :id)
router.get('/stats/summary', getTaskStats);

// GET all tasks & POST create task
router.route('/')
  .get(getAllTasks)
  .post(taskCreateValidator, createTask);

// GET, PUT, DELETE task by ID
router.route('/:id')
  .get(getTaskById)
  .put(taskUpdateValidator, updateTask)
  .delete(deleteTask);

export default router;
