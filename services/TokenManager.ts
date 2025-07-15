import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenManager = {
  /**
   * Stores the token in AsyncStorage.
   * @param {string} token - The token to store.
   */
  async setToken(token: string): Promise<void> {
    try {
      console.log('Saving token:', token);
      await AsyncStorage.setItem('auth_token', token);
      const check = await AsyncStorage.getItem('auth_token');
      console.log('Token after saving:', check);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }
  ,

  /**
   * Retrieves the token from AsyncStorage.
   * @returns {Promise<string | null>} - The stored token or null if not found.
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  },

  /**
   * Deletes the token from AsyncStorage.
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },
};