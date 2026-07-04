import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';

const TaskFilters = () => {
  const { filters, setFilters, openCreateModal } = useContext(TaskContext);
  
  // Local state for search input text (to support immediate typing)
  const [searchTerm, setSearchTerm] = useState(filters.search);
  
  // Debounce search term by 400ms
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Sync debounced search to global context filters
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleStatusChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setFilters({ priority: e.target.value });
  };

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'createdAt:desc',
      page: 1
    });
  };

  const isFiltered = filters.search !== '' || filters.status !== 'All' || filters.priority !== 'All';

  return (
    <div className="task-filters-section">
      <div className="filters-upper">
        <div className="search-box-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-task-btn" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="filters-lower">
        <div className="filter-controls-group">
          <div className="select-wrapper">
            <Filter className="select-icon" size={14} />
            <select 
              value={filters.status} 
              onChange={handleStatusChange}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="select-wrapper">
            <Filter className="select-icon" size={14} />
            <select 
              value={filters.priority} 
              onChange={handlePriorityChange}
              aria-label="Filter by Priority"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div className="select-wrapper">
            <ArrowUpDown className="select-icon" size={14} />
            <select 
              value={filters.sortBy} 
              onChange={handleSortChange}
              aria-label="Sort tasks by"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="dueDate:asc">Due Date: Soonest</option>
              <option value="dueDate:desc">Due Date: Latest</option>
            </select>
          </div>
        </div>

        {isFiltered && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
