// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  reviewsCount?: number;
  joinedDate?: string;
  responseTime?: string;
  verified?: boolean;
}

// Item Types
export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  owner: User;
  location: {
    lat: number;
    lng: number;
    address: string;
    distance?: number;
  };
  availability: string[];
  rating: number;
  reviews: Review[];
  policies: {
    cancellation: string;
    deposit: number;
    delivery: boolean;
    pickup: boolean;
  };
  featured?: boolean;
  instantBook?: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  itemId: string;
  item: {
    id: string;
    title: string;
    image: string;
    owner: string;
  };
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  message?: string;
  deliveryOption: 'pickup' | 'delivery';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Conversation {
  id: string;
  participant: User;
  lastMessage: {
    text: string;
    timestamp: number;
    unread: boolean;
  };
  item?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: number;
  read?: boolean;
}

// Review Types
export interface Review {
  id: string;
  itemId: string;
  userId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

// Notification Types
export interface NotificationData {
  id: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'message' | 'review';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  distance?: number;
  rating?: number;
  available?: boolean;
  instantBook?: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}