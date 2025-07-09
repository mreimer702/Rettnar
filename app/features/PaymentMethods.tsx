import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentMethods = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Methods Page</Text>
    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
