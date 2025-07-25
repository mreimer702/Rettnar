import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// API Base Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5001/api' 
  : 'https://your-production-api.com/api';

// Environment control for mock API
// Can be controlled via app.config.js or environment variables
const USE_MOCK_API = Constants.expoConfig?.extra?.useMockApi === 'true' || 
                     (__DEV__ && Constants.expoConfig?.extra?.useMockApi !== 'false');

// Debug logging
if (__DEV__) {
  console.log('🔧 API Configuration:', {
    isDev: __DEV__,
    useMockApi: USE_MOCK_API,
    apiBaseUrl: API_BASE_URL,
    expoConfig: Constants.expoConfig?.extra
  });
}

// Auth Token Management
export const TokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// Generic API Request Function with Token Refresh
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = await TokenManager.getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // For development, simulate API responses (can be disabled with USE_MOCK_API=false)
  if (USE_MOCK_API) {
    return simulateApiResponse<T>(endpoint, config);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token expiration
    if (response.status === 401 && token) {
      console.log('Token expired, attempting refresh...');
      await TokenManager.removeToken();
      throw new Error('Session expired. Please log in again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Simulated API Responses for Development
function simulateApiResponse<T>(endpoint: string, config: RequestInit): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, any> = {
        // Auth Endpoints
        'POST:/auth/login': {
          token: 'mock_jwt_token_12345',
          user: {
            id: '1',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
            location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' }
          }
        },
        'POST:/users/register': {
          token: 'mock_jwt_token_12345',
          user: {
            id: '1',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        'POST:/auth/logout': { success: true },

        // Listings Endpoints
        'GET:/listings/nearby': {
          items: [
            {
              id: '1',
              title: 'Professional DSLR Camera Kit',
              description: 'Complete camera setup with lenses and accessories',
              price: 45,
              category: 'Camera & Gear',
              images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'],
              owner: {
                id: '2',
                name: 'Mike Chen',
                avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
                rating: 4.8
              },
              location: { lat: 37.7849, lng: -122.4094, distance: 0.5 },
              availability: ['2024-01-15', '2024-01-16', '2024-01-17'],
              rating: 4.8,
              reviews: 24
            },
            {
              id: '2',
              title: 'DeWalt Power Drill Set',
              description: 'Professional grade power tools for construction',
              price: 25,
              category: 'Tools',
              images: ['https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg'],
              owner: {
                id: '3',
                name: 'Sarah Johnson',
                avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
                rating: 4.9
              },
              location: { lat: 37.7649, lng: -122.4294, distance: 1.2 },
              availability: ['2024-01-15', '2024-01-16'],
              rating: 4.9,
              reviews: 18
            }
          ]
        },
        'GET:/listings/1': {
          id: '1',
          title: 'Professional DSLR Camera Kit',
          description: 'Complete DSLR camera setup perfect for professional photography and videography. Includes camera body, multiple lenses (50mm, 85mm, 24-70mm), tripod, extra batteries, memory cards, and carrying case.',
          price: 45,
          category: 'Camera & Gear',
          images: [
            'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
            'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg'
          ],
          owner: {
            id: '2',
            name: 'Mike Chen',
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
            rating: 4.8,
            reviewsCount: 24,
            joinedDate: '2023-03-15',
            responseTime: '1 hour'
          },
          location: { 
            lat: 37.7849, 
            lng: -122.4094, 
            address: '123 Mission St, San Francisco, CA',
            distance: 0.5 
          },
          availability: ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18'],
          rating: 4.8,
          reviews: [
            {
              id: '1',
              user: 'Emma Wilson',
              rating: 5,
              comment: 'Amazing camera quality! Mike was super helpful.',
              date: '2024-01-10'
            }
          ],
          policies: {
            cancellation: '24 hours',
            deposit: 100,
            delivery: true,
            pickup: true
          }
        },
        'POST:/listings': {
          id: '3',
          title: 'New Item',
          message: 'Item created successfully'
        },

        // Bookings Endpoints
        'POST:/bookings': {
          id: 'booking_123',
          status: 'pending',
          item: {
            id: '1',
            title: 'Professional DSLR Camera Kit',
            price: 45
          },
          dates: {
            start: '2024-01-15',
            end: '2024-01-17'
          },
          total: 135,
          message: 'Booking request sent successfully'
        },
        'GET:/bookings': {
          bookings: [
            {
              id: 'booking_123',
              status: 'confirmed',
              item: {
                id: '1',
                title: 'Professional DSLR Camera Kit',
                image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
                owner: 'Mike Chen'
              },
              dates: { start: '2024-01-15', end: '2024-01-17' },
              total: 135,
              createdAt: '2024-01-12'
            },
            {
              id: 'booking_124',
              status: 'pending',
              item: {
                id: '2',
                title: 'DeWalt Power Drill Set',
                image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
                owner: 'Sarah Johnson'
              },
              dates: { start: '2024-01-20', end: '2024-01-22' },
              total: 75,
              createdAt: '2024-01-13'
            }
          ]
        },
        'PUT:/bookings/booking_123': {
          success: true,
          booking: {
            id: 'booking_123',
            status: 'confirmed'
          }
        },

        // Messages Endpoints
        'GET:/messages/conversations': {
          conversations: [
            {
              id: 'conv_1',
              participant: {
                id: '2',
                name: 'Mike Chen',
                avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
              },
              lastMessage: {
                text: 'The camera is ready for pickup tomorrow at 10am',
                timestamp: Date.now() - 120000,
                unread: true
              },
              item: {
                id: '1',
                title: 'Professional DSLR Camera',
                status: 'confirmed'
              }
            }
          ]
        },
        'GET:/messages/conv_1': {
          messages: [
            {
              id: 'msg_1',
              text: 'Hi! Is the DSLR camera still available?',
              sender: 'user',
              timestamp: Date.now() - 3600000
            },
            {
              id: 'msg_2',
              text: 'Yes, it\'s available! When do you need it?',
              sender: 'other',
              timestamp: Date.now() - 3500000
            }
          ]
        },
        'POST:/messages/conv_1': {
          id: 'msg_new',
          text: 'Message sent',
          timestamp: Date.now()
        },

        // Notifications Endpoints
        'GET:/notifications/general': {
          notifications: [
            {
              id: 'notif_1',
              type: 'booking_confirmed',
              title: 'Booking Confirmed',
              message: 'Your booking for DSLR Camera has been confirmed',
              timestamp: Date.now() - 3600000,
              read: false
            }
          ]
        },
        'PUT:/notifications/general/notif_1': { success: true }
      };

      const method = config.method || 'GET';
      const key = `${method}:${endpoint}`;
      
      resolve(responses[key] || { success: true });
    }, 500); // Simulate network delay
  });
}

