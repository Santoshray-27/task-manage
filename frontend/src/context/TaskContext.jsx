import React, { createContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // Task state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, Pending: 0, 'In Progress': 0, Completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Pagination state
  const [filters, setFiltersState] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    sortBy: 'createdAt:desc',
    page: 1,
    limit: 6
  });

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 6,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Modals state
  const [activeTask, setActiveTask] = useState(null); // Selected task for editing, null means create mode
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Selected Tasks for bulk actions
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Theme state (check localStorage or system settings)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Selection helpers
  const toggleSelectTask = (id) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedTaskIds([]);
  };

  const bulkUpdateStatus = async (targetStatus) => {
    setLoading(true);
    try {
      await Promise.all(selectedTaskIds.map(id => taskService.updateTask(id, { status: targetStatus })));
      showToast(`Moved ${selectedTaskIds.length} tasks to ${targetStatus}`, 'success');
      setSelectedTaskIds([]);
      fetchTasks();
      fetchStats();
    } catch (err) {
      showToast('Failed to update some tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedTaskIds.map(id => taskService.deleteTask(id)));
      showToast(`Deleted ${selectedTaskIds.length} tasks`, 'success');
      setSelectedTaskIds([]);
      fetchTasks();
      fetchStats();
    } catch (err) {
      showToast('Failed to delete some tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toast Helpers
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await taskService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Fetch Tasks based on current filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(filters);
      if (response.success) {
        setTasks(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
      showToast(err.response?.data?.message || 'Error fetching tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Run fetches when filters change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Set Filter Helper
  const setFilters = (newFilters) => {
    setFiltersState(prev => {
      // If query/status/priority changes, reset page back to 1
      const page = (newFilters.search !== undefined || newFilters.status !== undefined || newFilters.priority !== undefined)
        ? 1 
        : (newFilters.page || prev.page);

      return {
        ...prev,
        ...newFilters,
        page
      };
    });
  };

  // CRUD Operations
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await taskService.createTask(taskData);
      if (response.success) {
        showToast('Task created successfully!', 'success');
        setIsFormModalOpen(false);
        // Refresh items and stats
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create task.';
      showToast(errMsg, 'error');
      return { success: false, errors: err.response?.data?.errors || [] };
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const response = await taskService.updateTask(id, taskData);
      if (response.success) {
        showToast('Task updated successfully!', 'success');
        setIsFormModalOpen(false);
        setActiveTask(null);
        // Refresh items and stats
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update task.';
      showToast(errMsg, 'error');
      return { success: false, errors: err.response?.data?.errors || [] };
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        showToast('Task deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
        // Refresh items and stats
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete task.';
      showToast(errMsg, 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Modal Control helpers
  const openCreateModal = () => {
    setActiveTask(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (task) => {
    setActiveTask(task);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setActiveTask(null);
    setIsFormModalOpen(false);
  };

  const openDeleteConfirm = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirm = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        error,
        filters,
        pagination,
        activeTask,
        isFormModalOpen,
        isDeleteModalOpen,
        taskToDelete,
        selectedTaskIds,
        toasts,
        theme,
        toggleTheme,
        showToast,
        removeToast,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        openCreateModal,
        openEditModal,
        closeFormModal,
        openDeleteConfirm,
        closeDeleteConfirm,
        toggleSelectTask,
        clearSelection,
        bulkUpdateStatus,
        bulkDelete,
        refreshTasks: fetchTasks,
        refreshStats: fetchStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
