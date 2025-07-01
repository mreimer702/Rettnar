import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, MapPin, Calendar, DollarSign, Tag } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const categories = [
  'Camera & Gear', 'Tools', 'Sports Equipment', 'Tech & Electronics', 
  'Events & Furniture', 'Vehicles', 'Musical Instruments', 'Home & Garden'
];

export default function AddItemScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [itemData, setItemData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    images: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setItemData(prev => ({ ...prev, [field]: value }));
  };

  const handleTakePhoto = async () => {
    if (!permission) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }
    }

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos');
      return;
    }

    setShowCamera(true);
  };

  const handlePhotoTaken = () => {
    // Simulate photo being taken
    const newPhoto = `https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400`;
    setItemData(prev => ({
      ...prev,
      images: [...prev.images, newPhoto]
    }));
    setShowCamera(false);
  };

  const handlePublishItem = () => {
    if (!itemData.title || !itemData.description || !itemData.category || !itemData.price) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Item Published!',
      'Your item has been successfully listed on Renttar',
      [{ text: 'OK', onPress: () => {
        // Reset form
        setItemData({
          title: '',
          description: '',
          category: '',
          price: '',
          location: '',
          images: [],
        });
      }}]
    );
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handlePhotoTaken}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>List Your Item</Text>
          <Text style={styles.subtitle}>Share what you have and start earning</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photosContainer}>
              {itemData.images.map((image, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: image }} style={styles.photoImage} />
                </View>
              ))}
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleTakePhoto}>
                <Camera size={24} color="#1F3A93" strokeWidth={2} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={itemData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="What are you renting out?"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={itemData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Describe your item, its condition, and any special features..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesRow}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        itemData.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => handleInputChange('category', category)}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        itemData.category === category && styles.categoryChipTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Daily Rate *</Text>
              <View style={styles.priceContainer}>
                <DollarSign size={20} color="#8E8E93" strokeWidth={2} />
                <TextInput
                  style={styles.priceInput}
                  value={itemData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                />
                <Text style={styles.priceUnit}>per day</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.locationContainer}>
                <MapPin size={20} color="#8E8E93" strokeWidth={2} />
                <TextInput
                  style={styles.locationInput}
                  value={itemData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  placeholder="Address or area (optional)"
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </View>
          </View>

          <View style={styles.availabilitySection}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={20} color="#1F3A93" strokeWidth={2} />
              <Text style={styles.calendarText}>Set Available Dates</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.publishButton} onPress={handlePublishItem}>
            <Text style={styles.publishButtonText}>Publish Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
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
  form: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  photosSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  addPhotoText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryChipSelected: {
    backgroundColor: '#1F3A93',
    borderColor: '#1F3A93',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  availabilitySection: {
    marginBottom: 32,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  calendarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
    marginLeft: 8,
  },
  publishButton: {
    backgroundColor: '#1F3A93',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1F3A93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});