import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import { handleLogout } from '../../../Api/apiRequest';

const MENU_ITEMS = [
  { key: 'earnings', label: 'Earnings', icon: imageIndex.earing, screen: ScreenNameEnum.DeliveryEarningsScreen },
  { key: 'payout', label: 'Payout History', icon: imageIndex.document, screen: ScreenNameEnum.DeliveryPayoutHistoryScreen },
  { key: 'documents', label: 'Documents', icon: imageIndex.document, screen: ScreenNameEnum.DeliveryDocumentsScreen },
];

const DeliveryProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await handleLogout(dispatch);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: ScreenNameEnum.ChooseRole }] })
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBarComponent barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Image source={imageIndex.back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Image source={imageIndex.userLogo} style={styles.avatarIcon} resizeMode="contain" />
          </View>
        </View>

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuRow}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Image source={imageIndex.right} style={styles.arrowIcon} resizeMode="contain" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.85}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { width: 44, height: 44,  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  avatarWrap: { alignItems: 'center', marginVertical: 24 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#22C55E',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { width: 56, height: 56, tintColor: '#94A3B8' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowOpacity: 0.08,
shadowRadius: 6,

// Android shadow
elevation: 4,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(3, 80, 147, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIcon: { width: 22, height: 22, tintColor: color.primary },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  arrowIcon: { width: 20, height: 20, tintColor: '#94A3B8' },
  logoutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: color.red,
    alignItems: 'center',
  },
  logoutBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

export default DeliveryProfileScreen;
