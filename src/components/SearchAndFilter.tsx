import React from 'react';
import { Priority } from '../types';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
  dueDateFilter: string;
  onDueDateFilterChange: (date: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  dueDateFilter,
  onDueDateFilterChange
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-group">
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => onDueDateFilterChange(e.target.value)}
          className="filter-date"
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;