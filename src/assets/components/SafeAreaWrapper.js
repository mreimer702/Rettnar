// SafeAreaWrapper.js
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';

export default function SafeAreaWrapper({
  children,
  style,
  edges = ['top', 'left', 'right', 'bottom'],
  statusBarStyle = 'dark-content',
  backgroundColor = '#ffffff',
  statusBarTranslucent = false,
  statusBarHidden = false
}) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
        translucent={Platform.OS === 'android' ? statusBarTranslucent : false}
        hidden={statusBarHidden}
        animated={true}
      />
      {children}
    </SafeAreaView>
  );
}
