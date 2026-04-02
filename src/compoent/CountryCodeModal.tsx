import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color } from '../constant';
 
interface CountryCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: any) => void;
}

const CountryCodeModal: React.FC<CountryCodeModalProps> = ({ visible, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setFilteredCountries(Constcounty);
    }
  }, [visible]);

  useEffect(() => {
    const filtered = Constcounty.filter((item) =>
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dial_code.includes(searchQuery)
    );
    setFilteredCountries(filtered);
  }, [searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalBg}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Select country</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country or code..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          <View style={styles.modalListWrap}>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => (
                <Pressable
                  style={[
                    styles.countryItem,
                    index === filteredCountries.length - 1 && styles.countryItemLast,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.countryName}>
                    {item.flag} {item.country} ({item.dial_code})
                  </Text>
                </Pressable>
              )}
            />
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? hp(3) : 20,
    paddingHorizontal: 20,
    maxHeight: hp(85),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: '#111827',
    fontSize: 14,
  },
  modalListWrap: {
    maxHeight: hp(50),
    marginBottom: 16,
  },
  countryItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  countryItemLast: {
    borderBottomWidth: 0,
  },
  countryName: {
    fontSize: 16,
    color: '#374151',
  },
  closeBtn: {
    backgroundColor: color.primary || '#035093',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CountryCodeModal;
