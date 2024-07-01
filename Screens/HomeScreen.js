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
    require('../images/Edhi_Logo.png'),
    require('../images/old1.jpeg'),
    require('../images/userhome3.jpeg'),
    require('../images/userhome2.jpeg'),

    require('../images/userhome6.jpeg'),
    require('../images/userhome7.jpeg'),
    require('../images/old1.jpeg'),
    require('../images/userhome3.jpeg'),

    require('../images/old1.jpeg'),
    // require('../images/old1.jpeg'),
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
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
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
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
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

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('EdhiHomes')}>
            <FontAwesome name="home" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Edhi Homes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => handleNavigation('BloodDonationMainScreen')}>
            <FontAwesome name="heartbeat" size={35} color="#2DAA42" />
            <Text style={styles.iconText}>Blood Donation</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5', // Subtle background color
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '45%',
    backgroundColor: '#ffffff', // Changed to white
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: -1,
    shadowColor: '#2DAA42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10, // Added shading for depth
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    borderRadius: 50, // Move content up
  },
  imageContainer: {
    height: height * 0.25, // Reduced height to move up
    // marginBottom: 20, // Space between image and buttons
  },
  imageWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 39,

  },
  image: {
    width: width * 0.85,
    height: width * 0.6,
    borderRadius: 25,
  },
  horizontalScroll: {
    marginTop: 20,
  },
  box: {
    width: 110, // Fixed width for uniformity
    height: 200, // Increased height
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#2DAA42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6, // Increased shadow opacity
    shadowRadius: 5, // Increased shadow radius
    elevation: 15,
    marginTop: 135,
    marginHorizontal: 10,
    padding: 10,
  },
  iconText: {
    color: '#2DAA42',
    marginTop: 5,
    textAlign: 'center',
    fontSize: RFPercentage(1.5),
  },
});

export default HomeScreen;
