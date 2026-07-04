import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const TaskList = () => {
  const { 
    tasks, 
    loading, 
    pagination, 
    filters, 
    setFilters, 
    updateTask, 
    selectedTaskIds, 
    clearSelection, 
    bulkUpdateStatus, 
    bulkDelete 
  } = useContext(TaskContext);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = ['Pending', 'In Progress', 'Completed'];

  const getColumnIcon = (col) => {
    switch (col) {
      case 'Completed':
        return <CheckCircle2 className="kanban-icon completed" size={18} />;
      case 'In Progress':
        return <Loader2 className="kanban-icon progress" size={18} />;
      default:
        return <Clock className="kanban-icon pending" size={18} />;
    }
  };

  const getColumnClass = (col) => {
    switch (col) {
      case 'Completed':
        return 'col-completed';
      case 'In Progress':
        return 'col-progress';
      default:
        return 'col-pending';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, col) => {
    e.preventDefault();
    setDraggedOverColumn(col);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await updateTask(taskId, { status: targetStatus });
    }
  };

  if (loading && tasks.length === 0) {
    return <SkeletonLoader count={filters.limit} />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  // Filter columns to render based on status filter
  const columnsToRender = filters.status === 'All'
    ? columns
    : [columns.find(col => col === filters.status) || filters.status];

  return (
    <div className="task-list-container">
      {/* Kanban Board Layout */}
      <div className={`kanban-board-container ${filters.status !== 'All' ? 'single-column-mode' : ''}`}>
        {columnsToRender.map((col) => {
          const colTasks = tasks.filter(task => task.status === col);
          
          return (
            <div
              key={col}
              className={`kanban-column ${getColumnClass(col)} ${draggedOverColumn === col ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, col)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col)}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title-group">
                  {getColumnIcon(col)}
                  <h3 className="kanban-column-title">{col}</h3>
                </div>
                <span className="kanban-column-count">{colTasks.length}</span>
              </div>

              <div className="kanban-cards-list">
                {colTasks.length === 0 ? (
                  <div className="kanban-column-empty">
                    <p>No tasks in this status</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-limit-selector">
            <span className="limit-label">Show per page:</span>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ limit: parseInt(e.target.value, 10), page: 1 })}
              className="limit-select"
              aria-label="Items per page"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setFilters({ page: pagination.page - 1 })}
              disabled={!pagination.hasPrevPage}
              title="Previous Page"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="pagination-info">
              Page <span className="current-page">{pagination.page}</span> of {pagination.totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => setFilters({ page: pagination.page + 1 })}
              disabled={!pagination.hasNextPage}
              title="Next Page"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="pagination-total-records">
            Total results: {pagination.total}
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedTaskIds.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-actions-content">
            <span className="bulk-count">
              <strong>{selectedTaskIds.length}</strong> tasks selected
            </span>
            <div className="bulk-buttons">
              <span className="bulk-label">Put in:</span>
              <button 
                className="bulk-action-btn move-pending"
                onClick={() => bulkUpdateStatus('Pending')}
              >
                Pending
              </button>
              <button 
                className="bulk-action-btn move-progress"
                onClick={() => bulkUpdateStatus('In Progress')}
              >
                In Progress
              </button>
              <button 
                className="bulk-action-btn move-completed"
                onClick={() => bulkUpdateStatus('Completed')}
              >
                Completed
              </button>
              <button 
                className="bulk-action-btn bulk-delete-btn"
                onClick={bulkDelete}
              >
                Delete Selected
              </button>
            </div>
            <button 
              className="bulk-cancel-btn"
              onClick={clearSelection}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
