import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import styles from '../styles/DraftsStyle';
import BottomNavBar from '../components/BottomNavBar';

export default function DraftsPage({navigation}) {
  const [drafts, setDrafts] = useState([
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

  // Navigate to the UploadPage for editing a draft
  const handleEditDraft = draft => {
    navigation.navigate('UploadPage', {draft});
  };

  // TODO: Backend - Publish a draft using API and remove it from the drafts list on success
  const handlePublish = async draftId => {
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
        setDrafts(drafts.filter(draft => draft.id !== draftId));
      } else {
        Alert.alert('Error', data.message || 'Failed to publish draft.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to publish draft.');
    }
  };

  // Render each draft item with options to edit or publish
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.draftItem}
      onPress={() => handleEditDraft(item)}>
      <View style={styles.draftInfo}>
        <Text style={styles.draftTitle}>{item.title}</Text>
        <Text style={styles.draftDate}>Last edited: {item.lastEdited}</Text>
      </View>
      <TouchableOpacity onPress={() => handlePublish(item.id)}>
        <Text
          style={[
            styles.draftStatus,
            item.status === 'Ready' ? styles.ready : styles.incomplete,
          ]}>
          {item.status === 'Ready' ? 'Ready to Publish' : 'Incomplete'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Saved Drafts</Text>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Draft Listings</Text>

      {/* Draft List - Display drafts or empty message */}
      <FlatList
        data={drafts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drafts available.</Text>
        }
      />

      {/* Bottom Navigation Bar */}
      <BottomNavBar active="" />
    </View>
  );
}
