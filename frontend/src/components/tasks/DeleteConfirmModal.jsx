import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = () => {
  const { isDeleteModalOpen, taskToDelete, closeDeleteConfirm, deleteTask, loading } = useContext(TaskContext);

  if (!isDeleteModalOpen || !taskToDelete) return null;

  const handleDelete = async () => {
    await deleteTask(taskToDelete._id);
  };

  return (
    <div className="modal-overlay" onClick={closeDeleteConfirm}>
      <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title delete-title">Confirm Deletion</h2>
          <button className="modal-close-btn" onClick={closeDeleteConfirm} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body delete-body">
          <div className="warning-icon-container">
            <AlertTriangle className="warning-icon" size={32} />
          </div>
          <div className="delete-message-content">
            <p className="delete-warning-text">
              Are you sure you want to delete this task? This action is permanent and cannot be undone.
            </p>
            <div className="delete-task-info">
              <span className="delete-task-label">Task to delete:</span>
              <span className="delete-task-title">{taskToDelete.title}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions delete-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeDeleteConfirm}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={16} />
            <span>{loading ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
