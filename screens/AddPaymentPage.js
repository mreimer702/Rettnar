import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/AddPaymentStyle';
import BottomNavBar from '../components/BottomNavBar';

export default function AddPaymentPage({navigation}) {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // TODO: Backend Integration - Handle adding the payment method using API
  const handleAddPaymentMethod = async () => {
    if (
      !cardholderName ||
      !cardNumber ||
      !expirationDate ||
      !cvv ||
      !billingAddress
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // TODO: Replace with actual backend API URL and ensure secure payment handling
      const response = await fetch('https://your-api.com/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardholderName,
          cardNumber,
          expirationDate,
          cvv,
          billingAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Payment method added successfully.');
        navigation.goBack();
      } else {
        // TODO: Ensure backend provides appropriate error messages
        Alert.alert('Error', data.message || 'Failed to add payment method.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Payment Method</Text>
      </View>

      {/* Form for Payment Details */}
      <ScrollView style={styles.form}>
        {/* Cardholder Name Input */}
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter cardholder name"
          value={cardholderName}
          onChangeText={setCardholderName}
        />

        {/* Card Number Input - Backend should validate card type and number */}
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter card number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Text style={styles.subText}>Visa/Mastercard/AMEX supported</Text>

        {/* Expiration Date Input - Ensure backend validates correct format (MM/YY) */}
        <Text style={styles.label}>Expiration Date</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          keyboardType="numeric"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />

        {/* CVV Input - Backend should ensure secure CVV storage */}
        <Text style={styles.label}>CVV</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter CVV"
          keyboardType="numeric"
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
        />
        <Text style={styles.subText}>3 or 4 digits</Text>

        {/* Billing Address Input - Backend should ensure address validation */}
        <Text style={styles.label}>Billing Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter billing address"
          value={billingAddress}
          onChangeText={setBillingAddress}
        />

        {/* Add Payment Button - Trigger API call to backend */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddPaymentMethod}>
          <Text style={styles.buttonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="Account" />
    </View>
  );
}
