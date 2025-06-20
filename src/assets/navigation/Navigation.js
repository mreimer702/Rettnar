// src/navigation/Navigation.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomePage from '../screens/HomePage';
import NotificationPage from '../screens/NotificationPage';
import AccountPage from '../screens/AccountPage';
import RegisterPage from '../screens/RegisterPage';
import LoginPage from '../screens/LoginPage';
import SearchResultPage from '../screens/SearchResultPage';
import UploadPage from '../screens/UploadPage';
import DraftsPage from '../screens/DraftsPage';
import AddPaymentPage from '../screens/AddPaymentPage';
import ProfilePage from '../screens/ProfilePage';
import MapPage from '../screens/MapPage';
import RentalPage from '../screens/RentalPages';
import ListingPage from '../screens/ListingPage';
import ProductPage from '../screens/ProductPage';
import PaymentPage from '../screens/PaymentPage';
import EquipmentPage from '../screens/EquipmentPage';
import VenuePage from '../screens/VenuePage';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchResultPage"
          component={SearchResultPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationPage"
          component={NotificationPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadPage"
          component={UploadPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DraftsPage"
          component={DraftsPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddPaymentPage"
          component={AddPaymentPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AccountPage"
          component={AccountPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MapPage"
          component={MapPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RentalPage"
          component={RentalPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListingPage"
          component={ListingPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentPage"
          component={PaymentPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EquipmentPage"
          component={EquipmentPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VenuePage"
          component={VenuePage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
