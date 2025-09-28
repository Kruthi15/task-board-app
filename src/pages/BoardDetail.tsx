import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { Column, Task, Priority } from '../types';
import ColumnComponent from '../components/Column';
import SearchAndFilter from '../components/SearchAndFilter';

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useTaskContext();
  
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [dueDateFilter, setDueDateFilter] = useState('');
  
  const [columnForm, setColumnForm] = useState({ title: '' });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    createdBy: '',
    priority: 'medium' as Priority,
    dueDate: ''
  });

  const board = state.boards.find(b => b.id === boardId);
  const columns = state.columns.filter(col => col.boardId === boardId);

  const filteredTasks = useMemo(() => {
    let tasks = state.tasks.filter(task => 
      columns.some(col => col.id === task.columnId)
    );

    if (searchTerm) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'all') {
      tasks = tasks.filter(task => task.priority === priorityFilter);
    }

    if (dueDateFilter) {
      tasks = tasks.filter(task => task.dueDate === dueDateFilter);
    }

    return tasks;
  }, [state.tasks, columns, searchTerm, priorityFilter, dueDateFilter]);

  if (!board) {
    return (
      <div className="error-page">
        <h2>Board not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Boards
        </button>
      </div>
    );
  }

  const handleCreateColumn = () => {
    if (columnForm.title.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        title: columnForm.title,
        boardId: boardId!,
        position: columns.length
      };

      if (editingColumn) {
        const updatedColumn = { ...editingColumn, title: columnForm.title };
        dispatch({ type: 'UPDATE_COLUMN', payload: updatedColumn });
      } else {
        dispatch({ type: 'ADD_COLUMN', payload: newColumn });
      }

      setColumnForm({ title: '' });
      setEditingColumn(null);
      setShowColumnModal(false);
    }
  };

  const handleCreateTask = () => {
    if (taskForm.title.trim() && taskForm.createdBy.trim() && taskForm.dueDate) {
      const columnId = editingTask ? editingTask.columnId : selectedColumnId;
      const columnTasks = filteredTasks.filter(task => task.columnId === columnId);
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskForm.title,
        description: taskForm.description,
        createdBy: taskForm.createdBy,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        columnId: columnId,
        position: columnTasks.length
      };

      if (editingTask) {
        const updatedTask = { ...editingTask, ...taskForm };
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      } else {
        dispatch({ type: 'ADD_TASK', payload: newTask });
      }

      setTaskForm({
        title: '',
        description: '',
        createdBy: '',
        priority: 'medium',
        dueDate: ''
      });
      setEditingTask(null);
      setShowTaskModal(false);
    }
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setColumnForm({ title: column.title });
    setShowColumnModal(true);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column? All tasks in it will be deleted.')) {
      dispatch({ type: 'DELETE_COLUMN', payload: columnId });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      createdBy: task.createdBy,
      priority: task.priority,
      dueDate: task.dueDate
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    }
  };

  const handleMoveTask = (taskId: string, newColumnId: string) => {
    const newPosition = filteredTasks.filter(task => task.columnId === newColumnId).length;
    dispatch({
      type: 'MOVE_TASK',
      payload: { taskId, newColumnId, newPosition }
    });
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      createdBy: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowTaskModal(true);
  };

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className="board-detail">
      <div className="board-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Boards
        </button>
        <div className="board-title">
          <h1>{board.title}</h1>
          <p>{board.description}</p>
        </div>
        <button 
          onClick={() => {
            setEditingColumn(null);
            setColumnForm({ title: '' });
            setShowColumnModal(true);
          }}
          className="btn-primary"
        >
          Add Column
        </button>
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
      />

      <div className="columns-container">
        {sortedColumns.map(column => (
          <ColumnComponent
            key={column.id}
            column={column}
            tasks={filteredTasks.filter(task => task.columnId === column.id)}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onReorderTasks={(columnId, taskIds) => {
              dispatch({
                type: 'REORDER_TASKS',
                payload: { columnId, taskIds }
              });
            }}
          />
        ))}
        
        {columns.length === 0 && (
          <div className="empty-columns">
            <p>No columns created yet. Add your first column to get started!</p>
          </div>
        )}
      </div>

      {/* Column Modal */}
      {showColumnModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingColumn ? 'Edit Column' : 'Create New Column'}</h2>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={columnForm.title}
                onChange={(e) => setColumnForm({ title: e.target.value })}
                placeholder="Enter column title"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateColumn} className="btn-primary">
                {editingColumn ? 'Update Column' : 'Create Column'}
              </button>
              <button 
                onClick={() => setShowColumnModal(false)} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Created By:</label>
              <input
                type="text"
                value={taskForm.createdBy}
                onChange={(e) => setTaskForm({ ...taskForm, createdBy: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateTask} className="btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button 
                onClick={() => setShowTaskModal(false)} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;