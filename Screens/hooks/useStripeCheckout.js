import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";

export function useStripeCheckout() {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe("pk_test_51OIYqSSJnqSYq2ZEPOEfmQl9nA4Z72k9ogMLcI9khC7f5rdozegiwH6STubHvFYUaTF2vikgok6SBopvh6SyKeKm00MijgQAGq");

    const backendUrl = "https://edhi-backend.cyclic.app";

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
