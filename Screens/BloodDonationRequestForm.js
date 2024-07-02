import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Select } from 'native-base';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../components/firebase'; // Ensure the Firebase setup is correct

const BloodDonationRequestScreen = () => {
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email);
  const [requestInfo, setRequestInfo] = useState({
    patientName: '',
    bloodType: '',
    contactNumber: '',
    hospitalName: '',
    location: '',
    email: userEmail,
    additionalInfo: '',
  });

  const [errors, setErrors] = useState({
    nameError: '',
    contactError: '',
    addressError: '',
    emailError: '',
  });

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateContact = (contact) => /^[0-9]{11}$/.test(contact);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    const nameError = validateName(requestInfo.patientName) ? '' : 'Please enter a valid name (letters only).';
    const contactError = validateContact(requestInfo.contactNumber) ? '' : 'Please enter a valid 11-digit contact number.';
    const addressError = requestInfo.location.trim() ? '' : 'Location is required.';
    const emailError = validateEmail(requestInfo.email) ? '' : 'Please enter a valid email address.';

    setErrors({ nameError, contactError, addressError, emailError });

    if (!nameError && !contactError && !addressError && !emailError) {
      try {
        // Store form data in Firestore
        await addDoc(collection(db, 'BloodDonationRequests'), {
          ...requestInfo,
          dateAdded: serverTimestamp(),
        });

        setRequestInfo({
          patientName: '',
          bloodType: '',
          contactNumber: '',
          hospitalName: '',
          location: '',
          email: '',
          additionalInfo: '',
        });

        Alert.alert(
          'Request Submitted',
          'Your blood donation request has been submitted successfully.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      } catch (error) {
        console.error('Error adding document: ', error);
        Alert.alert(
          'Error',
          'There was an error submitting your request. Please try again later.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      }
    } else {
      Alert.alert(
        'Error',
        'Please fill all required fields correctly.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Make a Blood Donation Request</Text>
      
      <Text style={styles.fieldTitle}>Patient Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Patient Name"
        value={requestInfo.patientName}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, patientName: text })}
      />
      {errors.nameError ? <Text style={styles.errorText}>{errors.nameError}</Text> : null}

      <Text style={styles.fieldTitle}>Blood Type</Text>
      <Select
        selectedValue={requestInfo.bloodType}
        minWidth="80%"
        accessibilityLabel="Choose Blood Type"
        placeholder="Choose Blood Type"
        mt={1}
        onValueChange={(itemValue) => setRequestInfo({ ...requestInfo, bloodType: itemValue })}
        style={styles.select}
      >
        <Select.Item label="A+" value="A+" />
        <Select.Item label="A-" value="A-" />
        <Select.Item label="B+" value="B+" />
        <Select.Item label="B-" value="B-" />
        <Select.Item label="AB+" value="AB+" />
        <Select.Item label="AB-" value="AB-" />
        <Select.Item label="O+" value="O+" />
        <Select.Item label="O-" value="O-" />
      </Select>

      <Text style={styles.fieldTitle}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={requestInfo.contactNumber}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, contactNumber: text })}
        keyboardType="numeric"
      />
      {errors.contactError ? <Text style={styles.errorText}>{errors.contactError}</Text> : null}

      <Text style={styles.fieldTitle}>Hospital Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital Name"
        value={requestInfo.hospitalName}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, hospitalName: text })}
      />

      <Text style={styles.fieldTitle}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={requestInfo.location}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, location: text })}
      />
      {errors.addressError ? <Text style={styles.errorText}>{errors.addressError}</Text> : null}

      <Text style={styles.fieldTitle}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={requestInfo.email}
        editable={false}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, email: text })}
        onBlur={() => setErrors({ ...errors, emailError: validateEmail(requestInfo.email) ? '' : 'Please enter a valid email address.' })}
      />
      {errors.emailError ? <Text style={styles.errorText}>{errors.emailError}</Text> : null}

      <Text style={styles.fieldTitle}>Additional Information (if any)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Additional Information (if any)"
        multiline
        value={requestInfo.additionalInfo}
        onChangeText={(text) => setRequestInfo({ ...requestInfo, additionalInfo: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 16,
    marginBottom: 4,
    width: '80%',
    textAlign: 'left',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
  },
  select: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#2DAA42',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BloodDonationRequestScreen;
