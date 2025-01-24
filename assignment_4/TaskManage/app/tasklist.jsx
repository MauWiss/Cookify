import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { TaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';

export default function TaskListScreen() {
  const { tasks } = useContext(TaskContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} />
        )}
      />

      {/* Navigate to Add Task screen */}
      <Link href="/addedittask" asChild>
        <Button title="Add Task" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
