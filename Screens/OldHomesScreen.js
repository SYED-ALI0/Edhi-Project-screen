import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native';

const OldHomesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Edhi Foundation Old Homes</Text>
        </View>

        <ScrollView horizontal style={styles.imageScrollContainer}>
          <Image source={require('../images/old1.jpeg')} style={styles.image} />
          <Image source={require('../images/old2.jpeg')} style={styles.image} />
          <Image source={require('../images/old3.jpeg')} style={styles.image} />
          <Image source={require('../images/old4.jpeg')} style={styles.image} />
          <Image source={require('../images/old5.jpeg')} style={styles.image} />
          {/* <Image source={require('../images/image1.jpeg')} style={styles.image} />
          <Image source={require('../images/image1.jpeg')} style={styles.image} /> */}
          {/* Add more images as needed */}
        </ScrollView>

        <View style={styles.contentContainer}>
          <Text style={styles.paragraph}>
            Welcome to Edhi Foundation's Old Homes, where we provide a caring and supportive environment for the elderly. Our mission is to ensure the well-being and comfort of every resident, fostering a sense of community and happiness.
          </Text>
          <Text style={styles.paragraph}>
            Our dedicated staff is committed to providing personalized care, addressing the unique needs of each resident. From health services to recreational activities, we strive to make a positive impact on the lives of the elderly in our care.
          </Text>
          <Text style={styles.paragraph}>
            Join us in our mission to create a home where seniors can enjoy their golden years with dignity and joy.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Buttons Container at the bottom */}
      <View style={styles.fixedButtonsContainer}>
        <Button
          title="Admission Form"
          onPress={() => navigation.navigate('OldHomeAdmissionForm')}
          color="#3498db"
          style={styles.button}
        />
        {/* "Volunteer Form" button removed */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageScrollContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
    color: '#333',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  button: {
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonSpacing: {
    height: 10,
  },
});

export default OldHomesScreen;
