import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/SearchResultStyle';

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
const mockSearchResults = [
  {
    id: 1,
    title: 'Professional Camera Rental',
    location: 'Toronto, ON',
    responseTime: '1 hour',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.8,
    reviews: 120,
    price: 50,
    powerHost: true,
  },
  {
    id: 2,
    title: 'Studio Space for Rent',
    location: 'Downtown Toronto',
    responseTime: '2 hours',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.5,
    reviews: 89,
    price: 100,
    powerHost: false,
  },
  {
    id: 3,
    title: 'Lighting Equipment Set',
    location: 'Toronto, ON',
    responseTime: '3 hours',
    imageUrl: 'https://via.placeholder.com/300',
    rating: 4.7,
    reviews: 150,
    price: 30,
    powerHost: true,
  },
];

export default function SearchResultPage({route, navigation}) {
  // Extract parameters from Homepage
  const {searchQuery, selectedCategory} = route.params || {};
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    time: false,
    type: false,
    price: false,
    rating: false,
    distance: false,
  });

  // State Variables for Filtering (Relevant for Backend API)
  // These states store user-selected filter criteria and will be sent to the backend for search requests.
  const [selectedDate, setSelectedDate] = useState(null);
  // Selected date for time-based filtering. Example: Events or rentals on a specific day.

  const [selectedType, setSelectedType] = useState('');
  // Selected type filter (e.g., 'Venue' or 'Equipment'). This will be used for category-based filtering.

  const [minInputPrice, setMinInputPrice] = useState('');
  const [maxInputPrice, setMaxInputPrice] = useState('');
  // User-defined price range for filtering. Both values will be passed to the backend to filter search results within this range.

  const [selectedRating, setSelectedRating] = useState(0);
  // Minimum rating selected by the user for filtering results. Backend should return results with a rating greater than or equal to this value.

  // State Variables for UI Control (Frontend Only)
  // These states are for handling the visibility of modals and frontend interactions.
  // They are not sent to the backend.
  const [modalVisible, setModalVisible] = useState('');
  // Controls which modal (time, type, price, rating, or distance) is visible.
  // Example: 'time' will show the calendar modal, 'type' will show the type filter modal.

  useEffect(() => {
    // TODO: Replace this with API call to fetch search results from backend
    // Example: fetchDataFromBackend()
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSavePrice = () => {
    setFilters({...filters, price: true});
    setModalVisible('');
  };

  const toggleTypeSelection = type => {
    if (selectedType === type) {
      setSelectedType(''); // Cancel selection if clicked again
    } else {
      setSelectedType(type);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Search Results</Text>
      </View>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}>
          <TouchableOpacity
            style={[styles.filterButton, filters.time && styles.activeFilter]}
            onPress={() => setModalVisible('time')}>
            <Text>⏳Time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filters.type && styles.activeFilter]}
            onPress={() => setModalVisible('type')}>
            <Text>🏠Type</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filters.price && styles.activeFilter]}
            onPress={() => setModalVisible('price')}>
            <Text>💲Price</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filters.rating && styles.activeFilter]}
            onPress={() => setModalVisible('rating')}>
            <Text>⭐Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.distance && styles.activeFilter,
            ]}
            onPress={() => navigation.navigate('MapPage')}>
            <Text>📍Distance</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* Modal Components */}
      {/*// The Modal component handles displaying the appropriate filter UI based
      on user selection. // It uses the `modalVisible` state to determine which
      filter is currently active. // Each filter is presented using
      TouchableOpacity, providing a clickable overlay that dismisses the modal
      when clicked outside.*/}
      <Modal
        visible={!!modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible('')}>
        {/* Time Filter Modal */}
        {/* Displays a calendar using CalendarPicker for selecting a specific date */}
        {modalVisible === 'time' && (
          <TouchableOpacity
            style={styles.calendarOverlay}
            activeOpacity={1}
            onPress={() => {
              setModalVisible('');
            }}>
            <View style={styles.calendarContainer}>
              {/* Calendar Component */}
              <CalendarPicker
                onDateChange={setSelectedDate}
                selectedStartDate={selectedDate} // Show previously selected date
              />

              {/* Save Button Inside Calendar */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (selectedDate) {
                    console.log('Selected Date:', selectedDate);
                    setFilters(prev => ({
                      ...prev,
                      time: true, // Mark time filter as active
                    }));
                  }
                  setModalVisible('');
                }}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              {/* Clear Button to Reset Selection */}
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedDate(null); // Reset date selection
                  setFilters(prev => ({
                    ...prev,
                    time: false, // Mark time filter as inactive
                  }));
                }}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Type Filter Modal */}
        {/* Allows users to select between Venue or Equipment */}
        {modalVisible === 'type' && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              // Update filters to mark type filter as applied if a type is selected
              setFilters(prev => ({
                ...prev,
                type: selectedType ? true : false,
              }));
              setModalVisible('');
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Venue Selection */}
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'Venue' && styles.activeFilter,
                  ]}
                  onPress={() => toggleTypeSelection('Venue')}>
                  <Text style={styles.typeText}>Venue</Text>
                </TouchableOpacity>

                {/* Equipment Selection */}
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'Equipment' && styles.activeFilter,
                  ]}
                  onPress={() => toggleTypeSelection('Equipment')}>
                  <Text style={styles.typeText}>Equipment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Price Filter Modal */}
        {/* Allows users to input a minimum and maximum price range */}
        {modalVisible === 'price' && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              // Update filters to mark price filter as applied if a range is set
              setFilters(prev => ({
                ...prev,
                price: minInputPrice || maxInputPrice ? true : false,
              }));
              setModalVisible('');
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Input for Minimum Price */}
                <TextInput
                  style={styles.input}
                  placeholder="Min Price"
                  keyboardType="numeric"
                  value={minInputPrice}
                  onChangeText={setMinInputPrice}
                />

                {/* Input for Maximum Price */}
                <TextInput
                  style={styles.input}
                  placeholder="Max Price"
                  keyboardType="numeric"
                  value={maxInputPrice}
                  onChangeText={setMaxInputPrice}
                />

                {/* Save Button to Apply Price Filter */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSavePrice}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Rating Filter Modal */}
        {/* Allows users to select a rating from 1 to 5 stars */}
        {modalVisible === 'rating' && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              // Update filters to mark rating filter as applied if a rating is selected
              setFilters(prev => ({
                ...prev,
                rating: selectedRating > 0 ? true : false,
              }));
              setModalVisible('');
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Star Rating Selection */}
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setSelectedRating(star)}>
                    <Text
                      style={[
                        styles.star,
                        star <= selectedRating
                          ? styles.activeStar
                          : styles.inactiveStar,
                      ]}>
                      {star} ⭐
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Clear Button to Reset Rating Filter */}
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSelectedRating(0);
                    setFilters(prev => ({...prev, rating: false}));
                  }}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </Modal>
      {/* Loading & Error Handling */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.resultCard}>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.info}>📍 {item.location}</Text>
              <Text style={styles.info}>⏳ {item.responseTime}</Text>
              <Text style={styles.info}>
                ⭐ {item.rating} ({item.reviews} Reviews)
              </Text>
              <Text style={styles.info}>💲 ${item.price} / day</Text>
              {item.powerHost && (
                <Text style={styles.powerHost}>Power Host</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
