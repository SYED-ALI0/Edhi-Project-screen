import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { imagesDataURL } from "../../constants/constants/data";

import { auth, db, storage } from '../../Firebase/firebase.config'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// import { getStorage, ref } from "firebase/storage";



const EditProfile = ({ navigation, route }) => {
    console.log(route.params)
    const { userData }  = route.params;
    // const { userData } = route.params.userData;
    // const { profilePic } = route.params.profilePic;
    // console.log("userData : ", userData);
    // const userData = null;
    // const profilePic = null;

    // route.params == userData ? (
    //      userData  = route.params
    // ) : (
    //      userData = route.params.userData;
    //      profilePic = route.params.profilePic;
    // )

    navigation.setOptions({
        // title: userData[1],
        // headerStyle: { backgroundColor: COLORS.primary, },
        // headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "bold", },
        headerLeft : () => (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
            </TouchableOpacity>
        ),
    });




    const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
    // const [selectedImage, setSelectedImage] = useState(null);
    // const [selectedImage, setSelectedImage] = useState(null);
    // const [email, setEmail] = useState(auth.currentUser?.email);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [num, setNum] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    // const [profileImage, setProfileImage] = useState();



    
    useEffect(() => {

        if (userData) {
            const userName = userData.name;
            // setEmail(userData.email);
            setEmail(userData[0]);
            setName(userData[1]);
            setNum(userData[2]);
            setAge(userData[3]);
            setImage(userData[4]);
            // Update other state variables similarly
        }
    }, []);
    
    console.log("email: "+ email + " num: " + num + " name: " + name + " age: " + age + " image: " + image);
    
  

    const handleImageSelection = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        });

        console.log(result);
        console.log(result.assets[0].uri);

        if (!result.canceled) {
            // setSelectedImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    };
    
    
    const uploadImage = async (uri) => {
        
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        try {
            // const storageRef = ref(storage, `Images/picture-${new Date().toISOString()}`);  
            const storageRef = ref(storage, `Images/picture-${Date.now()}`);
            
            const result = await uploadBytes(storageRef, blob);

            blob.close();

            // const downloadURL = await getDownloadURL(result.ref);
            const downloadURL = await getDownloadURL(storageRef);
            setImageURL(downloadURL);

            return await getDownloadURL(storageRef);
            
        } catch (error) {
            console.log(`Rrror: ${error}`);
        }

    };


    // const uploadImage = async () => {
        // const response = await fetch(image);
        // const response = await fetch(selectedImage);
        // const blob = await response.blob();
    
        // const storageRef = await firebase.storage().ref().child(`images/${new Date().toISOString()}`);
        // await storageRef.put(blob);
        // alert('Image uploaded successfully!');

    // };


    const updateData = async () => {
        try {
            const user = auth.currentUser;
            const uid = user.uid;
            // const docRef = doc(db, "users", uid);
            const docRef = doc(db, "users", email);
            const payload = { 
                userName: name, 
                email: email, 
                phoneNumber: num, 
                age: age,
                image : image,
            };
            const res = await updateDoc(docRef, payload);
            // const res = await setDoc(docRef, payload);
            // console.log("res : ", res);
        } catch (err) {
            console.log(err);
        }
    }


    const handleSave = async () => {
            if (!name.trim()) {
                alert("Please enter your name");
                return;
            }
        
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address");
                return;
            }
        
            if (!num.trim() || num.length !== 11 || isNaN(num)) {
                alert("Please enter a valid 11-digit mobile number");
                return;
            }
        
            if (!age.trim() || isNaN(age)) {
                alert("Please enter a valid age");
                return;
            
        
            // If all validations pass, proceed with saving data
            console.log("All fields are valid. Proceeding with saving data...");
            // ...rest of your save logic
        };
        console.log("Saved");

        // const uploadURL = await uploadImage(selectedImage);
        const uploadURL = await uploadImage(image);
        console.log("uploadURL : ", uploadURL);

        // setSelectedImage(uploadURL);
        // console.log(setSelectedImage(uploadURL));
        setImage(uploadURL);
        // console.log(setImage(uploadURL));
        
        updateData();
        
        // navigation.goBack();
        // navigation.navigate("Settings", {profilePic: uploadURL});
        navigation.navigate("Settings", {profilePic: image});
    }

    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingHorizontal: 22,
            }}
            >
            
            <ScrollView>
                <View
                    style={{
                        alignItems: "center",
                        marginVertical: 2,
                    }}
                >
                {/* <TouchableOpacity onPress={handleImageSelection}> */}
                  
                    {!image ? (
                        <Image
                            source={{ uri: selectedImage}}
                            style={{
                                height: 170,
                                width: 170,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: COLORS.primary,
                            }}
                            
                        />
                        // <Text>{{console.log("no image ")}}</Text>
                        
                        
                     ) : (
                        <Image
                            source={{ uri: image }}
                            style={{
                                height: 170,
                                width: 170,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: '#007260',
                            }}
                        />
                   

                    )}


                    <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 89,
                        zIndex: 9999,
                    }}
                    >
                        <TouchableOpacity onPress={handleImageSelection}>
                            <MaterialIcons
                                name="photo-camera"
                                size={32}
                                color='#007260'
                            />
                        </TouchableOpacity>
                    </View>
                {/* </TouchableOpacity> */}
                </View>

                <View>
                <View
                    style={{
                        flexDirection: "column",
                        marginBottom: 6,
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>Name</Text>
                    <View
                    style={{
                        height: 44,
                        width: "100%",
                        borderColor: COLORS.secondaryGray,
                        borderWidth: 1,
                        borderRadius: 4,
                        marginVertical: 6,
                        justifyContent: "center",
                        paddingLeft: 8,
                    }}
                    >
                    <TextInput
                        value={name}
                        onChangeText={(value) => setName(value)}
                        editable={true}
                    />
                    </View>
                </View>

                <View
                    style={{
                    flexDirection: "column",
                    marginBottom: 6,
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>Email</Text>
                    <View
                    style={{
                        height: 44,
                        width: "100%",
                        borderColor: COLORS.secondaryGray,
                        borderWidth: 1,
                        borderRadius: 4,
                        marginVertical: 6,
                        justifyContent: "center",
                        paddingLeft: 8,
                    }}
                    >
                    <TextInput
                        value={email}
                        // onChangeText={(value) => setEmail(value)}
                        editable={false}
                    />
                    </View>
                </View>

                <View
                    style={{
                    flexDirection: "column",
                    marginBottom: 6,
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>Mobile Number</Text>

                        <View style={{
                             height: 44,
                             width: "100%",
                             borderColor: COLORS.secondaryGray,
                             borderWidth: 1,
                             borderRadius: 4,
                             marginVertical: 6,
                             justifyContent: "center",
                             paddingLeft: 8,
                        }}>
                           
                            <TextInput
                                value={num}
                                onChangeText={text => setNum(text)}
                                // maxLength={10} 
                                maxLength={11} 
                                keyboardType='numeric'
                                style={{
                                    width: "80%"
                                }}
                            />
                        </View>
                    </View>

                <View
                    style={{
                    flexDirection: "column",
                    marginBottom: 6,
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>Age</Text>
                    <View
                    style={{
                        height: 44,
                        width: "100%",
                        borderColor: COLORS.secondaryGray,
                        borderWidth: 1,
                        borderRadius: 4,
                        marginVertical: 6,
                        justifyContent: "center",
                        paddingLeft: 8,
                    }}
                    >
                        <TextInput
                            // value={Age}
                            value={age}
                            onChangeText={(value) => setAge(value)}
                            maxLength={3} 
                            editable={true}
                            keyboardType='numeric'
                            style={{
                                width: "80%"
                            }}
                        />
                    </View>
                </View>

              

                </View>


                <TouchableOpacity
                    // OnPress={() => {navigation.navigate("Settings")} }
                    onPress={()=>{handleSave()}}
                    style={{
                        backgroundColor: '#007260',
                        height: 44,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <Text
                        style={{
                        ...FONTS.body3,
                        color: COLORS.white,
                        }}
                    >
                        Save Change
                    </Text>
                </TouchableOpacity>

                
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;
