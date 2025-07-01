import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Auth Page</Text>
      <Button title="Go to Login" onPress={() => router.push('/login')} />
      <Button title="Go to Signup" onPress={() => router.push('/signup')} />
    </View>
  );
}