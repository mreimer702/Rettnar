import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

// Define the shape of a draft
interface Draft {
  id: number;
  title: string;
  lastEdited: string;
  status: 'Ready' | 'Incomplete';
}

// Define navigation props (adjust according to your actual navigation structure)
type RootStackParamList = {
  UploadPage: { draft: Draft };
  DraftsPage: undefined;
};

type DraftsPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DraftsPage'>;
  route: RouteProp<RootStackParamList, 'DraftsPage'>;
};

const DraftsPage: React.FC = () => {
  const navigation = useNavigation();
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      title: 'Photography Tips',
      lastEdited: '2025-03-20',
      status: 'Ready',
    },
    {
      id: 2,
      title: 'Event Planning Guide',
      lastEdited: '2025-03-18',
      status: 'Incomplete',
    },
    {
      id: 3,
      title: 'Studio Lighting Basics',
      lastEdited: '2025-03-22',
      status: 'Ready',
    },
    {
      id: 4,
      title: 'Videography for Beginners',
      lastEdited: '2025-03-21',
      status: 'Incomplete',
    },
    {
      id: 5,
      title: 'How to Edit Videos',
      lastEdited: '2025-03-19',
      status: 'Ready',
    },
  ]);

  useEffect(() => {
    // TODO: Backend - Fetch saved drafts from the server using API
    // fetch('https://your-api.com/drafts')
    //   .then(response => response.json())
    //   .then(data => setDrafts(data))
    //   .catch(error => console.error('Error fetching drafts:', error));
  }, []);

 // const handleEditDraft = (draft: Draft): void => {
   // navigation.navigate('UploadPage' as never, { draft } as never);
  //};

  const handlePublish = async (draftId: number): Promise<void> => {
    try {
      const response = await fetch(`https://your-api.com/publish/${draftId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Draft published successfully.');
        setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      } else {
        Alert.alert('Error', data.message || 'Failed to publish draft.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to publish draft.');
    }
  };

  const renderItem = ({ item }: { item: Draft }) => (
    <TouchableOpacity
      style={styles.draftItem}
      //onPress={() => handleEditDraft(item)}
    >
      <View style={styles.draftInfo}>
        <Text style={styles.draftTitle}>{item.title}</Text>
        <Text style={styles.draftDate}>Last edited: {item.lastEdited}</Text>
      </View>
      <TouchableOpacity onPress={() => handlePublish(item.id)}>
        <Text
          style={[
            styles.draftStatus,
            item.status === 'Ready' ? styles.ready : styles.incomplete,
          ]}
        >
          {item.status === 'Ready' ? 'Ready to Publish' : 'Incomplete'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
        <Text style={styles.headerText}>Saved Drafts</Text>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Draft Listings</Text>

      {/* Draft List - Display drafts or empty message */}
      <FlatList
        data={drafts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drafts available.</Text>
        }
      />

      {/* Bottom Navigation Bar */}
    </View>
  );
};

import { StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  draftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  draftInfo: {
    flex: 1,
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  draftDate: {
    fontSize: 12,
    color: '#888',
  },
  draftStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    textAlign: 'center',
  },
  ready: {
    color: '#fff',
    backgroundColor: '#4caf50',
  },
  incomplete: {
    color: '#fff',
    backgroundColor: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
});

export default DraftsPage;
