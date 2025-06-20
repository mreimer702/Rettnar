import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {Home, MessageCircle, User, ChevronLeft} from 'react-native-feather';
import styles from '../styles/NotificationStyle';
import {useNavigation} from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

export default function NotificationPage() {
  const [filter, setFilter] = useState('all');
  const navigation = useNavigation();

  // TODO: Fetch notifications from the backend
  const [notifications, setNotifications] = useState([
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

  // TODO: Implement a backend call to fetch only unread notifications
  const filterNotifications = () => {
    if (filter === 'unread') {
      return notifications.slice(0, 2); // Simulating unread notifications
    }
    return notifications;
  };

  // TODO: Implement backend API to dismiss notifications
  const dismissAll = async () => {
    try {
      // Example API Call: await fetch('https://your-api.com/notifications/dismiss-all', { method: 'POST' });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to dismiss notifications:', error);
    }
  };

  const renderItem = ({item}) => (
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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' ? styles.activeButton : {},
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' ? styles.activeFilterText : {},
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' ? styles.activeButton : {},
          ]}
          onPress={() => setFilter('unread')}>
          <Text
            style={[
              styles.filterText,
              filter === 'unread' ? styles.activeFilterText : {},
            ]}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification List - TODO: Connect with backend API data */}
      <FlatList
        data={filterNotifications()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {/* Dismiss All Button */}
      <TouchableOpacity style={styles.dismissButton} onPress={dismissAll}>
        <Text style={styles.dismissText}>Dismiss All</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="" />
    </View>
  );
}
