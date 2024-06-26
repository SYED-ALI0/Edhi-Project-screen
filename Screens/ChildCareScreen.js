import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChildCareScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <LinearGradient colors={['#ffffff', '#f0f0f0']} style={styles.headerContainer}>
          <Text style={styles.header}>Edhi Foundation Child Care Services</Text>
        </LinearGradient>

        <ScrollView horizontal style={styles.imageScrollContainer}>
          <Image source={require('../images/child1.jpeg')} style={styles.image} />
          <Image source={require('../images/child2.jpeg')} style={styles.image} />
          <Image source={require('../images/child3.jpg')} style={styles.image} />
          <Image source={require('../images/child4.jpeg')} style={styles.image} />
          <Image source={require('../images/child5.jpeg')} style={styles.image} />
          {/* Add more images as needed */}
        </ScrollView>

        <View style={styles.contentContainer}>
          <Text style={styles.paragraph}>
            Welcome to Edhi Foundation's Child Care Services, where we prioritize the well-being and development of every child. Our mission is to create a loving and secure environment, fostering growth and happiness.
          </Text>
          <Text style={styles.paragraph}>
            Our dedicated team of professionals is committed to providing personalized care, ensuring that each child's unique needs are met. From educational support to health services, we strive to make a positive impact on the lives of the children under our care.
          </Text>
          <Text style={styles.paragraph}>
            Join us in our journey to make a difference. Together, we can build a brighter future for every child.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.fixedButtonsContainer}>
        <Button
          title="Admission Form"
          onPress={() => navigation.navigate('ChildAdmissionForm')}
          color="#3498db"
          style={styles.button}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Adoption Form"
          onPress={() => navigation.navigate('ChildAdoptionForm')}
          color="#2ecc71"
          style={styles.button}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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

export default ChildCareScreen;
