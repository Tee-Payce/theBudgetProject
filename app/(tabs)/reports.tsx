import { useBudget } from '@/contexts/BudgetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getYearlyData } from '@/database/database';
import { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function Reports() {
  const { transactions, currency, getCurrencySymbol } = useBudget();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedYear] = useState(new Date().getFullYear());

  const getMonthlyData = () => {
    const monthlyData = {};
    
    transactions.filter(t => t.currency === currency).forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          income: {},
          expenses: {},
          totalIncome: 0,
          totalExpenses: 0
        };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income[transaction.category] = 
          (monthlyData[monthKey].income[transaction.category] || 0) + transaction.amount;
        monthlyData[monthKey].totalIncome += transaction.amount;
      } else {
        monthlyData[monthKey].expenses[transaction.category] = 
          (monthlyData[monthKey].expenses[transaction.category] || 0) + transaction.amount;
        monthlyData[monthKey].totalExpenses += transaction.amount;
      }
    });
    
    return monthlyData;
  };

  const getYearlyChartData = () => {
    const yearlyData = getYearlyData(selectedYear, currency);
    const monthlyTotals = Array(12).fill(0).map(() => ({ income: 0, expenses: 0 }));
    
    yearlyData.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (item.type === 'income') {
        monthlyTotals[monthIndex].income = item.total;
      } else {
        monthlyTotals[monthIndex].expenses = item.total;
      }
    });

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: monthlyTotals.map(m => m.income),
          color: () => theme.income,
          strokeWidth: 3
        },
        {
          data: monthlyTotals.map(m => m.expenses),
          color: () => theme.expense,
          strokeWidth: 3
        }
      ]
    };
  };

  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.textSecondary,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.glow
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.border,
      strokeWidth: 1
    }
  };

  const ViewToggle = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
      {['monthly', 'yearly'].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={{
            backgroundColor: viewMode === mode ? theme.primary : theme.surface,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            marginHorizontal: 8,
            borderWidth: 2,
            borderColor: viewMode === mode ? theme.primary : theme.border,
          }}
          onPress={() => setViewMode(mode)}
        >
          <Text style={{
            color: viewMode === mode ? '#000000' : theme.text,
            fontWeight: viewMode === mode ? '900' : '600',
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            {mode}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const monthlyData = getMonthlyData();
  const months = Object.keys(monthlyData).sort().reverse();
  const yearlyChartData = getYearlyChartData();

  if (months.length === 0) {
    return (
      <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ 
            fontSize: 24, 
            color: theme.textSecondary, 
            textAlign: 'center',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}>
            NO ANALYTICS DATA
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '900', 
          marginBottom: 20, 
          textAlign: 'center', 
          color: theme.primary,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>
          ⚡ DATA ANALYTICS ⚡
        </Text>

        <ViewToggle />

        {viewMode === 'yearly' && (
          <View style={{
            backgroundColor: theme.cardBackground,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: theme.border,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              color: theme.primary,
              textAlign: 'center',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}>
              {selectedYear} YEARLY OVERVIEW
            </Text>
            
            <LineChart
              data={yearlyChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: theme.glow,
              }}
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                <View style={{ width: 12, height: 12, backgroundColor: theme.income, marginRight: 8, borderRadius: 6 }} />
                <Text style={{ color: theme.textSecondary, fontFamily: 'monospace', fontSize: 12 }}>INCOME</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, backgroundColor: theme.expense, marginRight: 8, borderRadius: 6 }} />
                <Text style={{ color: theme.textSecondary, fontFamily: 'monospace', fontSize: 12 }}>EXPENSES</Text>
              </View>
            </View>
          </View>
        )}

        {viewMode === 'monthly' && months.map(month => {
          const data = monthlyData[month];
          const balance = data.totalIncome - data.totalExpenses;
          
          return (
            <View key={month} style={{
              backgroundColor: theme.cardBackground,
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 2,
              borderColor: theme.border,
            }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                marginBottom: 12, 
                color: theme.primary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontFamily: 'monospace',
                textAlign: 'center',
              }}>
                {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              
              {/* Bar Chart for Monthly Data */}
              {(data.totalIncome > 0 || data.totalExpenses > 0) && (
                <BarChart
                  data={{
                    labels: ['Incomessssss', 'Expenses'],
                    datasets: [{
                      data: [data.totalIncome, data.totalExpenses]
                    }]
                  }}
                  width={screenWidth - 64}
                  height={180}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => data.totalIncome > data.totalExpenses ? theme.income : theme.expense,
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: theme.glow,
                  }}
                />
              )}

              {/* Summary Cards */}
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={{
                    backgroundColor: theme.income,
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.glow,
                  }}>
                    <Text style={{ color: '#000000', fontWeight: '700', textTransform: 'uppercase', fontSize: 12, fontFamily: 'monospace' }}>TOTAL INCOME</Text>
                    <Text style={{ color: '#000000', fontWeight: '900', fontSize: 14, fontFamily: 'monospace' }}>{getCurrencySymbol()}{data.totalIncome.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <View style={{
                    backgroundColor: theme.expense,
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.glow,
                  }}>
                    <Text style={{ color: '#000000', fontWeight: '700', textTransform: 'uppercase', fontSize: 12, fontFamily: 'monospace' }}>TOTAL EXPENSES</Text>
                    <Text style={{ color: '#000000', fontWeight: '900', fontSize: 14, fontFamily: 'monospace' }}>{getCurrencySymbol()}{data.totalExpenses.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}