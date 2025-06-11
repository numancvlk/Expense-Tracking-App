import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";

import { RootStackParamList } from "./types/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";

type AddNewExpenseProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AddNewExpenseScreen"
  >;
  route: RouteProp<RootStackParamList, "AddNewExpenseScreen">;
};

const STORAGE_KEY = "expenses";

export default function AddNewExpense(props: AddNewExpenseProps) {
  const { id } = props.route.params ?? {};

  const [expense, setExpense] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (id) {
      AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
        const expenseList = stored ? JSON.parse(stored) : [];
        const found = expenseList.find((e: any) => e.id === id);
        if (found) {
          setExpense(found.expense);
          setAmount(found.amount.toString());
        }
      });
    }
  }, [id]);

  const handleAddOrUpdateExpense = async () => {
    if (!expense || isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter valid values.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const expenseList = stored ? JSON.parse(stored) : [];

      if (id) {
        // Düzenleme: mevcut kaydı güncelle
        const updatedList = expenseList.map((e: any) =>
          e.id === id ? { ...e, expense, amount: parseFloat(amount) } : e
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        Alert.alert("Updated", "Expense updated!");
      } else {
        // Yeni ekleme
        const newExpense = {
          id: Date.now().toString(),
          expense,
          amount: parseFloat(amount),
        };
        const updatedList = [...expenseList, newExpense];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

        Alert.alert("Saved", "New expense added!");
      }

      props.navigation.navigate("HomeScreen");
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <KeyboardAvoidingView style={myStyles.container}>
      <Text style={myStyles.title}>
        {id ? "EDIT EXPENSE" : "ADD NEW EXPENSE"}
      </Text>

      <TextInput
        value={expense}
        onChangeText={setExpense}
        placeholder="Expense Name"
      />

      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={handleAddOrUpdateExpense}>
        <Text>{id ? "Update Expense" : "Add your new expense"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
});
