import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../components/firebase';

import { useStripeCheckout } from "./hooks/useStripeCheckout";

const FundraiserScreen = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const { initiatePayment } = useStripeCheckout();
  useEffect(() => {
    const fetchFundraisers = async () => {
      const fundraisersCollection = collection(db, 'fundraisers');
      const fundraisersSnapshot = await getDocs(fundraisersCollection);
      const fetchedFundraisers = fundraisersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFundraisers(fetchedFundraisers.reverse());

      // Listen for real-time updates
      const unsubscribe = onSnapshot(fundraisersCollection, (snapshot) => {
        const updatedFundraisers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFundraisers(updatedFundraisers.reverse());
      });

      // Cleanup function to unsubscribe from snapshot listener
      return () => unsubscribe();
    };

    fetchFundraisers();
  }, []);

  const handleDonate = async  (fundraiserId, amount) => {
    // Add your donation logic here
    console.log(`Donating to fundraiser with ID ${fundraiserId}`);
        try {
          const status = await initiatePayment({
              userId: "123",
              userName: "Ali",
              amount: parseInt(amount), // Assuming the amount is in cents
              currency: "USD",
              paymentMethodTypes: ["card"],
          });

          console.log(status);

          //after this update 
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
            <TouchableOpacity
              style={styles.donateButton}
              onPress={() => handleDonate(item.id, item.amount)}>
              <Text style={styles.donateButtonText}>Donate</Text>
            </TouchableOpacity>
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
    position: 'relative', // Make the position relative to its parent
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 16,
  },
  donateButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  donateButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FundraiserScreen;