// API Endpoints
export const api = {
  // Authentication
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData: { firstName: string; lastName?: string; email: string; password: string; confirmPassword?: string }) =>
      apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: userData.firstName,
          email: userData.email,
          password: userData.password,
          confirmed_password: userData.confirmPassword || userData.password
        }),
      }),
    
    logout: () =>
      apiRequest('/auth/logout', { method: 'POST' }),
  },

  // Listings
  listings: {
    getNearby: (lat: number, lng: number, radius: number = 10) =>
      apiRequest(`/listings/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),

    getById: (id: string) =>
      apiRequest(`/listings/${id}`),

    create: (itemData: any) =>
      apiRequest('/listings', {
        method: 'POST',
        body: JSON.stringify(itemData),
      }),
    
    update: (id: string, itemData: any) =>
      apiRequest(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      }),
    
    search: (query: string, filters: any = {}) =>
      apiRequest(`/listings/search?q=${query}&${new URLSearchParams(filters)}`),
  },

  // Bookings
  bookings: {
    create: (bookingData: any) =>
      apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),
    
    getAll: () =>
      apiRequest('/bookings'),
    
    getById: (id: string) =>
      apiRequest(`/bookings/${id}`),
    
    updateStatus: (id: string, status: string) =>
      apiRequest(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    cancel: (id: string, reason?: string) =>
      apiRequest(`/bookings/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ reason }),
      }),
  },

  // Messages
  messages: {
    getConversations: () =>
      apiRequest('/messages/conversations'),
    
    getMessages: (conversationId: string) =>
      apiRequest(`/messages/${conversationId}`),
    
    sendMessage: (conversationId: string, text: string) =>
      apiRequest(`/messages/${conversationId}`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },

  // Notifications
  notifications: {
    getAll: () =>
      apiRequest('/notifications/general'),

    markAsRead: (id: string) =>
      apiRequest(`/notifications/general/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_read: true }),
      }),

    markAllAsRead: () =>
      apiRequest('/notifications/general/mark-all-read', {
        method: 'PUT',
      }),
  },

  // Payments
  payments: {
    addMethod: (paymentData: any) =>
      apiRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }),
  },

  // User Profile
  user: {
    getProfile: () =>
      apiRequest('/users/profile'),

    updateProfile: (profileData: any) =>
      apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    
    uploadAvatar: (imageUri: string) =>
      apiRequest('/users/avatar', {
        method: 'POST',
        body: JSON.stringify({ imageUri }),
      }),
  },
};