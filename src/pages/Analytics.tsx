import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const Analytics: React.FC = () => {
  const { state } = useTaskContext();
  const navigate = useNavigate();

  const analyticsData = useMemo(() => {
    const totalBoards = state.boards.length;
    const totalColumns = state.columns.length;
    const totalTasks = state.tasks.length;

    // Task distribution by priority
    const priorityCounts = state.tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Task distribution by column
    const columnCounts = state.columns.map(column => {
      const taskCount = state.tasks.filter(task => task.columnId === column.id).length;
      return {
        columnName: column.title,
        taskCount
      };
    });

    // Overdue tasks
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = state.tasks.filter(task => task.dueDate < today).length;

    // Tasks due today
    const dueToday = state.tasks.filter(task => task.dueDate === today).length;

    // Tasks by board
    const boardStats = state.boards.map(board => {
      const boardColumns = state.columns.filter(col => col.boardId === board.id);
      const boardTasks = state.tasks.filter(task => 
        boardColumns.some(col => col.id === task.columnId)
      );
      return {
        boardName: board.title,
        taskCount: boardTasks.length,
        columnCount: boardColumns.length
      };
    });

    return {
      totalBoards,
      totalColumns,
      totalTasks,
      priorityCounts,
      columnCounts,
      overdueTasks,
      dueToday,
      boardStats
    };
  }, [state.boards, state.columns, state.tasks]);

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Boards
        </button>
      </div>

      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Total Boards</h3>
          <div className="stat-number">{analyticsData.totalBoards}</div>
        </div>

        <div className="stat-card">
          <h3>Total Columns</h3>
          <div className="stat-number">{analyticsData.totalColumns}</div>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="stat-number">{analyticsData.totalTasks}</div>
        </div>

        <div className="stat-card">
          <h3>Overdue Tasks</h3>
          <div className="stat-number overdue">{analyticsData.overdueTasks}</div>
        </div>

        <div className="stat-card">
          <h3>Due Today</h3>
          <div className="stat-number due-today">{analyticsData.dueToday}</div>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Task Priority Distribution</h2>
        <div className="priority-stats">
          <div className="priority-stat">
            <span className="priority-dot high"></span>
            <span>High: {analyticsData.priorityCounts.high || 0}</span>
          </div>
          <div className="priority-stat">
            <span className="priority-dot medium"></span>
            <span>Medium: {analyticsData.priorityCounts.medium || 0}</span>
          </div>
          <div className="priority-stat">
            <span className="priority-dot low"></span>
            <span>Low: {analyticsData.priorityCounts.low || 0}</span>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <h2>Tasks by Column</h2>
        <div className="column-stats">
          {analyticsData.columnCounts.map((column, index) => (
            <div key={index} className="column-stat">
              <span className="column-name">{column.columnName}</span>
              <span className="column-count">{column.taskCount} tasks</span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Board Statistics</h2>
        <div className="board-stats">
          {analyticsData.boardStats.map((board, index) => (
            <div key={index} className="board-stat">
              <h4>{board.boardName}</h4>
              <p>Tasks: {board.taskCount}</p>
              <p>Columns: {board.columnCount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;