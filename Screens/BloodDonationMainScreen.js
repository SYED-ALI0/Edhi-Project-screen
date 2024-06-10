// screens/BloodDonationMainScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BloodDonationMainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BloodDonationForm')}>
        <Text style={styles.buttonText}>Register as a Blood Donor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BloodDonationRequestList')}>
        <Text style={styles.buttonText}>Blood Donation Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BloodDonationRequestForm')}>
        <Text style={styles.buttonText}>Make a Blood Donation Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 10,
    width: '100%',
    maxWidth: 400,
    // Adding shadow and elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    // Adding a border
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#2DAA42',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'sans-serif-light', // Softer font
  },
});

export default BloodDonationMainScreen;
