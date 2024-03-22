import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isEligible, setIsEligible] = useState(true); 

  const handleNavigation = (screenName) => {
    if (screenName === 'VolunteerScreen' && !isEligible) {
      
      alert('You are not eligible to volunteer.');
    } else {
      
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
    backgroundColor: '#ffffff', 
    paddingHorizontal: 20, 
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center', 
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 20, 
    marginHorizontal: 10, 
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, 
  },
  boxText: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#ffffff', 
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});


