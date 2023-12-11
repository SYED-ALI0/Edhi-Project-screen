import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screens for user

import HomeScreen from '../Screens/HomeScreen';
import VolunteerScreen from '../Screens/VolunteerScreen';
import DonationScreen from '../Screens/DonationScreen';
import AmbulanceScreen from '../Screens/AmbulanceScreen';
import EdhiHomes from '../Screens/EdhiHomes';
import ChildCareScreen from '../Screens/ChildCareScreen';
import OldHomesScreen from '../Screens/OldHomesScreen';
import ChildAdmissionForm from '../Screens/ChildAdmissionForm';
import ChildAdoptionForm from '../Screens/ChildAdoptionForm';
//Screen Stacks

//Account management
export const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="VolunteerScreen" component={VolunteerScreen} />
            <Stack.Screen name="DonationScreen" component={DonationScreen} />
            <Stack.Screen name="AmbulanceScreen" component={AmbulanceScreen} />
            <Stack.Screen name="EdhiHomes" component={EdhiHomes} />
            <Stack.Screen name="ChildCareScreen" component={ChildCareScreen} />
            <Stack.Screen name="OldHomesScreen" component={OldHomesScreen} />
            <Stack.Screen name="ChildAdmissionForm" component={ChildAdmissionForm} />
            <Stack.Screen name="ChildAdoptionForm" component={ChildAdoptionForm} />
        </Stack.Navigator>
    )
}

export const VolunteerStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="home" component={HomeScreen} /> */}
            <Stack.Screen name="volunteer" component={VolunteerScreen} />
        </Stack.Navigator>
    )
}

