import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS, SIZES } from '../theme';

const currentUserId = 'REPLACE_WITH_CURRENT_USER_ID'; // Replace with your auth logic

const ChatsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users you have chatted with
  useEffect(() => {
    const fetchConversations = async () => {
      // Get all unique user IDs you've chatted with
      const { data: sent } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', currentUserId);

      const { data: received } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', currentUserId);

      const userIds = [
        ...(sent ? sent.map(m => m.receiver_id) : []),
        ...(received ? received.map(m => m.sender_id) : []),
      ];
      // Remove duplicates and yourself
      const uniqueUserIds = [...new Set(userIds)].filter(id => id && id !== currentUserId);

      // Fetch user info for each
      let users = [];
      if (uniqueUserIds.length > 0) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, username')
          .in('id', uniqueUserIds);
        users = userData || [];
      }
      setConversations(users);
      setLoading(false);
    };
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary.main} />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No chats yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatRoom', { partnerId: item.id, partnerName: item.username, currentUserId })}
          >
            <Text style={styles.chatName}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.default },
  chatItem: {
    padding: SIZES.padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.text.secondary, fontSize: FONTS.sizes.md },
});

export default ChatsScreen;