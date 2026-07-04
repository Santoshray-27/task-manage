import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ toast }) => {
  const { removeToast } = useContext(TaskContext);
  const { id, message, type } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={20} />;
      default:
        return <AlertCircle className="toast-icon info" size={20} />;
    }
  };

  return (
    <div className={`toast-item ${type}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={() => removeToast(id)} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useContext(TaskContext);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
