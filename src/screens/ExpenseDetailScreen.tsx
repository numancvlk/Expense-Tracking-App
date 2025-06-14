import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";

type ExpenseDetailScreen = NativeStackScreenProps<
  RootStackParamList,
  "ExpenseDetailScreen"
>;

const STORAGE_KEY = "expenses";

export default function ExpenseDetailScreen({
  navigation,
  route,
}: ExpenseDetailScreen) {
  const { id, selectedExpense, allExpenses } = route.params;
  const [expense, setExpense] = useState<{
    id: string;
    expense: string;
    amount: number;
    date: string;
    category?: string;
  } | null>();

  const categoryColors: Record<string, string> = {
    Food: "#e6194B",
    Transport: "#3cb44b",
    Shopping: "#ffe119",
    Bills: "#4363d8",
    Market: "#f58231",
    Fuel: "#911eb4",
    PersonalCare: "#46f0f0",
    Clothing: "#f032e6",
    Subscriptions: "#bcf60c",
    Entertainment: "#fabebe",
    Rent: "#008080",
    Utilities: "#e6beff",
    Pets: "#9a6324",
    Medical: "#fffac8",
    Insurance: "#800000",
    Books: "#aaffc3",
    Education: "#808000",
    Investments: "#ffd8b1",
    Hotels: "#000075",
    Travel: "#808080",
    Donations: "#2c676a",
    Other: "#000000",
  };

  const chartData = Object.values(
    allExpenses.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          amount: 0,
          color: categoryColors[item.category] || "#000",
          legendFontColor: "#333",
          legendFontSize: 14,
        };
      }
      acc[item.category].amount += item.amount;
      return acc;
    }, {} as Record<string, any>)
  );

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
    navigation.navigate("AddNewExpenseScreen", { id: expense?.id });
  };

  if (!expense) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={myStyles.container}>
      <Text style={myStyles.title}>EXPENSE DETAIL</Text>
      <View style={myStyles.detailBox}>
        <Text style={myStyles.label}>
          Name: <Text style={myStyles.value}>{expense.expense}</Text>
        </Text>

        <Text style={myStyles.label}>
          Amount: <Text style={myStyles.value}>{expense.amount}$</Text>
        </Text>

        <Text style={myStyles.label}>
          Date:
          <Text style={myStyles.value}>
            {new Date(expense.date).toLocaleDateString()}
          </Text>
        </Text>

        <Text style={myStyles.label}>
          Category:
          <Text style={myStyles.value}>
            {expense.category || "Not specified"}
          </Text>
        </Text>
      </View>

      <View style={myStyles.buttonsRow}>
        <TouchableOpacity style={myStyles.deleteButton} onPress={deleteExpense}>
          <Text style={myStyles.buttonText}>DELETE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={myStyles.editButton} onPress={editExpense}>
          <Text style={myStyles.buttonText}>EDIT</Text>
        </TouchableOpacity>
      </View>
      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1,
  },
  detailBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 12,
  },
  value: {
    fontSize: 20,
    color: "#1e293b",
    fontWeight: "bold",
    marginTop: 6,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
