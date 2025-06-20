import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {ChevronLeft, Camera} from 'react-native-feather';
import styles from '../styles/ProfileStyle';
import BottomNavBar from '../components/BottomNavBar';

export default function ProfilePage({navigation}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Placeholder function for image selection
  const pickImage = () => {
    Alert.alert('Feature Pending', 'Image upload will be implemented.');
  };

  // Placeholder function for saving profile changes
  const handleSaveChanges = () => {
    Alert.alert('Feature Pending', 'Save functionality will be implemented.');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.scrollContainer}>
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.subText}>
          Your email is used for account notifications.
        </Text>

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.subText}>Your unique identifier on the app.</Text>

        {/* Profile Photo */}
        <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{uri: profileImage}} style={styles.profileImage} />
            ) : (
              <Camera width={40} height={40} color="gray" />
            )}
          </View>
          <View>
            <Text style={styles.profileName}>Your Name</Text>
            <Text style={styles.subText}>Add a profile photo</Text>
          </View>
        </TouchableOpacity>

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.subText}>Used for account security purposes.</Text>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="" />
    </View>
  );
}
