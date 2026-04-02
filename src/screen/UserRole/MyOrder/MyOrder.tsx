import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import DrawerHeader from '../../../compoent/DrawerHeader';

const HEADER_BG = '#035093';
const GREEN = '#22C55E';
const RED = '#EF4444';
const ORANGE = '#F97316';
const BLUE = '#035093';

type TabFilter = 'Active' | 'Completed' | 'Failed';

export type OrderItem = {
  id: string;
  time: string;
  name: string;
  location: string;
  distance?: string;
  status: 'in_transit' | 'delivered' | 'failed' | 'rejected' | 'pending';
  paymentStatus: 'paid' | 'unpaid';
  date?: string;
  serviceType?: string;
  price?: string | number;
};

const MOCK_ORDERS: OrderItem[] = [
  { id: '363348', time: '09:08 PM', name: 'Ahmad Aminoff', location: 'BGC, BLR', distance: '2m 1.2km', status: 'pending', paymentStatus: 'paid', date: 'Feb 11, 2026', serviceType: 'Instant', price: '30.25' },
  { id: '1043', time: '09:08 PM', name: 'Ahmad Aminoff', location: 'BGC, BLR', distance: '2m 1.2km', status: 'in_transit', paymentStatus: 'paid', date: 'Feb 10, 2026', serviceType: 'Standard', price: '24.50' },
  { id: '1044', time: '08:02 PM', name: 'Anil Mehra', location: 'BGC, BLR', distance: '2m 1.2km', status: 'delivered', paymentStatus: 'paid', date: 'Feb 9, 2026', serviceType: 'Express', price: '18.00' },
  { id: '1045', time: '08:02 PM', name: 'Anil Mehra', location: 'BGC, BLR', distance: '2m 1.2km', status: 'failed', paymentStatus: 'unpaid', date: 'Feb 8, 2026', serviceType: 'Instant', price: '30.25' },
  { id: '1046', time: '08:02 PM', name: 'Anil Mehra', location: 'BGC, BLR', distance: '2m 1.2km', status: 'pending', paymentStatus: 'unpaid', date: 'Feb 7, 2026', serviceType: 'Instant', price: '30.25' },
  { id: '1041', time: '08:02 PM', name: 'Anil Mehra', location: 'BGC, BLR', distance: '2m 1.2km', status: 'in_transit', paymentStatus: 'paid', date: 'Feb 6, 2026', serviceType: 'Standard', price: '22.00' },
  { id: '1042', time: '08:02 PM', name: 'Anil Mehra', location: 'BGC, BLR', distance: '2m 1.2km', status: 'pending', paymentStatus: 'unpaid', date: 'Feb 5, 2026', serviceType: 'Express', price: '28.50' },
];

const statusConfig: Record<string, { label: string; bg: string }> = {
  in_transit: { label: 'In Transit', bg: BLUE },
  delivered: { label: 'Delivered', bg: GREEN },
  failed: { label: 'Failed', bg: RED },
  rejected: { label: 'Rejected', bg: RED },
  pending: { label: 'Pending', bg: ORANGE },
};

function orderToTab(order: OrderItem): TabFilter {
  if (order.status === 'delivered') return 'Completed';
  if (order.status === 'failed' || order.status === 'rejected') return 'Failed';
  return 'Active';
}

const TABS: TabFilter[] = ['Active', 'Completed', 'Failed'];

const MyOrder = ({ navigation }: any) => {
  const [statusFilter, setStatusFilter] = useState<TabFilter>('Active');

  const counts = useMemo(() => {
    const active = MOCK_ORDERS.filter((o) => orderToTab(o) === 'Active').length;
    const completed = MOCK_ORDERS.filter((o) => orderToTab(o) === 'Completed').length;
    const failed = MOCK_ORDERS.filter((o) => orderToTab(o) === 'Failed').length;
    return { Active: active, Completed: completed, Failed: failed };
  }, []);

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((o) => orderToTab(o) === statusFilter);
  }, [statusFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: HEADER_BG }} edges={['top']}>
      <StatusBarComponent barStyle="light-content" />
      <DrawerHeader title="My Order" />

      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignSelf: 'flex-start', width: '100%', marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
          >
            {TABS.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setStatusFilter(tab)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                  backgroundColor: statusFilter === tab ? HEADER_BG : '#fff',
                  borderWidth: 1,
                  borderColor: statusFilter === tab ? HEADER_BG : '#E2E8F0',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: statusFilter === tab ? '#fff' : '#475569' }}>
                  {tab} ({counts[tab]})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {filteredOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyIconX}>✕</Text>
            </View>
            <Text style={styles.emptyText}>No orders found.</Text>
          </View>
        ) : (
          filteredOrders.map((order, i) => (
            <OrderCard
              key={`${order.id}-${i}`}
              order={order}
              onView={() => navigation.navigate(ScreenNameEnum.MyOrderDetails, { item: order })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  emptyWrap: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  emptyIcon: { fontSize: 36 },
  emptyIconX: { position: 'absolute' as const, fontSize: 24, color: RED },
  emptyText: { fontSize: 16, color: '#64748B', fontWeight: '500' as const },
};

function OrderCard({
  order,
  onView,
}: {
  order: OrderItem;
  onView: () => void;
}) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const orderId = `ORD${order.id}`;
  const date = order.date || order.time;
  const serviceType = order.serviceType || 'Standard';
  const priceStr = order.price != null ? (typeof order.price === 'number' ? `$${order.price.toFixed(2)}` : `$${order.price}`) : '—';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onView}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#0F172A' }}>{orderId}</Text>
        <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, backgroundColor: config.bg }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>{config.label}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>{date}</Text>
      <Text style={{ fontSize: 13, color: GREEN, marginBottom: 8 }}>{serviceType}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: BLUE }}>{priceStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default MyOrder;
