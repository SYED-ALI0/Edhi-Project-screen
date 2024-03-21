import { useNavigation } from '@react-navigation/core'
import React, { useEffect , useState } from 'react'
import { StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, View, Image, Pressable, Button } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth, db, app } from '../../components/firebase'
import { collection, addDoc, setDoc, getDocs, doc } from "firebase/firestore";


const Register = () => {
    
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [num, setNum] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    
    
    const [donationList, setDonationList] = useState([
        {
            amount: 0,
            date: "2017-05-31",
        }
    ]);

   
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe =  auth.onAuthStateChanged(user => {
        if(user){
            navigation.navigate("Home")
        }
      })

      return unsubscribe
    }, []);



    const handleSignUp = () => {

        if (!fName.trim() || !lName.trim() || !email || !num || !password) {
            alert("Please fill in all the fields");
            return;
        }

        const isValidPhoneNumber = /^\d+$/.test(num);

        if (num.length !== 11 || !isValidPhoneNumber) {
            alert("Please enter a valid 11-digit phone number");
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Password should be at least 6 characters long");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Logged with : ", user.email);
                storeUser();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Invalid Email or Password");
        });
    }

    const storeUser = async () => {
        try {
            
            const userID = email;
            await setDoc(doc(db, "users", userID), {
                // firstName: fName,
                // lastName: lName,
                userName: fName + " " + lName,
                email: email,
                phoneNumber: num,
                age: age,
                donations: donationList,
               
            });

        }catch(error){
            // console.log(error);
            console.error('Error adding user data: ', error);
        }
    }

    const checkTextInput = () => {
        if (!email.trim()) {
          alert('Please Enter Email');
          return;
        }
        else if (!password.trim()) {
          alert('Please Enter Password');
          return;
        }
    };
    
   
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: "black"
                        }}>
                            Create Account
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            color: "black"
                        }}>Welcome to Edhi Foundation Mobile App</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 12
                    }}>
                        <View style={{ width:'45%', margin: '5' }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8
                            }}>First Name</Text>

                            <View style={{
                                width: "100%",
                                height: 48,
                                borderColor: "black",
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingLeft: 22
                            }}>
                                <TextInput
                                    placeholder='Enter First Name'
                                    value={fName}
                                    onChangeText={text => setFName(text)}
                                    placeholderTextColor={"black"}
                                    style={{
                                        width: "100%"
                                    }}
                                />
                            </View>

                        </View>
                        <View style={{ width:'45%', margin: '5' }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 400,
                                marginVertical: 8
                            }}>Last Name</Text>

                            <View style={{
                                width: "100%",
                                height: 48,
                                borderColor: "black",
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                paddingLeft: 22
                            }}>
                                <TextInput
                                    placeholder='Enter Last Name'
                                    value={lName}
                                    onChangeText={text => setLName(text)}
                                    placeholderTextColor={"black"}
                                    style={{
                                        width: "100%"
                                    }}
                                />
                            </View>

                        </View>

                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Email address</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your email address'
                                value={email}
                                onChangeText={text => setEmail(text)}
                                placeholderTextColor={"black"}
                                autoCapitalize="none"
                                autoCompleteType="email"
                                inputMode="email"
                                keyboardType='email-address'
                                style={{
                                    width: "100%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Age</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>
                            
                            <TextInput
                                placeholder='Enter your age'
                                value={age}
                                onChangeText={text => setAge(text)}
                                placeholderTextColor={"black"}
                                maxLength={3} 
                                keyboardType='numeric'
                                style={{
                                    width: "80%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Mobile Number</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>


                            <TextInput
                                placeholder='Enter your phone number'
                                value={num}
                                onChangeText={text => setNum(text)}
                                placeholderTextColor={"black"}
                                // maxLength={10} 
                                maxLength={11} 
                                keyboardType='numeric'
                                style={{
                                    width: "80%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Password</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your password'
                                value={password}
                                onChangeText={text => setPassword(text)}
                                placeholderTextColor={"black"}
                                secureTextEntry={isPasswordShown}
                                required
                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == true ? (
                                        <Ionicons name="eye-off" size={24} color={"black"} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={"black"} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        onPress={()=>{handleSignUp(); }}
                        title="Sign Up"
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                   
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 22
                    }}>
                        <Text style={{ fontSize: 16, color: "black" }}>Already have an account,</Text>
                        <Pressable
                            onPress={() => navigation.navigate("login")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: "blue",
                                fontWeight: "bold",
                                marginLeft: 6
                            }}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>    
        </SafeAreaView>

    )
}

export default Register

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '"white"',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    }, 
    buttonContainer1: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    }, 
    button: {
        backgroundColor: "#07B2F9",
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center' 
    },
    buttonText: {
        color: '"white"',
        fontWeight: '700', 
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: '"white"',
        marginTop: 5,
        borderColor: "#07B2F9",
        borderWidth: 2, 
    },
    buttonOutlineText: {
        color: '#07B2F9',
        fontWeight: '700', 
        fontSize: 16,
    },
})