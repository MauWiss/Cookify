import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams(); // retrieve the task ID from route params
  const { tasks } = useContext(TaskContext);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>
      <Text style={styles.label}>Title:</Text>
      <Text>{task.title}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text>{task.description}</Text>
      <Text style={styles.label}>Completed:</Text>
      <Text>{task.completed ? 'Yes' : 'No'}</Text>

      {/* Button to navigate to edit the current task */}
      <Link
        href={{
          pathname: '/addedittask',
          params: { id: task.id },
        }}
        asChild
      >
        <Button title="Edit Task" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
  },
});
