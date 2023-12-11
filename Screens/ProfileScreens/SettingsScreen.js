import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React,  { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from 'firebase/auth'
import { db, auth } from '../../Firebase/firebase.config'
import { doc, getDoc, onSnapshot } from "firebase/firestore";



const SettingsScreen = ({ navigation, route }) => {


    navigation.setOptions({
        // title: Settings,
        // headerStyle: { backgroundColor: COLORS.primary, },
        // headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: "bold", },
        headerLeft : () => (
            <TouchableOpacity onPress={() => navigation.goBack()}  >
                <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
            </TouchableOpacity>
        ),
    });

    // const { profilePic } = route.params;
    // console.log(profilePic);
    // route.params ? console.log(route.params) : console.log("No profile pic"); 
    
    const [email, setEmail] = useState(auth.currentUser?.email);
    const [data, setData] = useState([]); 
    const [profile, setProfilePic] = useState(null);
    
    // route.params ? profilePic = route.params.profilePic : profilePic = null;
    
    const navigateToEditProfile = () => {
        route.params ? setProfilePic(route.params.profilePic) : setProfilePic(null);
        // getDocs();
        // navigation.navigate("EditProfile", {userData: data});
        // navigation.navigate("EditProfile", {userData: data, profilePic: profile});
        // navigation.navigate("EditProfile");
        profile ? (
            navigation.navigate("EditProfile", {userData: data, profilePic: profile}) 
        ): ( 
            navigation.navigate("EditProfile", {userData: data}) 
        )
    };

    // const getDocs = async () => {
    //     const data = [];
    //     let d;
    //     const docRef = doc(db, "users", email);
    //     const docSnap = await getDoc(docRef);
        

    //     // const userdata = docSnap.forEach((doc) => {
    //         // data.push({i:doc.id, j:doc.data().email, k:doc.data().userName, l:doc.data().country })
    //         // data.push({i:doc.id, j:doc.data().email, k:doc.data().userName })
           
    //         // d= doc.data().name
    //     // })

    //     if (docSnap.exists()) {
    //         // console.log("Document data:", docSnap.data());

    //         console.log(data.push(docSnap.data().email))
    //         data.push(docSnap.data().userName)
    //         data.push(docSnap.data().phoneNumber)
    //         data.push(docSnap.data().age)
    //         data.push(docSnap.data().image)

            
    //         setData(data);
            
    //     } 
    //     else {
    //         // docSnap.data() will be undefined in this case
    //         console.log("No such document!");
    //     }

    // }



    useEffect(() => {   
        
        // getDocs();

        const data = [];
        const docRef = doc(db, "users", email);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {

                console.log("Document data:", doc.data());

                data.push(doc.data().email)
                data.push(doc.data().userName)
                data.push(doc.data().phoneNumber)
                data.push(doc.data().age)   
                data.push(doc.data().image)


                setData(data);

                // setUserName(doc.data().userName)
                setProfilePic(doc.data().image)

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        });

        return () => {
            console.log("Listener Detached...");
            unsubscribe()
        };


    }, []);

    const navigateToNotifications = () => {
        console.log("Notifications function");
    };

    const navigateToPrivacy = () => {
        console.log("Privacy function");
        navigation.navigate("EditPrivacy");  
    };

    const navigateToSupport = () => {
        console.log("Support function");
    };
    const navigateToDeleteAccount = () => {
        console.log("Delete function");
        navigation.navigate("DeleteAccount");
    };

    const navigateToTermsAndPolicies = () => {
        console.log("Terms and Policies function");
    };

    const navigateToFreeSpace = () => {
        console.log("Free Space function");
    };

    // const logout = () => {
    //     console.log("Logout");
    // };

    const handleSignOut = () => {
        // navigation.replace("Login");
        signOut(auth)
        .then(() => {
            // navigation.replace("Login");
            navigation.navigate("Login");
            // navigation.navigate("LoginS");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }


    const accountItems = [
        {
        icon: "person-outline",
        text: "Edit Profile",
        action: navigateToEditProfile,
        },
        {
        icon: "notifications-none",
        text: "Notifications",
        action: navigateToNotifications,
        },
        { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
        { icon: "delete-outline", text: "Delete Account", action: navigateToDeleteAccount },
    ];

    const supportItems = [
        { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
        {
        icon: "info-outline",
        text: "Terms and Policies",
        action: navigateToTermsAndPolicies,
        },
    ];

    const cacheAndCellularItems = [
        {
        icon: "delete-outline",
        text: "Free up space",
        action: navigateToFreeSpace,
        },
    ];


    const actionsItems = [
        { icon: "logout", text: "Log out", action: handleSignOut, onclick: handleSignOut },
    ];

    const renderSettingsItem = ({ icon, text, action }) => (
        <TouchableOpacity
        onPress={action}
        style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingLeft: 12,
            backgroundColor: COLORS.gray,
        }}
        >
        <MaterialIcons name={icon} size={24} color="black" />
        <Text
            style={{
            marginLeft: 36,
            ...FONTS.semiBold,
            fontWeight: 600,
            fontSize: 16,
            }}
        >
            {text}{" "}
        </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: COLORS.white,
        }}
        >

        <ScrollView style={{ marginHorizontal: 12 }}>
            {/* Account Settings */}
            <View style={{ marginBottom: 12 }}>
            {/* <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Account</Text> */}
            <Text style={{ ...FONTS.h4, marginVertical: 1 }}>Account</Text>
            <View
                style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
                }}
            >
                {accountItems.map((item, index) => (
                <React.Fragment key={index}>
                    {renderSettingsItem(item)}
                </React.Fragment>
                ))}
            </View>
            </View>

            {/* Support and About settings */}

            <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                Support & About{" "}
            </Text>
            <View
                style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
                }}
            >
                {supportItems.map((item, index) => (
                <React.Fragment key={index}>
                    {renderSettingsItem(item)}
                </React.Fragment>
                ))}
            </View>
            </View>

            {/* Cache & Cellular */}
            <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                Cache & Cellular{" "}
            </Text>
            <View
                style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
                }}
            >
                {cacheAndCellularItems.map((item, index) => (
                <React.Fragment key={index}>
                    {renderSettingsItem(item)}
                </React.Fragment>
                ))}
            </View>
            </View>

            {/* Actions Settings */}

            <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Actions</Text>
            <View
                style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
                }}
            >
                {actionsItems.map((item, index) => (
                <React.Fragment key={index}>
                    {renderSettingsItem(item)}
                </React.Fragment>
                ))}
            </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
