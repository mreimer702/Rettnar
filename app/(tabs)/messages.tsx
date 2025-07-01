import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Send, MoveHorizontal as MoreHorizontal, ArrowLeft, Phone, Video } from 'lucide-react-native';

const conversations = [
  {
    id: 1,
    name: 'Alex Chen',
    lastMessage: 'The camera is ready for pickup tomorrow at 10am',
    time: '2m ago',
    unread: true,
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    item: 'Professional DSLR Camera',
    status: 'confirmed',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    lastMessage: 'Is the drill still available for this weekend?',
    time: '1h ago',
    unread: false,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
    item: 'DeWalt Power Drill Set',
    status: 'pending',
  },
  {
    id: 3,
    name: 'David Park',
    lastMessage: 'Thanks for the quick response! Looking forward to using it.',
    time: '3h ago',
    unread: false,
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100',
    item: 'MacBook Pro 16-inch',
    status: 'confirmed',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    lastMessage: 'Can we meet at the coffee shop instead?',
    time: '1d ago',
    unread: true,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    item: 'Sony A7R IV Camera',
    status: 'negotiating',
  },
];

const currentMessages = [
  {
    id: 1,
    text: 'Hi! Is the DSLR camera still available for rent this weekend?',
    sent: true,
    time: '10:30 AM',
  },
  {
    id: 2,
    text: 'Yes, it\'s available! The daily rate is $45. When would you need it?',
    sent: false,
    time: '10:32 AM',
  },
  {
    id: 3,
    text: 'Perfect! I need it from Friday morning to Sunday evening. That would be 3 days total.',
    sent: true,
    time: '10:35 AM',
  },
  {
    id: 4,
    text: 'Great! That would be $135 for 3 days. The camera comes with extra batteries and memory cards. Would you like to confirm the booking?',
    sent: false,
    time: '10:37 AM',
  },
  {
    id: 5,
    text: 'Sounds perfect! How do we proceed with the booking?',
    sent: true,
    time: '10:40 AM',
  },
];

export default function MessagesScreen() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Simulate sending message
    setMessageText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'negotiating': return '#3B82F6';
      default: return '#64748B';
    }
  };

  const renderConversationsList = () => (
    <View style={styles.conversationsContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <MoreHorizontal size={24} color="#1E293B" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#64748B" strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationItem}
            onPress={() => setSelectedConversation(conversation)}
          >
            <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.name}>{conversation.name}</Text>
                <Text style={styles.time}>{conversation.time}</Text>
              </View>
              <Text style={styles.itemName}>{conversation.item}</Text>
              <Text 
                style={[
                  styles.lastMessage,
                  conversation.unread && styles.unreadMessage
                ]}
                numberOfLines={1}
              >
                {conversation.lastMessage}
              </Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(conversation.status)}20` }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(conversation.status) }
                  ]}>
                    {conversation.status}
                  </Text>
                </View>
              </View>
            </View>
            {conversation.unread && <View style={styles.unreadBadge} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderChat = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedConversation(null)}
        >
          <ArrowLeft size={24} color="#1E293B" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <Image source={{ uri: selectedConversation.avatar }} style={styles.chatAvatar} />
          <View>
            <Text style={styles.chatName}>{selectedConversation.name}</Text>
            <Text style={styles.chatItem}>{selectedConversation.item}</Text>
          </View>
        </View>
        <View style={styles.chatActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Video size={20} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {currentMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageItem,
              message.sent ? styles.sentMessage : styles.receivedMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.sent ? styles.sentBubble : styles.receivedBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.sent ? styles.sentMessageText : styles.receivedMessageText
              ]}>
                {message.text}
              </Text>
            </View>
            <Text style={[
              styles.messageTime,
              message.sent ? styles.sentMessageTime : styles.receivedMessageTime
            ]}>
              {message.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bookingActions}>
        <TouchableOpacity style={styles.bookingButton}>
          <Text style={styles.bookingButtonText}>Confirm Booking - $135</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Send size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedConversation ? renderChat() : renderConversationsList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  conversationsContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  itemName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 6,
  },
  unreadMessage: {
    color: '#1E293B',
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: 16,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  chatItem: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageItem: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  sentBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sentMessageTime: {
    color: '#64748B',
    textAlign: 'right',
  },
  receivedMessageTime: {
    color: '#64748B',
    textAlign: 'left',
  },
  bookingActions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bookingButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});