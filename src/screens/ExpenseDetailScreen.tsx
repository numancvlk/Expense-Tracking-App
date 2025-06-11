import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type ExpenseDetailScreen = NativeStackScreenProps<
  RootStackParamList,
  "ExpenseDetailScreen"
>;

const STORAGE_KEY = "expenses";

export default function ExpenseDetailScreen({
  navigation,
  route,
}: ExpenseDetailScreen) {
  const { id } = route.params;
  const [expense, setExpense] = useState<{
    id: string;
    expense: string;
    amount: number;
  } | null>();

  useEffect(() => {
    const loadExpense = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const expenses = stored ? JSON.parse(stored) : [];
      const found = expenses.find((e: any) => e.id === id);
      if (found) setExpense(found);
    };
    loadExpense();
  }, [id]);

  const deleteExpense = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const expenses = stored ? JSON.parse(stored) : [];
            const filtered = expenses.filter((e: any) => e.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            navigation.navigate("HomeScreen");
          },
          style: "destructive",
        },
      ]
    );
  };
  const editExpense = () => {
    navigation.navigate("AddNewExpenseScreen", { id }); // Bu kısmı sonra ekleyeceğiz
  };

  if (!expense) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>EXPENSE DETAIL</Text>
      <Text>Name: {expense.expense}</Text>
      <Text>Amount: {expense.amount}</Text>

      <TouchableOpacity onPress={deleteExpense}>
        <Text>DELETE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={editExpense}>
        <Text>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
}
