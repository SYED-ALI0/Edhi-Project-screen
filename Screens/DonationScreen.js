import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native"; 

import { useStripeCheckout } from "./hooks/useStripeCheckout";

import { auth, db } from '../components/firebase';
import { doc, getDoc, updateDoc, collection, setDoc, addDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

export default function DonationScreen() {
    const [amount, setAmount] = useState("1");
    const { initiatePayment } = useStripeCheckout();
    const navigation = useNavigation(); 
    const [email, setEmail]  = useState(auth.currentUser?.email);
    const [showHistory, setShowHistory] = useState(false); 
    
    const [donationList, setDonationList] = useState([]);
    
    const [donationList1, setDonationList1] = useState([]);

    console.log(amount)

    
    
  useEffect(()=>{
    // const unsubscribe = setDonationList({
    //     amount: amount,
    //     date: new Date().toISOString(),
    // })

    fetchDonationHistory();
    console.log(donationList)
   
  }, [donationList]);

  const fetchDonationHistory = async () => {
    try {
        const userID = email;
        const userDocRef = doc(db, "users", userID);

        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        const existingDonationList = userData?.donations || [];

        setDonationList1(existingDonationList);
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

        setDonationList1(existingDonationList)

    
        const updatedDonationList = [...existingDonationList, {
            amount: amount,
            date: new Date().toISOString(),
        }];

        // Update user document with the updated donation list using updateDoc
        await updateDoc(userDocRef, {
            donations: updatedDonationList,
        });

        
        setDonationList(updatedDonationList);
        console.log(updatedDonationList);
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

    const showHistoryCard = () => {
        setShowHistory(true);
    };


    return (
        <View style={{ flex: 1, margin: 55 }}>
            <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
                value={amount}
                onChangeText={(text) => setAmount(text)}
            />
            <Button title="Donate" onPress={handlePayment} />
            <Button title="Fundraisers" onPress={navigateToFundraisers} /> 
            <Button title="History" onPress={showHistoryCard} />
            
            {showHistory && ( 
                <View style={{ marginTop: 20, borderColor: "black", borderWidth: 1, padding: 10 }}>
                    <Text>Donation History:</Text>
                    {donationList1.map((donation, index) => (
                        <Text key={index}>{`Amount: ${donation.amount}, Date: ${donation.date}`}</Text>
                    ))}
                </View>
            )}
        </View>
    );
}
