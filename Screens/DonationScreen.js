import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

import { useStripeCheckout } from "./hooks/useStripeCheckout";

export default function DonationScreen() {
    const [amount, setAmount] = useState("1");
    const { initiatePayment } = useStripeCheckout();
    const navigation = useNavigation(); // Initialize navigation

    const handlePayment = async () => {
        try {
            const status = await initiatePayment({
                userId: "123",
                userName: "Ali",
                amount: parseInt(amount), // Assuming the amount is in cents
                currency: "USD",
                paymentMethodTypes: ["card"],
            });

            console.log(status);
        } catch (error) {
            console.error(error);
        }
    };

    const navigateToFundraisers = () => {
        navigation.navigate("FundraiserScreen"); // Navigate to FundraiserScreen
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
        </View>
    );
}
