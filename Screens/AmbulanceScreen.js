import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, Linking, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../components/firebase';

export default function AmbulanceScreen() {
  const [location, setLocation] = useState(null);
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          setLocationPermissionDenied(true);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log('Location: ', currentLocation);
        setLocationConfirmed(true);
      } catch (error) {
        console.error('Error while getting location permission:', error);
      }
    };

    getPermissions();
  }, []);

  const storeEmergencyRequest = async () => {
    try {
      const emergencyRequestsCollection = collection(db, 'emergencyRequests');
      await addDoc(emergencyRequestsCollection, {
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        requestTime: serverTimestamp(),
        emergencyContact: {
          name: contactName,
          number: contactNumber,
        },
      });
      console.log('Emergency request stored successfully');
    } catch (error) {
      console.error('Error storing emergency request:', error);
    }
  };

  const handleEmergencyRequest = () => {
    if (!isValidName(contactName)) {
      Alert.alert(
        'Invalid Name',
        'Please enter a valid name without special characters or numbers.'
      );
      return;
    }

    if (!isValidPhoneNumber(contactNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }

    if (locationPermissionDenied) {
      showLocationAccessDeniedAlert();
    } else {
      if (!emergencyRequested) {
        if (locationConfirmed) {
          Alert.alert(
            'Emergency Assistance',
            'Are you sure you want to request an ambulance?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Request',
                onPress: async () => {
                  setEmergencyRequested(true);
                  await storeEmergencyRequest();
                  setContactName(''); // Clear the name field
                  setContactNumber(''); // Clear the number field
                  Alert.alert(
                    'Ambulance Request Confirmed',
                    'An ambulance has been requested. Assistance will arrive soon.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Reset the fields after alert confirmation
                          setContactName('');
                          setContactNumber('');
                        },
                      },
                    ]
                  );
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'Location Confirmation Required',
            'Please wait while your location is being confirmed.'
          );
        }
      } else {
        Alert.alert('Emergency Assistance', 'An ambulance has already been requested.');
      }
    }
  };

  const showLocationAccessDeniedAlert = () => {
    Alert.alert(
      'Location Access Required',
      'To use this feature, please enable location access in your device settings.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Enable',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  };

  const isValidName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const isValidPhoneNumber = (number) => {
    const pakistanPhoneNumberPattern = /^(0|\+92)?[0-9]{11}$/;
    return pakistanPhoneNumberPattern.test(number);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          />
        </MapView>
      )}

      <View style={styles.contactContainer}>
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Name"
          onChangeText={setContactName}
          value={contactName}
          placeholderTextColor="#2DAA42"
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact Number"
          onChangeText={setContactNumber}
          value={contactNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#2DAA42"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Call Ambulance"
          onPress={handleEmergencyRequest}
          disabled={emergencyRequested || locationPermissionDenied || !locationConfirmed}
          style={styles.button}
          color="#2DAA42"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  contactContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  input: {
    height: 40,
    borderColor: '#2DAA42',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2DAA42',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
