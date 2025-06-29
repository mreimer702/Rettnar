// OnboardingScreen.js
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { styles } from '../styles/OnboardingStyle'; // Import styles from OnboardingStyle.js

export default function OnboardingScreen({ navigation }) {
  return (
    // Background Image for the Onboarding Page
    <ImageBackground
      source={'../Onboarding.jpg'} // Background image for onboarding
      style={styles.container}
      resizeMode="cover">
      {/* Status bar settings for better visibility */}
      <StatusBar barStyle="dark-content" />

      {/* Welcome message */}
      <Text style={styles.heading}>Welcome to Renttar</Text>

      {/* Button section for Sign Up, Log in, and Continue as Guest */}
      <View style={styles.buttonContainer}>
        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('RegisterPage')}>
          <Text style={styles.buttonTextWhite}>Sign Up</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity
          style={styles.buttonLight}
          onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.buttonTextBlack}>Log in</Text>
        </TouchableOpacity>

        {/* Continue as Guest Button */}
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('HomePage')}>
          <Text style={styles.textMuted}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
