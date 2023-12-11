import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//screens
import Login from '../Screens/Login/Login';
import Register from '../Screens/Login/Registration';
import ForgotPassword from '../Screens/Login/ForgotPassword';


const AuthNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                
                <Stack.Screen name="register" component={Register} />
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="forgotPassword" component={ForgotPassword} />
            </Stack.Navigator>
    );
}

export default AuthNavigation;