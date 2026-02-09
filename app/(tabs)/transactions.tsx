import { useBudget } from '@/contexts/BudgetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Alert, FlatList, ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function Transactions() {
  const { transactions, deleteTransaction, currency } = useBudget();
  const { theme } = useTheme();

  const currentTransactions = transactions.filter(t => t.currency === currency);

  const handleDelete = (id: string, description: string) => {
    Alert.alert(
      'DELETE TRANSACTION',
      `CONFIRM DELETION: "${description.toUpperCase()}"?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        { 
          text: 'DELETE', 
          style: 'destructive',
          onPress: () => deleteTransaction(id)
        }
      ]
    );
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
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
      onLongPress={() => handleDelete(item.id, item.description)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, fontFamily: 'monospace', textTransform: 'uppercase' }}>
            {item.description}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
            {item.category} • {item.date}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '900',
            color: item.type === 'income' ? theme.income : theme.expense,
            fontFamily: 'monospace',
            textShadowColor: item.type === 'income' ? theme.income : theme.expense,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 5,
          }}>
            {item.type === 'income' ? '+' : '-'}{item.currency === 'USD' ? '$' : 'ZWG'}{item.amount.toFixed(2)}
          </Text>
          <Text style={{
            fontSize: 10,
            color: theme.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}>
            {item.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (currentTransactions.length === 0) {
    return (
      <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20
        }}>
          <Text style={{ 
            fontSize: 24, 
            color: theme.textSecondary,
            textAlign: 'center',
            marginBottom: 8,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: 2,
            textShadowColor: theme.shadow,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}>
            NO DATA STREAMS
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: theme.textMuted,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            INITIALIZE TRANSACTION PROTOCOL
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ 
          fontSize: 12, 
          color: theme.textSecondary, 
          marginBottom: 16,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontFamily: 'monospace',
        }}>
          LONG PRESS TO DELETE ENTRY
        </Text>
        
        <FlatList
          data={currentTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}