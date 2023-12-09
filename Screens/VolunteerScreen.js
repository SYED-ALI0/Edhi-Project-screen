import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput, Alert, Text } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
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
    userContact: '',
    userLocation: 'Select City', // Set an initial value
  });
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [contactError, setContactError] = useState('');
  const [locationError, setLocationError] = useState('');

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

  function submit() {
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

    if (isValid) {
      const userDb = collection(db, "volunteers");
      addDoc(userDb, {
        userName: user.userName,
        age: user.userAge,
        contact: user.userContact,
        location: user.userLocation,
      }).then(() => {
        Alert.alert('Data submitted successfully!');
        // Clear the fields after successful submission
        setUser({
          userName: '',
          userAge: '',
          userContact: '',
          userLocation: 'Select City', // Reset the location
        });
      }).catch((error) => {
        Alert.alert('Error submitting data');
      });
    } else {
      Alert.alert('Please provide valid information.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='name'
        value={user.userName}
        onChangeText={(text) => setUser({ ...user, userName: text })}
        style={styles.textBoxes}
        keyboardType="default"
        onBlur={() => setNameError(validateName(user.userName) ? '' : 'Please enter a valid name (letters only).')}
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <TextInput
        value={user.userAge}
        onChangeText={(text) => setUser({ ...user, userAge: text })}
        placeholder="age"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setAgeError(validateAge(user.userAge) ? '' : 'Please enter a valid age (18-80).')}
      />
      {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
      <TextInput
        value={user.userContact}
        onChangeText={(text) => setUser({ ...user, userContact: text })}
        placeholder="contact"
        keyboardType="numeric"
        style={styles.textBoxes}
        onBlur={() => setContactError(validateContact(user.userContact) ? '' : 'Please enter a valid 11-digit contact number.')}
      />
      {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
      <Picker
        selectedValue={user.userLocation}
        onValueChange={(itemValue) => setUser({ ...user, userLocation: itemValue })}
        style={{ ...styles.textBoxes, color: 'black' }} // Set the color of the selected value
        itemStyle={{ color: 'black' }} // Set the color of the items
      >
        {cities.map((city, index) => (
          <Picker.Item key={index} label={city} value={city} />
        ))}
      </Picker>

      {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
      <Button title='Submit' onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textBoxes: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    color: "black"
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  }
});

export default VolunteerScreen;
