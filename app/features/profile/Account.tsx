import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';

// Define your navigation param list (adjust as needed)
type RootStackParamList = {
  AccountPage: undefined;
  // Add other routes here
};

type AccountPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AccountPage'
>;

type Props = {
  navigation: AccountPageNavigationProp;
};

export default function AccountPage({ navigation }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  // Placeholder function for image selection
  const pickImage = () => {
    Alert.alert('Feature Pending', 'Image upload will be implemented.');
  };

  // Placeholder function for saving profile changes
  const handleSaveChanges = () => {
    if (newPassword && newPassword !== confirmNewPassword) {
    Alert.alert("Password Mismatch", "New passwords do not match.");
    return;
  }
    Alert.alert('Feature Pending', 'Save functionality will be implemented.');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
                  <ChevronLeft width={24} height={24} />
                </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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
          autoCapitalize="none"
        />
        <Text style={styles.subText}>Your unique identifier on the app.</Text>

        {/* Profile Photo */}
        <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
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
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.subText}>Used for account security purposes.</Text>

        {/* Change Password */}
<Text style={styles.sectionTitle}>Change Password</Text>

<Text style={styles.label}>Current Password</Text>
<TextInput
  style={styles.input}
  placeholder="Enter current password"
  value={currentPassword}
  onChangeText={setCurrentPassword}
  secureTextEntry
/>

<Text style={styles.label}>New Password</Text>
<TextInput
  style={styles.input}
  placeholder="Enter new password"
  value={newPassword}
  onChangeText={setNewPassword}
  secureTextEntry
/>

<Text style={styles.label}>Confirm New Password</Text>
<TextInput
  style={styles.input}
  placeholder="Confirm new password"
  value={confirmNewPassword}
  onChangeText={setConfirmNewPassword}
  secureTextEntry
/>


        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Add your styles below
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 8,
    color: '#222',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  subText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    marginTop: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
