import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Navigations from "./navigations";


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
      <Navigations />
    </NavigationContainer>
  </Box>
</NativeBaseProvider>
  );
}
