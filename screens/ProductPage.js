import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles/ProductStyle';

export default function ProductPage() {
  const navigation = useNavigation();

  // Temporary rental date states; should be replaced with backend date selection
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock product data; should be replaced with data passed via route params or fetched from API
  const product = {
    title: 'Professional Camera Kit',
    price: '$40/day',
    thumbnail: 'https://via.placeholder.com/300x200', // Replace with actual image URL
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button and product title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{product.title}</Text>
      </View>

      {/* Product image area; can be turned into a carousel */}
      <View style={styles.imagePlaceholder}>
        {/* Replace with image carousel using product.images */}
        <Text>Product Images</Text>
      </View>

      {/* Owner info section with avatar and response time */}
      <View style={styles.ownerContainer}>
        {/* Replace with actual owner avatar */}
        <View style={styles.avatarPlaceholder}></View>
        <View>
          {/* Replace with owner name and response time from backend */}
          <Text style={styles.ownerName}>Owner's Name</Text>
          <Text style={styles.ownerResponse}>Responds within 1 hour</Text>
        </View>
      </View>

      {/* Ratings section */}
      <Text style={styles.sectionHeading}>Product Information</Text>
      <View style={styles.ratingRow}>
        {/* Replace with real rating */}
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.ratingText}>4.9 (371)</Text>
      </View>

      {/* Description blocks for feature highlights */}
      <Text style={styles.sectionHeading}>Product Description</Text>
      {/* Replace the static list with dynamic product.description array */}
      {[
        {
          title: 'Key Features',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
          title: 'Included Accessories',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
          title: 'Recommended Usage',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      ].map((section, index) => (
        <View key={index} style={styles.descCard}>
          <View style={styles.descIcon}></View>
          <View style={styles.descContent}>
            <Text style={styles.descTitle}>{section.title}</Text>
            <Text>{section.content}</Text>
          </View>
        </View>
      ))}

      {/* Map section for product location or delivery info */}
      {/* Replace with real map view or delivery data */}
      <View style={styles.mapPlaceholder}>
        <Text>Location & Delivery</Text>
      </View>

      {/* Rental date selection input fields */}
      {/* These dates should be sent to backend upon order confirmation */}
      <Text style={styles.sectionHeading}>Choose Rental Dates</Text>
      <View style={styles.dateRow}>
        <TextInput
          placeholder="Start Date"
          style={styles.dateInput}
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          placeholder="End Date"
          style={styles.dateInput}
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      {/* Price section - static for now */}
      {/* Should be calculated from backend per product and dates */}
      <Text style={styles.sectionHeading}>Pricing & Availability</Text>
      <TextInput
        value={product.price}
        editable={false}
        style={styles.priceBox}
      />

      {/* Action buttons - messaging and rental */}
      <View style={styles.buttonRow}>
        {/* TODO: Integrate with chat or messaging feature */}
        <TouchableOpacity style={styles.messageButton}>
          <Text>Message Owner</Text>
        </TouchableOpacity>

        {/* Rent now navigates to PaymentPage with necessary data */}
        <TouchableOpacity
          style={styles.rentButton}
          onPress={() =>
            navigation.navigate('PaymentPage', {
              productTitle: product.title,
              thumbnail: product.thumbnail,
              price: product.price,
              startDate,
              endDate,
            })
          }>
          <Text style={styles.rentButtonText}>Rent Now</Text>
        </TouchableOpacity>
      </View>

      {/* Related product suggestions; replace with actual related data */}
      <Text style={styles.sectionHeading}>Related Listings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          {name: 'Related Product Name', price: '$50/day'},
          {name: 'Another Related Product', price: '$60/day'},
        ].map((item, index) => (
          <View key={index} style={styles.relatedCard}>
            <View style={styles.relatedImage}></View>
            <Text style={styles.relatedTitle}>{item.name}</Text>
            <Text style={styles.relatedPrice}>{item.price}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
