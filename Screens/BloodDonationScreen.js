import React, { useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { Select } from 'native-base';
import { db } from '../components/firebase';
import { FontAwesome } from '@expo/vector-icons';

const healthConditionsList = [
  'None',
  'Anemia',
  'Diabetes',
  'High Blood Pressure',
  'Heart Disease',
  'Asthma',
  'Cancer',
  'Thyroid Disease',
  'Kidney Disease',
  'Liver Disease',
  'HIV/AIDS',
  'Tuberculosis',
  'Hepatitis B',
  'Hepatitis C',
  'Other',
];

const BloodDonationScreen = () => {
  const [donor, setDonor] = useState({
    name: '',
    age: '',
    gender: 'Select Gender',
    bloodType: 'Select Blood Type',
    contactNumber: '',
    address: '',
    healthConditions: 'Select Health Condition',
    otherHealthCondition: '',
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [contactError, setContactError] = useState('');
  const [addressError, setAddressError] = useState('');

  function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    return !isNaN(parsedAge) && parsedAge > 17 && parsedAge < 66;
  }

  function validateContact(contact) {
    return /^\d{10}$/.test(contact);
  }

  function submitForm() {
    let isValid = true;

    if (!validateName(donor.name)) {
      setNameError('Please enter a valid name (letters only).');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!validateAge(donor.age)) {
      setAgeError('Please enter a valid age (18-65).');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!validateContact(donor.contactNumber)) {
      setContactError('Please enter a valid 10-digit contact number.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (!donor.address.trim()) {
      setAddressError('Address is required.');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (donor.healthConditions === 'Select Health Condition') {
      Alert.alert('Health Condition Error', 'Please select a health condition.');
      isValid = false;
    }

    if (donor.healthConditions === 'Other' && !donor.otherHealthCondition.trim()) {
      Alert.alert('Health Condition Error', 'Please specify the health condition.');
      isValid = false;
    }

    if (isValid) {
      try {
        const donorDb = collection(db, "BloodDonors");
        addDoc(donorDb, {
          name: donor.name,
          age: parseInt(donor.age, 10),
          gender: donor.gender,
          bloodType: donor.bloodType,
          contactNumber: donor.contactNumber,
          address: donor.address,
          healthConditions: donor.healthConditions === 'Other' ? donor.otherHealthCondition : donor.healthConditions,
        });

        Alert.alert('Form Submitted', 'Blood donation form submitted successfully.');

        // Clear the fields after successful submission
        setDonor({
          name: '',
          age: '',
          gender: 'Select Gender',
          bloodType: 'Select Blood Type',
          contactNumber: '',
          address: '',
          healthConditions: 'Select Health Condition',
          otherHealthCondition: '',
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        Alert.alert('Error', 'An error occurred while submitting the form. Please try again.');
      }
    } else {
      Alert.alert('Form Error', 'Please fix the errors in the form.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="tint" size={50} color="#e74c3c" />
        <Text style={styles.title}>Blood Donation</Text>
      </View>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Enter Full Name"
        value={donor.name}
        onChangeText={(text) => setDonor({ ...donor, name: text })}
        style={styles.textBoxes}
        onBlur={() => setNameError(validateName(donor.name) ? '' : 'Please enter a valid name (letters only).')}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={donor.age}
        onChangeText={(text) => setDonor({ ...donor, age: text })}
        placeholder="Enter Age"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setAgeError(validateAge(donor.age) ? '' : 'Please enter a valid age (18-65).')}
      />
      {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

      <Text style={styles.label}>Gender</Text>
      <Select
        selectedValue={donor.gender}
        minWidth="200"
        accessibilityLabel="Choose Gender"
        placeholder="Choose Gender"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, gender: itemValue })}
      >
        <Select.Item label="Male" value="male" />
        <Select.Item label="Female" value="female" />
        <Select.Item label="Other" value="other" />
      </Select>

      <Text style={styles.label}>Blood Type</Text>
      <Select
        selectedValue={donor.bloodType}
        minWidth="200"
        accessibilityLabel="Choose Blood Type"
        placeholder="Choose Blood Type"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, bloodType: itemValue })}
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

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        value={donor.contactNumber}
        onChangeText={(text) => setDonor({ ...donor, contactNumber: text })}
        placeholder="Enter Contact Number"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setContactError(validateContact(donor.contactNumber) ? '' : 'Please enter a valid 10-digit contact number.')}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={donor.address}
        onChangeText={(text) => setDonor({ ...donor, address: text })}
        placeholder="Enter Address"
        style={styles.textBoxes}
        onBlur={() => setAddressError(donor.address.trim() ? '' : 'Address is required.')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Health Conditions</Text>
      <Select
        selectedValue={donor.healthConditions}
        minWidth="200"
        accessibilityLabel="Choose Health Condition"
        placeholder="Choose Health Condition"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, healthConditions: itemValue })}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <FontAwesome name="check" size={24} color="white" />
        }}
      >
        {healthConditionsList.map((condition) => (
          <Select.Item label={condition} value={condition} key={condition} />
        ))}
      </Select>

      {donor.healthConditions === 'Other' && (
        <>
          <Text style={styles.label}>Specify Health Condition</Text>
          <TextInput
            value={donor.otherHealthCondition}
            onChangeText={(text) => setDonor({ ...donor, otherHealthCondition: text })}
            placeholder="Specify Health Condition"
            style={styles.textBoxes}
          />
        </>
      )}

      <Button title="Submit" onPress={submitForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2DAA42',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  textBoxes: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default BloodDonationScreen;
