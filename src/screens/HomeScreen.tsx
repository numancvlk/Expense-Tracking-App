import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
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
    { id: string; expense: string; amount: number }[]
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
    navigation.navigate("AddNewExpenseScreen", {});
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
  const totalExpense = expenseList.reduce((sum, e) => sum + (e.amount || 0), 0);
  const renderExpenseItem = ({
    item,
  }: {
    item: { id: string; expense: string; amount: number };
  }) => (
    <TouchableOpacity
      style={myStyles.expenseItem}
      onPress={() =>
        navigation.navigate("ExpenseDetailScreen", { id: item.id })
      }
    >
      <View>
        <Text style={myStyles.expenseName}>{item.expense}</Text>
        <Text style={myStyles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={myStyles.container}>
      <Text style={myStyles.header}>WELCOME TO YOUR EXPENSE TRACKER</Text>
      <View style={myStyles.underline} />

      <Text style={myStyles.subheader}>Your Expenses</Text>

      <View style={myStyles.totalContainer}>
        <Text style={myStyles.totalText}>Total Expenses</Text>
        <Text style={myStyles.totalAmount}>${totalExpense.toFixed(2)}</Text>
      </View>

      <FlatList
        data={expenseList}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={myStyles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={myStyles.addButton} onPress={handleNewExpense}>
        <Text style={myStyles.addButtonText}>+ Add New Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b", // Lacivert
    textAlign: "center",
    letterSpacing: 1,
  },
  underline: {
    height: 4,
    width: 120,
    backgroundColor: "#f97316", // Parlak turuncu
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 18,
    borderRadius: 2,
    // Gradient yapabilirsin ileride, şu an basit renk
  },
  subheader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
    marginLeft: 5,
  },
  totalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 18,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280", // Gri ton
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f97316", // Turuncu, dikkat çeker
  },
  listContainer: {
    paddingBottom: 80,
  },
  expenseItem: {
    backgroundColor: "#fff",
    padding: 18,
    marginBottom: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#f97316",
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 14,
    shadowColor: "#f97316",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
