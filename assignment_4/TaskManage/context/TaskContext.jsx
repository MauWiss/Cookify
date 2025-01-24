import { createContext } from 'react';

export const TaskContext = createContext({
  tasks: [],
  addTask: () => {},
  deleteTask: () => {},
  updateTask: () => {},
});
