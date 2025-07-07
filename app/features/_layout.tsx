import { Slot } from 'expo-router';
import { View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';

export default function FeaturesLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <BottomTabBar />
    </View>
  );
}
export const unstable_settings = {
  initialRouteName: '(tabs)/index',
};