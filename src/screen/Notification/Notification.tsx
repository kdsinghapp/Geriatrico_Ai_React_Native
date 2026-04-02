import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../compoent/StatusBarCompoent';

const notifications = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: 'Your weekly review has been answered',
        date: 'Jun 2, 2024 • 09:41 AM',
        unread: false,
      },
      {
        id: '2',
        title: 'Unread notification title',
        date: 'Just now',
        unread: true,
      },
    ],
  },
  {
    title: 'This week',
    data: [
      {
        id: '3',
        title: 'Unread notification title',
        date: '1 hour ago',
        unread: true,
      },
      {
        id: '4',
        title: 'Notification title',
        date: 'Yesterday',
        unread: false,
      },
    ],
  },
];

const NotificationItem = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, item.unread && styles.unreadCard]}
    >
      {item.unread && <View style={styles.unreadDot} />}

      <View style={styles.textContainer}>
        <Text style={[styles.title, item.unread && styles.unreadTitle]}>
          {item.title}
        </Text>

        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent/>
      <CustomHeader

        txtHeading={{
          fontSize: 18,
          color: 'black',
          fontWeight: "500"
        }}
        label={'Notification'} />

      <SectionList
        sections={[]}   // ✅ FIXED
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}

        // ✅ Section Header Added
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerWrapper}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}

        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Notifications Found</Text>
          </View>
        )}

        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  headerWrapper: {
    marginTop: 16,
    marginBottom: 8,
  },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  unreadCard: {
    backgroundColor: '#EAF7F0',
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27AE60',
    marginRight: 10,
    marginTop: 6,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },

  unreadTitle: {
    fontWeight: '700',
    color: '#111',
  },

  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },

  emptyText: {
    fontSize: 14,
    color: 'black',
  },
});