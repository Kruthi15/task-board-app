export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  priority: Priority;
  dueDate: string;
  columnId: string;
  position: number;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  darkMode: boolean;
  themeColors: {
    rosewater: string;
    dustyRose: string;
    coffeePotLight: string;
    coffeePotDark: string;
  };
}