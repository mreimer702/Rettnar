import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit3, Star, MapPin, Calendar, Heart, CreditCard, Bell, Shield, CircleHelp as HelpCircle, LogOut, Award, TrendingUp, Eye, Users, LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';

const userStats = [
  { label: 'Items Rented', value: '24', color: '#3B82F6', icon: Calendar },
  { label: 'Items Listed', value: '8', color: '#10B981', icon: Heart },
  { label: 'Rating', value: '4.9', color: '#F59E0B', icon: Star },
  { label: 'Earnings', value: '$1.2k', color: '#8B5CF6', icon: TrendingUp },
];

const menuItems = [
  { id: 1, title: 'My Bookings', icon: Calendar, badge: '3' },
  { id: 2, title: 'My Listings', icon: Heart, badge: '8' },
  { id: 3, title: 'Payment Methods', icon: CreditCard },
  { id: 4, title: 'Notifications', icon: Bell, toggle: true },
  { id: 5, title: 'Privacy & Security', icon: Shield },
  { id: 6, title: 'Help & Support', icon: HelpCircle },
];

const recentActivity = [
  {
    id: 1,
    title: 'Rented Professional DSLR Camera',
    date: '3 days ago',
    status: 'Completed',
    amount: '$135',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=60',
    type: 'expense',
  },
  {
    id: 2,
    title: 'Listed Power Drill Set',
    date: '1 week ago',
    status: 'Active',
    amount: '+$75',
    image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=60',
    type: 'income',
  },
];

export default function ProfileScreen() {

  type RootStackParamList = {
  Bookings: undefined;
  Listings: undefined;
  PaymentMethods: undefined;
  PrivacySecurity: undefined;
  HelpSupport: undefined;
};

const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function handlePress(
  item:
    | { id: number; title: string; icon: LucideIcon; badge: string; toggle?: undefined }
    | { id: number; title: string; icon: LucideIcon; badge?: undefined; toggle?: undefined }
    | { id: number; title: string; icon: LucideIcon; toggle: boolean; badge?: undefined }
): void {
  switch (item.title) {
    case 'My Bookings':
      navigation.navigate('Bookings');
      break;
    case 'My Listings':
      navigation.navigate('Listings');
      break;
    case 'Payment Methods':
      navigation.navigate('PaymentMethods');
      break;
    case 'Notifications':
      // Handled by toggle/switch
      break;
    case 'Privacy & Security':
      navigation.navigate('PrivacySecurity');
      break;
    case 'Help & Support':
      navigation.navigate('HelpSupport');
      break;
    default:
      Alert.alert('Info', 'Action not implemented.');
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>John Doe</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#DBEAFE" strokeWidth={2} />
                <Text style={styles.location}>San Francisco, CA</Text>
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                <Text style={styles.rating}>4.9</Text>
                <Text style={styles.reviewCount}>(47 reviews)</Text>
                <View style={styles.verifiedBadge}>
                  <Award size={12} color="#10B981" strokeWidth={2} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#3B82F6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                  <IconComponent size={16} color={stat.color} strokeWidth={2} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.content}>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Calendar size={20} color="#3B82F6" strokeWidth={2} />
              </View>
              <Text style={styles.quickActionText}>Book Item</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Heart size={20} color="#10B981" strokeWidth={2} />
              </View>
              <Text style={styles.quickActionText}>List Item</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFFBEB' }]}>
                <Star size={20} color="#F59E0B" strokeWidth={2} />
              </View>
              <Text style={styles.quickActionText}>Reviews</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FAF5FF' }]}>
                <TrendingUp size={20} color="#8B5CF6" strokeWidth={2} />
              </View>
              <Text style={styles.quickActionText}>Earnings</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <Text style={styles.sectionTitle}>Account</Text>
          
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handlePress(item)}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#3B82F6" strokeWidth={2} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.toggle ? (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                    thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
                  />
                ) : (
                  <Text style={styles.chevron}>›</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <Image
                  source={{ uri: activity.image }}
                  style={styles.activityImage}
                />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  <View style={[
                    styles.activityStatus,
                    { backgroundColor: activity.status === 'Completed' ? '#DCFCE7' : '#EFF6FF' }
                  ]}>
                    <Text style={[
                      styles.activityStatusText,
                      { color: activity.status === 'Completed' ? '#166534' : '#1E40AF' }
                    ]}>
                      {activity.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityAmount}>
                  <Text style={[
                    styles.activityPrice,
                    { color: activity.type === 'income' ? '#10B981' : '#3B82F6' }
                  ]}>
                    {activity.amount}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Renttar v1.0.0</Text>
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
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: -16,
    marginBottom: 32,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 18,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 6,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  activityStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
  },
});