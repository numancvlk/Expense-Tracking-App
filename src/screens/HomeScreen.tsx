import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

const STORAGE_KEY = "expenses";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [expenseList, setExpenseList] = useState<
    { expense: string; amount: number }[]
  >([]);

  const loadExpenses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log("Loading Error", error);
      return [];
    }
  };

  const handleNewExpense = () => {
    navigation.navigate("AddNewExpenseScreen");
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        const loadedExpenses = await loadExpenses();
        setExpenseList(loadedExpenses);
      };
      fetchExpenses();
    }, [])
  );

  return (
    <View style={myStyles.container}>
      <Text style={myStyles.title}>WELCOME YOUR EXPENSE TRACKER</Text>

      <Text>YOUR EXPENSE</Text>

      <View>
        <Text>
          Total Fee: {expenseList.reduce((sum, e) => sum + (e.amount || 0), 0)}{" "}
          $
        </Text>
      </View>

      <View style={myStyles.expenseBox}>
        {expenseList.map((e, i) => {
          return (
            <Text key={i}>
              {e.expense} - {e.amount}
            </Text>
          );
        })}
      </View>

      <TouchableOpacity onPress={handleNewExpense}>
        <Text>Add New Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 9,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  expenseBox: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    padding: 10,
  },
});
