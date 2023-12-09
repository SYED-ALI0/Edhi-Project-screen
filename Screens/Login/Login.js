import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { AuthThemeProvider } from '../../components/Theme/ThemeProvider';
import { Box, Text, Heading, VStack, FormControl, Input, Button, HStack, Center, Spinner, PresenceTransition } from "native-base";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from 'native-base';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setError] = useState('');
    const [splash, setSplash] = useState(true);
    const[isLoading,setIsLoading]=useState(false);
    useLayoutEffect(() => {
        setTimeout(() => {
            setSplash(false)
        }, 3000);
    }, [])



    const handleLogin = () => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }

        if (email || password) {
            setError(null);
            // signIn(email, password);
        }

    }




    return (
        <AuthThemeProvider>
            <Center flex={1} px="3">
                <Center w="100%">
                    {splash ? (

                        <Center w="100%" mt={8}>
                            <VStack
                                w="90%"
                                maxW="400"
                                borderWidth="1"
                                space={8}
                                overflow="hidden"
                                rounded="md"
                                _light={{ borderColor: 'coolGray.200' }}
                            >
                                <Skeleton h="230" />
                                <Skeleton.Text px="4" />
                                <Skeleton px="4" my="4" rounded="md" startColor="coolGray.200" />
                            </VStack>
                        </Center>
                    ) : (

                        <Box safeArea p="2" py="8" w="90%" maxW="290">
                            <Heading size="lg" fontWeight="600" color="coolGray.800">
                                Efamily
                            </Heading>
                            <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                                Sign in to continue!
                            </Heading>

                            <PresenceTransition
                                visible={true}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 3000 } }}
                            >
                                <VStack space={3} mt="5">
                                    <FormControl>
                                        <FormControl.Label>Email ID</FormControl.Label>
                                        <Input value={email} onChangeText={setEmail} />
                                    </FormControl>

                                    <FormControl>
                                        <FormControl.Label>Password</FormControl.Label>
                                        <Input type="password" value={password} onChangeText={setPassword} />

                                        <TouchableOpacity onPress={() => { navigation.navigate("forgotPassword") }}>
                                            <Text mt="2" color="blue.500">forgot Password?</Text>
                                        </TouchableOpacity>

                                    </FormControl>

                                    <FormControl>
                                        {err && (<Text color="error.500">{err}</Text>)}
                                        
                                    </FormControl>

                                    {isLoading ? (
                                        <Button mt="2" colorScheme="indigo" disabled>
                                            <Spinner color="white" size="sm" />
                                        </Button>
                                    ) : (
                                        <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
                                            Sign in
                                        </Button>
                                    )}

                                    <HStack mt="6" justifyContent="center">
                                        <Text fontSize="sm" color="coolGray.600">I'm a new user.{" "}</Text>
                                        {/* <TouchableOpacity onPress={() => { navigation.navigate('register') }}> */}
                                        <TouchableOpacity >
                                            <Text _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }} href="#">
                                                Sign Up
                                            </Text>
                                        </TouchableOpacity>
                                    </HStack>
                                </VStack>

                            </PresenceTransition>

                        </Box>
                    )

                    }

                </Center>
            </Center>
        </AuthThemeProvider>
    )
}

export default Login;