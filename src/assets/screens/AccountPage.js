import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CreditCard, HelpCircle, List, Edit} from 'react-native-feather';
import styles from '../styles/AccountStyle';
import BottomNavBar from '../components/BottomNavBar';

export default function AccountPage() {
  const navigation = useNavigation();

  // TODO: Replace with actual user data from backend (e.g. avatar, name, status)
  const userInfo = {
    name: "User's Name",
    avatar: require('../assets/user-avatar.jpg'), // or use URI from backend
    welcomeMessage: 'Welcome back!',
  };

  // Action buttons for different account functions
  const actions = [
    {
      id: '1',
      title: 'Payment',
      icon: <CreditCard width={24} height={24} color="black" />,
    },
    {
      id: '2',
      title: 'My Rentals',
      icon: <List width={24} height={24} color="black" />,
    },
    {
      id: '3',
      title: 'My Listings',
      icon: <List width={24} height={24} color="brown" />,
    },
    {
      id: '4',
      title: 'My Drafts',
      icon: <Edit width={24} height={24} color="black" />,
    },
    {
      id: '5',
      title: 'Help',
      icon: <HelpCircle width={24} height={24} color="red" />,
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={() => {
        // Navigate to respective pages
        if (item.id === '1') {
          navigation.navigate('AddPaymentPage');
        } else if (item.id === '2') {
          navigation.navigate('RentalPage');
        } else if (item.id === '3') {
          navigation.navigate('ListingPage');
        } else if (item.id === '4') {
          navigation.navigate('DraftsPage');
        }
        // Note: Help currently doesn't navigate anywhere
      }}>
      {item.icon}
      <Text style={styles.actionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Account</Text>

      {/* User Info Section */}
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => navigation.navigate('ProfilePage')}>
        {/* TODO: Replace static avatar with backend user's avatar URI */}
        <Image source={userInfo.avatar} style={styles.avatar} />
        <View>
          {/* TODO: Replace with user's real name from backend */}
          <Text style={styles.userName}>{userInfo.name}</Text>
          {/* TODO: Customize welcome message dynamically if needed */}
          <Text style={styles.welcomeText}>{userInfo.welcomeMessage}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions List */}
      <Text style={styles.sectionTitle}>My Actions</Text>
      <FlatList
        data={actions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="Account" />
    </View>
  );
}
