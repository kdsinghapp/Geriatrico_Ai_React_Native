import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
 import { DrawerActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import imageIndex from "../../../assets/imageIndex";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { STATUS, STATUS_LABELS } from "../../../utils/Constant";
import useUserDashboard from "./useUserDashboard";
import styles from "./style";

const CARD_BLUE = "#035093";
const GREEN = "#22C55E";
const ORANGE = "#EAB308";
const RED = "#EF4444";

const UserRoleDashBoard = () => {
  const { navigation, isLoading, orderData } = useUserDashboard();
  const nav = navigation as any;

  const openDrawer = () => {
    navigation.navigate(ScreenNameEnum.setting);
    // navigation.dispatch(DrawerActions.openDrawer());
  };

  const lastOrders = useMemo(() => {
    if (!orderData?.length) return [];
    return [...orderData].slice(0, 20);
  }, [orderData]);

  const getStatusLabel = (status: string) => {
    if (status === STATUS.DELIVERED || status === STATUS.COMPLETED) return "Delivered";
    if (
      status === STATUS.ON_THE_WAY ||
      status === STATUS.PICKED_UP ||
      status === STATUS.ASSIGNED ||
      status === STATUS.GOING_TO_PICKUP ||
      status === STATUS.ARRIVING
    )
      return "Transit";
    return STATUS_LABELS[status] || status;
  };

  const getStatusColor = (status: string) => {
    if (status === STATUS.DELIVERED || status === STATUS.COMPLETED) return GREEN;
    if (status === STATUS.PENDING) return ORANGE;
    if (
      status === STATUS.ON_THE_WAY ||
      status === STATUS.PICKED_UP ||
      status === STATUS.ASSIGNED ||
      status === STATUS.GOING_TO_PICKUP ||
      status === STATUS.ARRIVING
    )
      return CARD_BLUE;
    if (status === STATUS.CANCELLED) return RED;
    return ORANGE;
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusLabel = getStatusLabel(item.deliveryStatus);
    const statusColor = getStatusColor(item.deliveryStatus);
    const orderId = item.trackingId || `ORD${(item.id || "---").slice(-6)}`;

    return (
      <TouchableOpacity style={styles.orderCard}
                    onPress={() => nav.navigate(ScreenNameEnum.SendPackage, { item })}

      >
        <View style={styles.orderRow}>
          <View style={styles.orderLeft}>
            <Text style={styles.orderId}>{orderId}</Text>
            <Text style={styles.instantText}>Instant</Text>
          </View>
          <View style={styles.orderRight}>
            <View style={[styles.statusTag, { backgroundColor: statusColor }]}>
              <Text style={styles.statusTagText}>{statusLabel}</Text>
            </View>
            <TouchableOpacity
              onPress={() => nav.navigate(ScreenNameEnum.ViewDetails, { item })}
              style={styles.viewDetailsWrap}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBarComponent backgroundColor={CARD_BLUE} />

      {/* Header: menu, BS logo, notification */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={openDrawer}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Image
            source={imageIndex.menus}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => nav.navigate(ScreenNameEnum.NotificationsScreen)}
        >
          <Image
            source={imageIndex.Notification}
            style={styles.notifIcon}
            resizeMode="contain"
          />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionCardBlue}
            onPress={() => nav.navigate(ScreenNameEnum.SendPackage)}
            activeOpacity={0.85}
          >
            <Image
              source={imageIndex.document}
              style={styles.quickActionIconWhite}
              resizeMode="contain"
            />
            <Text style={styles.quickActionTextWhite}>Send a Package</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCardWhite}
            onPress={() => nav.navigate(ScreenNameEnum.MyOrder)}
            // onPress={() => nav.navigate(ScreenNameEnum.ViewOrders)}
            activeOpacity={0.85}
          >
            <Image
              source={imageIndex.document}
              style={styles.quickActionIconBlue}
              resizeMode="contain"
            />
            <Text style={styles.quickActionTextBlue}>My Order</Text>
          </TouchableOpacity>
        </View>

        {/* Last Orders */}
        <Text style={styles.sectionTitle}>Last Orders</Text>
        <FlatList
          data={lastOrders}
          keyExtractor={(item) => item.id || String(Math.random())}
          renderItem={renderOrderItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyOrders}>No orders yet</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.orderSeparator} />}
        />
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserRoleDashBoard;
