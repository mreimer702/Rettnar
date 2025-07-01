// OnboardingScreen.js
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { styles } from '../styles/OnboardingStyle'; // Import styles from OnboardingStyle.js

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaWrapper statusBarStyle="dark-content" backgroundColor="transparent">
      {/* Background Image for the Onboarding Page */}
      <ImageBackground
        source={require('../Onboarding.jpg')} // Background image for onboarding
        style={styles.container}
        resizeMode="cover">

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
    </SafeAreaWrapper>
  );
}
