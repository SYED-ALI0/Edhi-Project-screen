import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Select } from 'native-base';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../components/firebase'; // Ensure the Firebase setup is correct

const BloodDonationForm = () => {
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email);
  const [donor, setDonor] = useState({
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    contactNumber: '',
    address: '',
    email: userEmail,
    healthConditions: '',
    otherHealthCondition: '',
  });

  const [errors, setErrors] = useState({
    nameError: '',
    ageError: '',
    contactError: '',
    addressError: '',
    emailError: '',
  });

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateAge = (age) => /^[1-9][0-9]?$|^65$/.test(age);
  const validateContact = (contact) => /^[0-9]{11}$/.test(contact);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    const nameError = validateName(donor.name) ? '' : 'Please enter a valid name (letters only).';
    const ageError = validateAge(donor.age) ? '' : 'Please enter a valid age (18-65).';
    const contactError = validateContact(donor.contactNumber) ? '' : 'Please enter a valid 11-digit contact number.';
    const addressError = donor.address.trim() ? '' : 'Address is required.';
    const emailError = validateEmail(donor.email) ? '' : 'Please enter a valid email address.';

    setErrors({ nameError, ageError, contactError, addressError, emailError });

    if (!nameError && !ageError && !contactError && !addressError && !emailError) {
      try {
        const donorData = {
          ...donor,
          submissionTimestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'BloodDonors'), donorData);
        alert('Blood donation form submitted successfully!');
        setDonor({
          name: '',
          age: '',
          gender: '',
          bloodType: '',
          contactNumber: '',
          address: '',
          email: userEmail,
          healthConditions: '',
          otherHealthCondition: '',
        });
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error submitting the form. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blood Donation</Text>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Enter Full Name"
        value={donor.name}
        onChangeText={(text) => setDonor({ ...donor, name: text })}
        style={styles.input}
        onBlur={() => setErrors({ ...errors, nameError: validateName(donor.name) ? '' : 'Please enter a valid name (letters only).' })}
      />
      {errors.nameError ? <Text style={styles.errorText}>{errors.nameError}</Text> : null}

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={donor.age}
        onChangeText={(text) => setDonor({ ...donor, age: text })}
        placeholder="Enter Age"
        keyboardType="numeric"
        style={styles.input}
        onBlur={() => setErrors({ ...errors, ageError: validateAge(donor.age) ? '' : 'Please enter a valid age (18-65).' })}
      />
      {errors.ageError ? <Text style={styles.errorText}>{errors.ageError}</Text> : null}

      <Text style={styles.label}>Gender</Text>
      <Select
        selectedValue={donor.gender}
        minWidth="80%"
        accessibilityLabel="Choose Gender"
        placeholder="Choose Gender"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, gender: itemValue })}
        style={styles.select}
      >
        <Select.Item label="Male" value="male" />
        <Select.Item label="Female" value="female" />
      </Select>

      <Text style={styles.label}>Blood Type</Text>
      <Select
        selectedValue={donor.bloodType}
        minWidth="80%"
        accessibilityLabel="Choose Blood Type"
        placeholder="Choose Blood Type"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, bloodType: itemValue })}
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

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        value={donor.contactNumber}
        onChangeText={(text) => setDonor({ ...donor, contactNumber: text })}
        placeholder="Enter Contact Number"
        keyboardType="numeric"
        style={styles.input}
        onBlur={() => setErrors({ ...errors, contactError: validateContact(donor.contactNumber) ? '' : 'Please enter a valid 11-digit contact number.' })}
      />
      {errors.contactError ? <Text style={styles.errorText}>{errors.contactError}</Text> : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={donor.address}
        onChangeText={(text) => setDonor({ ...donor, address: text })}
        placeholder="Enter Address"
        style={styles.input}
        onBlur={() => setErrors({ ...errors, addressError: donor.address.trim() ? '' : 'Address is required.' })}
      />
      {errors.addressError ? <Text style={styles.errorText}>{errors.addressError}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={donor.email}
        onChangeText={(text) => setDonor({ ...donor, email: text })}
        placeholder="Enter Email"
        style={styles.input}
        onBlur={() => setErrors({ ...errors, emailError: validateEmail(donor.email) ? '' : 'Please enter a valid email address.' })}
        editable={false} // Disable email input
      />
      {errors.emailError ? <Text style={styles.errorText}>{errors.emailError}</Text> : null}

      <Text style={styles.label}>Health Conditions</Text>
      <Select
        selectedValue={donor.healthConditions}
        minWidth="80%"
        accessibilityLabel="Choose Health Condition"
        placeholder="Choose Health Condition"
        mt={1}
        onValueChange={(itemValue) => setDonor({ ...donor, healthConditions: itemValue })}
        style={styles.select}
      >
        {['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Other'].map((condition) => (
          <Select.Item key={condition} label={condition} value={condition} />
        ))}
      </Select>
      {donor.healthConditions === 'Other' && (
        <TextInput
          value={donor.otherHealthCondition}
          onChangeText={(text) => setDonor({ ...donor, otherHealthCondition: text })}
          placeholder="Specify Health Condition"
          style={styles.input}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  label: {
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
    fontSize: 16,
    color: 'black',
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
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BloodDonationForm;
