import React, { createContext, useState, useEffect, useMemo } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { db, auth } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userID, setuId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isStateLoading, setStateLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        userCredential();
    }, []);

    useEffect(() => {
        onAuthStateChanged(auth, (usr) => {
            if (usr) {
                console.log("auth state running in Auth", usr.uid);
                setuId(usr.uid);
            }
        });
    }, []);

    const userCredential = async () => {
        const jsonCredentials = await AsyncStorage.getItem('credentials');
        if (jsonCredentials) {
            const credentials = JSON.parse(jsonCredentials);
            setUser(credentials);
            setIsAuthenticated(true);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    const handleStatus = async (userId, email, password) => {
        // You can customize this part based on your requirements
        // For now, it just sets the loading state for a short period
        setStateLoading(true);
        setTimeout(() => {
            setStateLoading(false);
        }, 2000);
    };

    const handleSignUpWithPromise = (name, family_name, email, password) => {
        return new Promise((resolve, reject) => {
            setIsLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const userRef = doc(db, 'users', userCredential.user.uid);
                    const familyRef = doc(collection(db, "families"));
                    const newFamily = {
                        name: family_name,
                        members: [userCredential.user.uid]
                    };
                    const data = {
                        name: name,
                        email: email,
                        familyName: family_name,
                        role: 'user', // Assuming a user role for non-admin users
                        familyId: familyRef.id
                    };
                    return Promise.all([setDoc(userRef, data), setDoc(familyRef, newFamily)]);
                })
                .then(() => {
                    setIsLoading(false);
                    resolve('Promise resolved');
                })
                .catch((error) => {
                    setIsLoading(false);
                    reject(error);
                });
        });
    };

    const signUp = (name, family_name, email, password) => {
        handleSignUpWithPromise(name, family_name, email, password)
            .then((result) => {
                handleStatus(auth.currentUser.uid, email, password);
                signInWithEmailAndPassword(auth, email, password);
                setError('');
                setTimeout(() => {
                    userCredential();
                }, 2000);
            })
            .catch((error) => {
                console.error(error.code);
                setError(error.code);
            });
    };

    const signIn = (email, password) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return getDoc(doc(db, 'users', userCredential.user.uid));
            })
            .then((userDoc) => {
                setStateLoading(true);
                const userData = userDoc.data();
                const userid = userDoc.id;
                handleStatus(userid, email, password);
                userCredential()
                    .then(() => {
                        setTimeout(() => {
                            setIsAuthenticated(true);
                            setIsLoading(false);
                        }, 2000)
                    }).catch(() => {
                        setIsLoading(false);
                    });
            })
            .catch((error) => {
                console.error('Error:', error.code);
                if (error.message === "Cannot read properties of undefined (reading 'role')") {
                    setError("This account no longer has access to this family");
                } else {
                    setError(error.code);
                }
                setTimeout(() => {
                    setError(null);
                }, 3000);
                setIsLoading(false);
            });
    };

    const logout = () => {
        setIsLoading(true);
        signOut(auth).then(() => {
            AsyncStorage.removeItem("credentials");
            setUser({});
            setIsAuthenticated(false);
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
        });
    };

    const forgotPassword = async (email) => {
        try {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert("Password reset link sent");
                })
                .catch((error) => {
                    alert(error.message);
                });
        } catch (error) {
            return error;
        }
    };

    const memoValues = useMemo(() => ({
        user,
        userID,
        error,
        success,
        isLoading,
        isStateLoading,
        isAuthenticated,
        userCredential,
        handleStatus,
        signIn,
        signUp,
        logout,
        forgotPassword,
    }), [user, error, success, isLoading, isStateLoading, isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                user,
                userID,
                error,
                success,
                isLoading,
                isStateLoading,
                isAuthenticated,
                userCredential,
                handleStatus,
                signIn,
                signUp,
                logout,
                forgotPassword,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
