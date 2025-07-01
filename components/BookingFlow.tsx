import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { CalendarDays, CreditCard, MapPin, Clock, User, Star, MessageCircle, X, Check, CircleAlert as AlertCircle } from 'lucide-react-native';
import { api } from '../services/api';

interface BookingFlowProps {
  item: any;
  isVisible: boolean;
  onClose: () => void;
  onBookingComplete: (booking: any) => void;
}

interface BookingStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

export default function BookingFlow({ item, isVisible, onClose, onBookingComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    message: '',
    deliveryOption: 'pickup',
    specialRequests: '',
    totalDays: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);

  const steps: BookingStep[] = [
    { id: 'dates', title: 'Select Dates', component: DateSelection },
    { id: 'details', title: 'Booking Details', component: BookingDetails },
    { id: 'payment', title: 'Payment', component: PaymentInfo },
    { id: 'confirmation', title: 'Confirmation', component: Confirmation },
  ];

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const calculateTotal = () => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const total = days * item.price;
      
      updateBookingData({
        totalDays: days,
        totalPrice: total,
      });
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [bookingData.startDate, bookingData.endDate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const booking = await api.bookings.create({
        itemId: item.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message,
        deliveryOption: bookingData.deliveryOption,
        specialRequests: bookingData.specialRequests,
        totalPrice: bookingData.totalPrice,
      });

      onBookingComplete(booking);
      Alert.alert('Success', 'Your booking request has been sent!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>
              {currentStep + 1} of {steps.length}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <CurrentStepComponent
            item={item}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleBookingSubmit}
            loading={loading}
            isLastStep={currentStep === steps.length - 1}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

// Date Selection Component
function DateSelection({ item, bookingData, updateBookingData, onNext }: any) {
  const [selectedDates, setSelectedDates] = useState<any>({});

  const handleDayPress = (day: any) => {
    if (!bookingData.startDate || (bookingData.startDate && bookingData.endDate)) {
      // Start new selection
      setSelectedDates({ [day.dateString]: { selected: true, startingDay: true } });
      updateBookingData({ startDate: day.dateString, endDate: '' });
    } else if (bookingData.startDate && !bookingData.endDate) {
      // Complete the range
      const start = new Date(bookingData.startDate);
      const end = new Date(day.dateString);
      
      if (end < start) {
        // If end date is before start date, reset
        setSelectedDates({ [day.dateString]: { selected: true, startingDay: true } });
        updateBookingData({ startDate: day.dateString, endDate: '' });
        return;
      }

      const range: any = {};
      const current = new Date(start);
      
      while (current <= end) {
        const dateString = current.toISOString().split('T')[0];
        range[dateString] = {
          selected: true,
          startingDay: current.getTime() === start.getTime(),
          endingDay: current.getTime() === end.getTime(),
        };
        current.setDate(current.getDate() + 1);
      }
      
      setSelectedDates(range);
      updateBookingData({ endDate: day.dateString });
    }
  };

  const isNextEnabled = bookingData.startDate && bookingData.endDate;

  return (
    <View style={styles.stepContainer}>
      <View style={styles.itemPreview}>
        <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>${item.price}/day</Text>
        </View>
      </View>

      <Text style={styles.stepTitle}>When do you need it?</Text>
      <Text style={styles.stepSubtitle}>Select your rental dates</Text>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        markingType="period"
        theme={{
          selectedDayBackgroundColor: '#1F3A93',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#1F3A93',
          dayTextColor: '#1E1E1E',
          textDisabledColor: '#8E8E93',
          arrowColor: '#1F3A93',
        }}
        style={styles.calendar}
      />

      {bookingData.startDate && (
        <View style={styles.selectedDates}>
          <Text style={styles.selectedDatesTitle}>Selected Dates:</Text>
          <Text style={styles.selectedDatesText}>
            {new Date(bookingData.startDate).toLocaleDateString()} 
            {bookingData.endDate && ` - ${new Date(bookingData.endDate).toLocaleDateString()}`}
          </Text>
          {bookingData.totalDays > 0 && (
            <Text style={styles.totalDays}>
              {bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''} • ${bookingData.totalPrice}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextButton, !isNextEnabled && styles.disabledButton]}
        onPress={onNext}
        disabled={!isNextEnabled}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Booking Details Component
function BookingDetails({ item, bookingData, updateBookingData, onNext, onBack }: any) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Booking Details</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Options</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              bookingData.deliveryOption === 'pickup' && styles.selectedOption
            ]}
            onPress={() => updateBookingData({ deliveryOption: 'pickup' })}
          >
            <MapPin size={20} color={bookingData.deliveryOption === 'pickup' ? '#FFFFFF' : '#1F3A93'} />
            <Text style={[
              styles.optionText,
              bookingData.deliveryOption === 'pickup' && styles.selectedOptionText
            ]}>
              Pickup
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              bookingData.deliveryOption === 'delivery' && styles.selectedOption
            ]}
            onPress={() => updateBookingData({ deliveryOption: 'delivery' })}
          >
            <Clock size={20} color={bookingData.deliveryOption === 'delivery' ? '#FFFFFF' : '#1F3A93'} />
            <Text style={[
              styles.optionText,
              bookingData.deliveryOption === 'delivery' && styles.selectedOptionText
            ]}>
              Delivery (+$10)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Message to Owner</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Tell the owner about your project or any special requirements..."
          placeholderTextColor="#8E8E93"
          value={bookingData.message}
          onChangeText={(text) => updateBookingData({ message: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Any special requests or requirements..."
          placeholderTextColor="#8E8E93"
          value={bookingData.specialRequests}
          onChangeText={(text) => updateBookingData({ specialRequests: text })}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Payment Info Component
function PaymentInfo({ item, bookingData, updateBookingData, onNext, onBack }: any) {
  const deliveryFee = bookingData.deliveryOption === 'delivery' ? 10 : 0;
  const subtotal = bookingData.totalPrice;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Payment Summary</Text>
      
      <View style={styles.ownerInfo}>
        <Image source={{ uri: item.owner.avatar }} style={styles.ownerAvatar} />
        <View style={styles.ownerDetails}>
          <Text style={styles.ownerName}>{item.owner.name}</Text>
          <View style={styles.ownerRating}>
            <Star size={14} color="#FECA57" fill="#FECA57" strokeWidth={0} />
            <Text style={styles.ratingText}>{item.owner.rating}</Text>
            <Text style={styles.reviewsText}>({item.owner.reviewsCount} reviews)</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={20} color="#1F3A93" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.paymentSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            ${item.price} × {bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryValue}>${subtotal}</Text>
        </View>
        
        {deliveryFee > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee}</Text>
          </View>
        )}
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotal}>${total}</Text>
        </View>
      </View>

      <View style={styles.paymentMethod}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <CreditCard size={20} color="#1F3A93" strokeWidth={2} />
          <Text style={styles.paymentText}>•••• 4242 (Default)</Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <AlertCircle size={16} color="#8E8E93" strokeWidth={2} />
        <Text style={styles.termsText}>
          By continuing, you agree to Renttar's Terms of Service and Privacy Policy.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Review Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Confirmation Component
function Confirmation({ item, bookingData, onSubmit, onBack, loading }: any) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.confirmationIcon}>
        <Check size={32} color="#4CD7D0" strokeWidth={2} />
      </View>
      
      <Text style={styles.confirmationTitle}>Review Your Booking</Text>
      <Text style={styles.confirmationSubtitle}>
        Double-check your booking details before sending your request
      </Text>

      <View style={styles.bookingSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Item</Text>
          <Text style={styles.summaryItemValue}>{item.title}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Dates</Text>
          <Text style={styles.summaryItemValue}>
            {new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Duration</Text>
          <Text style={styles.summaryItemValue}>
            {bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Delivery</Text>
          <Text style={styles.summaryItemValue}>
            {bookingData.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryItemLabel}>Total</Text>
          <Text style={[styles.summaryItemValue, styles.totalPrice]}>
            ${bookingData.totalPrice + (bookingData.deliveryOption === 'delivery' ? 10 : 0)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Send Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    maxHeight: '90%',
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  stepIndicator: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1F3A93',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F3A93',
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 24,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedDates: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedDatesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
    marginBottom: 8,
  },
  selectedDatesText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  totalDays: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#1F3A93',
    borderColor: '#1F3A93',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
    marginLeft: 8,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  messageInput: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 100,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 4,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  paymentSummary: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
  },
  paymentMethod: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  paymentText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E1E1E',
    marginLeft: 12,
    flex: 1,
  },
  changeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F3A93',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  bookingSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryItemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  summaryItemValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E1E',
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F3A93',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1F3A93',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#4CD7D0',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
});