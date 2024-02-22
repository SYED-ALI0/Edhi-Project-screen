import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, Linking, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../components/firebase';

export default function AmbulanceScreen() {
  const [location, setLocation] = useState(null);
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("Location permission denied");
          setLocationPermissionDenied(true);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log("Location: ", currentLocation);
        setLocationConfirmed(true);
      } catch (error) {
        console.error("Error while getting location permission:", error);
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
        userInfo: {
          // You can add more user info here if needed
          userId: 'USER_ID', // Replace with actual user ID
        },
      });
      console.log('Emergency request stored successfully');
    } catch (error) {
      console.error('Error storing emergency request:', error);
    }
  };

  const handleEmergencyRequest = () => {
    if (locationPermissionDenied) {
      showLocationAccessDeniedAlert();
    } else {
      if (!emergencyRequested) {
        if (locationConfirmed) {
          Alert.alert(
            "Emergency Assistance",
            "Are you sure you want to request an ambulance?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Request",
                onPress: async () => {
                  setEmergencyRequested(true);
                  await storeEmergencyRequest(); // Store emergency request
                  Alert.alert(
                    "Ambulance Request Confirmed",
                    "An ambulance has been requested. Assistance will arrive soon."
                  );
                }
              }
            ]
          );
        } else {
          Alert.alert(
            "Location Confirmation Required",
            "Please wait while your location is being confirmed."
          );
        }
      } else {
        Alert.alert(
          "Emergency Assistance",
          "An ambulance has already been requested."
        );
      }
    }
  };

  const showLocationAccessDeniedAlert = () => {
    Alert.alert(
      "Location Access Required",
      "To use this feature, please enable location access in your device settings.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Enable",
          onPress: () => Linking.openSettings()
        }
      ]
    );
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

      <View style={styles.buttonContainer}>
        <Button
          title="Call Ambulance"
          onPress={handleEmergencyRequest}
          disabled={emergencyRequested || locationPermissionDenied || !locationConfirmed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
