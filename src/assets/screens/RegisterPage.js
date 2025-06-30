import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'react-native-feather';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import styles from '../styles/RegisterStyle';

export default function RegisterPage({ navigation }) {
  // State to store user input for registration
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // TODO: Implement backend API call for registration on button press
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!agreed) {
      alert('You need to agree to the terms and conditions.');
      return;
    }

    try {
      const response = await fetch('https://your-backend-api.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        navigation.navigate('LoginPage'); // Navigate to login upon success
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#FFFFFF" statusBarStyle="dark-content">
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Register</Text>
      </View>

      {/* Registration Form */}
      <View style={styles.form}>
        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password Input */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={[styles.agreeButton, agreed && styles.agreeButtonActive]}
          onPress={() => setAgreed(!agreed)}>
          <Text style={styles.agreeText}>Agree to Terms & Conditions</Text>
        </TouchableOpacity>

        {/* Register Button - Disabled if user hasn't agreed */}
        <TouchableOpacity
          style={[styles.primaryButton, !agreed && styles.disabledButton]}
          onPress={handleRegister}
          disabled={!agreed}>
          <Text style={styles.primaryButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
