import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Board, Column, Task, AppSettings } from '../types';
import { localStorageUtils } from '../utils/localStorage';

interface TaskState {
  boards: Board[];
  columns: Column[];
  tasks: Task[];
  settings: AppSettings;
}

type TaskAction =
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'ADD_COLUMN'; payload: Column }
  | { type: 'UPDATE_COLUMN'; payload: Column }
  | { type: 'DELETE_COLUMN'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newColumnId: string; newPosition: number } }
  | { type: 'REORDER_TASKS'; payload: { columnId: string; taskIds: string[] } }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'UPDATE_THEME_COLORS'; payload: Partial<AppSettings['themeColors']> }
  | { type: 'LOAD_INITIAL_DATA'; payload: TaskState };

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  darkMode: false,
  themeColors: {
    rosewater: '#e8b4b8',
    dustyRose: '#eed6d3',
    coffeePotLight: '#a49393',
    coffeePotDark: '#67595e'
  }
};

const initialState: TaskState = {
  boards: [],
  columns: [],
  tasks: [],
  settings: defaultSettings
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  let newState: TaskState;

  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return { ...initialState, ...action.payload };

    case 'ADD_BOARD':
      newState = {
        ...state,
        boards: [...state.boards, action.payload]
      };
      localStorageUtils.saveBoards(newState.boards);
      return newState;

    case 'UPDATE_BOARD':
      newState = {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.id ? action.payload : board
        )
      };
      localStorageUtils.saveBoards(newState.boards);
      return newState;

    case 'DELETE_BOARD':
      newState = {
        ...state,
        boards: state.boards.filter(board => board.id !== action.payload),
        columns: state.columns.filter(column => {
          const boardColumns = state.columns.filter(col => col.boardId === action.payload);
          return !boardColumns.some(col => col.id === column.id);
        }),
        tasks: state.tasks.filter(task => {
          const boardColumns = state.columns.filter(col => col.boardId === action.payload);
          return !boardColumns.some(col => col.id === task.columnId);
        })
      };
      localStorageUtils.saveBoards(newState.boards);
      localStorageUtils.saveColumns(newState.columns);
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'ADD_COLUMN':
      newState = {
        ...state,
        columns: [...state.columns, action.payload]
      };
      localStorageUtils.saveColumns(newState.columns);
      return newState;

    case 'UPDATE_COLUMN':
      newState = {
        ...state,
        columns: state.columns.map(column =>
          column.id === action.payload.id ? action.payload : column
        )
      };
      localStorageUtils.saveColumns(newState.columns);
      return newState;

    case 'DELETE_COLUMN':
      newState = {
        ...state,
        columns: state.columns.filter(column => column.id !== action.payload),
        tasks: state.tasks.filter(task => task.columnId !== action.payload)
      };
      localStorageUtils.saveColumns(newState.columns);
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'ADD_TASK':
      newState = {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'MOVE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, columnId: action.payload.newColumnId, position: action.payload.newPosition }
            : task
        )
      };
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'REORDER_TASKS':
      const updatedTasks = state.tasks.map(task => {
        if (task.columnId === action.payload.columnId) {
          const newPosition = action.payload.taskIds.indexOf(task.id);
          if (newPosition !== -1) {
            return { ...task, position: newPosition };
          }
        }
        return task;
      });
      newState = {
        ...state,
        tasks: updatedTasks
      };
      localStorageUtils.saveTasks(newState.tasks);
      return newState;

    case 'TOGGLE_DARK_MODE':
      newState = {
        ...state,
        settings: {
          ...state.settings,
          darkMode: !state.settings.darkMode
        }
      };
      localStorage.setItem('app_settings', JSON.stringify(newState.settings));
      return newState;

    case 'UPDATE_THEME_COLORS':
      newState = {
        ...state,
        settings: {
          ...state.settings,
          themeColors: {
            ...state.settings.themeColors,
            ...action.payload
          }
        }
      };
      localStorage.setItem('app_settings', JSON.stringify(newState.settings));
      return newState;

    default:
      return state;
  }
}

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  React.useEffect(() => {
    // Load initial data from localStorage
    const boards = localStorageUtils.getBoards();
    const columns = localStorageUtils.getColumns();
    const tasks = localStorageUtils.getTasks();
    const savedSettings = localStorage.getItem('app_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    
    dispatch({
      type: 'LOAD_INITIAL_DATA',
      payload: { boards, columns, tasks, settings }
    });
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};