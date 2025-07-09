import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Alert, GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, MapPin, Calendar, DollarSign, Tag, Plus, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  'Photography', 'Tools', 'Electronics', 'Sports Equipment', 
  'Events & Furniture', 'Vehicles', 'Musical Instruments', 'Home & Garden'
];

export default function ListItemScreen() {
  const [itemData, setItemData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    images: [] as string[],
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    rateType: 'daily', // Added rateType property with default value
  });

  const handleInputChange = (field: string, value: string) => {
    setItemData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = () => {
    // Simulate adding a photo
    const newPhoto = `https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400`;
    setItemData(prev => ({
      ...prev,
      images: [...prev.images, newPhoto]
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setItemData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handlePublishItem = () => {
    if (!itemData.images || !itemData.title || !itemData.description || !itemData.category || !itemData.price || !itemData.city || !itemData.country) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Item Published!',
      'Your item has been successfully listed on Renttar',
      [{ text: 'OK', onPress: () => {
        setItemData({
          title: '',
          description: '',
          category: '',
          price: '',
          location: '',
          images: [],
          address: '',
          city: '',
          state: '',
          country: '',
          zip: '',
          rateType: 'daily', // Reset rateType as well
        });
      }}]
    );
  };

  function handleSaveDraft(event: GestureResponderEvent): void {
    // Save the current form data as a draft (could be local storage, async storage, etc.)
    // For now, just show an alert to simulate saving
    Alert.alert(
      'Draft Saved',
      'Your item draft has been saved. You can continue editing later.',
      [{ text: 'OK' }]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>List Your Item</Text>
          <Text style={styles.subtitle}>Share what you have and start earning</Text>
        </LinearGradient>

        <View style={styles.form}>
          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos *</Text>
            
            <Text style={styles.sectionSubtitle}>Add up to 8 photos to showcase your item</Text>
            
            <View style={styles.photosContainer}>
              {itemData.images.map((image, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: image }} style={styles.photoImage} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <X size={16} color="#FFFFFF" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {itemData.images.length < 8 && (
                <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                  <Camera size={24} color="#3B82F6" strokeWidth={2} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Item Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={itemData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="What are you renting out?"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={itemData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Describe your item, its condition, and any special features..."
                placeholderTextColor="#94A3B8"
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
              <Text style={styles.label}>Rate *</Text>
              <View style={styles.priceContainer}>
                <DollarSign size={20} color="#64748B" strokeWidth={2} />
                <TextInput
                  style={styles.priceInput}
                  value={itemData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              {/* Radio Buttons for Rate Type */}
  <View style={styles.rateTypeContainer}>
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => handleInputChange('rateType', 'daily')}
    >
      <View style={styles.radioCircle}>
        {itemData.rateType === 'daily' && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>Daily</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => handleInputChange('rateType', 'hourly')}
    >
      <View style={styles.radioCircle}>
        {itemData.rateType === 'hourly' && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.radioLabel}>Hourly</Text>
    </TouchableOpacity>
  </View>
            </View>

{/* Location */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Location *</Text>

  {/* Address */}
  <View style={styles.locationContainer}>
    <MapPin size={20} color="#64748B" strokeWidth={2} />
    <TextInput
      style={styles.locationInput}
      value={itemData.address}
      onChangeText={(value) => handleInputChange('address', value)}
      placeholder="Street address (optional)"
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* City */}
  <View style={styles.locationContainer}>
    <MapPin size={20} color="#64748B" strokeWidth={2} />
    <TextInput
      style={styles.locationInput}
      value={itemData.city}
      onChangeText={(value) => handleInputChange('city', value)}
      placeholder="City"
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* State / Province */}
  <View style={styles.locationContainer}>
    <MapPin size={20} color="#64748B" strokeWidth={2} />
    <TextInput
      style={styles.locationInput}
      value={itemData.state}
      onChangeText={(value) => handleInputChange('state', value)}
      placeholder="State/Province (optional)"
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* Country */}
  <View style={styles.locationContainer}>
    <MapPin size={20} color="#64748B" strokeWidth={2} />
    <TextInput
      style={styles.locationInput}
      value={itemData.country}
      onChangeText={(value) => handleInputChange('country', value)}
      placeholder="Country"
      placeholderTextColor="#94A3B8"
    />
  </View>

  {/* Zip Code */}
  <View style={styles.locationContainer}>
    <MapPin size={20} color="#64748B" strokeWidth={2} />
    <TextInput
      style={styles.locationInput}
      value={itemData.zip}
      onChangeText={(value) => handleInputChange('zip', value)}
      placeholder="ZIP/Postal Code (optional)"
      placeholderTextColor="#94A3B8"
      keyboardType="numeric"
    />
  </View>
</View>

          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <Text style={styles.sectionSubtitle}>Set when your item is available for rent</Text>
            
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.calendarText}>Set Available Dates</Text>
            </TouchableOpacity>
          </View>

          {/* Pricing Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Pricing Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Research similar items in your area</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Consider the item's condition and age</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Factor in cleaning and maintenance costs</Text>
            </View>
          </View>

          <TouchableOpacity
          style={styles.saveDraftButton}
          onPress={handleSaveDraft}>
          <Text style={styles.buttonText}>Save Draft</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.publishButton} onPress={handlePublishItem}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.publishGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.publishButtonText}>Publish Item</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  rateTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    gap: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE',
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  addPhotoText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginTop: 4,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
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
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 8,
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
     marginBottom: 12, 
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 8,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginLeft: 8,
  },
  tipsSection: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
  },
  publishButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: 'center',
  },
  saveDraftButton: {
    borderRadius: 16,
    backgroundColor: '#E0E7EF',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  publishButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  publishGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});