import { useBudget } from '@/contexts/BudgetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const { getTotalIncome, getTotalExpenses, getBalance, transactions, currency, setCurrency, getCurrencySymbol } = useBudget();
  const { theme } = useTheme();

  const StatCard = ({ title, value, color }) => (
    <View style={{
      backgroundColor: color,
      padding: 16,
      borderRadius: 12,
      margin: 4,
      flex: 1,
      borderWidth: 2,
      borderColor: theme.glow,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 10,
    }}>
      <Text style={{ color: '#000000', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
      <Text style={{ color: '#000000', fontSize: 28, fontWeight: '900', fontFamily: 'monospace' }}>{getCurrencySymbol()}{value.toFixed(2)}</Text>
    </View>
  );

  const CurrencySelector = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
      {['USD', 'ZWG'].map((curr) => (
        <TouchableOpacity
          key={curr}
          style={{
            backgroundColor: currency === curr ? theme.primary : theme.surface,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            marginHorizontal: 8,
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
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            {curr}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const QuickAction = ({ title, onPress, icon }) => (
    <TouchableOpacity
      style={{
        backgroundColor: theme.surface,
        padding: 16,
        borderRadius: 12,
        margin: 4,
        alignItems: 'center',
        flex: 1,
        borderWidth: 2,
        borderColor: theme.primary,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
      }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 28, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 12, fontWeight: '700', textAlign: 'center', color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Text>
    </TouchableOpacity>
  );

  const balance = getBalance();
  const balanceColor = balance >= 0 ? theme.income : theme.expense;
  const currentTransactions = transactions.filter(t => t.currency === currency);

  return (
    <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: '900', 
          marginBottom: 20, 
          textAlign: 'center',
          color: theme.primary,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: 2,
          textShadowColor: theme.shadow,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        }}>
          ⚡ NEXUS FINANCE ⚡
        </Text>

        {/* Currency Selector */}
        <CurrencySelector />

        {/* Balance Card */}
        <View style={{ marginBottom: 20 }}>
          <StatCard 
            title="CURRENT BALANCE" 
            value={balance} 
            color={balanceColor} 
          />
        </View>

        {/* Income/Expense Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatCard title="TOTAL INCOME" value={getTotalIncome()} color={theme.income} />
          <StatCard title="TOTAL EXPENSES" value={getTotalExpenses()} color={theme.expense} />
        </View>

        {/* Quick Actions */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>QUICK ACCESS</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <QuickAction 
            title="ADD INCOME" 
            icon="💎" 
            onPress={() => router.push('/add-transaction?type=income')} 
          />
          <QuickAction 
            title="ADD EXPENSE" 
            icon="⚡" 
            onPress={() => router.push('/add-transaction?type=expense')} 
          />
        </View>

        {/* Recent Transactions */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>RECENT ACTIVITY</Text>
        {currentTransactions.slice(0, 5).map(transaction => (
          <View
            key={transaction.id}
            style={{
              backgroundColor: theme.cardBackground,
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, fontFamily: 'monospace' }}>
                  {transaction.description.toUpperCase()}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {transaction.category} • {transaction.date} • {transaction.currency}
                </Text>
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '900',
                color: transaction.type === 'income' ? theme.income : theme.expense,
                fontFamily: 'monospace',
                textShadowColor: transaction.type === 'income' ? theme.income : theme.expense,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 5,
              }}>
                {transaction.type === 'income' ? '+' : '-'}{transaction.currency === 'USD' ? '$' : 'ZWG'}{transaction.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        {currentTransactions.length === 0 && (
          <View style={{
            backgroundColor: theme.surface,
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.border,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
          }}>
            <Text style={{ color: theme.textSecondary, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>NO {currency} DATA FOUND</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4, textTransform: 'uppercase' }}>INITIALIZE FIRST {currency} TRANSACTION</Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}
