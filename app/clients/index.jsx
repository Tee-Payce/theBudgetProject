import { useAppContext } from '@/contexts/AppContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addClient, deleteClient, getClients } from '../../database/clientQueries';
import { getSalesByClientId, getTotalSalesByClientId } from '../../database/salesQueries';

export default function Clients() {
  const { refreshTrigger, triggerRefresh } = useAppContext();
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadClients();
  }, [refreshTrigger]);

  const loadClients = () => {
    const data = getClients();
    const clientsWithStats = data.map(client => {
      const totalSpent = getTotalSalesByClientId(client.id);
      const sales = getSalesByClientId(client.id);
      return { ...client, totalSpent, salesCount: sales.length };
    });
    setClients(clientsWithStats);
  };

  const saveClient = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter client name');
      return;
    }

    try {
      addClient({ name: name.trim(), phone: phone.trim() });
      setName('');
      setPhone('');
      setShowAddForm(false);
      triggerRefresh();
      Alert.alert('Success', 'Client added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add client');
    }
  };

  const handleDeleteClient = (client) => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteClient(client.id);
              triggerRefresh();
              Alert.alert('Success', 'Client deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete client');
            }
          }
        }
      ]
    );
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.phone && client.phone.includes(searchQuery))
  );

  const ClientCard = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        margin: 8,
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      }}
      onPress={() => router.push(`/sales/add?clientId=${item.id}`)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }}>
            {item.name}
          </Text>
          
          {item.phone ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 24, marginRight: 8 }}>📞</Text>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>{item.phone}</Text>
            </View>
          ) : (
            <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>No phone number</Text>
          )}
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>TOTAL SPENT</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#059669' }}>
                ${item.totalSpent.toFixed(2)}
              </Text>
            </View>
            
            <View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>PURCHASES</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#374151' }}>
                {item.salesCount}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 6,
            backgroundColor: '#fef2f2'
          }}
          onPress={() => handleDeleteClient(item)}
        >
          <Text style={{ color: '#dc2626', fontSize: 16 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: 'white', elevation: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Clients</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#16a34a',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 4 }}>+</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Client</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ color: '#6b7280', marginBottom: 16 }}>
          {clients.length} total clients • ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)} total revenue
        </Text>

        {/* Search Bar */}
        <TextInput
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#e5e7eb'
          }}
          placeholder="Search clients by name or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Client Form */}
      {showAddForm && (
        <View style={{ backgroundColor: 'white', padding: 16, margin: 16, borderRadius: 12, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' }}>Add New Client</Text>
          
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#49fe88ff',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              marginBottom: 12,
              backgroundColor: '#95ef85ff'
            }}
            placeholder="Client name *"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#49fe88ff',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              marginBottom: 16,
              backgroundColor: '#95ef85ff'
            }}
            placeholder="Phone number (optional)"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#16a34a',
                padding: 12,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center'
              }}
              onPress={saveClient}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Client</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#81e7a5ff',
                padding: 12,
                borderRadius: 8,
                flex: 1,
                alignItems: 'center'
              }}
              onPress={() => {
                setShowAddForm(false);
                setName('');
                setPhone('');
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Client List */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ClientCard item={item} />}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>👤</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#1f2937' }}>
              {searchQuery ? 'No clients found' : 'No clients added yet'}
            </Text>
            <Text style={{ color: '#6b7280', textAlign: 'center' }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first client to start tracking sales'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}