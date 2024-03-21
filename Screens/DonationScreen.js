import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStripeCheckout } from "./hooks/useStripeCheckout";
import { auth, db } from '../components/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function DonationScreen() {
    const [amount, setAmount] = useState("1");
    const { initiatePayment } = useStripeCheckout();
    const navigation = useNavigation();
    const [email, setEmail] = useState(auth.currentUser?.email);
    const [showHistory, setShowHistory] = useState(false);
    const [donationList, setDonationList] = useState([]);

    useEffect(() => {
        fetchDonationHistory();
    }, []);

    const fetchDonationHistory = async () => {
        try {
            const userID = email;
            const userDocRef = doc(db, "users", userID);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const existingDonationList = userData?.donations || [];
            setDonationList(existingDonationList);
        } catch (error) {
            console.error('Error fetching donation history: ', error);
        }
    };

    const handleDonations = async () => {
        try {
            const userID = email;
            const userDocRef = doc(db, "users", userID);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const existingDonationList = userData?.donations || [];
            const updatedDonationList = [...existingDonationList, {
                amount: amount,
                date: new Date().toISOString(),
            }];
            await updateDoc(userDocRef, {
                donations: updatedDonationList,
            });
            setDonationList(updatedDonationList);
        } catch (error) {
            console.error('Error adding user data: ', error);
        }
    };

    const handlePayment = async () => {
        try {
            const status = await initiatePayment({
                userId: "123",
                userName: "Ali",
                amount: parseInt(amount),
                currency: "Rupees",
                paymentMethodTypes: ["card"],
            });
            handleDonations();
            console.log(status);
        } catch (error) {
            console.error(error);
        }
    };

    const navigateToFundraisers = () => {
        navigation.navigate("FundraiserScreen");
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text>Enter Donation Amount</Text>
                <TextInput
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    style={styles.input}
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                />
                <TouchableOpacity style={styles.donateButton} onPress={handlePayment}>
                    <Text style={styles.buttonText}>Donate Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fundraiserButton} onPress={navigateToFundraisers}>
                    <Text style={styles.buttonText}>View Fundraisers</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.historyButton} onPress={toggleHistory}>
                <Text style={styles.buttonText}>{showHistory ? "Hide History" : "View History"}</Text>
            </TouchableOpacity>

            {showHistory && (
                <FlatList
                data={donationList.reverse()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.historyAmount}>Amount: {item.amount}</Text>
                        <Text style={styles.historyDate}>Date: {new Date(item.date).toLocaleString()}</Text>
                    </View>
                )}
            />
            
            
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '100%',
        maxWidth: 350, // Adjust width to match view history button
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    donateButton: {
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    fundraiserButton: {
        backgroundColor: '#4CAF50',
        width: '100%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    historyButton: {
        backgroundColor: '#007bff',
        width: '100%',
        height:     50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    historyText: {
        fontSize: 16,
    },
    historyItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    historyAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historyDate: {
        fontSize: 16,
        color: '#777',
    },
});

