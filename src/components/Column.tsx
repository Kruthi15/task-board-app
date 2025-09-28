import React, { useState } from 'react';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newColumnId: string) => void;
  onReorderTasks: (columnId: string, taskIds: string[]) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onReorderTasks
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    if (sourceColumnId !== column.id) {
      onMoveTask(taskId, column.id);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <div 
      className={`column ${isDraggingOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <div className="column-actions">
          <button onClick={() => onEditColumn(column)} className="btn-edit">
            Edit
          </button>
          <button onClick={() => onDeleteColumn(column.id)} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
      
      <div className="tasks-container">
        {sortedTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onReorder={onReorderTasks}
            allTasks={sortedTasks}
          />
        ))}
      </div>
      
      <button 
        onClick={() => onAddTask(column.id)}
        className="add-task-btn"
      >
        + Add Task
      </button>
    </div>
  );
};

export default Column;