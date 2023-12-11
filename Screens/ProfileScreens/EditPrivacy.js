import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { updatePassword } from "firebase/auth";
import { db, auth } from '../../Firebase/firebase.config'


const EditPrivacy = ({ navigation, route }) => {

    
    navigation.setOptions({
        // title: Settings,
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



    const [Cpassword, setCPassword] = useState('');
    const [Npassword, setNPassword] = useState('');
    const [CFpassword, setCFPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isPasswordShown1, setIsPasswordShown1] = useState(true);
    const [isPasswordShown2, setIsPasswordShown2] = useState(true);

    const handleSave = () => {
        
        // console.log("Password Changed");
        if (!Cpassword.trim() || !Npassword.trim() || !CFpassword.trim()) {
            alert("Please fill in all password fields");
            return;
        }
    
        if (Npassword !== CFpassword) {
            alert("Passwords do not match");
;
        }else{
            // alert(Npassword);

            const user = auth.currentUser;

            // const newPassword = Npassword;
            
            // updatePassword(auth.currentUser, Npassword);
            // updatePassword(user, newPassword).then(() => {

            updatePassword(user, Npassword).then(() => {
                // Update successful.
                alert("Password Changed");
                // navigation.goBack();
                navigation.push(value="Settings");
            }).catch((error) => {
                // An error ocurred
                // ...
                alert(error);
            });
        }


    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingHorizontal: 22,
            }}
            >
            {/* <View
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
                <Text style={{ ...FONTS.h3, }}>Edit Password</Text>

            </View> */}

            <ScrollView>

                {/* <View style={{ marginTop: 50 }}> */}
                <View style={{ marginTop: 10 }}>
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...FONTS.h4, paddingBottom: 8, }}>Current Password</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter current password'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={isPasswordShown}
                                value={Cpassword}
                                onChangeText={text => setCPassword(text)}
                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == true ? (
                                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={COLORS.black} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...FONTS.h4, paddingBottom: 8, }}>New Password</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter new password'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={isPasswordShown1}
                                value={Npassword}
                                onChangeText={text => setNPassword(text)}
                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown1(!isPasswordShown1)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown1 == true ? (
                                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={COLORS.black} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...FONTS.h4, paddingBottom: 8, }}>Confirm Password</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Confirm your password'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={isPasswordShown2}
                                value={CFpassword}
                                onChangeText={text => setCFPassword(text)}
                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown2(!isPasswordShown2)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown2 == true ? (
                                        <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={COLORS.black} />
                                    )
                                }

                            </TouchableOpacity>
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
                        Save Password
                    </Text>
                </TouchableOpacity>

                
            </ScrollView>
        </SafeAreaView>
    );

};

export default EditPrivacy;
