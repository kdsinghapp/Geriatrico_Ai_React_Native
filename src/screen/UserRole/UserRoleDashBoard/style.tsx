import { StyleSheet } from "react-native";

const HEADER_BG = "#035093";
const CARD_BLUE = "#035093";
const RED = "#EF4444";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: HEADER_BG,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 90,
  },
  menuBtn: {
    padding: 4,
  },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 28,
    height: 28,
  },
  notifBtn: {
    position: "relative",
    padding: 8,
  },
  notifIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RED,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
    marginBottom: 14,
  },
  quickActionsRow: {
    flexDirection: "row",
    marginBottom: 24,

    justifyContent: "space-between" ,
   },
  quickActionCardBlue: {
    flex: 1,
    backgroundColor: CARD_BLUE,
    borderRadius: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
        margin:5

  },
  quickActionCardWhite: {
    flex: 1,
    backgroundColor: "#fff",    margin:5
,
    borderRadius: 14,
     borderColor: "#E5E7EB",
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    width:100,
     // Shadow (iOS)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,

  // Elevation (Android)
  elevation: 4,
   },
  quickActionIconWhite: {
    width: 36,
    height: 36,
    tintColor: "#fff",
    marginBottom: 8,
  },
  quickActionIconBlue: {
    width: 36,
    height: 36,
    tintColor: CARD_BLUE,
    marginBottom: 8,
  },
  quickActionTextWhite: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  quickActionTextBlue: {
    fontSize: 14,
    color: CARD_BLUE,
    fontWeight: "700",
    textAlign: "center",
  },
  orderCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',

    marginBottom: 20,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderLeft: {},
  orderId: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
  },
  instantText: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    marginTop: 4,
  },
  orderRight: {
    alignItems: "flex-end",
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusTagText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  viewDetailsWrap: {
    paddingVertical: 2,
  },
  viewDetailsText: {
    fontSize: 13,
    color: CARD_BLUE,
    fontWeight: "600",
  },
  orderSeparator: {
    height: 12,
  },
  emptyOrders: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
});

export default styles;
