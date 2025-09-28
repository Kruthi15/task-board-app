const STORAGE_KEYS = {
  BOARDS: 'task_boards',
  COLUMNS: 'task_columns',
  TASKS: 'task_tasks'
};

export const localStorageUtils = {
  // Boards
  getBoards: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOARDS) || '[]');
    } catch {
      return [];
    }
  },

  saveBoards: (boards: any[]) => {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  },

  // Columns
  getColumns: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COLUMNS) || '[]');
    } catch {
      return [];
    }
  },

  saveColumns: (columns: any[]) => {
    localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
  },

  // Tasks
  getTasks: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    } catch {
      return [];
    }
  },

  saveTasks: (tasks: any[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
};