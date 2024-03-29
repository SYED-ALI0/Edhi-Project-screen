import { Box, Text, Heading, ScrollView, VStack, FormControl, Input, Button, Center, Spinner, HStack, PresenceTransition } from "native-base";
import React, { useContext, useState } from 'react'
import { AuthThemeProvider } from '../../components/Theme/ThemeProvider';
import { TouchableOpacity } from "react-native";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { auth, db, app } from '../../components/firebase'
import { collection, addDoc, setDoc, getDocs, doc } from "firebase/firestore";

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [err, setError] = useState(null);
    const [error, setErrorr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [errorr, set_Errorr] = useState(null);

    // const [isLoading, setIsLoading] = useState(true);

    const handleForgotPassword = async () => {
        setIsLoading(true);
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!email) {
            setError('Please Enter Email Address');
            setIsLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email");
            setIsLoading(false);
            return;
        }

        // setIsLoading(true);
        setIsLoading(false)

        try {
            sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                alert("Email Sent on the email address.")
                // ..
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
          } catch (error) {
            setError(error.message);
            setResetEmailSent(false);
          }
      

        
    }

    return (
        <AuthThemeProvider>
            <Center flex={1} px="3">
                <Center w="100%">
                    <Box safeArea p="2" w="90%" maxW="290" py="8">

                        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                            Forgot you password
                        </Heading>
                        <PresenceTransition
                            visible={true}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 20 } }}
                        >
                            <VStack space={3} mt="5">

                                <FormControl>
                                    <FormControl.Label>Email</FormControl.Label>
                                    <Input value={email} onChangeText={setEmail} />
                                </FormControl>

                                <FormControl>
                                    {error && (<Text mt="2" color="error.500">{error}</Text>)}
                                    {err && (<Text mt="2" color="error.500">{err}</Text>)}
                                </FormControl>

                                {isLoading ? (
                                    <Button mt="2" colorScheme="indigo" disabled>
                                        <Spinner color="white" size="sm" />
                                    </Button>
                                ) : (
                                    <Button mt="2" colorScheme="indigo" onPress={() => { handleForgotPassword() }}>
                                        forgot password
                                    </Button>
                                )}

                                <HStack mt="6" justifyContent="center">
                                    <Text fontSize="sm" color="coolGray.600"> I'm already user. {" "}</Text>
                                    <TouchableOpacity onPress={() => { navigation.navigate('login') }}>
                                        <Text _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} href="#">
                                            Login
                                        </Text>
                                    </TouchableOpacity>
                                </HStack>

                            </VStack>

                        </PresenceTransition>
                    </Box>
                </Center>
            </Center>
        </AuthThemeProvider>
    )
}

export default ForgotPassword