import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Home, Upload, MessageCircle, User} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/HomeStyle';

export default function BottomNavBar({active = 'Home'}) {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('HomePage')}>
        <Home
          width={24}
          height={24}
          color={active === 'Home' ? 'black' : 'gray'}
        />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('UploadPage')}>
        <Upload
          width={24}
          height={24}
          color={active === 'List' ? 'black' : 'gray'}
        />
        <Text style={styles.navText}>List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('MessagesPage')}>
        <MessageCircle
          width={24}
          height={24}
          color={active === 'Messages' ? 'black' : 'gray'}
        />
        <Text style={styles.navText}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('AccountPage')}>
        <User
          width={24}
          height={24}
          color={active === 'Account' ? 'black' : 'gray'}
        />
        <Text style={styles.navText}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}
