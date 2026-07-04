import React from 'react';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/common/Navbar';
import StatsDashboard from './components/dashboard/StatsDashboard';
import TaskFilters from './components/tasks/TaskFilters';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import DeleteConfirmModal from './components/tasks/DeleteConfirmModal';
import { ToastContainer } from './components/common/Toast';

function AppContent() {
  return (
    <div className="app-container">
      {/* Dynamic Header Navbar */}
      <Navbar />

      {/* Main Workspace */}
      <main className="main-content">
        {/* Dashboard Statistics */}
        <StatsDashboard />

        {/* Filters, Search & Add Task Action Panel */}
        <TaskFilters />

        {/* Task Cards Display Grid */}
        <TaskList />
      </main>

      {/* Task Creation & Update Modal overlay */}
      <TaskForm />

      {/* Deletion Confirmation Guard */}
      <DeleteConfirmModal />

      {/* Dynamic Alert Messages */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
