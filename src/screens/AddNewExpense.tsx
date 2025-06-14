import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";

import { RootStackParamList } from "./types/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
type AddNewExpenseProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "AddNewExpenseScreen"
  >;
  route: RouteProp<RootStackParamList, "AddNewExpenseScreen">;
};

const categoryOptions = [
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
];
const STORAGE_KEY = "expenses";

export default function AddNewExpense(props: AddNewExpenseProps) {
  const { id } = props.route.params ?? {};

  const [expense, setExpense] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };
  const [category, setCategory] = useState<string>(categoryOptions[0]);

  useEffect(() => {
    if (id) {
      AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
        const expenseList = stored ? JSON.parse(stored) : [];
        const found = expenseList.find((e: any) => e.id === id);
        if (found) {
          setExpense(found.expense);
          setAmount(found.amount.toString());
          setDate(new Date(found.date));
          setCategory(found.category || categoryOptions[0]);
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
          e.id === id
            ? {
                ...e,
                expense,
                amount: parseFloat(amount),
                date: date ? date.toISOString() : new Date().toISOString(),
                category,
              }
            : e
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        Alert.alert("Updated", "Expense updated!");
      } else {
        // Yeni ekleme
        const newExpense = {
          id: Date.now().toString(),
          expense,
          amount: parseFloat(amount),
          date: date ? date.toISOString() : new Date().toISOString(),
          category,
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
    <KeyboardAvoidingView behavior="padding" style={myStyles.container}>
      <Text style={myStyles.header}>
        {id ? "EDIT EXPENSE" : "ADD NEW EXPENSE"}
      </Text>
      <View style={myStyles.underline} />

      <View style={myStyles.form}>
        <Text style={myStyles.label}>Expense Name</Text>
        <TextInput
          style={myStyles.input}
          placeholderTextColor="#94a3b9"
          value={expense}
          onChangeText={setExpense}
          placeholder="Please enter your expense"
        />

        <TextInput
          style={myStyles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Please enter your amount"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={myStyles.input}
            value={date ? date.toLocaleDateString() : ""}
            placeholder="Select a date"
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <Text style={myStyles.label}>Category</Text>
        <View style={myStyles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categoryOptions.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={myStyles.addButton}
          onPress={handleAddOrUpdateExpense}
        >
          <Text style={myStyles.buttonText}>
            {id ? "Update Expense" : "Add your new expense"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 1,
  },
  underline: {
    height: 4,
    width: 100,
    backgroundColor: "#f97316",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 24,
    borderRadius: 2,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    height: 44,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f9fafb",
  },
  addButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  dateButton: {
    backgroundColor: "#0dc0c9",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f9fafb",
  },
});
