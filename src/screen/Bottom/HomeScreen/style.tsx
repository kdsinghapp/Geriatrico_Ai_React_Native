import { StyleSheet } from 'react-native';
import { color } from '../../../constant';

const HEADER_BG = '#035093';
const GREEN = '#22C55E';
const LIGHT_BG = '#E4EDF8';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 100,
  },
  menuBtn: { padding: 4 },
  menuIcon: { width: 24, height: 24, tintColor: '#fff' },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 20, color: '#fff', fontWeight: '800' },
  headerSubtitle: { fontSize: 13, color: '#fff', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idText: { fontSize: 14, color: '#64748B' },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: LIGHT_BG,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: color.primary },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  balanceLabel: { fontSize: 14, color: '#64748B' },
  balanceValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  tasksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  taskItem: {
    alignItems: 'center',
    flex: 1,
  },
  taskCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCircleDone: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  taskIcon: { fontSize: 22 },
  taskLabel: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  getStartedBtn: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  getStartedText: { fontSize: 17, color: '#fff', fontWeight: '700' },
});
