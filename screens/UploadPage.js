import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/UploadStyle';
import BottomNavBar from '../components/BottomNavBar';

// UploadPage Component - Allows users to upload new rental listings
// Provides options to publish directly or save as a draft
export default function UploadPage({navigation}) {
  // State for storing form input data
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Predefined categories for listings
  const categories = ['Equipment', 'Venue'];

  /**
   * Handle publishing the listing.
   * TODO: Backend - Implement API call to submit the listing data to the backend.
   */
  const handlePublish = async () => {
    // Validate input fields to ensure all data is filled
    if (!title || !selectedCategory || !price || !description) {
      Alert.alert('Error', 'Please fill in all fields before publishing.');
      return;
    }

    // Prepare data payload for API submission
    const payload = {
      title,
      category: selectedCategory,
      price,
      description,
      status: 'published',
    };

    try {
      // API call to publish the listing
      const response = await fetch('https://your-api.com/upload', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Handle API response
      if (response.ok) {
        Alert.alert('Success', 'Your listing has been published.');
        navigation.navigate('HomePage'); // Navigate to homepage on success
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to publish. Please try again.');
    }
  };

  /**
   * Handle saving the listing as a draft.
   * TODO: Backend - Implement API call to save the draft data to the backend.
   */
  const handleSaveDraft = async () => {
    // Validate that a title exists for the draft
    if (!title) {
      Alert.alert('Error', 'Please enter a title before saving as draft.');
      return;
    }

    // Prepare data payload for saving the draft
    const payload = {
      title,
      category: selectedCategory || '',
      price: price || '',
      description: description || '',
      status: 'draft',
    };

    try {
      // API call to save the draft
      const response = await fetch('https://your-api.com/save-draft', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Handle API response
      if (response.ok) {
        Alert.alert('Success', 'Your draft has been saved.');
        navigation.navigate('DraftsPage'); // Navigate to Drafts Page on success
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save draft. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {/* Displays a back button and screen title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload</Text>
      </View>

      {/* Form Section */}
      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.scrollContainer}>
        {/* Title Input */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a descriptive name"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.subText}>
          Choose a clear title that describes your item
        </Text>

        {/* Category Selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={
                  selectedCategory === category
                    ? styles.activeCategoryText
                    : styles.categoryText
                }>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subText}>
          Select a category for your rental item
        </Text>

        {/* Price Input */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={styles.subText}>Enter a price or toggle 'Negotiable'</Text>

        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide details about your item"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.subText}>
          Provide specifications, availability, and conditions
        </Text>

        {/* Media Upload Section */}
        {/* TODO: Backend - Implement image and video upload */}
        <Text style={styles.label}>Media Upload</Text>
        <TouchableOpacity
          style={styles.mediaUpload}
          onPress={() => alert('Upload Photos')}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={styles.mediaThumbnail}
          />
          <View style={styles.mediaTextContainer}>
            <Text style={styles.mediaTitle}>Photos 📸</Text>
            <Text style={styles.mediaSubText}>
              Click to upload or open camera
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaUpload}
          onPress={() => alert('Upload Videos')}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={styles.mediaThumbnail}
          />
          <View style={styles.mediaTextContainer}>
            <Text style={styles.mediaTitle}>Videos 🎥</Text>
            <Text style={styles.mediaSubText}>Click to upload or record</Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons Section */}
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.buttonText}>Publish</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => alert('Preview Listing')}>
          <Text style={styles.button2Text}>Preview Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveDraftButton}
          onPress={handleSaveDraft}>
          <Text style={styles.buttonText}>Save Draft</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="List" />
    </View>
  );
}
