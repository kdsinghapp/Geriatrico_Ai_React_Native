import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import { color } from "../constant";

const VehicleCard = ({ item, selected, onSelect }: { item: any; selected: string; onSelect: (id: string) => void }) => {

  console.log("item",item)
  const isSelected = selected === item._id || selected === item.id;
  const title = item.name || item.title || "Vehicle";
  const subtitle = item.description || item.subtitle || "Standard";
  const imageSource = item.image || item.icon_url;
  const iconSource = typeof imageSource === "string" ? { uri: imageSource } : imageSource;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
      onPress={() => onSelect(item._id || item.id)}
    >
      <View style={styles.iconContainer}>
        {iconSource ? (
          <Image source={iconSource} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.icon}>{item.icon || "🚗"}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isSelected && styles.selectedText]}>{title}</Text>
        <Text style={[styles.subtitle, isSelected && styles.selectedSubtext]}>{subtitle}</Text>
      </View>

      {(item.recommended || item.isRecommended) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>
      )}

      {isSelected && (
        <View style={styles.checkIcon}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
     position: "relative",
  },
  selectedCard: {
    borderColor: color.primary,
    backgroundColor: "#F9FBFF",
  },
  iconContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  icon: {
    fontSize: 40,
  },
  content: {
    alignItems: "flex-start",
  },
  title: {
    color: "#333",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  selectedText: {
    color: color.primary,
  },
  subtitle: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedSubtext: {
    color: "#4A6E91",
  },
  badge: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: color.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});