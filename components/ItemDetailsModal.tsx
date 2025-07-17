import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { X, Star, MapPin, Calendar, Shield, MessageCircle, Heart, Share2, Camera, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { api } from '../services/api';
import BookingFlow from './BookingFlow';

const { width } = Dimensions.get('window');

interface ItemDetailsModalProps {
  itemId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function ItemDetailsModal({ itemId, isVisible, onClose }: ItemDetailsModalProps) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (itemId && isVisible) {
      loadItemDetails();
    }
  }, [itemId, isVisible]);

  const loadItemDetails = async () => {
    if (!itemId) return;
    
    setLoading(true);
    try {
      const response = await api.listings.getById(itemId);
      setItem(response);
    } catch (error) {
      console.error('Failed to load item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = (booking: any) => {
    setShowBookingFlow(false);
    onClose();
    // Here you could navigate to a booking confirmation screen
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Call API to update favorites
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Share item:', item?.title);
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <Modal isVisible={isVisible} style={styles.modal}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F3A93" />
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </Modal>
    );
  }

  if (!item) return null;

  return (
    <>
      <Modal
        isVisible={isVisible && !showBookingFlow}
        style={styles.modal}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        swipeDirection="down"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={24} color="#1E1E1E" strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Share2 size={24} color="#1E1E1E" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFavorite} style={styles.headerButton}>
                <Heart 
                  size={24} 
                  color={isFavorited ? "#FF3B30" : "#1E1E1E"} 
                  fill={isFavorited ? "#FF3B30" : "none"}
                  strokeWidth={2} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setCurrentImageIndex(index);
                }}
              >
                {item.images.map((image: string, index: number) => (
                  <Image key={index} source={{ uri: image }} style={styles.itemImage} />
                ))}
              </ScrollView>
              
              {item.images.length > 1 && (
                <View style={styles.imageIndicator}>
                  {item.images.map((_: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === currentImageIndex && styles.activeIndicator
                      ]}
                    />
                  ))}
                </View>
              )}

              <View style={styles.imageOverlay}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <TouchableOpacity style={styles.galleryButton}>
                  <Camera size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.galleryText}>{item.images.length}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Item Info */}
            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FECA57" fill="#FECA57" strokeWidth={0} />
                  <Text style={styles.rating}>{item.rating}</Text>
                  <Text style={styles.reviewCount}>({item.reviews?.length || 0})</Text>
                </View>
              </View>

              <Text style={styles.description}>{item.description}</Text>

              {/* Price */}
              <View style={styles.priceSection}>
                <View style={styles.priceInfo}>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.priceUnit}>/day</Text>
                </View>
                <View style={styles.availabilityBadge}>
                  <CheckCircle size={16} color="#4CD7D0" strokeWidth={2} />
                  <Text style={styles.availabilityText}>Available</Text>
                </View>
              </View>

              {/* Owner Info */}
              <View style={styles.ownerSection}>
                <View style={styles.ownerInfo}>
                  <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
                  <View style={styles.ownerDetails}>
                    <Text style={styles.ownerName}>{item.owner.name}</Text>
                    <View style={styles.ownerMeta}>
                      <Star size={12} color="#FECA57" fill="#FECA57" strokeWidth={0} />
                      <Text style={styles.ownerRating}>{item.owner.rating}</Text>
                      <Text style={styles.ownerReviews}>• {item.owner.reviewsCount} reviews</Text>
                    </View>
                    <Text style={styles.responseTime}>Responds in {item.owner.responseTime}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.messageOwnerButton}>
                  <MessageCircle size={20} color="#1F3A93" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Location */}
              <View style={styles.locationSection}>
                <View style={styles.sectionHeader}>
                  <MapPin size={20} color="#1F3A93" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Location</Text>
                </View>
                <Text style={styles.address}>{item.location.address}</Text>
                <Text style={styles.distance}>{item.location.distance} km away</Text>
              </View>

              {/* Availability */}
              <View style={styles.availabilitySection}>
                <View style={styles.sectionHeader}>
                  <Calendar size={20} color="#1F3A93" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Availability</Text>
                </View>
                <Text style={styles.availabilityDesc}>
                  Available for the next {item.availability?.length || 0} days
                </Text>
                <TouchableOpacity style={styles.viewCalendarButton}>
                  <Text style={styles.viewCalendarText}>View Calendar</Text>
                </TouchableOpacity>
              </View>

              {/* Policies */}
              <View style={styles.policiesSection}>
                <View style={styles.sectionHeader}>
                  <Shield size={20} color="#1F3A93" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Rental Policies</Text>
                </View>
                <View style={styles.policyItem}>
                  <Text style={styles.policyLabel}>Cancellation:</Text>
                  <Text style={styles.policyValue}>{item.policies?.cancellation}</Text>
                </View>
                <View style={styles.policyItem}>
                  <Text style={styles.policyLabel}>Security Deposit:</Text>
                  <Text style={styles.policyValue}>${item.policies?.deposit}</Text>
                </View>
                <View style={styles.policyItem}>
                  <Text style={styles.policyLabel}>Delivery Available:</Text>
                  <Text style={styles.policyValue}>
                    {item.policies?.delivery ? 'Yes' : 'Pickup only'}
                  </Text>
                </View>
              </View>

              {/* Reviews */}
              {item.reviews && item.reviews.length > 0 && (
                <View style={styles.reviewsSection}>
                  <View style={styles.sectionHeader}>
                    <Star size={20} color="#FECA57" fill="#FECA57" strokeWidth={0} />
                    <Text style={styles.sectionTitle}>
                      Reviews ({item.reviews.length})
                    </Text>
                  </View>
                  {item.reviews.slice(0, 2).map((review: any) => (
                    <View key={review.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>{review.user}</Text>
                        <View style={styles.reviewRating}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              color={i < review.rating ? "#FECA57" : "#E5E5EA"}
                              fill={i < review.rating ? "#FECA57" : "none"}
                              strokeWidth={1}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  ))}
                  {item.reviews.length > 2 && (
                    <TouchableOpacity style={styles.viewAllReviewsButton}>
                      <Text style={styles.viewAllReviewsText}>
                        View all {item.reviews.length} reviews
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.bottomAction}>
            <View style={styles.priceDisplay}>
              <Text style={styles.bottomPrice}>${item.price}</Text>
              <Text style={styles.bottomPriceUnit}>/day</Text>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => setShowBookingFlow(true)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BookingFlow
        item={item}
        isVisible={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    minHeight: '80%',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: width,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  imageOverlay: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  categoryBadge: {
    backgroundColor: 'rgba(31, 58, 147, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  galleryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  content: {
    padding: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 2,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    lineHeight: 24,
    marginBottom: 24,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F3A93',
  },
  priceUnit: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4CD7D0',
    marginLeft: 4,
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  ownerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownerRating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginLeft: 4,
  },
  ownerReviews: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  responseTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  messageOwnerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  locationSection: {
    marginBottom: 32,
  },
  address: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  availabilitySection: {
    marginBottom: 32,
  },
  availabilityDesc: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  viewCalendarButton: {
    alignSelf: 'flex-start',
  },
  viewCalendarText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
  },
  policiesSection: {
    marginBottom: 32,
  },
  policyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  policyValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  reviewsSection: {
    marginBottom: 100,
  },
  reviewItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  viewAllReviewsButton: {
    alignSelf: 'flex-start',
  },
  viewAllReviewsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  bottomPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F3A93',
  },
  bottomPriceUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#1F3A93',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#1F3A93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});