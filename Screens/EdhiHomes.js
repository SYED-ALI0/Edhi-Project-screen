import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const EdhiHomes = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OldHomesScreen')}
      >
        <Image
          source={require('../images/oldhome.jpg')} 
          style={styles.cardImage}
        />
        <Text style={styles.cardText}>Old Homes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ChildCareScreen')}
      >
        <Image
          source={require('../images/child.jpg')} 
          style={styles.cardImage}
        />
        <Text style={styles.cardText}>Child Care</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    width: '40%', 
  },
  cardImage: {
    width: 100, 
    height: 100, 
    borderRadius: 25,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EdhiHomes;
