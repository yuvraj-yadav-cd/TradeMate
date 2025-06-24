import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS, SIZES } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatRoomScreen = ({ route, navigation }) => {
  const { partnerId, partnerName, currentUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  // Fetch messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`
      )
      .order('created_at', { ascending: true });
    if (!error) setMessages(data);
  };

  // Subscribe to new messages (auto refresh)
  useEffect(() => {
    if (!currentUserId || !partnerId) return;
    fetchMessages();
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === currentUserId)
          ) {
            fetchMessages();
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(), // Temporary ID for UI
      sender_id: currentUserId,
      receiver_id: partnerId,
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]); // Optimistically add message
    setInput('');
    await supabase.from('messages').insert([
      { sender_id: currentUserId, receiver_id: partnerId, content: newMsg.content }
    ]);
    // The real-time subscription will fetch the actual message from DB
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.sender_id === currentUserId ? styles.myRow : styles.theirRow,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender_id === currentUserId ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender_id === currentUserId ? { color: '#fff' } : { color: COLORS.text.primary },
          ]}
        >
          {item.content}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Floating Header (no "Chats" heading, just back and partner name) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{partnerName || 'Chat'}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.default },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.main,
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding.lg,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  headerBack: {
    marginRight: 12,
    padding: 4,
  },
  headerText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    flex: 1,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  list: {
    padding: SIZES.padding.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: SIZES.padding.sm,
    borderRadius: 18,
    marginHorizontal: 6,
    marginVertical: 2,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  myMessage: {
    backgroundColor: COLORS.primary.main,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  theirMessage: {
    backgroundColor: COLORS.background.paper,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
  },
  timeText: {
    fontSize: 10,
    color: '#bbb',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.padding.sm,
    backgroundColor: COLORS.background.paper,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.default,
    borderRadius: 20,
    paddingHorizontal: SIZES.padding.md,
    marginRight: SIZES.padding.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: 20,
    paddingHorizontal: SIZES.padding.lg,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatRoomScreen;