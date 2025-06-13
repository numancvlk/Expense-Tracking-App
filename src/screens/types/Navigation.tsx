export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  AddNewExpenseScreen: { id?: string } | undefined;
  ExpenseDetailScreen: {
    id: string;
    selectedExpense: {
      id: string;
      expense: string;
      amount: number;
      date: string;
      category: string;
    };
    allExpenses: {
      id: string;
      expense: string;
      amount: number;
      date: string;
      category: string;
    }[];
  };
};
