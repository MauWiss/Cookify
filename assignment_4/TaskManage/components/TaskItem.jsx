import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { TaskContext } from '../context/TaskContext';

export default function TaskItem({ task }) {
  const { deleteTask, updateTask } = useContext(TaskContext);

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const toggleCompleted = () => {
    updateTask({ ...task, completed: !task.completed });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCompleted} style={styles.infoContainer}>
        <Text style={[styles.title, task.completed && styles.completed]}>
          {task.title}
        </Text>
        <Text numberOfLines={1} style={styles.description}>
          {task.description}
        </Text>
      </TouchableOpacity>

      {/* Link to Task Details screen */}
      <Link href={{ pathname: '/taskdetails', params: { id: task.id } }} asChild>
        <Button title="Details" />
      </Link>

      {/* Delete button */}
      <Button title="Delete" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
