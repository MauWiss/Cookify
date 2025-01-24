import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function MainScreen() {
  const { tasks } = useContext(TaskContext);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Task Manager!</Text>
      <Text style={styles.summary}>
        Total Tasks: {totalTasks} | Completed: {completedTasks}
      </Text>

      {/* Navigation Buttons */}
      <Link href="/tasklist" asChild>
        <Button title="Go to Task List" />
      </Link>
      <Link href="/addedittask" asChild>
        <Button title="Add a New Task" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  summary: {
    fontSize: 18,
    marginBottom: 16,
  },
});
