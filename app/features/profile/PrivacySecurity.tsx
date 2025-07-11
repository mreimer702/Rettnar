import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacySecurity = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Privacy & Security Page</Text>
    </View>
  );
};

export default PrivacySecurity;

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
