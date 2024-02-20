import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, Linking, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Function to convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export default function AmbulanceScreen() {
  const [location, setLocation] = useState(null);
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [ambulanceArrivalTime, setAmbulanceArrivalTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

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

  // Function to handle emergency request
  const handleEmergencyRequest = () => {
    if (locationPermissionDenied) {
      showLocationAccessDeniedAlert();
    } else {
      if (!emergencyRequested) {
        if (locationConfirmed) {
          // Display confirmation dialog
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
                onPress: () => {
                  // Logic to request ambulance
                  console.log("Ambulance requested");
                  setEmergencyRequested(true); // Update state to prevent multiple requests
                  const hospitalLocation = { latitude: 34.2193, longitude: 73.2394 }; // Example hospital location
                  const distance = calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    hospitalLocation.latitude,
                    hospitalLocation.longitude
                  );
                  const arrivalTime = estimateAmbulanceArrivalTime(distance);
                  setAmbulanceArrivalTime(arrivalTime); // Update ambulance arrival time
                  
                  // Show confirmation alert after ambulance request
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
        // Inform user that emergency request has already been made
        Alert.alert(
          "Emergency Assistance",
          "An ambulance has already been requested."
        );
      }
    }
  };

  // Function to estimate ambulance arrival time based on distance
  const estimateAmbulanceArrivalTime = (distance) => {
    // Average speed of ambulance in km/h
    const ambulanceSpeed = 60;
    // Calculate time in hours
    const timeInHours = distance / ambulanceSpeed;
    // Convert time to minutes
    const timeInMinutes = Math.round(timeInHours * 60);
    return timeInMinutes + " minutes";
  };

  // Function to show alert when location access is denied
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
          onPress: () => Linking.openSettings() // Open device settings
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
            latitudeDelta: 0.05, // Adjusted to zoom out
            longitudeDelta: 0.05, // Adjusted to zoom out
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

      {/* Button to request ambulance */}
      <View style={styles.buttonContainer}>
        <Button
          title="Call Ambulance"
          onPress={handleEmergencyRequest}
          disabled={emergencyRequested || locationPermissionDenied || !locationConfirmed}
        />
      </View>

      {/* Display ambulance arrival time */}
      {emergencyRequested && ambulanceArrivalTime && (
        <View style={styles.ambulanceArrivalContainer}>
          <Text>Ambulance Arrival Time: {ambulanceArrivalTime}</Text>
        </View>
      )}
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
  ambulanceArrivalContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
