import React, { useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Picker } from '@react-native-picker/picker';

const ChildAdoptionForm = () => {
  const [adoption, setAdoption] = useState({
    adopterName: '',
    adopterAge: '',
    adopterGender: 'Select Gender',
    maritalStatus: 'Select Marital Status',
    occupation: '',
    income: '',
    contactNumber: '',
    address: '',
    reason: '',
    otherChildren: 'No',
    childrenDetails: '',
    criminalRecord: 'No',
    criminalRecordDetails: '',
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [contactError, setContactError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [occupationError, setOccupationError] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [childrenDetailsError, setChildrenDetailsError] = useState('');
  const [criminalRecordDetailsError, setCriminalRecordDetailsError] = useState('');

  function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    return !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 80 && parsedAge >= 18;
  }

  function validateContact(contact) {
    return /^\d{11}$/.test(contact);
  }

  function validateOccupation(occupation) {
    return /^[a-zA-Z\s]+$/.test(occupation);
  }

  function validateIncome(income) {
    return /^\d+$/.test(income);
  }

  function validateChildrenDetails(childrenDetails) {
    // Additional validation logic if needed
    return true;
  }

  function validateCriminalRecordDetails(criminalRecordDetails) {
    // Additional validation logic if needed
    return true;
  }

  function submitForm() {
    // Basic input validation
    let isValid = true;

    if (!validateName(adoption.adopterName)) {
      setNameError('Please enter a valid name (letters only).');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!validateAge(adoption.adopterAge)) {
      if (parseInt(adoption.adopterAge, 10) < 18) {
        setAgeError('Adopters must be 18 years or older.');
      } else {
        setAgeError('Please enter a valid age (18-80).');
      }
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!validateContact(adoption.contactNumber)) {
      setContactError('Please enter a valid 11-digit contact number.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (!validateOccupation(adoption.occupation)) {
      setOccupationError('Please enter a valid occupation (letters only).');
      isValid = false;
    } else {
      setOccupationError('');
    }

    if (!validateIncome(adoption.income)) {
      setIncomeError('Please enter a valid income (numeric characters only).');
      isValid = false;
    } else {
      setIncomeError('');
    }

    if (adoption.address.trim() === '') {
      setAddressError('Address is required.');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (adoption.reason.trim() === '') {
      setReasonError('Reason for Adoption is required.');
      isValid = false;
    } else {
      setReasonError('');
    }

    if (adoption.otherChildren === 'Yes' && !validateChildrenDetails(adoption.childrenDetails)) {
      setChildrenDetailsError('Additional validation logic if needed.');
      isValid = false;
    } else {
      setChildrenDetailsError('');
    }

    if (adoption.criminalRecord === 'Yes' && !validateCriminalRecordDetails(adoption.criminalRecordDetails)) {
      setCriminalRecordDetailsError('Additional validation logic if needed.');
      isValid = false;
    } else {
      setCriminalRecordDetailsError('');
    }

    if (isValid) {
      const adoptionDb = collection(db, 'childAdoptionForms');
      addDoc(adoptionDb, {
        adopterName: adoption.adopterName,
        adopterAge: adoption.adopterAge,
        adopterGender: adoption.adopterGender,
        maritalStatus: adoption.maritalStatus,
        occupation: adoption.occupation,
        income: adoption.income,
        contactNumber: adoption.contactNumber,
        address: adoption.address,
        reason: adoption.reason,
        otherChildren: adoption.otherChildren,
        childrenDetails: adoption.childrenDetails,
        criminalRecord: adoption.criminalRecord,
        criminalRecordDetails: adoption.criminalRecordDetails,
      })
        .then(() => {
          Alert.alert('Form Submitted', 'Child adoption form submitted successfully.');
          setAdoption({
            adopterName: '',
            adopterAge: '',
            adopterGender: 'Select Gender',
            maritalStatus: 'Select Marital Status',
            occupation: '',
            income: '',
            contactNumber: '',
            address: '',
            reason: '',
            otherChildren: 'No',
            childrenDetails: '',
            criminalRecord: 'No',
            criminalRecordDetails: '',
          });
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          Alert.alert('Error', 'An error occurred while submitting the form. Please try again.');
        });
    } else {
      Alert.alert('Form Error', 'Please fix the errors in the form.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Adopter's Full Name</Text>
      <TextInput
        value={adoption.adopterName}
        onChangeText={(text) => setAdoption({ ...adoption, adopterName: text })}
        placeholder="Enter Adopter's Full Name"
        style={styles.textBoxes}
        onBlur={() => setNameError(validateName(adoption.adopterName) ? '' : 'Please enter a valid name (letters only).')}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={adoption.adopterAge}
        onChangeText={(text) => setAdoption({ ...adoption, adopterAge: text })}
        placeholder="Enter Age"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setAgeError(validateAge(adoption.adopterAge) ? '' : 'Please enter a valid age (18-80).')}
      />
      {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={adoption.adopterGender}
        onValueChange={(itemValue) => setAdoption({ ...adoption, adopterGender: itemValue })}
        style={{ ...styles.textBoxes, color: 'black' }}
        itemStyle={{ color: 'black' }}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Marital Status</Text>
      <Picker
        selectedValue={adoption.maritalStatus}
        onValueChange={(itemValue) => setAdoption({ ...adoption, maritalStatus: itemValue })}
        style={{ ...styles.textBoxes, color: 'black' }}
        itemStyle={{ color: 'black' }}
      >
        <Picker.Item label='Select Marital Status' value='' />
        <Picker.Item label='Single' value='Single' />
        <Picker.Item label='Married' value='Married' />
        <Picker.Item label='Divorced' value='Divorced' />
        <Picker.Item label='Widowed' value='Widowed' />
      </Picker>

      <Text style={styles.label}>Occupation</Text>
      <TextInput
        value={adoption.occupation}
        onChangeText={(text) => setAdoption({ ...adoption, occupation: text })}
        placeholder="Enter Occupation"
        style={styles.textBoxes}
        onBlur={() => setOccupationError(validateOccupation(adoption.occupation) ? '' : 'Please enter a valid occupation (letters only).')}
      />
      {occupationError ? <Text style={styles.errorText}>{occupationError}</Text> : null}

      <Text style={styles.label}>Annual Income</Text>
      <TextInput
        value={adoption.income}
        onChangeText={(text) => setAdoption({ ...adoption, income: text })}
        placeholder="Enter Annual Income"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setIncomeError(validateIncome(adoption.income) ? '' : 'Please enter a valid income (numeric characters only).')}
      />
      {incomeError ? <Text style={styles.errorText}>{incomeError}</Text> : null}

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        value={adoption.contactNumber}
        onChangeText={(text) => setAdoption({ ...adoption, contactNumber: text })}
        placeholder="Enter Contact Number"
        keyboardType="phone-pad"
        style={styles.textBoxes}
        onBlur={() => setContactError(validateContact(adoption.contactNumber) ? '' : 'Please enter a valid 11-digit contact number.')}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={adoption.address}
        onChangeText={(text) => setAdoption({ ...adoption, address: text })}
        placeholder="Enter Address"
        style={styles.textBoxes}
        onBlur={() => setAddressError(adoption.address.trim() === '' ? 'Address is required.' : '')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Reason for Adoption</Text>
      <TextInput
        value={adoption.reason}
        onChangeText={(text) => setAdoption({ ...adoption, reason: text })}
        placeholder="Enter Reason for Adoption"
        style={styles.textBoxes}
        onBlur={() => setReasonError(adoption.reason.trim() === '' ? 'Reason for Adoption is required.' : '')}
      />
      {reasonError ? <Text style={styles.errorText}>{reasonError}</Text> : null}

      <Text style={styles.label}>Do you have other children?</Text>
      <Picker
        selectedValue={adoption.otherChildren}
        onValueChange={(itemValue) => setAdoption({ ...adoption, otherChildren: itemValue })}
        style={{ ...styles.textBoxes, color: 'black' }}
        itemStyle={{ color: 'black' }}
      >
        <Picker.Item label='No' value='No' />
        <Picker.Item label='Yes' value='Yes' />
      </Picker>

      {adoption.otherChildren === 'Yes' && (
        <>
          <Text style={styles.label}>Details of Other Children</Text>
          <TextInput
            value={adoption.childrenDetails}
            onChangeText={(text) => setAdoption({ ...adoption, childrenDetails: text })}
            placeholder="Enter Details"
            style={styles.textBoxes}
            onBlur={() => setChildrenDetailsError(validateChildrenDetails(adoption.childrenDetails) ? '' : 'Additional validation logic if needed.')}
          />
          {childrenDetailsError ? <Text style={styles.errorText}>{childrenDetailsError}</Text> : null}
        </>
      )}

      <Text style={styles.label}>Do you have any criminal record?</Text>
      <Picker
        selectedValue={adoption.criminalRecord}
        onValueChange={(itemValue) => setAdoption({ ...adoption, criminalRecord: itemValue })}
        style={{ ...styles.textBoxes, color: 'black' }}
        itemStyle={{ color: 'black' }}
      >
        <Picker.Item label='No' value='No' />
        <Picker.Item label='Yes' value='Yes' />
      </Picker>

      {adoption.criminalRecord === 'Yes' && (
        <>
          <Text style={styles.label}>Details of Criminal Record</Text>
          <TextInput
            value={adoption.criminalRecordDetails}
            onChangeText={(text) => setAdoption({ ...adoption, criminalRecordDetails: text })}
            placeholder="Enter Details"
            style={styles.textBoxes}
            onBlur={() => setCriminalRecordDetailsError(validateCriminalRecordDetails(adoption.criminalRecordDetails) ? '' : 'Additional validation logic if needed.')}
          />
          {criminalRecordDetailsError ? <Text style={styles.errorText}>{criminalRecordDetailsError}</Text> : null}
        </>
      )}

      <Button title='Submit' onPress={submitForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  textBoxes: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ChildAdoptionForm;
