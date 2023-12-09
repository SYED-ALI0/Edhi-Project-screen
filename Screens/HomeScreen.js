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
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    margin: 3,
  },
});
