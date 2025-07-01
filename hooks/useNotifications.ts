import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    // Request permissions and get push token
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });

    // Listen for received notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification responses (when user taps notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      handleNotificationResponse(data);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const handleNotificationResponse = (data: any) => {
    // Handle different notification types
    switch (data.type) {
      case 'booking_request':
        // Navigate to booking management
        console.log('Navigate to booking:', data.bookingId);
        break;
      case 'message':
        // Navigate to messages
        console.log('Navigate to message:', data.conversationId);
        break;
      case 'booking_confirmed':
        // Navigate to booking details
        console.log('Navigate to confirmed booking:', data.bookingId);
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  };

  const scheduleLocalNotification = async (title: string, body: string, data?: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  const schedulePushNotification = async (
    title: string, 
    body: string, 
    data?: any,
    delay?: number
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: delay
          ? {
              seconds: delay,
              repeats: false,
              type: 'timeInterval',
            } as Notifications.TimeIntervalTriggerInput
          : null,
      });
    } catch (error) {
      console.error('Failed to schedule push notification:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    scheduleLocalNotification,
    schedulePushNotification,
  };
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return null;
  }
  
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
  } catch (error) {
    console.error('Failed to get push token:', error);
  }

  return token;
}