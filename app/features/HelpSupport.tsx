import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpSupport = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help & Support Page</Text>
    </View>
  );
};

export default HelpSupport;

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
