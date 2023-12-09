import { View } from "native-base";
import React from "react";



export const AppThemeProvider = ({ children }) => {
    return (
        <View flex={1} bg={"#FFFFFF"}>
            {children}
        </View >
    )
}

export const AuthThemeProvider = ({ children }) => {
    return (
        <View flex={1} bg={"#FBFAFD"}>
            {children}
        </View>
    )
}