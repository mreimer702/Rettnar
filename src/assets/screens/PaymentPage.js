import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';

export default function PaymentPage() {
  const navigation = useNavigation();
  const [billingAddress, setBillingAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreed, setAgreed] = useState(false);

  // 🛠️ TODO: Replace with real backend data from ProductPage navigation params or fetch
  const product = {
    id: '123', // 🛠️ backend needs this
    title: 'Professional Camera Kit',
    image: 'https://via.placeholder.com/300x200',
    totalPrice: '$XXX', // 🛠️ Calculate final price server-side
    startDate: 'March 15, 2025',
    endDate: 'March 20, 2025',
  };

  const handlePayment = () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    // 🛠️ BACKEND INTEGRATION GOES HERE
    // Replace this with actual API call to backend
    const payload = {
      productId: product.id,
      productTitle: product.title,
      startDate: product.startDate,
      endDate: product.endDate,
      billingAddress,
      promoCode,
      totalPrice: product.totalPrice,
      // userId should be injected from auth context or token in real app
    };

    // Example:
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })

    alert('Payment Submitted');
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      {/* Header */}
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 8}}>
          Payment
        </Text>
      </View>

      {/* Order Summary */}
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 12}}>
        Order Summary
      </Text>

      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#eee',
          marginBottom: 20,
          overflow: 'hidden',
        }}>
        <View
          style={{
            backgroundColor: '#f6f6f6',
            padding: 6,
          }}>
          <Text style={{fontSize: 14}}>Total Price: {product.totalPrice}</Text>
        </View>

        <Image
          source={{uri: product.image}}
          style={{height: 180, width: '100%', backgroundColor: '#ccc'}}
          resizeMode="cover"
        />

        <View style={{padding: 12}}>
          <Text style={{fontWeight: 'bold'}}>{product.title}</Text>
          <Text style={{color: 'gray'}}>
            {product.startDate} - {product.endDate}
          </Text>
        </View>
      </View>

      {/* Billing Address */}
      <Text style={{fontWeight: 'bold', marginBottom: 6}}>Billing Address</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
        placeholder="Enter your billing address"
        value={billingAddress}
        onChangeText={setBillingAddress}
      />

      {/* Promo Code */}
      <Text style={{fontWeight: 'bold', marginBottom: 6}}>
        Apply Promo Code
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
        placeholder="Enter promo code"
        value={promoCode}
        onChangeText={setPromoCode}
      />

      {/* Terms & Conditions */}
      <TouchableOpacity
        onPress={() => setAgreed(!agreed)}
        style={{
          backgroundColor: '#f0f0f0',
          padding: 14,
          borderRadius: 8,
          marginBottom: 20,
        }}>
        <Text>
          {agreed ? '✅' : '⬜'} I agree to the terms and cancellation policy
        </Text>
      </TouchableOpacity>

      {/* Pay Button */}
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handlePayment}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
