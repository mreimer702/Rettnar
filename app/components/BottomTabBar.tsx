import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Chrome as Home, Search, Plus, MessageSquare, User } from 'lucide-react-native';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, route: '/(tabs)/index' },
    { name: 'Search', icon: Search, route: '/(tabs)/search' },
    { name: 'List Item', icon: Plus, route: '/(tabs)/list' },
    { name: 'Messages', icon: MessageSquare, route: '/(tabs)/messages' },
    { name: 'Profile', icon: User, route: '/(tabs)/profile' },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
      paddingBottom: 20,
      paddingTop: 12,
      height: 88,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    }}>
      {tabs.map(({ name, icon: Icon, route }) => {
        const isActive = pathname === route;
        const color = isActive ? '#3B82F6' : '#64748B';

        return (
          <TouchableOpacity
            key={name}
            onPress={() => router.push(route as any)}
            style={{ alignItems: 'center' }}
          >
            <Icon size={24} color={color} strokeWidth={2} />
            <Text style={{ fontSize: 12, fontFamily: 'Inter-Medium', color, marginTop: 4 }}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
