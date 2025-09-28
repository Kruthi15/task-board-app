import React, { useState } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onReorder: (columnId: string, taskIds: string[]) => void;
  allTasks: Task[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onReorder, allTasks }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColumnId', task.columnId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#cccccc';
    }
  };

  return (
    <div 
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn-edit">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="task-priority">
          <span 
            className="priority-dot"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          ></span>
          {task.priority}
        </div>
        <div className="task-due-date">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <div className="task-created-by">
          By: {task.createdBy}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;