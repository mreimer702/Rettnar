import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Notification = {
  id: string;
  type: 'info' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
};

export default function NotificationPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigation = useNavigation<any>(); // Replace with proper typing if using typed navigation

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Information Notification',
      message: 'Lorem ipsum dolor sit amet',
      time: '5 mins ago',
    },
    {
      id: '2',
      type: 'alert',
      title: 'Alert Notification',
      message: 'Consectetur adipiscing elit',
      time: '1 hour ago',
    },
    {
      id: '3',
      type: 'success',
      title: 'Success Notification',
      message: 'Sed do eiusmod tempor',
      time: '1 day ago',
    },
  ]);

  const filterNotifications = (): Notification[] => {
    return filter === 'unread' ? notifications.slice(0, 2) : notifications;
  };

  const dismissAll = async () => {
    try {
      setNotifications([]);
    } catch (error) {
      console.error('Failed to dismiss notifications:', error);
    }
  };

  const renderItem: ListRenderItem<Notification> = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={[styles.icon, styles[item.type]]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('(tabs)')}>
          <Text style={{fontSize: 24, color: '#111827'}}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' ? styles.activeButton : {},
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' ? styles.activeFilterText : {},
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' ? styles.activeButton : {},
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'unread' ? styles.activeFilterText : {},
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filterNotifications()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {/* Dismiss All */}
      <TouchableOpacity style={styles.dismissButton} onPress={dismissAll}>
        <Text style={styles.dismissText}>Dismiss All</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#111827',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  activeButton: {
    backgroundColor: '#3B82F6',
  },

  filterText: {
    color: '#374151',
    fontWeight: '500',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  list: {
    flexGrow: 0,
    marginBottom: 16,
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  icon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  info: {
    backgroundColor: '#60A5FA',
  },

  alert: {
    backgroundColor: '#F87171',
  },

  success: {
    backgroundColor: '#34D399',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  message: {
    fontSize: 14,
    color: '#6B7280',
  },

  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  dismissButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  dismissText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

