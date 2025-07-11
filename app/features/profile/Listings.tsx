import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Listings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Listings Page</Text>
    </View>
  );
};

export default Listings;

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
