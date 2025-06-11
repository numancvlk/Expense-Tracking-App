import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useState } from "react";

import { RootStackParamList } from "./types/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AddNewExpenseProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AddNewExpenseScreen"
  >;
};

const STORAGE_KEY = "expenses";

export default function AddNewExpense(props: AddNewExpenseProps) {
  const [expense, setExpense] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleAddNewExpense = async () => {
    if (!expense || isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter valid values.");
      return;
    }

    const newExpense = { expense, amount: parseFloat(amount) };

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const expenseList = stored ? JSON.parse(stored) : [];

      const updatedList = [...expenseList, newExpense];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

      Alert.alert("Saved", "New expense added!");

      props.navigation.navigate("HomeScreen");
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <KeyboardAvoidingView style={myStyles.container}>
      <Text style={myStyles.title}>ADD NEW EXPENSE</Text>

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

      <TouchableOpacity onPress={handleAddNewExpense}>
        <Text>Add your new expense</Text>
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
