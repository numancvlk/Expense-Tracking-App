import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//----------SCREENS--------------
import { RootStackParamList } from "./src/screens/types/Navigation";
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddNewExpense from "./src/screens/AddNewExpense";
import ExpenseDetailScreen from "./src/screens/ExpenseDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Expenses" }}
        />
        <Stack.Screen
          name="AddNewExpenseScreen"
          component={AddNewExpense}
          options={{
            title: "Add New Expense",
          }}
        />
        <Stack.Screen
          name="ExpenseDetailScreen"
          component={ExpenseDetailScreen}
          options={{
            title: "Expense Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
