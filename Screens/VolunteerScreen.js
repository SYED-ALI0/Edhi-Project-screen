import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput, Alert, Text, ScrollView } from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Picker } from '@react-native-picker/picker';

const cities = [
  'Select City', // Set a placeholder
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Quetta', 'Peshawar', 'Sialkot', 'Abbottabad'
  // Add more cities as needed
];

const VolunteerScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    userName: '',
    userAge: '',
    userEmail: '',
    userGender: 'Select Gender', // Set an initial value
    userContact: '',
    userLocation: 'Select City', // Set an initial value
    userAvailability: '',
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [contactError, setContactError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

  async function checkExistingUser(email, contact) {
    const volunteerRef = collection(db, 'volunteers');
    
    const emailQuery = query(volunteerRef, where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);
    
    const contactQuery = query(volunteerRef, where('contact', '==', contact));
    const contactSnapshot = await getDocs(contactQuery);

    return {
      emailExists: !emailSnapshot.empty,
      contactExists: !contactSnapshot.empty,
    };
  }

  async function submit() {
    // Basic input validation
    let isValid = true;

    if (!validateName(user.userName)) {
      setNameError('Please enter a valid name (letters only).');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!validateAge(user.userAge)) {
      if (parseInt(user.userAge, 10) < 18) {
        setAgeError('Volunteers must be 18 years or older.');
      } else {
        setAgeError('Please enter a valid age (18-80).');
      }
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!validateEmail(user.userEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (user.userGender === 'Select Gender') {
      setGenderError('Please select a gender.');
      isValid = false;
    } else {
      setGenderError('');
    }

    if (!validateContact(user.userContact)) {
      setContactError('Please enter a valid 11-digit contact number.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (user.userLocation === 'Select City') {
      setLocationError('Please select a city.');
      isValid = false;
    } else {
      setLocationError('');
    }

    if (user.userAvailability.trim() === '') {
      setAvailabilityError('Please enter your availability.');
      isValid = false;
    } else {
      setAvailabilityError('');
    }

    if (isValid) {
      const { emailExists, contactExists } = await checkExistingUser(user.userEmail, user.userContact);

      if (emailExists) {
        Alert.alert('Email already registered', 'This email is already registered. Please use another email.');
        return;
      }

      if (contactExists) {
        Alert.alert('Contact already registered', 'This contact number is already registered. Please use another contact number.');
        return;
      }

      const userDb = collection(db, "volunteers");
      addDoc(userDb, {
        userName: user.userName,
        age: user.userAge,
        email: user.userEmail,
        gender: user.userGender,
        contact: user.userContact,
        location: user.userLocation,
        availability: user.userAvailability,
      }).then(() => {
        Alert.alert('Data submitted successfully!');
        // Clear the fields after successful submission
        setUser({
          userName: '',
          userAge: '',
          userEmail: '',
          userGender: 'Select Gender',
          userContact: '',
          userLocation: 'Select City',
          userAvailability: '',
        });
      }).catch((error) => {
        Alert.alert('Error submitting data');
      });
    } else {
      Alert.alert('Please provide valid information.');
    }
  }

  function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateAge(age) {
    const parsedAge = parseInt(age, 10);
    return !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 80 && parsedAge >= 18;
  }

  function validateEmail(email) {
    // Simple email validation
    return /\S+@\S+\.\S+/.test(email);
  }

  function validateContact(contact) {
    return /^\d{11}$/.test(contact);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder='Enter your name'
          value={user.userName}
          onChangeText={(text) => setUser({ ...user, userName: text })}
          style={styles.textBoxes}
          keyboardType="default"
          onBlur={() => setNameError(validateName(user.userName) ? '' : 'Please enter a valid name (letters only).')}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          value={user.userAge}
          onChangeText={(text) => setUser({ ...user, userAge: text })}
          placeholder="Enter your age"
          keyboardType="numeric"
          style={styles.textBoxes}
          onBlur={() => setAgeError(validateAge(user.userAge) ? '' : 'Please enter a valid age (18-80).')}
        />
        {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={user.userEmail}
          onChangeText={(text) => setUser({ ...user, userEmail: text })}
          placeholder="Enter your email"
          style={styles.textBoxes}
          keyboardType="email-address"
          onBlur={() => setEmailError(validateEmail(user.userEmail) ? '' : 'Please enter a valid email address.')}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={user.userGender}
          onValueChange={(itemValue) => setUser({ ...user, userGender: itemValue })}
          style={styles.textBoxes}
          itemStyle={{ color: 'black' }}
        >
          <Picker.Item label="Select Gender" value="Select Gender" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Contact</Text>
        <TextInput
          value={user.userContact}
          onChangeText={(text) => setUser({ ...user, userContact: text })}
          placeholder="Enter your contact number"
          keyboardType="numeric"
          style={styles.textBoxes}
          onBlur={() => setContactError(validateContact(user.userContact) ? '' : 'Please enter a valid 11-digit contact number.')}
        />
        {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <Picker
          selectedValue={user.userLocation}
          onValueChange={(itemValue) => setUser({ ...user, userLocation: itemValue })}
          style={styles.textBoxes}
          itemStyle={{ color: 'black' }}
        >
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city} value={city} />
          ))}
        </Picker>
        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Availability</Text>
        <TextInput
          value={user.userAvailability}
          onChangeText={(text) => setUser({ ...user, userAvailability: text })}
          placeholder="Enter your availability"
          style={styles.textBoxes}
          onBlur={() => setAvailabilityError(user.userAvailability.trim() === '' ? 'Please enter your availability.' : '')}
        />
        {availabilityError ? <Text style={styles.errorText}>{availabilityError}</Text> : null}
      </View>

      <Button title='Submit' onPress={submit} />

      {/* Add "Tasks" button */}
      <View style={styles.tasksButtonContainer}>
        <Button
          title='Tasks'
          onPress={() => navigation.navigate('TasksScreen')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  fieldContainer: {
    width: '80%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  textBoxes: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  tasksButtonContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default VolunteerScreen;
