import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Filter, Star, Heart, Zap, TrendingUp, Clock, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const router = useRouter();

const { width } = Dimensions.get('window');

const categories = [

  { id: 1, name: 'Tools', icon: '🔧', color: '#4ECDC4', gradient: ['#4ECDC4', '#6EE7E0'] as const },
  { id: 2, name: 'Venues', icon: '🎉', color: '#FECA57', gradient: ['#FECA57', '#FFD76F'] as const },
  { id: 3, name: 'Vehicles', icon: '🚗', color: '#FF9FF3', gradient: ['#FF9FF3', '#FFB3F6'] as const },
];

const featuredItems = [
  {
    id: '1',
    title: 'Professional DSLR Camera Kit',
    price: 45,
    rating: 4.9,
    reviews: 127,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    owner: {
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
    },
    distance: '0.8 km',
    instantBook: true,
    category: 'Equipment',
  },
  {
    id: '2',
    title: 'MacBook Pro 16" M3 Max',
    price: 85,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    owner: {
      name: 'Sarah Kim',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
    },
    distance: '1.2 km',
    instantBook: true,
    category: 'Equipment',
  },
  {
    id: '3',
    title: 'Modern Loft Event Space',
    price: 120,
    rating: 4.9,
    reviews: 202,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    owner: {
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true,
    },
    distance: '3.4 km',
    instantBook: true,
    category: 'Venues',
  },
  {
    id: '4',
    title: 'Tesla Model 3 - Long Range',
    price: 95,
    rating: 4.8,
    reviews: 143,
    image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=800',
    owner: {
      name: 'Daniel Wu',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: false,
    },
    distance: '2.7 km',
    instantBook: false,
    category: 'Vehicles',
  },
];


const trendingItems = [
  {
    id: '4',
    title: 'Tesla Model 3',
    price: 120,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Vehicles',
  },
  {
    id: '5',
    title: 'DJ Controller Set',
    price: 55,
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Equipment',
  },
  {
    id: '6',
    title: 'Modern Studio Space',
    price: 140,
    image: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'Venues',
  },
];


export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={18} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>
          <Text style={styles.greeting}>Discover amazing rentals</Text>
          <Text style={styles.subGreeting}>Find anything you need, anywhere you are</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748B" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for items, tools, gear..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <TrendingUp size={16} color="#10B981" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>2.5K+</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={16} color="#F59E0B" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Shield size={16} color="#3B82F6" strokeWidth={2} />
            </View>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Secure</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
  <TouchableOpacity
    key={category.id}
    style={styles.categoryCard}
    onPress={() => {
      if (category.name === 'Tools') {
        router.push('/features/tools/Tools');
      } else if (category.name === 'Venues') {
        router.push('/features/venues/Venues');
      } else if (category.name === 'Vehicles') {
        router.push('/features/vehicles/Vehicles');
      }
    }} // Navigate to the matching route
  >
    <LinearGradient
      colors={[...category.gradient]}
      style={styles.categoryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
    </LinearGradient>
    <Text style={styles.categoryName}>{category.name}</Text>
  </TouchableOpacity>
))}
          </ScrollView>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Near You</Text>
            <TouchableOpacity style={styles.instantBookBadge}>
              <Zap size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={styles.instantBookText}>Instant Book</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
            {featuredItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.featuredCard}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image }} style={styles.featuredImage} />
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Heart size={14} color="#64748B" strokeWidth={2} />
                  </TouchableOpacity>
                  {item.instantBook && (
                    <View style={styles.instantBookBadgeSmall}>
                      <Zap size={8} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                    </View>
                  )}
                </View>
                
                <View style={styles.cardContent}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.reviewCount}>({item.reviews})</Text>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.priceUnit}>/day</Text>
                  </View>
                  
                  <View style={styles.ownerContainer}>
                    <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
                    <Text style={styles.ownerName}>{item.owner.name}</Text>
                    {item.owner.verified && (
                      <View style={styles.verifiedBadge}>
                        <Shield size={8} color="#10B981" strokeWidth={2} />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending This Week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending This Week</Text>
          <View style={styles.trendingGrid}>
            {trendingItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.trendingCard}>
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.trendingOverlay}
                >
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  <Text style={styles.trendingPrice}>${item.price}/day</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaTitle}>Start Earning Today</Text>
            <Text style={styles.ctaSubtitle}>List your items and earn money when you're not using them</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>List Your First Item</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginLeft: 6,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  instantBookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  instantBookText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
    marginLeft: 4,
  },
  categoriesScroll: {
    paddingLeft: 24,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    textAlign: 'center',
  },
  itemsScroll: {
    paddingLeft: 24,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instantBookBadgeSmall: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(254, 243, 199, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 22,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  ownerName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    flex: 1,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  trendingCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    justifyContent: 'flex-end',
  },
  trendingTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  trendingPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 100,
  },
  ctaGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});