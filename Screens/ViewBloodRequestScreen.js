import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Button } from 'react-native';
import { collection, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove, query, where, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase'; // Ensure the Firebase setup is correct
import { format } from 'date-fns';

const BloodDonationRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');

  useEffect(() => {
    const fetchRequests = () => {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        console.error('No user logged in');
        return;
      }

      const requestsCollection = collection(db, 'BloodDonationRequests');
      const userRequestsQuery = query(requestsCollection, where('email', '==', userEmail));

      const unsubscribe = onSnapshot(userRequestsQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dateAdded: doc.data().dateAdded ? doc.data().dateAdded.toMillis() : 0,
          donors: doc.data().donors ? doc.data().donors : [], // Initialize donors as an empty array if not exists
        }));

        // Sort the data based on submission timestamp
        const sortedData = data.sort((a, b) => b.dateAdded - a.dateAdded);

        setRequests(sortedData);
      });

      return () => unsubscribe();
    };

    fetchRequests();
  }, []);

  const handleDonateNow = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleDonation = async () => {
    if (selectedRequest && donorName && donorContact) {
      const requestDocRef = doc(db, 'BloodDonationRequests', selectedRequest.id);
      await updateDoc(requestDocRef, {
        donors: arrayUnion({
          name: donorName,
          contact: donorContact,
          timestamp: new Date(),
        }),
      });

      setModalVisible(false);
      setDonorName('');
      setDonorContact('');
      alert('Thank you for your donation!');
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const requestDocRef = doc(db, 'BloodDonationRequests', requestId);
      await deleteDoc(requestDocRef);
      alert('Request deleted successfully!');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Blood Donation Requests</Text>
      {requests.length > 0 ? (
        requests.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text style={styles.patientName}>{request.patientName}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Blood Type:</Text> {request.bloodType}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Contact:</Text> {request.contactNumber}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Location:</Text> {request.location}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Hospital:</Text> {request.hospitalName}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Additional Info:</Text> {request.additionalInfo}</Text>
            <Text style={styles.date}>{format(new Date(request.dateAdded), 'dd MMMM yyyy, HH:mm')}</Text>

            
            {request.donors.length > 0 && (
              <View style={styles.donorsContainer}>
                <Text style={styles.donorsTitle}>Donors:</Text>
                {request.donors.map((donor, index) => (
                  <View key={index} style={styles.donor}>
                    <Text>{donor.name}</Text>
                    <Text>{donor.contact}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRequest(request.id)}>
                <Text style={styles.buttonText}>Delete Request</Text>
              </TouchableOpacity>
            </View>


          </View>
        ))
      ) : (
        <Text style={styles.noRequests}>No blood donation requests available.</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Donate to {selectedRequest?.patientName}</Text>
            <TextInput
              placeholder="Your Name"
              value={donorName}
              onChangeText={setDonorName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Your Contact"
              value={donorContact}
              onChangeText={setDonorContact}
              style={styles.modalInput}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Donate" onPress={handleDonation} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#34495e',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#7f8c8d',
  },
  bold: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  date: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 10,
    textAlign: 'right',
  },
  noRequests: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  donateButton: {
    backgroundColor: '#2DAA42',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  donorsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  donorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  donor: {
    marginBottom: 5,
  },
});

export default BloodDonationRequestList;
