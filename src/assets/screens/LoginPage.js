import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/LoginStyle';

export default function LoginPage({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      // TODO: Implement the actual API call to authenticate the user
      const response = await fetch('https://your-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        // TODO: Save user token or session information if required
        alert('Login successful');
        navigation.navigate('HomePage'); // Navigate to homepage upon success
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Learning Resource Sharing Platform
        </Text>
      </View>

      {/* Input Fields Section */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.secondaryButton}>
            {/* TODO: Implement password recovery process */}
            <Text style={styles.secondaryButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
