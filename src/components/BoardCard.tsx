import React from 'react';
import { Board } from '../types';

interface BoardCardProps {
  board: Board;
  onEdit: (board: Board) => void;
  onDelete: (boardId: string) => void;
  onClick: (boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onEdit, onDelete, onClick }) => {
  return (
    <div className="board-card" onClick={() => onClick(board.id)}>
      <div className="board-card-header">
        <h3>{board.title}</h3>
        <div className="board-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(board);
            }}
            className="btn-edit"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(board.id);
            }}
            className="btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="board-description">{board.description}</p>
      <div className="board-meta">
        <span>Created: {new Date(board.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(board.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default BoardCard;