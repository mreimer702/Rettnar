import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Search, ChevronLeft} from 'react-native-feather';
import Slider from '@react-native-community/slider';
import styles from '../styles/MapStyle';

export default function MapPage() {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');
  const [radius, setRadius] = useState(500); // default 500m

  // Default mock location (Toronto downtown)
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
  });

  const handleSaveLocation = () => {
    if (!selectedLocation) {
      Alert.alert('No Location Selected', 'Please select a location.');
      return;
    }

    // 👉 TODO: Send selectedLocation and radius to backend
    console.log('Selected Location:', selectedLocation);
    console.log('Selected Radius:', radius);

    navigation.goBack(); // Mock behavior
  };

  return (
    <View style={styles.container}>
      {/* 🔼 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Map Integration</Text>
      </View>

      {/* 🔍 Search Bar */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search Location"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            // 🔧 TODO: Enable location auto-complete via backend + API integration
            Alert.alert('Search', 'Search will be enabled with backend.');
          }}>
          <Search width={20} height={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subText}>Auto-complete will be enabled later</Text>

      {/* 🗺️ Placeholder for Map */}
      <View style={styles.mapPlaceholder}>
        <Image style={styles.mapImage} />
        <Text style={styles.mapPlaceholderText}>
          Map will be shown here (API integration pending)
        </Text>
        <Text style={styles.mapRadiusText}>
          Simulated Radius: {Math.round(radius)} KiloMeters
        </Text>
      </View>

      {/* 📏 Radius Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Search Radius: {Math.round(radius)} KiloMeters
        </Text>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={100}
          maximumValue={5000}
          step={100}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="black"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* 💾 Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );
}
