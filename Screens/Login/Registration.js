import { Box, Text, Heading, ScrollView, VStack, FormControl, Input, Button, Center, Spinner, HStack, PresenceTransition } from "native-base";
import React, { useContext, useState } from 'react'

import { AuthThemeProvider } from '../../components/Theme/ThemeProvider';
import { TouchableOpacity } from "react-native";

const Register = ({ navigation }) => {

    const [name, setName] = useState('');
    const [family_name, setFamilyname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [c_password, setCPassword] = useState('');
    const [err, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSignUp = () => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!name || !family_name || !email || !password || !c_password) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== c_password) {
            setError('Passwords do not match');
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }
        if (name || family_name || email || password || c_password) {
            setError(null);
            signUp(name, family_name, email, password);
        }
    };

    return (
        <AuthThemeProvider>
            <ScrollView>
                <Center flex={1} px="3">
                    <Center w="100%">
                        <Box safeArea p="2" w="90%" maxW="290" py="8">

                            <Heading size="lg" color="coolGray.800" fontWeight="semibold">
                                Welcome
                            </Heading>

                            <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                                Sign up and create your family to continue!
                            </Heading>
                            <PresenceTransition
                                visible={true}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, transition: { duration: 2000 } }}>
                                <VStack space={3} mt="5">

                                    <FormControl>
                                        <FormControl.Label>Name</FormControl.Label>
                                        <Input value={name} onChangeText={setName} />
                                    </FormControl>

                                    <FormControl>
                                        <FormControl.Label>Family Name</FormControl.Label>
                                        <Input value={family_name} onChangeText={setFamilyname} />
                                    </FormControl>

                                    <FormControl>
                                        <FormControl.Label>Email</FormControl.Label>
                                        <Input value={email} onChangeText={setEmail} />
                                    </FormControl>

                                    <FormControl>
                                        <FormControl.Label>Password</FormControl.Label>
                                        <Input value={password} onChangeText={setPassword} type="password" />
                                    </FormControl>

                                    <FormControl>
                                        <FormControl.Label>Confirm Password</FormControl.Label>
                                        <Input type="password" value={c_password} onChangeText={setCPassword} />
                                    </FormControl>

                                    <FormControl>
                                        {err && (<Text mt="2" color="error.500">{err}</Text>)}
                                    </FormControl>


                                    {isLoading ? (
                                        <Button mt="2" colorScheme="indigo" disabled>
                                            <Spinner color="white" size="sm" />
                                        </Button>
                                    ) : (
                                        <Button mt="2" colorScheme="indigo" onPress={handleSignUp}>
                                            Sign up
                                        </Button>
                                    )}

                                    <HStack mt="6" justifyContent="center">
                                        <Text fontSize="sm" color="coolGray.600">
                                            I'm already user. {" "}
                                        </Text>
                                        <TouchableOpacity>
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
            </ScrollView>
        </AuthThemeProvider>
    )
}

export default Register