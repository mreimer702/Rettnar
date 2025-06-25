import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const categories = [
  {
    id: 1,
    name: 'Camera Gear',
    icon: 'camera-alt',
    gradient: ['#FF6B6B', '#FF8E8E'],
    itemCount: '1.2k+',
  },
  {
    id: 2, 
    name: 'Tools', 
    icon: 'build', 
    gradient: ['#4ECDC4', '#44D8CC'], 
    itemCount: '850+'
  },
  {
    id: 3,
    name: 'Tech & Office',
    icon: 'laptop',
    gradient: ['#45B7D1', '#5CC1DA'],
    itemCount: '2.1k+',
  },
  {
    id: 4,
    name: 'Vehicles',
    icon: 'directions-car',
    gradient: ['#96CEB4', '#A5D4BE'],
    itemCount: '340+',
  },
  {
    id: 5, 
    name: 'Spaces', 
    icon: 'home', 
    gradient: ['#FECA57', '#FED368'], 
    itemCount: '120+'
  },
  {
    id: 6,
    name: 'Events',
    icon: 'event',
    gradient: ['#FF9FF3', '#FFB3F6'],
    itemCount: '680+',
  },
];

const whyRenttar = [
  {
    id: 1,
    title: 'Smart Search',
    description: 'AI-powered search finds exactly what you need',
    icon: 'search',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Flexible Rentals',
    description: 'Hourly, daily, weekly, or monthly options',
    icon: 'schedule',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 3,
    title: 'Secure & Verified',
    description: 'Identity verified users & secure payments',
    icon: 'security',
    gradient: ['#43e97b', '#38f9d7'],
  },
  {
    id: 4,
    title: 'Delivery Options',
    description: 'Pickup, delivery, or shipped anywhere',
    icon: 'local-shipping',
    gradient: ['#fa709a', '#fee140'],
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Maya Chen',
    role: 'Content Creator',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I needed professional lighting gear for a last-minute shoot—Renttar delivered the same day. Absolute game changer for creators!',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Event Planner',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The audio equipment selection is incredible. Saved me thousands on my corporate event and everything worked flawlessly.',
  },
  {
    id: 3,
    name: 'Sarah Kim',
    role: 'Startup Founder',
    avatar:
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Perfect for our temporary office setup. Quality gear, transparent pricing, and incredibly responsive support team.',
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const Header = () => (
    <SafeAreaView style={styles.header}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false}
      />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.logoContainer}>
            <Text style={styles.logo}>Renttar</Text>
         
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.locationButton}>
            <View style={styles.locationIconContainer}>
              <Icon name="location-on" size={14} color="#667eea" />
            </View>
            <Text style={styles.locationText}>San Francisco</Text>
            <Icon name="keyboard-arrow-down" size={16} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-none" size={22} color="#667eea" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const HeroSection = () => (
    <View style={styles.heroWrapper}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.heroSection}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.heroKeyboardView}>
          <View style={styles.heroContent}>
            {/* Hero Text */}
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Access Anything.{'\n'}
                <Text style={styles.heroTitleAccent}>Anywhere. Anytime.</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                The smart rental marketplace connecting you with gear, tools, spaces, and experiences in your neighborhood.
              </Text>
            </View>

            {/* Search Container */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.searchIconContainer}>
                  <Icon name="search" size={20} color="#FFFFFF" />
                </LinearGradient>
                <TextInput
                  style={styles.searchInput}
                  placeholder="What do you need to rent today?"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
              </View>
              
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={['#fa709a', '#fee140']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.searchButton}>
                  <View style={styles.searchButtonInner}>
                    <Text style={styles.searchButtonText}>Search</Text>
                    <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, { marginRight: 10 }]}
                activeOpacity={0.8}>
                <Text style={styles.secondaryButtonText}>Start Renting</Text>
                <Icon name="add-circle-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                activeOpacity={0.8}>
                <Text style={styles.secondaryButtonText}>List Your Item</Text>
                <Icon name="add-circle-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>10k+</Text>
                <Text style={styles.heroStatLabel}>Items Available</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>5k+</Text>
                <Text style={styles.heroStatLabel}>Happy Users</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>50+</Text>
                <Text style={styles.heroStatLabel}>Cities</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );

  const WhyRenttar = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>Why Choose Renttar?</Text>
        <Text style={styles.sectionSubtitle}>Everything you need to rent with confidence</Text>
      </View>
      <View style={styles.featuresGrid}>
        {whyRenttar.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <LinearGradient
              colors={feature.gradient}
              style={styles.featureIconGradient}>
              <Icon name={feature.icon} size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const CategoriesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <Text style={styles.sectionSubtitle}>Explore what's trending near you</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="arrow-forward" size={16} color="#667eea" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <LinearGradient
              colors={category.gradient}
              style={styles.categoryIconGradient}>
              <Icon name={category.icon} size={32} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.categoryCountContainer}>
              <Text style={styles.categoryCount}>{category.itemCount} items</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const HowItWorks = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>Get started in 4 simple steps</Text>
      </View>
      <View style={styles.stepsContainer}>
        {[
          {
            step: 1, 
            title: 'Search & Discover', 
            description: 'Find exactly what you need with smart filters and location-based results',
            icon: 'search',
            gradient: ['#667eea', '#764ba2']
          },
          {
            step: 2,
            title: 'Book & Pay',
            description: 'Select your dates, review terms, and secure your booking with protected payments',
            icon: 'payment',
            gradient: ['#4facfe', '#00f2fe']
          },
          {
            step: 3,
            title: 'Receive & Enjoy',
            description: 'Pick up locally or get it delivered right to your door, ready to use',
            icon: 'local-shipping',
            gradient: ['#43e97b', '#38f9d7']
          },
          {
            step: 4,
            title: 'Return & Review',
            description: 'Easy return process with flexible pickup options and rate your experience',
            icon: 'assignment-turned-in',
            gradient: ['#fa709a', '#fee140']
          },
        ].map((item, index) => (
          <View key={item.step} style={styles.stepCard}>
            <LinearGradient
              colors={item.gradient}
              style={styles.stepIconContainer}>
              <Icon name={item.icon} size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDescription}>{item.description}</Text>
            </View>
            {index < 3 && <View style={styles.stepConnector} />}
          </View>
        ))}
      </View>
    </View>
  );

  const BecomeALender = () => (
    <View style={styles.lenderWrapper}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.lenderSection}>
        <View style={styles.lenderOverlay}>
          <View style={styles.lenderContent}>
            <View style={styles.lenderIconContainer}>
              <Icon name="trending-up" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.lenderTitle}>Become a Lender</Text>
            <Text style={styles.lenderSubtitle}>
              Turn your unused items into income. Join thousands earning extra money by sharing what they own.
            </Text>
            <View style={styles.lenderStats}>
              <View style={styles.lenderStat}>
                <Text style={styles.lenderStatNumber}>$2,400</Text>
                <Text style={styles.lenderStatLabel}>Avg. monthly earnings</Text>
              </View>
              <View style={styles.lenderStat}>
                <Text style={styles.lenderStatNumber}>24hrs</Text>
                <Text style={styles.lenderStatLabel}>Average approval time</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.lenderButton}>
              <Text style={styles.lenderButtonText}>Start Listing Today</Text>
              <Icon name="arrow-forward" size={18} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const TestimonialsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>What Our Community Says</Text>
        <Text style={styles.sectionSubtitle}>Real experiences from real users</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContainer}>
        {testimonials.map(testimonial => (
          <View key={testimonial.id} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatarContainer}>
                <Image
                  source={{uri: testimonial.avatar}}
                  style={styles.testimonialAvatar}
                />
                <View style={styles.testimonialVerifiedBadge}>
                  <Icon name="verified" size={12} color="#10B981" />
                </View>
              </View>
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
              <View style={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Icon key={i} name="star" size={14} color="#FCD34D" />
                ))}
              </View>
            </View>
            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
            <View style={styles.testimonialFooter}>
              <Text style={styles.testimonialDate}>2 days ago</Text>
              <TouchableOpacity style={styles.testimonialHelpful}>
                <Icon name="thumb-up" size={12} color="#9CA3AF" />
                <Text style={styles.testimonialHelpfulText}>Helpful</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeroSection />
        <WhyRenttar />
        <CategoriesSection />
        <HowItWorks />
        <BecomeALender />
        <TestimonialsSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 16,
  },
  logoContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'dark blue',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationIconContainer: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Hero Section - Fixed Layout
  heroWrapper: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroSection: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: height * 0.65, // Responsive height
  },
  heroKeyboardView: {
    flex: 1,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: Math.min(width * 0.08, 32), // Responsive font size
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: Math.min(width * 0.1, 40),
  },
  heroTitleAccent: {
    color: '#FED7AA',
  },
  heroSubtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width - 80,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 10,
  },
  searchButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  searchButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1F3A93',
    height: 48,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal:2,
    borderRadius: 25,
    gap: 2,
  },
  primaryButtonText: {
    color: '#1F3A93',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 'auto',
  },
  heroStat: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },

  // Rest of the styles remain the same
  section: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionHeaderContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginLeft: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryCountContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepsContainer: {
    gap: 32,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  stepConnector: {
    position: 'absolute',
    left: 44,
    top: 68,
    width: 2,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  lenderWrapper: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  lenderSection: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 320,
  },
  lenderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 24,
    padding: 32,
  },
  lenderContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  lenderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lenderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  lenderSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  lenderStats: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 32,
  },
  lenderStat: {
    alignItems: 'center',
  },
  lenderStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lenderStatLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  lenderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  lenderButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
  testimonialsContainer: {
    paddingRight: 20,
  },
  testimonialCard: {
    width: width - 80,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  testimonialVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  testimonialHelpful: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testimonialHelpfulText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default HomePage;