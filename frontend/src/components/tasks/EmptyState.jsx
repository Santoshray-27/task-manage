import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { FileQuestion, Plus, XOctagon } from 'lucide-react';

const EmptyState = () => {
  const { filters, setFilters, openCreateModal } = useContext(TaskContext);

  const isFiltered = filters.search !== '' || filters.status !== 'All' || filters.priority !== 'All';

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'createdAt:desc',
      page: 1
    });
  };

  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-wrapper">
        {isFiltered ? (
          <XOctagon size={48} className="empty-icon warning" />
        ) : (
          <FileQuestion size={48} className="empty-icon primary" />
        )}
      </div>
      
      <h3 className="empty-state-title">
        {isFiltered ? 'No matching tasks found' : 'Your task board is empty'}
      </h3>
      
      <p className="empty-state-description">
        {isFiltered 
          ? 'Try adjusting your filters or search terms to locate the task.' 
          : 'Get started by creating your first task to track progress and prioritize workload.'
        }
      </p>

      <div className="empty-state-actions">
        {isFiltered ? (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        ) : (
          <button className="add-task-btn" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Create your first task</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
