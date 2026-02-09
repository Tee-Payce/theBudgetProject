import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { BudgetProvider } from '@/contexts/BudgetContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BudgetProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-transaction" options={{
            title: 'Add Transaction',
            headerStyle: { backgroundColor: '#059669' },
            headerTitleStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
          }} />
        </Stack>
        <StatusBar style="auto" />
      </BudgetProvider>
    </ThemeProvider>
  );
}
