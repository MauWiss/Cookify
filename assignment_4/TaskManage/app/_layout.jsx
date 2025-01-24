import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { TaskContext } from '../context/TaskContext';
import { nanoid } from 'nanoid/non-secure'; // For unique IDs (optional)

export default function Layout() {
  const [tasks, setTasks] = useState([
    // Some sample tasks (optional)
    { id: '1', title: 'Buy groceries', description: 'Milk, Eggs, Bread', completed: false },
    { id: '2', title: 'Walk the dog', description: 'Morning walk in the park', completed: false },
  ]);

  // Add a new task
  const addTask = (title, description) => {
    const newTask = {
      id: nanoid(), // or use any unique ID generation strategy
      title,
      description,
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Delete a task by ID
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Update an existing task (e.g., mark completed or edit details)
  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const taskContextValue = {
    tasks,
    addTask,
    deleteTask,
    updateTask,
  };

  return (
    <TaskContext.Provider value={taskContextValue}>
      {/* 
        Stack handles navigation within expo-router.
        The screens (index.jsx, tasklist.jsx, taskdetails.jsx, addedittask.jsx)
        will be displayed here based on navigation paths.
      */}
      <Stack />
    </TaskContext.Provider>
  );
}
