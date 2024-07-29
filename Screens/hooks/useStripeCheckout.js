import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";

export function useStripeCheckout() {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe("pk_test_51MH3xKEf1gVnSEtdnA6u94KsVdS5P9GioPEA6vOUW61mtT023fJXVSwSUoQeybLZ8SUA7EZOGlN7NZcc4Eyqjd9r00GAs32lag");


    const backendUrl = "https://dev-backend-production.up.railway.app";

    const fetchClientSecret = async (data) => {
        try {
            const response = await fetch(`${backendUrl}/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const { clientSecret } = await response.json();
            return clientSecret;
        } catch (err) {
            displayError(err.message || "Something went wrong");
            throw err;
        }
    };

    const initiatePayment = async (data) => {
        try {
            const { userId, userName, amount, currency, paymentMethodTypes } = data;
            const clientSecret = await fetchClientSecret(data);

            if (!clientSecret) {
                displayError("Failed to fetch client secret");
                return;
            }

            const initSheet = await stripe.initPaymentSheet({
                merchantDisplayName: userName,
                paymentIntentClientSecret: clientSecret,
            });

            if (initSheet.error) {
                displayError(initSheet.error.message);
                return;
            }

            const presentSheet = await stripe.presentPaymentSheet({
                clientSecret: clientSecret,
            });

            if (presentSheet.error) {
                displayError(presentSheet.error.message);
                return;
            }

            setSuccess(true);
        } catch (err) {
            displayError(err.message || "Something went wrong");
        }
    };

    const displayError = (message) => {
        setSuccess(false);
        alert(message);
    };

    return { initiatePayment, success };
}
