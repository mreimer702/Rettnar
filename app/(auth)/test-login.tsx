// app/(auth)/test-login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';

export default function TestLogin() {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      const response = await api.auth.login(email, password) as { user: { firstName: string } };
      console.log('API response:', response);

      const storedToken = await AsyncStorage.getItem('auth_token');
      console.log('Stored token:', storedToken);

      Alert.alert('Login Successful', `Welcome, ${response.user.firstName}`);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});
