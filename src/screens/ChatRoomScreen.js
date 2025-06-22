import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS, SIZES } from '../theme';

const ChatRoomScreen = ({ route }) => {
  const { partnerId, partnerName, currentUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  // Fetch messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data);
  };

  // Subscribe to new messages
  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === partnerId) ||
            (msg.sender_id === partnerId && msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert([
      { sender_id: currentUserId, receiver_id: partnerId, content: input }
    ]);
    setInput('');
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender_id === currentUserId ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{partnerName}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.default },
  header: { padding: SIZES.padding.lg, backgroundColor: COLORS.primary.main },
  headerText: { color: '#fff', fontFamily: FONTS.bold, fontSize: FONTS.sizes.lg },
  list: { padding: SIZES.padding.md, flexGrow: 1, justifyContent: 'flex-end' },
  messageBubble: {
    maxWidth: '75%',
    marginVertical: 4,
    padding: SIZES.padding.sm,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: COLORS.primary.main,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: COLORS.background.paper,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: COLORS.text.primary,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
  },
  timeText: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.padding.sm,
    backgroundColor: COLORS.background.paper,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  },
  sendButton: {
    backgroundColor: COLORS.primary.main,
    borderRadius: 20,
    paddingHorizontal: SIZES.padding.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: COLORS.primary.contrast,
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.md,
  },
});

export default ChatRoomScreen;