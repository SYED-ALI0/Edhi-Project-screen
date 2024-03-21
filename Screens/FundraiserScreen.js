import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { collection, query, getDocs, onSnapshot, doc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../components/firebase';

import { useStripeCheckout } from "./hooks/useStripeCheckout";

const FundraiserScreen = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedFundraiserId, setSelectedFundraiserId] = useState(null);
  const { initiatePayment } = useStripeCheckout();

  useEffect(() => {
    const fetchFundraisers = async () => {
      const fundraisersCollection = collection(db, 'fundraisers');
      const fundraisersSnapshot = await getDocs(fundraisersCollection);
      const fetchedFundraisers = fundraisersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFundraisers(fetchedFundraisers.reverse());

      const unsubscribe = onSnapshot(fundraisersCollection, (snapshot) => {
        const updatedFundraisers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFundraisers(updatedFundraisers.reverse());
      });

      return () => unsubscribe();
    };

    fetchFundraisers();
  }, []);

  const handleDonate = (fundraiserId) => {
    setSelectedFundraiserId(fundraiserId);
  };

  const handleConfirmDonation = async (fundraiserTitle) => {
    try {
      const status = await initiatePayment({
        userId: "123",
        userName: "Ali",
        amount: parseInt(donationAmount),
        currency: "USD",
        paymentMethodTypes: ["card"],
      });

      const donationData = {
        title: fundraiserTitle,
        amount: parseInt(donationAmount),
        date: Timestamp.now(),
      };

      const userID = auth.currentUser?.email;
      const userDocRef = doc(db, "users", userID);
      await updateDoc(userDocRef, {
        donations: arrayUnion(donationData)
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
            <Text style={styles.cardAmount}>Amount: {item.amount}</Text>
            {(selectedFundraiserId === item.id) ? (
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
                  onPress={() => handleConfirmDonation(item.title)}>
                  <Text style={styles.confirmButtonText}>Confirm Donation</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => handleDonate(item.id)}>
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

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
