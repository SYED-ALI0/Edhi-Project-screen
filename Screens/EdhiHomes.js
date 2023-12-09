import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EdhiHomes = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OldHomesScreen')}
      >
        <Text style={styles.buttonText}>Old Homes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ChildCareScreen')}
      >
        <Text style={styles.buttonText}>Child Care</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EdhiHomes;
