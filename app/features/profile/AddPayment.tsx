import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { api } from '../../../services/api';

// Define navigation stack types
type RootStackParamList = {
  AddPaymentPage: undefined;
};

const AddPaymentPage: React.FC = () => {
  const router = useRouter();
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [billingAddress, setBillingAddress] = useState<string>('');

  const handleAddPaymentMethod = async (): Promise<void> => {
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
      const response = await api.payments.addMethod({
        cardholderName,
        cardNumber,
        expirationDate,
        cvv,
        billingAddress,
      }) as { message?: string };

      if (response) {
        Alert.alert('Success', 'Payment method added successfully.');
        router.back();
      } else {
        Alert.alert('Error', response?.message || 'Failed to add payment method.');
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
        <TouchableOpacity onPress={() => router.back()}>
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

        {/* Card Number Input */}
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter card number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Text style={styles.subText}>Visa/Mastercard/AMEX supported</Text>

        {/* Expiration Date Input */}
        <Text style={styles.label}>Expiration Date</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          keyboardType="numeric"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />

        {/* CVV Input */}
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

        {/* Billing Address Input */}
        <Text style={styles.label}>Billing Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter billing address"
          value={billingAddress}
          onChangeText={setBillingAddress}
        />

                {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          // TODO: Add your submit logic here
          alert('Payment method submitted!');
        }}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
              </ScrollView>
            </View>
          );
        };

        export default AddPaymentPage;
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 16,
          },
          header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
          },
          headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 16,
          },
          form: {
            flex: 1,
          },
          label: {
            fontSize: 16,
            fontWeight: '500',
            marginTop: 16,
            marginBottom: 4,
          },
          input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#f9f9f9',
          },
          subText: {
            fontSize: 12,
            color: '#888',
            marginBottom: 8,
            marginTop: 2,
          },
          submitButton: {
            backgroundColor: '#007AFF',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 24,
            marginBottom: 32,
          },
          submitButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          },
        });
