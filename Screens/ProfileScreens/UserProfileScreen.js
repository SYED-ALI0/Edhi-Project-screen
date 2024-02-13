import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { db, auth } from '../../components/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { Button } from "native-base";
import { getAuth, signOut } from "firebase/auth";

const UserProfileScreen = ({ navigation }) => {
    const [email, setEmail] = useState(auth.currentUser?.email);
    const [username, setUserName] = useState("");
    const [ImageUri, setImageUri] = useState(null);

    useEffect(() => {
        const docRef = doc(db, "users", email);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                console.log("Document data:", doc.data());
                setUserName(doc.data().userName)
                setImageUri(doc.data().image)
            } else {
                console.log("No such document!");
            }
        });

        return () => {
            console.log("Listener Detached");
            unsubscribe();
        }
    }, []);

    const handleSignOut = async () => {
        
            const auth = getAuth();
            signOut(auth).then(() => {
            // Sign-out successful.
                // navigation.replace('login');
                alert("Logged Out")
            }).catch((error) => {
            // An error happened.
            });
    }  

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <View style={styles.profileContainer}>
                <View style={styles.profileBox}>
                    <Image
                        source={{ uri: ImageUri }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Button onPress={handleSignOut}>Logout</Button>
                </View>
                
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,        
        borderRadius: 60,
        marginBottom: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
    },
});

export default UserProfileScreen;
