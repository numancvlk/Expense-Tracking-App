import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/Navigation";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

const STORAGE_KEY = "expenses";

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [expenseList, setExpenseList] = useState<
    {
      id: string;
      expense: string;
      amount: number;
      date: string;
      category: string;
    }[]
  >([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [filteredList, setFilteredList] = useState<
    { id: string; expense: string; amount: number; date: string }[]
  >([]);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        const loadedExpenses = await loadExpenses();
        setExpenseList(loadedExpenses);
        setFilteredList(loadedExpenses);
      };
      fetchExpenses();
    }, [])
  );

  useEffect(() => {
    filterExpenses();
  }, [startDate, endDate, expenseList]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory(null);
    setFilteredList(expenseList);
  };

  const filterExpenses = () => {
    if (!startDate && !endDate) {
      setFilteredList(expenseList);
      return;
    }

    let dateMatch = true;

    const filtered = expenseList.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        dateMatch =
          itemDate.getFullYear() === startDate.getFullYear() &&
          itemDate.getMonth() === startDate.getMonth() &&
          itemDate.getDate() === startDate.getDate();
      }
      const categoryMatch = selectedCategory
        ? item.category === selectedCategory
        : true;
      return dateMatch && categoryMatch;
    });
    setFilteredList(filtered);
  };

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

  const totalExpense = filteredList.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const renderExpenseItem = ({
    item,
  }: {
    item: { id: string; expense: string; amount: number; date: string };
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
        {item.date && (
          <Text style={myStyles.expenseDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={myStyles.container}>
      <Text style={myStyles.header}>WELCOME TO YOUR EXPENSE TRACKER</Text>

      <View style={myStyles.underline} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Text>Filter</Text>
        </TouchableOpacity>

        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={myStyles.modalOverlay}>
            <View style={myStyles.modalContainer}>
              <TouchableOpacity
                style={[
                  myStyles.dateInput,
                  { width: "30%", paddingVertical: 8 },
                ]}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={{ fontSize: 13, textAlign: "center" }}>
                  {startDate ? startDate.toDateString() : "Start Date"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  myStyles.dateInput,
                  { width: "30%", paddingVertical: 8 },
                ]}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={{ fontSize: 13, textAlign: "center" }}>
                  {endDate ? endDate.toDateString() : "End Date"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetFilters}
                style={[
                  myStyles.dateInput,
                  {
                    width: "30%",
                    backgroundColor: "#e11d48",
                  },
                ]}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <Text style={myStyles.modalLabel}>Select Category</Text>
              <View style={myStyles.categoryContainer}>
                {[
                  "Food",
                  "Transport",
                  "Shopping",
                  "Bills",
                  "Market",
                  "Fuel",
                  "Personal Care",
                  "Clothing",
                  "Subscriptions",
                  "Entertainment",
                  "Rent",
                  "Utilities",
                  "Pets",
                  "Medical",
                  "Insurance",
                  "Books",
                  "Education",
                  "Investments",
                  "Hotels",
                  "Travel",
                  "Donations",
                  "Other",
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      myStyles.categoryButton,
                      selectedCategory === cat &&
                        myStyles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        myStyles.categoryButtonText,
                        selectedCategory === cat &&
                          myStyles.categoryButtonTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={{
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ marginTop: 12, width: "100%", alignItems: "center" }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {(startDate || endDate) && (
        <Text style={{ textAlign: "center", color: "#888", marginBottom: 8 }}>
          Showing expenses {startDate ? `from ${startDate.toDateString()}` : ""}{" "}
          {endDate ? `to ${endDate.toDateString()}` : ""}
        </Text>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <Text style={myStyles.subheader}>Your Expenses</Text>

      <View style={myStyles.totalContainer}>
        <Text style={myStyles.totalText}>Total Expenses</Text>
        <Text style={myStyles.totalAmount}>${totalExpense.toFixed(2)}</Text>
      </View>

      <FlatList
        data={filteredList}
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
  expenseDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 1,
  },
  underline: {
    height: 4,
    width: 120,
    backgroundColor: "#f97316",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 18,
    borderRadius: 2,
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
    color: "#6b7280",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f97316",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "#fff", // Arka plan şeffaf değil
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    columnGap: 12,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#334155",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 20,
  },

  categoryButtonSelected: {
    backgroundColor: "#2563eb",
  },

  categoryButtonText: {
    color: "#1e293b",
    fontSize: 13,
  },

  categoryButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
