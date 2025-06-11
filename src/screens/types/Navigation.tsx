export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  AddNewExpenseScreen: { id?: string } | undefined;
  ExpenseDetailScreen: { id: string };
};
