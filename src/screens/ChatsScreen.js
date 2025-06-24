import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS, SIZES } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id);
    };
    getUser();
  }, []);

  const fetchConversations = async () => {
    setRefreshing(true);
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
    const uniqueUserIds = [...new Set(userIds)].filter(id => id && id !== currentUserId);

    // Fetch user info for each from profiles table
    let users = [];
    if (uniqueUserIds.length > 0) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', uniqueUserIds);
      users = userData || [];
    }
    setConversations(users);
    setLoading(false);
    setRefreshing(false);
  };

  // Auto-refresh when a new message is sent/received using Supabase real-time
  useEffect(() => {
    if (!currentUserId) return;
    fetchConversations();

    // Subscribe to new messages
    subscriptionRef.current = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUserId},receiver_id=eq.${currentUserId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    // Also listen to any message where user is sender or receiver
    const generalSub = supabase
      .channel('messages_general')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (
            payload.new.sender_id === currentUserId ||
            payload.new.receiver_id === currentUserId
          ) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionRef.current);
      supabase.removeChannel(generalSub);
    };
    // eslint-disable-next-line
  }, [currentUserId]);

  const renderAvatar = (item) => {
    if (item.avatar) {
      return (
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />
      );
    }
    const initials = `${item.first_name?.[0] || ''}${item.last_name?.[0] || ''}`.toUpperCase();
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
    );
  };

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
        <MaterialIcons name="chat-bubble-outline" size={64} color={COLORS.primary.light} />
        <Text style={styles.emptyText}>No chats yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('ChatRoomScreen', {
                partnerId: item.id,
                partnerName: `${item.first_name} ${item.last_name}`,
                currentUserId,
              })
            }
            activeOpacity={0.85}
          >
            {renderAvatar(item)}
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.chatSubText}>Tap to chat</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.primary.light} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: SIZES.padding.lg }}
        refreshing={refreshing}
        onRefresh={fetchConversations}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.default },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 18,
    backgroundColor: COLORS.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: SIZES.padding.md,
    elevation: 6,
    shadowColor: COLORS.primary.main,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xxl,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.paper,
    marginHorizontal: SIZES.padding.lg,
    marginBottom: SIZES.padding.md,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.padding.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 3 },
    }),
    borderWidth: 1,
    borderColor: COLORS.primary.light,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: SIZES.padding.md,
    backgroundColor: COLORS.primary.light,
    borderWidth: 2,
    borderColor: COLORS.primary.main,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: SIZES.padding.md,
    backgroundColor: COLORS.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary.main,
  },
  avatarInitials: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.xl,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  chatSubText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.text.secondary, fontSize: FONTS.sizes.md, marginTop: 12 },
});

export default ChatsScreen;