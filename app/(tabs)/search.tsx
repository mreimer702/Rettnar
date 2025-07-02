import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, MapPin, SlidersHorizontal, Grid3x3 as Grid3X3, List } from 'lucide-react-native';


// Backend Integration Note:
// This page (SearchResultPage) receives search parameters from the Homepage via route.params.
// The backend should implement a search API that accepts these parameters for data filtering.
// Expected parameters:
// - searchQuery: User's search keyword (e.g., product name or category)
// - selectedCategory: Selected category for filtering
//
// API Endpoint Example: GET /api/search?query={searchQuery}&category={selectedCategory}&minPrice={minPrice}&maxPrice={maxPrice}
// Backend should return data in the following format:
// [
//   {
//     id: number,
//     title: string,
//     location: string,
//     responseTime: string,
//     imageUrl: string,
//     rating: number,
//     reviews: number,
//     price: number,
//     powerHost: boolean
//   }
// ]
// TODO: Replace mockSearchResults with actual API data from backend
const searchResults = [
  {
    id: '1',
    title: 'Professional DSLR Camera Kit',
    price: 45,
    rating: 4.8,
    reviews: 24,
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
    distance: '0.5 km',
    category: 'Equipment',
    owner: 'Mike Chen',
    verified: true,
  },
  {
    id: '2',
    title: 'Downtown Loft Studio',
    price: 130,
    rating: 4.9,
    reviews: 29,
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=600',
    distance: '1.2 km',
    category: 'Venues',
    owner: 'Sarah Johnson',
    verified: false,
  },
  {
    id: '3',
    title: 'MacBook Pro 16-inch',
    price: 65,
    rating: 4.7,
    reviews: 31,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=600',
    distance: '0.8 km',
    category: 'Equipment',
    owner: 'David Park',
    verified: true,
  },
  {
    id: '4',
    title: '2022 Jeep Wrangler',
    price: 95,
    rating: 4.8,
    reviews: 37,
    image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=600',
    distance: '2.1 km',
    category: 'Vehicles',
    owner: 'Emma Wilson',
    verified: true,
  },
];


const filters = [
  { id: 1, name: 'Price', icon: '💰', active: false },
  { id: 2, name: 'Distance', icon: '📍', active: true },
  { id: 3, name: 'Rating', icon: '⭐', active: false },
  { id: 4, name: 'Category', icon: '📂', active: false },
  { id: 5, name: 'Instant Book', icon: '⚡', active: false },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Distance']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleFilterToggle = (filterName: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search & Discover</Text>
        <Text style={styles.subtitle}>Find exactly what you need</Text>
      </View>

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
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color={showFilters ? '#FFFFFF' : '#3B82F6'} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilters.includes(filter.name) && styles.filterChipActive
                ]}
                onPress={() => handleFilterToggle(filter.name)}
              >
                <Text style={styles.filterEmoji}>{filter.icon}</Text>
                <Text style={[
                  styles.filterText,
                  selectedFilters.includes(filter.name) && styles.filterTextActive
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{searchResults.length} items found</Text>
        <View style={styles.viewControls}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={16} color={viewMode === 'list' ? '#FFFFFF' : '#64748B'} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={16} color={viewMode === 'grid' ? '#FFFFFF' : '#64748B'} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.resultsContainer}>
        <View style={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
          {searchResults.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
            >
              <Image 
                source={{ uri: item.image }} 
                style={viewMode === 'grid' ? styles.gridImage : styles.listImage} 
              />
              
              <View style={viewMode === 'grid' ? styles.gridInfo : styles.listInfo}>
                <View style={styles.itemHeader}>
                  <Text 
                    style={[styles.itemTitle, viewMode === 'grid' && styles.gridTitle]} 
                    numberOfLines={viewMode === 'grid' ? 2 : 1}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.category}>{item.category}</Text>
                
                <View style={styles.itemMeta}>
                  <View style={styles.ownerInfo}>
                    <Text style={styles.ownerText}>by {item.owner}</Text>
                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.locationInfo}>
                    <MapPin size={12} color="#64748B" strokeWidth={2} />
                    <Text style={styles.distance}>{item.distance}</Text>
                  </View>
                </View>
                
                <View style={styles.priceContainer}>
                  <View style={styles.priceInfo}>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.priceUnit}>/day</Text>
                  </View>
                  {viewMode === 'list' && (
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
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
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  viewControls: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: '#3B82F6',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  gridImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listInfo: {
    flex: 1,
  },
  gridInfo: {
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginRight: 8,
  },
  gridTitle: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginLeft: 4,
  },
  category: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  priceUnit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});