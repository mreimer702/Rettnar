import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';

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

// Generic API Request Function
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

  // For development, simulate API responses
  if (__DEV__) {
    return simulateApiResponse<T>(endpoint, config);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Simulated API Responses for Development
function simulateApiResponse<T>(endpoint: string, config: RequestInit): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, any> = {
        // Auth Endpoints
        'POST:/api/users/login': {
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
        'POST:/api/auth/register': {
          token: 'mock_jwt_token_12345',
          user: {
            id: '1',
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        'POST:/api/auth/logout': { success: true },

        // Items Endpoints
        'GET:/items/nearby': {
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
        'GET:/items/1': {
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
        'POST:/items': {
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
        'PUT:/bookings/booking_123/status': {
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
        'GET:/notifications': {
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
        'PUT:/notifications/notif_1/read': { success: true }
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
      apiRequest('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData: any) =>
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    logout: () =>
      apiRequest('/api/auth/logout', { method: 'POST' }),
  },

  // Items
  items: {
    getNearby: (lat: number, lng: number, radius: number = 10) =>
      apiRequest(`/items/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    
    getById: (id: string) =>
      apiRequest(`/items/${id}`),
    
    create: (itemData: any) =>
      apiRequest('/items', {
        method: 'POST',
        body: JSON.stringify(itemData),
      }),
    
    update: (id: string, itemData: any) =>
      apiRequest(`/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      }),
    
    search: (query: string, filters: any = {}) =>
      apiRequest(`/items/search?q=${query}&${new URLSearchParams(filters)}`),
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
      apiRequest(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    
    cancel: (id: string, reason?: string) =>
      apiRequest(`/bookings/${id}/cancel`, {
        method: 'PUT',
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
      apiRequest('/notifications'),
    
    markAsRead: (id: string) =>
      apiRequest(`/notifications/${id}/read`, {
        method: 'PUT',
      }),
    
    markAllAsRead: () =>
      apiRequest('/notifications/read-all', {
        method: 'PUT',
      }),
  },

  // User Profile
  user: {
    getProfile: () =>
      apiRequest('/user/profile'),
    
    updateProfile: (profileData: any) =>
      apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
    
    uploadAvatar: (imageUri: string) =>
      apiRequest('/user/avatar', {
        method: 'POST',
        body: JSON.stringify({ imageUri }),
      }),
  },
};