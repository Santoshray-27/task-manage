import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { formatDisplayDate, isOverdue } from '../../utils/helpers';
import { Calendar, Edit, Trash2, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const TaskCard = ({ task }) => {
  const { openEditModal, openDeleteConfirm, updateTask, selectedTaskIds, toggleSelectTask } = useContext(TaskContext);
  const { _id, title, description, status, priority, dueDate } = task;

  const overdue = isOverdue(dueDate, status);
  const isSelected = selectedTaskIds.includes(_id);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    await updateTask(_id, { status: newStatus });
  };

  // Get status color classes
  const getStatusClass = (taskStatus) => {
    switch (taskStatus) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  };

  // Get priority color classes
  const getPriorityClass = (taskPriority) => {
    switch (taskPriority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', _id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div 
      className={`task-card ${overdue ? 'card-overdue' : ''} ${isSelected ? 'card-selected' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-card-header">
        <div className="task-card-header-left">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => toggleSelectTask(_id)}
            onClick={(e) => e.stopPropagation()}
            className="card-checkbox"
            aria-label={`Select task ${title}`}
          />
          <span className={`priority-badge ${getPriorityClass(priority)}`}>
            {priority} Priority
          </span>
        </div>
        <div className="task-card-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => openEditModal(task)}
            title="Edit Task"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => openDeleteConfirm(task)}
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-card-body">
        <h3 className="task-card-title">{title}</h3>
        <p className="task-card-description">
          {description || <span className="no-description">No description provided.</span>}
        </p>
      </div>

      <div className="task-card-footer">
        <div className={`task-due-date ${overdue ? 'overdue' : ''}`} title={overdue ? 'Task is overdue!' : 'Due Date'}>
          {overdue ? <AlertTriangle size={14} className="overdue-icon" /> : <Calendar size={14} />}
          <span>{formatDisplayDate(dueDate)}</span>
        </div>

        <div className="task-status-selector">
          {status === 'Completed' ? (
            <CheckCircle size={14} className="status-quick-icon completed" />
          ) : (
            <Clock size={14} className="status-quick-icon pending" />
          )}
          <select 
            value={status} 
            onChange={handleStatusChange}
            className={`status-select-inline ${getStatusClass(status)}`}
            aria-label="Change status inline"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
