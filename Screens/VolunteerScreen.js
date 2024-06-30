import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput, Alert, Text, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../components/firebase';
import { Select } from 'native-base';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const cities = [
  'Select City',
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Quetta', 'Peshawar', 'Sialkot', 'Abbottabad'
];

const VolunteerScreen = ({ navigation }) => {
  const [email, setEmail] = useState(auth.currentUser?.email);
  const [user, setUser] = useState({
    userName: '',
    userAge: '',
    userEmail: email,
    userGender: 'Select Gender',
    userContact: '',
    userLocation: 'Select City',
    userAvailability: '',
  });

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [contactError, setContactError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const nav = useNavigation(); // Use useNavigation

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
    console.log('Submit button pressed');
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
      console.log('Form is valid, checking for existing user...');
      const { emailExists, contactExists } = await checkExistingUser(user.userEmail, user.userContact);

      if (emailExists) {
        Alert.alert('Email already registered', 'This email is already registered. Please use another email.');
        return;
      }

      if (contactExists) {
        Alert.alert('Contact already registered', 'This contact number is already registered. Please use another contact number.');
        return;
      }

      setSubmitDisabled(true);
      const userDb = collection(db, "volunteers");
      try {
        const timestamp = serverTimestamp();
        await addDoc(userDb, {
          userName: user.userName,
          age: user.userAge,
          email: user.userEmail,
          gender: user.userGender,
          contact: user.userContact,
          location: user.userLocation,
          availability: user.userAvailability,
          createdAt: timestamp,
        });
        Alert.alert('Data submitted successfully!');
        setUser({
          userName: '',
          userAge: '',
          userEmail: '',
          userGender: 'Select Gender',
          userContact: '',
          userLocation: 'Select City',
          userAvailability: '',
        });
      } catch (error) {
        console.error('Error submitting data:', error);
        Alert.alert('Error submitting data');
      } finally {
        setSubmitDisabled(false);
      }
    } else {
      console.log('Form is not valid');
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
        <Select
          selectedValue={user.userGender}
          minWidth="200"
          placeholder="Select Gender"
          onValueChange={itemValue => setUser({ ...user, userGender: itemValue })}
        >
          <Select.Item label="Male" value="Male" />
          <Select.Item label="Female" value="Female" />
        </Select>
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
        <Select
          selectedValue={user.userLocation}
          minWidth="200"
          placeholder="Select Location"
          onValueChange={itemValue => setUser({ ...user, userLocation: itemValue })}
        >
          {cities.map((city, index) => (
            <Select.Item key={index} label={city} value={city} />
          ))}
        </Select>
        {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Availability</Text>
        <TextInput
          value={user.userAvailability}
          onChangeText={(text) => setUser({ ...user, userAvailability: text })}
          placeholder="Enter your availability"
          style={styles.textBoxes}
          keyboardType="default"
          onBlur={() => setAvailabilityError(user.userAvailability.trim() ? '' : 'Please enter your availability.')}
        />
        {availabilityError ? <Text style={styles.errorText}>{availabilityError}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
  <Button
    title="Submit"
    onPress={submit}
    disabled={submitDisabled}
    color="#007bff"
  />
</View>
<View style={styles.buttonContainer}>
  <Button
    title="Tasks"
    onPress={() => navigation.navigate('TasksScreen')}
    color="#007bff"
  />
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textBoxes: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  buttonContainer: {
    marginVertical: 10, // Adds vertical margin to each button container
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20, // Increased margin to create more space between buttons
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VolunteerScreen;
