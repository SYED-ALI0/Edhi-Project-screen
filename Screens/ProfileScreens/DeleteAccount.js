import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { db, auth } from '../../Firebase/firebase.config'
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

// import { useNavigation } from '@react-navigation/core'



// const DeleteAccount = () => {
const DeleteAccount = ({ navigation }) => {


   
    
    // const navigation = useNavigation()

    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState(auth.currentUser?.email);

    const showDialog = () => {
        setVisible(true);
    };
    
    const handleCancel = () => {
        setVisible(false);
    };

    const DeleteUserData = async (mail) => {
        
        // await deleteDoc(doc(db, "users", email));
        
        const del = await deleteDoc(doc(db, "users", mail));
        console.log("Delete User Data");
        
        // console.log(del);
    }
  
    const Delete_Account = async () => {

        
        console.log("Delete Account");
        
        // const auth = getAuth();
        const user = auth.currentUser;
        
        // await deleteUser(email).then(() => {
        await deleteUser(user).then(() => {
            // User deleted.
            
            DeleteUserData(email);
            
            console.log("User deleted");
            alert("Account deleted successfully.")
            navigation.navigate("Login")

        }).catch((error) => {
            // An error ocurred
            // ...
            console.log("An error ocurred");
            // alert("Unable to delete account. Please try again.")
            alert("Unable to delete account due to slow internet. Please try again.")
        });

        setVisible(false);

    }

    useEffect(() => {
        return () => {
            // DeleteUserData(email);
            DeleteAccount();


            // navigation.setOptions({
            //     headerTitleStyle: { fontWeight: "bold", },
            //     headerLeft : () => (
            //         <TouchableOpacity onPress={() => navigation.goBack()} >
            //             <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
            //         </TouchableOpacity>
            //     ),
            // }),
        }
    }, []);

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

                <Text style={{ ...FONTS.h3, }}>Delete Account</Text>
            </View>

            <ScrollView>

                <View style={{ marginTop: 250, justifyContent: 'center', }}>
                    <View style={styles.container}>
                        {/* <Button title="Show dialog" onPress={showDialog} /> */}
                        <Dialog.Container visible={visible}>
                            <Dialog.Title>Account delete</Dialog.Title>
                            <Dialog.Description>
                            Do you want to delete this account? You cannot undo this action.
                            </Dialog.Description>
                            <Dialog.Button label="Cancel" onPress={handleCancel} />
                            <Dialog.Button label="Delete" onPress={Delete_Account} />
                        </Dialog.Container>
                    </View>
                    <View style={{ marginBottom: 12, justifyContent: 'center', }}>
                        <Text style={{ ...FONTS.h4, paddingBottom: 8, justifyContent: 'center', left: 10, right: 10, }}>
                            To delete your account, click on the delete button.
                        </Text>
                    </View>
                </View>


                <TouchableOpacity
                    // OnPress={() => {navigation.navigate("Settings")} }
                    onPress={()=>{showDialog()}}
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
                        Delete
                    </Text>
                </TouchableOpacity>

                
            </ScrollView>
        </SafeAreaView>
    );

};

export default DeleteAccount;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
});
