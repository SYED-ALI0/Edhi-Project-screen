import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isEligible, setIsEligible] = useState(true); // Add state for eligibility

  const handleNavigation = (screenName) => {
    if (screenName === 'VolunteerScreen' && !isEligible) {
      // Check eligibility, show a message, or take appropriate action
      alert('You are not eligible to volunteer.');
    } else {
      // Navigate to the selected screen
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleNavigation('AmbulanceScreen')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Ambulance</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('VolunteerScreen')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Volunteer</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleNavigation('DonationScreen')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Donation</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('EdhiHomes')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Edhi Homes</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleNavigation('SomeOtherScreen')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Some Other Screen</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigation('YetAnotherScreen')}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Yet Another Screen</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Change background color to white
    paddingHorizontal: 20, // Add horizontal padding for better spacing
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center', // Center the rows horizontally
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 20, // Increase border radius for smoother corners
    marginHorizontal: 10, // Adjust horizontal margin
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Change background color to a green shade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Add elevation for Android shadow
  },
  boxText: {
    fontSize: 16, // Decrease font size slightly
    fontWeight: 'bold',
    color: '#ffffff', // Change text color to white
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});


