import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, useWindowDimensions, FlatList, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, SIZES, images } from "../../constants/constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { imagesDataURL } from "../../constants/constants/data";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
// import { Button } from "../../components/Button";

import { db, auth } from '../../Firebase/firebase.config'
import { doc, getDoc, onSnapshot } from "firebase/firestore";



const UserProfileScreen = ({ navigation }) => {
    const [email, setEmail] = useState(auth.currentUser?.email);
    const [username, setUserName] = useState("");
    const [data, setData] = useState([]);
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [ImageUri, setImageUri] = useState(null);

    
        // const getDocs = async () => {
        //     const data = [];
        //     let d;
        //     const docRef = doc(db, "users", email);
        //     const docSnap = await getDoc(docRef);
        //     console.log("dAttta", docSnap);
            
        //     if (docSnap.exists()) {
        //         // console.log("Document data:", docSnap.data());

        //         // console.log(data.push(docSnap.data().email))
        //         console.log("\nTest Data retrive...")
                
        //         // data.push(docSnap.data().userName)
        //         // data.push(docSnap.data().phoneNumber)
        //         // data.push(docSnap.data().age)
        //         // data.push(docSnap.data().image)

        //         setUserName(docSnap.data().userName)
        //         setImageUri(docSnap.data().image)
        //         // console.log("Username: ", username)

        //         console.log("Data: ", data)
                
        //         setData(data);
                
        //     } 
        //     else {
        //         // docSnap.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }


        useEffect(() => {  
          
                //  getDocs();

            const docRef = doc(db, "users", email);
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    console.log("Document data:", doc.data());
                    setUserName(doc.data().userName)
                    setImageUri(doc.data().image)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });

            return () => { 
                console.log("Listenr Detatched");
                unsubscribe();
            }

        
            
        }, []);

    

    
    return (
        <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: COLORS.white,
        }}
        >
        <StatusBar backgroundColor={COLORS.gray} />
        <View style={{ width: "100%" }}>
            {/* <Image source={images.cover} resizeMode="cover" style={{ height: 228, width: "100%",}} /> */}

            <ImageBackground
                source={images.cover}
                resizeMode="cover"
                style={{
                    height: 228,
                    width: "100%",
                }}
            >
                <TouchableOpacity
                    onPress={() => {console.log("Settings"); navigation.navigate("Settings");}}
                    style={{ 
                        justifyContent: "flex-end", 
                        alignItems: "flex-end", 
                        padding: 16
                    }}
                >
                        <MaterialIcons name="settings" size={24} color={COLORS.black} />
                        {/* <MaterialIcons name="settings" size={24} color={focused ? COLORS.primary : COLORS.black} /> */}
                </TouchableOpacity>
            
            </ImageBackground>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>

        {!ImageUri ? (
            <Image
                // source={images.profile}
                source={{uri: imagesDataURL[0]}}
                resizeMode="contain"
                style={{
                    height: 155,
                    width: 155,
                    borderRadius: 999,
                    borderColor: COLORS.primary,
                    borderWidth: 2,
                    marginTop: -90,
                }}
            />
            ) : (
                <Image
                    source={{uri: ImageUri}}
                    resizeMode="contain"
                    style={{
                        height: 155,
                        width: 155,
                        borderRadius: 999,
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        marginTop: -90,
                    }}
                />
            )
        }

            <Text
            style={{
                ...FONTS.h3,
                color: COLORS.primary,
                marginVertical: 8,
            }}
            >
            {/* {console.log(data[1])} */}
            {username}
            </Text>
            <Text
            style={{
                ...FONTS.h3,
                color: COLORS.primary,
                marginVertical: 6,
            }}
            >
            {email}
            </Text>

         

        </View>

        {/* <View style={{ flex: 1, marginHorizontal: 22, marginTop: 20 }}>
            <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            />
        </View> */}
        </SafeAreaView>
    );
};

export default UserProfileScreen;
