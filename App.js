import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Navigations from "./navigations";
import { StripeProvider } from "@stripe/stripe-react-native";


export default function App() {  
  const Stack = createNativeStackNavigator();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="green" />
        </View>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
  <Box flex={1} safeArea>
    <NavigationContainer>
    <StripeProvider  publishableKey="pk_test_51MH3xKEf1gVnSEtdnA6u94KsVdS5P9GioPEA6vOUW61mtT023fJXVSwSUoQeybLZ8SUA7EZOGlN7NZcc4Eyqjd9r00GAs32lag">   
      <Navigations />

</StripeProvider>
    </NavigationContainer>
  </Box>
</NativeBaseProvider>
  );
}
