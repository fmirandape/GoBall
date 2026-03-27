import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LayoutDashboard, MapPin, CalendarDays, DollarSign, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

function TabIcon({ icon, label, focused }: { icon: React.ReactNode; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      {icon}
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

const OWNER_COLOR = '#8B5CF6';

export default function OwnerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<LayoutDashboard size={22} color={focused ? OWNER_COLOR : Colors.textMuted} />}
              label="Panel"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<MapPin size={22} color={focused ? OWNER_COLOR : Colors.textMuted} />}
              label="Canchas"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<CalendarDays size={22} color={focused ? OWNER_COLOR : Colors.textMuted} />}
              label="Reservas"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<DollarSign size={22} color={focused ? OWNER_COLOR : Colors.textMuted} />}
              label="Finanzas"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<User size={22} color={focused ? OWNER_COLOR : Colors.textMuted} />}
              label="Perfil"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tabItemFocused: { backgroundColor: '#F5F3FF' },
  tabLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: Colors.textMuted },
  tabLabelFocused: { color: '#8B5CF6' },
});
