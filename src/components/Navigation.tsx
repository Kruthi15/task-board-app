import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { state, dispatch } = useTaskContext();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navigation ${state.settings.darkMode ? 'dark' : 'light'}`}>
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          📋 Task Board
        </Link>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Boards
        </Link>
        <Link 
          to="/instructions" 
          className={`nav-link ${isActive('/instructions') ? 'active' : ''}`}
        >
          Instructions
        </Link>
        <Link 
          to="/analytics" 
          className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
        >
          Analytics
        </Link>
        <Link 
          to="/settings" 
          className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
        >
          Settings
        </Link>
      </div>

      <div className="nav-actions">
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="theme-toggle"
          title={state.settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {state.settings.darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;