import React, { useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Select } from "native-base";
import { db } from '../components/firebase';

const cities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Quetta', 'Peshawar', 'Sialkot', 'Abbottabad'
];

const ChildAdmissionForm = () => {
  const [child, setChild] = useState({
    childName: '',
    age: '',
    gender: 'Select Gender',
    parentName: '',
    contactNumber: '',
    address: '',
    healthConditions: '',
    edhiHomeLocation: 'Select Location'
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [parentNameError, setParentNameError] = useState('');
  const [contactError, setContactError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [healthConditionsError, setHealthConditionsError] = useState('');
  const [edhiHomeLocationError, setEdhiHomeLocationError] = useState('');

  function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    return !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 18;
  }

  function validateContact(contact) {
    return /^\d{11}$/.test(contact);
  }

  function validateEdhiHomeLocation(location) {
    return location !== 'Select Location';
  }

  async function submitForm() {
    let isValid = true;
    if (!validateName(child.childName)) {
      setNameError('Please enter a valid name (letters only).');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!validateAge(child.age)) {
      setAgeError('Please enter a valid age (1-18).');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!validateName(child.parentName)) {
      setParentNameError('Please enter a valid parent\'s name (letters only).');
      isValid = false;
    } else {
      setParentNameError('');
    }

    if (!validateContact(child.contactNumber)) {
      setContactError('Please enter a valid 11-digit contact number.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (!child.address.trim()) {
      setAddressError('Address is required.');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (!child.healthConditions.trim()) {
      setHealthConditionsError('Health conditions are required.');
      isValid = false;
    } else {
      setHealthConditionsError('');
    }

    if (!validateEdhiHomeLocation(child.edhiHomeLocation)) {
      setEdhiHomeLocationError('Please select a valid Edhi Home Location.');
      isValid = false;
    } else {
      setEdhiHomeLocationError('');
    }

    if (isValid) {
      try {
        const childDb = collection(db, "ChildAdmissionForm");
        await addDoc(childDb, {
          childName: child.childName,
          age: parseInt(child.age, 10),
          gender: child.gender,
          parentName: child.parentName,
          contactNumber: child.contactNumber,
          address: child.address,
          healthConditions: child.healthConditions,
          edhiHomeLocation: child.edhiHomeLocation,
          timestamp: Timestamp.fromDate(new Date()) // Add timestamp field
        });

        Alert.alert('Form Submitted', 'Child admission form submitted successfully.');

        setChild({
          childName: '',
          age: '',
          gender: 'Select Gender',
          parentName: '',
          contactNumber: '',
          address: '',
          healthConditions: '',
          edhiHomeLocation: 'Select Location'
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
      <Text style={styles.label}>Child's Full Name</Text>
      <TextInput
        placeholder='Enter Childs Full Name'
        value={child.childName}
        onChangeText={(text) => setChild({ ...child, childName: text })}
        style={styles.textBoxes}
        onBlur={() => setNameError(validateName(child.childName) ? '' : 'Please enter a valid name (letters only).')}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={child.age}
        onChangeText={(text) => setChild({ ...child, age: text })}
        placeholder='Enter Age'
        keyboardType='numeric'
        style={styles.textBoxes}
        onBlur={() => setAgeError(validateAge(child.age) ? '' : 'Please enter a valid age (1-18).')}
      />
      {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

      <Text style={styles.label}>Gender</Text>
      <Select selectedValue={child.gender} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Gender"  mt={1} onValueChange={itemValue =>  setChild({ ...child, gender: itemValue })}>
          <Select.Item label="Male" value="male" />
          <Select.Item label="Female" value="female" />
      </Select>

      <Text style={styles.label}>Parent's Full Name</Text>
      <TextInput
        value={child.parentName}
        onChangeText={(text) => setChild({ ...child, parentName: text })}
        placeholder="Enter Parent's Full Name"
        style={styles.textBoxes}
        onBlur={() => setParentNameError(validateName(child.parentName) ? '' : 'Please enter a valid parent\'s name (letters only).')}
      />
      {parentNameError ? <Text style={styles.errorText}>{parentNameError}</Text> : null}

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        value={child.contactNumber}
        onChangeText={(text) => setChild({ ...child, contactNumber: text })}
        placeholder='Enter Contact Number'
        keyboardType='numeric'
        style={styles.textBoxes}
        onBlur={() => setContactError(validateContact(child.contactNumber) ? '' : 'Please enter a valid 11-digit contact number.')}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={child.address}
        onChangeText={(text) => setChild({ ...child, address: text })}
        placeholder='Enter Address'
        style={styles.textBoxes}
        onBlur={() => setAddressError(child.address.trim() ? '' : 'Address is required.')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Health Conditions</Text>
      <TextInput
        value={child.healthConditions}
        onChangeText={(text) => setChild({ ...child, healthConditions: text })}
        placeholder='Enter Health Conditions'
        style={styles.textBoxes}
        onBlur={() => setHealthConditionsError(child.healthConditions.trim() ? '' : 'Health conditions are required.')}
      />
      {healthConditionsError ? <Text style={styles.errorText}>{healthConditionsError}</Text> : null}

      <Text style={styles.label}>Edhi Home Location</Text>
      <Select
        selectedValue={child.edhiHomeLocation}
        minWidth="200"
        accessibilityLabel="Choose Location"
        placeholder="Select Location"
        mt={1}
        onValueChange={(itemValue) => setChild({ ...child, edhiHomeLocation: itemValue })}
      >
        <Select.Item label="Karachi" value="Karachi" />
        <Select.Item label="Lahore" value="Lahore" />
        <Select.Item label="Islamabad" value="Islamabad" />
        <Select.Item label="Rawalpindi" value="Rawalpindi" />
        <Select.Item label="Faisalabad" value="Faisalabad" />
        <Select.Item label="Multan" value="Multan" />
        <Select.Item label="Gujranwala" value="Gujranwala" />
        <Select.Item label="Quetta" value="Quetta" />
        <Select.Item label="Peshawar" value="Peshawar" />
        <Select.Item label="Sialkot" value="Sialkot" />
        <Select.Item label="Abbottabad" value="Abbottabad" />
      </Select>
      {edhiHomeLocationError ? <Text style={styles.errorText}>{edhiHomeLocationError}</Text> : null}

      <Button title='Submit' onPress={submitForm} color="#2DAA42" style={{width: 80}}/>
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
    color: 'black'
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  }
});

export default ChildAdmissionForm;
