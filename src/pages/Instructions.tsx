import React from 'react';
import { useNavigate } from 'react-router-dom';

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="instructions-page">
      <div className="page-header">
        <h1>How to Use Task Board</h1>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Boards
        </button>
      </div>

      <div className="instructions-content">
        <div className="instruction-section">
          <h2>📋 Getting Started</h2>
          <p>Welcome to Task Board! This application helps you organize tasks visually using boards and columns.</p>
        </div>

        <div className="instruction-section">
          <h2>🎯 Board Management</h2>
          <div className="instruction-step">
            <h3>Creating Boards</h3>
            <p>• Click "Create New Board" on the main page</p>
            <p>• Give your board a title and description</p>
            <p>• Click "Create Board" to save</p>
          </div>
          
          <div className="instruction-step">
            <h3>Managing Boards</h3>
            <p>• Click on any board to open it</p>
            <p>• Use Edit to modify board details</p>
            <p>• Use Delete to remove a board (this will delete all columns and tasks in it)</p>
          </div>
        </div>

        <div className="instruction-section">
          <h2>📝 Column Management</h2>
          <div className="instruction-step">
            <h3>Creating Columns</h3>
            <p>• Inside a board, click "Add Column"</p>
            <p>• Name your column (e.g., "To Do", "In Progress", "Done")</p>
            <p>• Columns will appear horizontally across the board</p>
          </div>
          
          <div className="instruction-step">
            <h3>Managing Columns</h3>
            <p>• Use Edit to rename a column</p>
            <p>• Use Delete to remove a column and all its tasks</p>
            <p>• Click "+ Add Task" to create tasks in a column</p>
          </div>
        </div>

        <div className="instruction-section">
          <h2>✅ Task Management</h2>
          <div className="instruction-step">
            <h3>Creating Tasks</h3>
            <p>• Click "+ Add Task" in any column</p>
            <p>• Fill in task details:</p>
            <ul>
              <li><strong>Title:</strong> Short description of the task</li>
              <li><strong>Description:</strong> Detailed information</li>
              <li><strong>Created By:</strong> Your name or team member</li>
              <li><strong>Priority:</strong> High, Medium, or Low</li>
              <li><strong>Due Date:</strong> When the task needs to be completed</li>
            </ul>
          </div>
          
          <div className="instruction-step">
            <h3>Managing Tasks</h3>
            <p>• <strong>Drag and Drop:</strong> Move tasks between columns by dragging them</p>
            <p>• <strong>Edit:</strong> Click Edit to modify task details</p>
            <p>• <strong>Delete:</strong> Remove tasks you no longer need</p>
            <p>• <strong>Search:</strong> Use the search box to find tasks by title or description</p>
            <p>• <strong>Filter:</strong> Filter tasks by priority or due date</p>
          </div>
        </div>

        <div className="instruction-section">
          <h2>🔍 Search & Filter</h2>
          <p>• <strong>Search:</strong> Type in the search box to find tasks by title or description</p>
          <p>• <strong>Priority Filter:</strong> Select priority level to show only high, medium, or low priority tasks</p>
          <p>• <strong>Due Date Filter:</strong> Select a date to show tasks due on that specific date</p>
        </div>

        <div className="instruction-section">
          <h2>🎨 Customization</h2>
          <p>• Toggle between Light and Dark mode in Settings</p>
          <p>• Customize theme colors to match your preferences</p>
          <p>• All data is saved automatically in your browser</p>
        </div>

        <div className="instruction-section">
          <h2>💡 Tips</h2>
          <p>• Use consistent naming for columns across boards</p>
          <p>• Set realistic due dates and priorities</p>
          <p>• Regularly review and update task statuses</p>
          <p>• Use the search feature to quickly find specific tasks</p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;