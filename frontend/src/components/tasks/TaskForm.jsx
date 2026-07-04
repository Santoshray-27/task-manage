import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { formatDateForInput } from '../../utils/helpers';
import { X, Save, AlertCircle } from 'lucide-react';

const TaskForm = () => {
  const { activeTask, isFormModalOpen, closeFormModal, createTask, updateTask, loading } = useContext(TaskContext);

  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  // Field-level validation errors state (both client & server errors)
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync form state when activeTask changes (edit vs create mode)
  useEffect(() => {
    if (activeTask) {
      setTitle(activeTask.title || '');
      setDescription(activeTask.description || '');
      setStatus(activeTask.status || 'Pending');
      setPriority(activeTask.priority || 'Medium');
      setDueDate(formatDateForInput(activeTask.dueDate));
    } else {
      // Clear form for create mode
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      
      // Default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(formatDateForInput(tomorrow));
    }
    setFieldErrors({});
  }, [activeTask, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  // Client-side validations
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Task title is required';
    } else if (title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    if (!dueDate) {
      errors.dueDate = 'Due date is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate
    };

    let result;
    if (activeTask) {
      result = await updateTask(activeTask._id, taskData);
    } else {
      result = await createTask(taskData);
    }

    // If server validation failed, map the errors back to inputs
    if (result && !result.success && result.errors) {
      const serverErrorsObj = {};
      result.errors.forEach(err => {
        serverErrorsObj[err.field] = err.message;
      });
      setFieldErrors(serverErrorsObj);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeFormModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {activeTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="modal-close-btn" onClick={closeFormModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">Title</label>
            <input
              type="text"
              id="title"
              className={`form-input ${fieldErrors.title ? 'input-error' : ''}`}
              placeholder="e.g., Implement OAuth Authentication"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors(prev => ({ ...prev, title: null }));
              }}
              required
            />
            {fieldErrors.title && (
              <span className="field-error-msg">
                <AlertCircle size={12} />
                {fieldErrors.title}
              </span>
            )}
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              rows="3"
              className={`form-input textarea ${fieldErrors.description ? 'input-error' : ''}`}
              placeholder="Provide context and notes for this task..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) setFieldErrors(prev => ({ ...prev, description: null }));
              }}
            />
            {fieldErrors.description && (
              <span className="field-error-msg">
                <AlertCircle size={12} />
                {fieldErrors.description}
              </span>
            )}
          </div>

          <div className="form-row">
            {/* Status Dropdown */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className="form-input select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                className="form-input select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due Date Input */}
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label required">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className={`form-input ${fieldErrors.dueDate ? 'input-error' : ''}`}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (fieldErrors.dueDate) setFieldErrors(prev => ({ ...prev, dueDate: null }));
              }}
              required
            />
            {fieldErrors.dueDate && (
              <span className="field-error-msg">
                <AlertCircle size={12} />
                {fieldErrors.dueDate}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeFormModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : activeTask ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
