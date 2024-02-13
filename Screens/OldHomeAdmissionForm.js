import React, { useState } from 'react';
import { View, Button, TextInput, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import {Select} from "native-base"

import { Picker } from '@react-native-picker/picker';

const OldHomeAdmissionForm = () => {
  const [admission, setAdmission] = useState({
    applicantName: '',
    applicantAge: '',
    applicantGender: 'Select Gender',
    maritalStatus: 'Select Marital Status',
    occupation: '',
    monthlyIncome: '',
    contactNumber: '',
    address: '',
    healthCondition: '',
    medication: '',
    emergencyContact: '',
    relationshipWithEmergencyContact: '',
    anyAllergies: 'No',
    allergiesDetails: '',
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [contactError, setContactError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [healthConditionError, setHealthConditionError] = useState('');
  const [emergencyContactError, setEmergencyContactError] = useState('');
  const [allergiesDetailsError, setAllergiesDetailsError] = useState('');

  function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    return !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120 && parsedAge >= 60;
  }

  function validateContact(contact) {
    return /^\d{10}$/.test(contact);
  }

  function validateOccupation(occupation) {
    return /^[a-zA-Z\s]+$/.test(occupation);
  }

  function validateIncome(monthlyIncome) {
    return /^\d+$/.test(monthlyIncome);
  }

  function validateHealthCondition(healthCondition) {
    // Additional validation logic if needed
    return true;
  }

  function validateEmergencyContact(emergencyContact) {
    return /^\d{10}$/.test(emergencyContact);
  }

  function validateAllergiesDetails(allergiesDetails) {
    // Additional validation logic if needed
    return true;
  }

  function submitForm() {
    // Basic input validation
    let isValid = true;

    if (!validateName(admission.applicantName)) {
      setNameError('Please enter a valid name (letters only).');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!validateAge(admission.applicantAge)) {
      setAgeError('Applicants must be 60 years or older.');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!validateContact(admission.contactNumber)) {
      setContactError('Please enter a valid 10-digit contact number.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (!validateOccupation(admission.occupation)) {
      setAddressError('Please enter a valid occupation (letters only).');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (!validateIncome(admission.monthlyIncome)) {
      setAddressError('Please enter a valid monthly income (numeric characters only).');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (admission.address.trim() === '') {
      setAddressError('Address is required.');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (admission.healthCondition.trim() === '') {
      setHealthConditionError('Health condition is required.');
      isValid = false;
    } else {
      setHealthConditionError('');
    }

    if (!validateEmergencyContact(admission.emergencyContact)) {
      setEmergencyContactError('Please enter a valid 10-digit emergency contact number.');
      isValid = false;
    } else {
      setEmergencyContactError('');
    }

    if (admission.anyAllergies === 'Yes' && !validateAllergiesDetails(admission.allergiesDetails)) {
      setAllergiesDetailsError('Additional validation logic if needed.');
      isValid = false;
    } else {
      setAllergiesDetailsError('');
    }

    if (isValid) {
      const admissionDb = collection(db, 'oldHomeAdmissionForms');
      addDoc(admissionDb, {
        applicantName: admission.applicantName,
        applicantAge: admission.applicantAge,
        applicantGender: admission.applicantGender,
        maritalStatus: admission.maritalStatus,
        occupation: admission.occupation,
        monthlyIncome: admission.monthlyIncome,
        contactNumber: admission.contactNumber,
        address: admission.address,
        healthCondition: admission.healthCondition,
        medication: admission.medication,
        emergencyContact: admission.emergencyContact,
        relationshipWithEmergencyContact: admission.relationshipWithEmergencyContact,
        anyAllergies: admission.anyAllergies,
        allergiesDetails: admission.allergiesDetails,
      })
        .then(() => {
          Alert.alert('Form Submitted', 'Old home admission form submitted successfully.');
          setAdmission({
            applicantName: '',
            applicantAge: '',
            applicantGender: 'Select Gender',
            maritalStatus: 'Select Marital Status',
            occupation: '',
            monthlyIncome: '',
            contactNumber: '',
            address: '',
            healthCondition: '',
            medication: '',
            emergencyContact: '',
            relationshipWithEmergencyContact: '',
            anyAllergies: 'No',
            allergiesDetails: '',
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
      <Text style={styles.label}>Applicant's Full Name</Text>
      <TextInput
        value={admission.applicantName}
        onChangeText={(text) => setAdmission({ ...admission, applicantName: text })}
        placeholder="Enter Applicant's Full Name"
        style={styles.textBoxes}
        onBlur={() => setNameError(validateName(admission.applicantName) ? '' : 'Please enter a valid name (letters only).')}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={admission.applicantAge}
        onChangeText={(text) => setAdmission({ ...admission, applicantAge: text })}
        placeholder="Enter Age"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setAgeError(validateAge(admission.applicantAge) ? '' : 'Applicants must be 60 years or older.')}
      />
      {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

      <Text style={styles.label}>Gender</Text>
            
      <Select selectedValue={admission.applicantGender} minWidth="200" accessibilityLabel="Choose Service" placeholder="Select Gender"  mt={1} onValueChange={itemValue =>  setAdmission({ ...admission, applicantGender: itemValue })}>
          <Select.Item label="Male" value="Male" />
          <Select.Item label="Female" value="Female"  />
          <Select.Item label="Other" value="Other" />
        </Select>

      <Text style={styles.label}>Marital Status</Text>
     
      <Select selectedValue={admission.maritalStatus} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Marital Status"  mt={1} onValueChange={itemValue =>  setAdmission({ ...admission, maritalStatus: itemValue })}>
          <Select.Item label="Single" value="Single" />
          <Select.Item label="Married" value="Marred" />
          <Select.Item label="Divorced" value="Divorced" />
          <Select.Item label="Widowed" value="Widowed" />
        </Select>

      <Text style={styles.label}>Occupation</Text>
      <TextInput
        value={admission.occupation}
        onChangeText={(text) => setAdmission({ ...admission, occupation: text })}
        placeholder="Enter Occupation"
        style={styles.textBoxes}
        onBlur={() => setAddressError(validateOccupation(admission.occupation) ? '' : 'Please enter a valid occupation (letters only).')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Monthly Income</Text>
      <TextInput
        value={admission.monthlyIncome}
        onChangeText={(text) => setAdmission({ ...admission, monthlyIncome: text })}
        placeholder="Enter Monthly Income"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setAddressError(validateIncome(admission.monthlyIncome) ? '' : 'Please enter a valid monthly income (numeric characters only).')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        value={admission.contactNumber}
        onChangeText={(text) => setAdmission({ ...admission, contactNumber: text })}
        placeholder="Enter Contact Number"
        keyboardType="phone-pad"
        style={styles.textBoxes}
        onBlur={() => setContactError(validateContact(admission.contactNumber) ? '' : 'Please enter a valid 10-digit contact number.')}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={admission.address}
        onChangeText={(text) => setAdmission({ ...admission, address: text })}
        placeholder="Enter Address"
        style={styles.textBoxes}
        onBlur={() => setAddressError(admission.address.trim() === '' ? 'Address is required.' : '')}
      />
      {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

      <Text style={styles.label}>Health Condition</Text>
      <TextInput
        value={admission.healthCondition}
        onChangeText={(text) => setAdmission({ ...admission, healthCondition: text })}
        placeholder="Enter Health Condition"
        style={styles.textBoxes}
        onBlur={() => setHealthConditionError(admission.healthCondition.trim() === '' ? 'Health condition is required.' : '')}
      />
      {healthConditionError ? <Text style={styles.errorText}>{healthConditionError}</Text> : null}

      <Text style={styles.label}>Medication</Text>
      <TextInput
        value={admission.medication}
        onChangeText={(text) => setAdmission({ ...admission, medication: text })}
        placeholder="Enter Medication"
        style={styles.textBoxes}
      />

      <Text style={styles.label}>Emergency Contact Number</Text>
      <TextInput
        value={admission.emergencyContact}
        onChangeText={(text) => setAdmission({ ...admission, emergencyContact: text })}
        placeholder="Enter Emergency Contact Number"
        keyboardType="phone-pad"
        style={styles.textBoxes}
        onBlur={() => setEmergencyContactError(validateEmergencyContact(admission.emergencyContact) ? '' : 'Please enter a valid 10-digit emergency contact number.')}
      />
      {emergencyContactError ? <Text style={styles.errorText}>{emergencyContactError}</Text> : null}

      <Text style={styles.label}>Relationship with Emergency Contact</Text>
      <TextInput
        value={admission.relationshipWithEmergencyContact}
        onChangeText={(text) => setAdmission({ ...admission, relationshipWithEmergencyContact: text })}
        placeholder="Enter Relationship"
        style={styles.textBoxes}
      />

      <Text style={styles.label}>Any Allergies?</Text>
    

      <Select selectedValue={admission.anyAllergies} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Option"  mt={1} onValueChange={itemValue =>  setAdmission({ ...admission, anyAllergies: itemValue })}>
          <Select.Item label="Yes" value="Yes" />
          <Select.Item label="No" value="No" />
       
        </Select>

      {admission.anyAllergies === "Yes" && (
        <>
          <Text style={styles.label}>Details of Allergies</Text>
          <TextInput
            value={admission.allergiesDetails}
            onChangeText={(text) => setAdmission({ ...admission, allergiesDetails: text })}
            placeholder="Enter Details"
            style={styles.textBoxes}
            onBlur={() => setAllergiesDetailsError(validateAllergiesDetails(admission.allergiesDetails) ? '' : 'Additional validation logic if needed.')}
          />
          {allergiesDetailsError && <Text style={styles.errorText}>{allergiesDetailsError}</Text>}
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

export default OldHomeAdmissionForm;
