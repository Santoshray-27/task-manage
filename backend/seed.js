import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/builder-task-tracker';

const sampleTasks = [
  {
    title: 'Setup MongoDB Atlas Cluster',
    description: 'Create a shared M0 cluster on MongoDB Atlas, configure database user access, and whitelist IP boundaries.',
    status: 'Completed',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    title: 'Configure Node/Express Server Structure',
    description: 'Initialize backend project structure, set up MVC routing directories, configure global error interceptors, and CORS policies.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Build Drag and Drop Kanban Board UI',
    description: 'Implement native HTML5 draggable columns and cards. Connect react states to reflect drag changes instantly.',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Implement Multi-Select Task Operations',
    description: 'Add checkboxes to task headers. Build a sticky floating action panel to batch-update task statuses or delete them.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Write Jest API Route Integration Tests',
    description: 'Create test suites to validate express-validator boundaries, CRUD controller functionalities, and Mongoose indexing constraints.',
    status: 'Pending',
    priority: 'Low',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Prepare Project Production Deployment docs',
    description: 'Document env configurations, database indexes, Render backend specifications, and Vercel build parameters in the README.',
    status: 'Pending',
    priority: 'Low',
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Database connected successfully.');

    console.log('Cleaning up existing tasks...');
    await Task.deleteMany({});
    console.log('Database cleaned.');

    console.log('Seeding sample tasks...');
    await Task.insertMany(sampleTasks);
    console.log('Seeding completed successfully!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
