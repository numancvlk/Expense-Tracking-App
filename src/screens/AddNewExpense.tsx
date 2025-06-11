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

type AddNewExpenseProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AddNewExpenseScreen"
  >;
};

export default function AddNewExpense(props: AddNewExpenseProps) {
  const [expense, setExpense] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const numberAmount = parseFloat(amount);

  const handleAddNewExpense = () => {
    props.navigation.navigate("HomeScreen", { expense, numberAmount });
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
