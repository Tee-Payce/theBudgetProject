import { useBudget } from '@/contexts/BudgetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const INCOME_CATEGORIES = ['SALARY', 'FREELANCE', 'INVESTMENT', 'GIFT', 'OTHER'];
const EXPENSE_CATEGORIES = ['FOOD', 'TRANSPORTATION', 'ENTERTAINMENT', 'BILLS', 'SHOPPING', 'HEALTHCARE', 'SAVINGS', 'INVESTMENT', 'LOANS', 'BLACK TAX', 'TITHE', 'PERSONAL CARE', 'OTHER'];

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const { addTransaction, currency, setCurrency } = useBudget();
  const { theme } = useTheme();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const transactionType = type as 'income' | 'expense' || 'expense';
  const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  const handleSubmit = () => {
    if (!amount || !description || !category) {
      Alert.alert('ERROR', 'ALL FIELDS REQUIRED');
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('ERROR', 'INVALID AMOUNT VALUE');
      return;
    }
    
    addTransaction({
      type: transactionType,
      amount: numAmount,
      description: description.toUpperCase(),
      category,
      date: new Date().toLocaleDateString(),
      currency,
    });
    
    Alert.alert('SUCCESS', 'TRANSACTION LOGGED', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '900', 
          marginBottom: 20, 
          textAlign: 'center',
          color: transactionType === 'income' ? theme.income : theme.expense,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: 2,
          textShadowColor: transactionType === 'income' ? theme.income : theme.expense,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }}>
          {transactionType === 'income' ? '⚡ LOG INCOME ⚡' : '⚡ LOG EXPENSE ⚡'}
        </Text>

        {/* Currency Selector */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 8, 
            color: theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            CURRENCY
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {['USD', 'ZWG'].map((curr) => (
              <TouchableOpacity
                key={curr}
                style={{
                  backgroundColor: currency === curr ? theme.primary : theme.surface,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  marginRight: 12,
                  borderWidth: 2,
                  borderColor: currency === curr ? theme.primary : theme.border,
                  shadowColor: currency === curr ? theme.primary : theme.shadow,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: currency === curr ? 0.8 : 0.4,
                  shadowRadius: currency === curr ? 8 : 4,
                  elevation: currency === curr ? 8 : 4,
                }}
                onPress={() => setCurrency(curr)}
              >
                <Text style={{
                  color: currency === curr ? '#000000' : theme.text,
                  fontWeight: currency === curr ? '900' : '600',
                  fontSize: 16,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontFamily: 'monospace',
                }}>
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 8, 
            color: theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            AMOUNT ({currency === 'USD' ? '$' : 'ZWG'})
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: theme.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 18,
              backgroundColor: theme.surface,
              color: theme.text,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            keyboardType="numeric"
          />
        </View>

        {/* Description Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 8, 
            color: theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            DESCRIPTION
          </Text>
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: theme.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              backgroundColor: theme.surface,
              color: theme.text,
              fontFamily: 'monospace',
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}
            value={description}
            onChangeText={setDescription}
            placeholder={`ENTER ${transactionType.toUpperCase()} DESCRIPTION`}
            placeholderTextColor={theme.textMuted}
          />
        </View>

        {/* Category Selection */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            marginBottom: 8, 
            color: theme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            CATEGORY
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={{
                  backgroundColor: category === cat ? theme.primary : theme.surface,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  margin: 4,
                  borderWidth: 2,
                  borderColor: category === cat ? theme.primary : theme.border,
                  shadowColor: category === cat ? theme.primary : theme.shadow,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: category === cat ? 0.8 : 0.4,
                  shadowRadius: category === cat ? 8 : 4,
                  elevation: category === cat ? 8 : 4,
                }}
                onPress={() => setCategory(cat)}
              >
                <Text style={{
                  color: category === cat ? '#000000' : theme.text,
                  fontWeight: category === cat ? '900' : '600',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontFamily: 'monospace',
                }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: transactionType === 'income' ? theme.income : theme.expense,
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: transactionType === 'income' ? theme.income : theme.expense,
            shadowColor: transactionType === 'income' ? theme.income : theme.expense,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 10,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ 
            color: '#000000', 
            textAlign: 'center', 
            fontWeight: '900',
            fontSize: 18,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontFamily: 'monospace',
          }}>
            {transactionType === 'income' ? 'LOG INCOME' : 'LOG EXPENSE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}