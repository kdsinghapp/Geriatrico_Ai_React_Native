import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import type { OrderItem } from '../MyOrder/MyOrder';

const HEADER_BG = '#035093';
const CARD_BLUE = '#035093';
const GREEN = '#22C55E';
const LIGHT_BLUE = '#E0F2FE';
const TEXT_DARK = '#0F172A';
const TEXT_MUTED = '#64748B';

type NavParams = { item: OrderItem };

const TIMELINE_STEPS = [
  { key: 'created', label: 'Order Created' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'picked', label: 'Picked Up' },
  { key: 'delivered', label: 'Delivered' },
] as const;

function getActiveStepIndex(status: OrderItem['status']): number {
  switch (status) {
    case 'pending':
      return 0;
    case 'in_transit':
      return 2;
    case 'delivered':
      return 3;
    case 'failed':
    case 'rejected':
    default:
      return 0;
  }
}

const statusLabel: Record<OrderItem['status'], string> = {
  pending: 'Pending',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  failed: 'Failed',
  rejected: 'Rejected',
};

export default function MyOrderDetails() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: NavParams }, 'params'>>();
  const item = route.params?.item;

  if (!item) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBarComponent backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image source={imageIndex.back} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No order data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeStep = getActiveStepIndex(item.status);
  const statusText = statusLabel[item.status];
  const orderCreatedDate = item.date ? `${item.date}, ${item.time}` : item.time;
  const serviceLabel = (item.serviceType || 'Instant').toLowerCase();
  const serviceTime = serviceLabel === 'instant' ? '30-60 min' : '1-2 days';
  const priceStr =
    item.price != null
      ? `$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}`
      : '$0.00';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBarComponent backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={imageIndex.back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>⚡</Text>
          <View>
            <Text style={styles.statusLabel}>{statusText}</Text>
            <Text style={styles.statusSubtext}>Current Status</Text>
          </View>
        </View>

        {/* Delivery Timeline */}
        <Text style={styles.sectionTitle}>Delivery Timeline</Text>
        <View style={styles.timeline}>
          {TIMELINE_STEPS.map((step, index) => {
            const isActive = index <= activeStep;
            const isLast = index === TIMELINE_STEPS.length - 1;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, isActive && styles.timelineDotActive]}>
                    <Text style={[styles.timelineDotText, isActive && styles.timelineDotTextActive]}>
                      {index + 1}
                    </Text>
                  </View>
                  {!isLast && <View style={[styles.timelineLine, isActive && styles.timelineLineActive]} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{step.label}</Text>
                  {step.key === 'created' && (
                    <Text style={styles.timelineDate}>{orderCreatedDate}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Service Level Card */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceIcon}>⚡</Text>
          <View>
            <Text style={styles.serviceLabel}>{serviceLabel}</Text>
            <Text style={styles.serviceSubtext}>{serviceTime}</Text>
          </View>
        </View>

        {/* Recipient Details Card */}
        <Text style={styles.sectionTitle}>Recipient Details</Text>
        <View style={styles.recipientCard}>
          <DetailRow label="Name" value={item.name} />
          <DetailRow label="Phone" value="+1234567890" />
          <DetailRow label="Pickup Address" value={item.location || '13655 Rte 31 W, Albion, NY 14411'} />
          <DetailRow label="Drop-off Address" value={item.location || '13655 Rte 31 W, Albion, NY 14411'} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{priceStr}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailKey}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 8,
    marginLeft: 4,
  },
  backIcon: {
    width: 40,
    height: 40,
   },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BLUE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  timeline: {
    marginBottom: 24,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 14,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: GREEN,
  },
  timelineDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  timelineDotTextActive: {
    color: '#fff',
  },
  timelineLine: {
    width: 2,
    minHeight: 32,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineLineActive: {
    backgroundColor: GREEN,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: TEXT_DARK,
  },
  timelineDate: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BLUE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  serviceIcon: {
    fontSize: 24,
    marginRight: 12,
    color: CARD_BLUE,
  },
  serviceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: CARD_BLUE,
    textTransform: 'capitalize',
  },
  serviceSubtext: {
    fontSize: 13,
    color: '#0284C7',
    marginTop: 2,
  },
  recipientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailKey: {
    fontSize: 14,
    color: TEXT_DARK,
    fontWeight: '500',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 14,
    color: TEXT_MUTED,
    flex: 0.6,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
});
