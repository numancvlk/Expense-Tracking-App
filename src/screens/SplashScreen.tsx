import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
};

export default function SplashScreen(props: SplashScreenProps) {
  const handleScreenChange = () => {
    setTimeout(() => {
      props.navigation.navigate("HomeScreen");
    }, 2000);
  };

  useEffect(() => {
    handleScreenChange();
  }, []);

  return (
    <View style={myStyles.container}>
      <Text style={myStyles.text}>EXPENSE TRACKING</Text>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#e8630c",
    fontWeight: "bold",
    fontSize: 25,
  },
});
