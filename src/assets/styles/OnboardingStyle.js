// bootstrap.js
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, // 确保容器能够占满整个屏幕
    justifyContent: 'center',
    alignItems: 'center', // 居中内容
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonLight: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonTextWhite: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextBlack: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textMuted: {
    color: 'gray',
    fontSize: 14,
  },
});
