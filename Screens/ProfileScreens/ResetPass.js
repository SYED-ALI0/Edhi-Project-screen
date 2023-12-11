import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from '../../Firebase/firebase.config'


const ResetPass = ({ navigation, route }) => {
    const { useremail } = route.params;
    // const [email, setEmail] = useState(auth.currentUser?.email);
    const [email, setEmail] = useState(useremail);
    // const [Npassword, setNPassword] = useState('');
    // const [CFpassword, setCFPassword] = useState('');

    const Reset_pass = async () => {
        // console.log("Password Reset");

        await sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            // ..
            console.log("Password Reset Email Sent");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
  });

    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingHorizontal: 22,
            }}
            >
            <View
                style={{
                marginHorizontal: 12,
                flexDirection: "row",
                // justifyContent: "flex-start",
                justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        position: "absolute",
                        left: 0,
                        // justifyContent: "flex-start",
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <Text style={{ ...FONTS.h3, }}>Reset Password</Text>
            </View>

            <ScrollView>

                <View style={{ marginTop: 250, justifyContent: 'center', }}>
                    <View style={{ marginBottom: 12, justifyContent: 'center', }}>
                        <Text style={{ ...FONTS.h4, paddingBottom: 8, justifyContent: 'center', left: 10, right: 10, }}>
                            If you forget the password, then click on the button below to reset the password.
                        </Text>
                    </View>
                </View>


                <TouchableOpacity
                    // OnPress={() => {navigation.navigate("Settings")} }
                    onPress={()=>{Reset_pass()}}
                    style={{
                        backgroundColor: '#007260',
                        height: 44,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        left: 70,
                        marginTop: 10,
                    }}
                    >
                    <Text
                        style={{
                        ...FONTS.body3,
                        color: COLORS.white,
                        }}
                    >
                        Reset Password
                    </Text>
                </TouchableOpacity>

                
            </ScrollView>
        </SafeAreaView>
    );

};

export default ResetPass;
