import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import BoardView from './pages/BoardView';
import BoardDetail from './pages/BoardDetail';
import Instructions from './pages/Instructions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import './App.css';

const AppContent: React.FC = () => {
  const { state } = useTaskContext();

  return (
    <div className={`app ${state.settings.darkMode ? 'dark-mode' : ''}`}>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <Router>
        <AppContent />
      </Router>
    </TaskProvider>
  );
};

export default App;