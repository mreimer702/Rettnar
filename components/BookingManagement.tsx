import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar, Clock, MapPin, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, MessageCircle, Star, ArrowRight } from 'lucide-react-native';
import { api } from '../services/api';

interface BookingManagementProps {
  userId?: string;
}

export default function BookingManagement({ userId }: BookingManagementProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await api.bookings.getAll();
      const data = response as { bookings?: any[] };
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      Alert.alert('Success', `Booking ${newStatus} successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${newStatus} booking`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CD7D0';
      case 'pending': return '#FECA57';
      case 'completed': return '#96CEB4';
      case 'cancelled': return '#FF6B6B';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  const filterCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F3A93" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your rental bookings</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {Object.entries(filterCounts).map(([key, count]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterTab,
              filter === key && styles.activeFilterTab
            ]}
            onPress={() => setFilter(key as any)}
          >
            <Text style={[
              styles.filterText,
              filter === key && styles.activeFilterText
            ]}>
              {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <ScrollView style={styles.bookingsList} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#8E8E93" strokeWidth={1} />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings found`
              }
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function BookingCard({ booking, onStatusUpdate }: { booking: any; onStatusUpdate: (id: string, status: string) => void }) {
  const StatusIcon = getStatusIcon(booking.status);
  const statusColor = getStatusColor(booking.status);

  const handleAccept = () => {
    Alert.alert(
      'Confirm Booking',
      'Are you sure you want to accept this booking request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => onStatusUpdate(booking.id, 'confirmed') }
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', style: 'destructive', onPress: () => onStatusUpdate(booking.id, 'cancelled') }
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Mark as Completed',
      'Mark this booking as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => onStatusUpdate(booking.id, 'completed') }
      ]
    );
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: booking.item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>{booking.item.title}</Text>
          <Text style={styles.itemOwner}>by {booking.item.owner}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <StatusIcon size={16} color={statusColor} strokeWidth={2} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#8E8E93" strokeWidth={2} />
          <Text style={styles.detailText}>
            {new Date(booking.dates.start).toLocaleDateString()} - {new Date(booking.dates.end).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color="#8E8E93" strokeWidth={2} />
          <Text style={styles.detailText}>
            Booked on {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>${booking.total}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={16} color="#1F3A93" strokeWidth={2} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>

        {booking.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'confirmed' && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'completed' && (
          <TouchableOpacity style={styles.reviewButton}>
            <Star size={16} color="#FECA57" strokeWidth={2} />
            <Text style={styles.reviewButtonText}>Leave Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return '#4CD7D0';
    case 'pending': return '#FECA57';
    case 'completed': return '#96CEB4';
    case 'cancelled': return '#FF6B6B';
    default: return '#8E8E93';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed': return CheckCircle;
    case 'pending': return Clock;
    case 'completed': return CheckCircle;
    case 'cancelled': return XCircle;
    default: return AlertCircle;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeFilterTab: {
    backgroundColor: '#1F3A93',
    borderColor: '#1F3A93',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  bookingsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  itemOwner: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F3A93',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFE5E5',
  },
  declineButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
  },
  acceptButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1F3A93',
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4CD7D0',
  },
  completeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF3CD',
  },
  reviewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 6,
  },
});