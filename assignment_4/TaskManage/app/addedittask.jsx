import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams , useRouter } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function AddEditTaskScreen() {
  const { id } = useLocalSearchParams(); // if present, we're editing
  const router = useRouter();

  const { tasks, addTask, updateTask } = useContext(TaskContext);

  const existingTask = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(existingTask ? existingTask.title : '');
  const [description, setDescription] = useState(
    existingTask ? existingTask.description : ''
  );

  useEffect(() => {
    // If we have an existing task, populate fields
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
    }
  }, [existingTask]);

  const handleSave = () => {
    if (existingTask) {
      // Update task
      updateTask({
        ...existingTask,
        title,
        description,
      });
    } else {
      // Add new task
      addTask(title, description);
    }
    router.back(); // Navigate back after saving
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {existingTask ? 'Edit Task' : 'Add New Task'}
      </Text>

      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 6,
    borderRadius: 4,
  },
});
