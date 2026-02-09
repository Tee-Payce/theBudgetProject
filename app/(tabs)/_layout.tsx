import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { 
          backgroundColor: theme.tabBarBackground,
          borderTopWidth: 2,
          borderTopColor: theme.primary,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 10,
        },
        headerStyle: { 
          backgroundColor: theme.headerBackground,
          borderBottomWidth: 2,
          borderBottomColor: theme.primary,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 10,
        },
        headerTitleStyle: { 
          color: theme.primary,
          fontWeight: '900',
          fontSize: 18,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'monospace',
        },
        headerTintColor: theme.primary,
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ 
              marginRight: 16,
              padding: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.primary,
              backgroundColor: theme.surface,
            }}
          >
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'NEXUS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'DATA',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'ANALYTICS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}