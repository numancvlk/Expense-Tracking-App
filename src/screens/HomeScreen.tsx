import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";
import { useState } from "react";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const [expenseList, setExpenseList] = useState([]);

  const { expense, numberAmount } = route.params ?? {};

  const handleNewExpense = () => {
    navigation.navigate("AddNewExpenseScreen");
  };

  return (
    <View style={myStyles.container}>
      <Text style={myStyles.title}>WELCOME YOUR EXPENSE TRACKER</Text>

      <Text>YOUR EXPENSE</Text>

      <View>
        <Text>Total Fee: 60$</Text>
      </View>

      <View style={myStyles.expenseBox}>
        <Text>
          {expense} - {numberAmount}$
        </Text>
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
