import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Compass, Calendar, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

function TabIcon({ icon, label, focused }: { icon: React.ReactNode; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      {icon}
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Compass size={22} color={focused ? Colors.primary : Colors.textMuted} />}
              label="Explorar"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Calendar size={22} color={focused ? Colors.primary : Colors.textMuted} />}
              label="Reservas"
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
              icon={<User size={22} color={focused ? Colors.primary : Colors.textMuted} />}
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tabItemFocused: {
    backgroundColor: Colors.primaryLight,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMuted,
  },
  tabLabelFocused: {
    color: Colors.primary,
  },
});
