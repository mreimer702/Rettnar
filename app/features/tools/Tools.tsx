import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types
type RootStackParamList = {
  ProductPage: { productId: number };
  EquipmentPage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'EquipmentPage'>;

interface EquipmentItem {
  id: number;
  title: string;
  image: ImageSourcePropType;
  price: string;
}

export default function EquipmentPage() {
  const navigation = useNavigation<NavigationProp>();
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const mockData: EquipmentItem[] = [...Array(6)].map((_, i) => ({
      id: i + 1,
      title: `Tool ${i + 1}`,
      image: require('../../../assets/images/tool-placeholder.png'),
      price: '$50/day',
    }));

    setEquipmentList(mockData);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.searchContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="black" />
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Tools</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={equipmentList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, styles.shadow]}
              onPress={() =>
                navigation.navigate('ProductPage', {
                  productId: item.id,
                })
              }
            >
              <Heart width={20} height={20} color="#e74c3c" style={styles.favoriteIcon} />
              <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Optional BottomNavBar */}
      {/* <BottomNavBar active="Home" /> */}
    </View>
  );
}

import { ChevronLeft, Heart } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIcon: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
