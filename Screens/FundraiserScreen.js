import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { collection, query, getDocs, onSnapshot, doc, updateDoc, Timestamp, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../components/firebase';
import { auth } from '../components/firebase';
import { useStripeCheckout } from './hooks/useStripeCheckout';

const FundraiserScreen = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedFundraiserId, setSelectedFundraiserId] = useState(null);
  const { initiatePayment } = useStripeCheckout();

  useEffect(() => {
    const fetchFundraisers = async () => {
      const fundraisersCollection = collection(db, 'fundraisers');
      const fundraisersSnapshot = await getDocs(fundraisersCollection);
      const fetchedFundraisers = fundraisersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setFundraisers(fetchedFundraisers);

      const unsubscribe = onSnapshot(fundraisersCollection, (snapshot) => {
        const updatedFundraisers = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        setFundraisers(updatedFundraisers);
      });

      return () => unsubscribe();
    };

    fetchFundraisers();
  }, []);

  const handleDonate = (fundraiserId) => {
    setSelectedFundraiserId(fundraiserId);
  };

  const handleConfirmDonation = async (fundraiser) => {
    try {
      if (!donationAmount || parseInt(donationAmount) < 50) {
        alert('The minimum donation amount is Rs.50');
        return;
      }

      const status = await initiatePayment({
        userId: '123',
        userName: 'Ali',
        amount: parseInt(donationAmount),
        currency: 'USD',
        paymentMethodTypes: ['card'],
      });

      const donationData = {
        title: fundraiser.title,
        amount: parseInt(donationAmount),
        date: Timestamp.now(),
      };

      const userID = auth.currentUser?.email;
      const userDocRef = doc(db, 'users', userID);
      await updateDoc(userDocRef, {
        donations: arrayUnion(donationData),
      });

      // Update collected amount in the fundraiser document
      const fundraiserDocRef = doc(db, 'fundraisers', fundraiser.id);
      await updateDoc(fundraiserDocRef, {
        collectedAmount: increment(parseInt(donationAmount)),
      });

      console.log(status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fundraisers</Text>
      <FlatList
        data={fundraisers}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Title: {item.title}</Text>
            <Text style={styles.cardAmount}>Target Amount: {item.amount}</Text>
            <Text style={styles.cardCollectedAmount}>Collected Amount: {item.collectedAmount}</Text>
            {selectedFundraiserId === item.id ? (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Donation Amount"
                  keyboardType="numeric"
                  style={styles.donationInput}
                  value={donationAmount}
                  onChangeText={(text) => setDonationAmount(text)}
                />
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirmDonation(item)}
                >
                  <Text style={styles.confirmButtonText}>Confirm Donation</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => handleDonate(item.id)}
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 16,
  },
  cardCollectedAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  donateButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  donateButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 10,
  },
  donationInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FundraiserScreen;
