import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase'; 

const TasksScreen = ({ route }) => {
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [userId, setUserId] = useState('');
  const [approvedVolunteers, setApprovedVolunteers] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isUserExists, setIsUserExists] = useState(false); // State to track if user exists in approved volunteers

  useEffect(() => {
    const fetchApprovedVolunteers = async () => {
      try {
        const approvedVolunteersCollection = collection(db, 'approvedVolunteers');
        const snapshot = await getDocs(approvedVolunteersCollection);

        const volunteersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Check if current user exists in approved volunteers
        const currentUserEmail = auth.currentUser?.email;
        const currentUserVolunteer = volunteersData.find(volunteer => volunteer.email === currentUserEmail);

        if (currentUserVolunteer) {
          setUserId(currentUserVolunteer.id);
          setIsUserExists(true); // Set flag to true if user exists
        }

        setApprovedVolunteers(volunteersData);
      } catch (error) {
        console.error('Error fetching approved volunteers:', error);
      }
    };

    fetchApprovedVolunteers();
  }, []);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        if (!userId) {
          console.error('User ID is undefined.');
          return;
        }

        const tasksCollection = collection(db, 'tasks');
        const q = query(tasksCollection, where('volunteerId', '==', userId));
        const snapshot = await getDocs(q);

        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchUserTasks();
  }, [userId]);

  const handleSubmitTask = async () => {
    try {
      // Implement your task submission logic here
      // For demonstration, let's assume we're adding a task
      const tasksCollection = collection(db, 'tasks');
      const taskDocRef = await addDoc(tasksCollection, {
        volunteerId: userId,
        taskName: 'Example Task',
        taskDetails: 'Example Details',
        taskDeadline: 'Example Deadline',
        taskComments: 'Example Comments',
        assignedAt: new Date(),
      });

      console.log('Task added with ID:', taskDocRef.id);
      Alert.alert('Success', 'Task assigned successfully');

      // Clear form or reset states if needed
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to assign task');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <FlatList
        data={userTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <Text>{item.taskDetails}</Text>
            <Text>Deadline: {item.taskDeadline}</Text>
            <Text>Comments: {item.taskComments}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No tasks assigned yet.</Text>}
      />
      {/* Conditional rendering of submit button */}
      {!isUserExists && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitTask}
          disabled={isUserExists} // Disable button if user already exists
        >
          <Text style={styles.submitButtonText}>Assign Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TasksScreen;
