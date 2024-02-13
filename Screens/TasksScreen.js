import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';

const TasksScreen = ({ route }) => {
  // Use optional chaining to handle potential undefined route or params
  const { userId, userEmail } = route?.params || {};
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        if (!userId) {
          console.error('User ID is undefined.');
          return;
        }

        const tasksCollection = collection(db, 'volunteertasks'); // Replace with your actual collection name
        const q = query(tasksCollection, where('volunteerId', '==', userId));
        const snapshot = await getDocs(q);

        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserTasks(tasksData);
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        // Handle error if needed
      }
    };

    fetchUserTasks();
  }, [userId, userEmail]); // Include userEmail in the dependency array if needed

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Tasks</Text>
      <FlatList
        data={userTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <Text>{item.taskDetails}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskItem: {
    marginBottom: 16,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default TasksScreen;
