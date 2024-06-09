import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Text, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const images = [
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/old1.jpeg'),
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  }, [currentIndex]);

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.image} />
            </View>
          )}
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          pagingEnabled
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('AmbulanceScreen')}>
            <FontAwesome name="ambulance" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Ambulance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('VolunteerScreen')}>
            <FontAwesome name="handshake-o" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Volunteers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('DonationScreen')}>
            <FontAwesome name="money" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Donation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('EdhiHomes')}>
            <FontAwesome name="home" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Edhi Homes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('BloodDonationMainScreen')}>
            <FontAwesome name="heartbeat" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Blood Donation</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('YetAnotherScreen')}>
            <FontAwesome name="file-text" size={34} color="#2DAA42" />
            <Text style={styles.iconText}>News</Text>
            <Text style={styles.iconText}>Feed</Text>


          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f0f0f5', // Subtle background color
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '45%', // Extend the height of the background
    backgroundColor: '#8CB369', // Icon color
    borderBottomLeftRadius: 40, // Adjust the border radius
    borderBottomRightRadius: 40, // Adjust the border radius
    zIndex: -1, // Ensure the background does not interfere with the content
  },
  scrollContainer: {
    flexGrow: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  iconText: {
    color: '#2DAA42',
    // marginTop: 5,
    textAlign: 'center',
    fontSize: RFPercentage(1.5),
  },
  imageContainer: {
    width: width, // Make the container width same as screen width to center the image
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    // marginRight: -10, // Adjust to move the container to the left
    marginTop: -25, // Adjust to move the container up
  },
  image: {
    width: width * 0.85, // Make the image responsive to screen width
    height: width * 0.4, // Maintain a 2:1 aspect ratio
    borderRadius: 25,
  },
});

export default HomeScreen;