import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Board } from '../types';
import BoardCard from '../components/BoardCard';
import { useNavigate } from 'react-router-dom';

const BoardView: React.FC = () => {
  const { state, dispatch } = useTaskContext();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleCreateBoard = () => {
    if (formData.title.trim()) {
      const newBoard: Board = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingBoard) {
        const updatedBoard = { ...editingBoard, ...formData, updatedAt: new Date().toISOString() };
        dispatch({ type: 'UPDATE_BOARD', payload: updatedBoard });
      } else {
        dispatch({ type: 'ADD_BOARD', payload: newBoard });
      }

      setFormData({ title: '', description: '' });
      setEditingBoard(null);
      setShowCreateModal(false);
    }
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setFormData({
      title: board.title,
      description: board.description
    });
    setShowCreateModal(true);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      dispatch({ type: 'DELETE_BOARD', payload: boardId });
    }
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="board-view">
      <div className="page-header">
        <h1>Task Boards</h1>
        <button 
          onClick={() => {
            setEditingBoard(null);
            setFormData({ title: '', description: '' });
            setShowCreateModal(true);
          }}
          className="btn-primary"
        >
          Create New Board
        </button>
      </div>

      <div className="boards-grid">
        {state.boards.map(board => (
          <BoardCard
            key={board.id}
            board={board}
            onEdit={handleEditBoard}
            onDelete={handleDeleteBoard}
            onClick={handleBoardClick}
          />
        ))}
        {state.boards.length === 0 && (
          <div className="empty-state">
            <p>No boards created yet. Create your first board to get started!</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingBoard ? 'Edit Board' : 'Create New Board'}</h2>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter board title"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter board description"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateBoard} className="btn-primary">
                {editingBoard ? 'Update Board' : 'Create Board'}
              </button>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBoard(null);
                }} 
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

export default BoardView;