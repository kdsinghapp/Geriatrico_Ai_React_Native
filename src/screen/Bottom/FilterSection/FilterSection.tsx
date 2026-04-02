import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
   StatusBar,
  Platform,
} from 'react-native';
import CustomHeader from '../../../compoent/CustomHeader';
import { s } from '../../../utils/Constant';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#7625FE',
  primaryLight: '#EDE7FB',
  background: '#F7F7F7',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#888888',
  border: '#E8E8E8',
  chipBg: '#EFEFEF',
};

const FilterSection = ({ title, options, selected, onSelect, multiSelect = false }) => {
  const handlePress = (value) => {
    if (multiSelect) {
      if (selected.includes(value)) {
        onSelect(selected.filter((v) => v !== value));
      } else {
        onSelect([...selected, value]);
      }
    } else {
      onSelect(value);
    }
  };

  const isSelected = (value) =>
    multiSelect ? selected.includes(value) : selected === value;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.chip,
              isSelected(option) && styles.chipSelected,
            ]}
            onPress={() => handlePress(option)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipText,
                isSelected(option) && styles.chipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function FilterScreen() {
    const navigation = useNavigation();
  const [selectedYears, setSelectedYears] = useState(['2018']);
  const [difficulty, setDifficulty] = useState('Easy');
  const [questionType, setQuestionType] = useState('Abs Questions');
  const [topic, setTopic] = useState('Algebra');
  const [practice, setPractice] = useState('Practice By Exam');

  const handleApply = () => {
    const filters = {
      years: selectedYears,
      difficulty,
      questionType,
      topic,
      practice,
    };
    navigation.navigate(ScreenNameEnum.QuestionBank);
    console.log('Applied Filters:', filters);
    // navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

                    <CustomHeader label="Filter"   />
    

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FilterSection
          title="Year"
          options={['2018', '2019', '2020', '2021']}
          selected={selectedYears}
          onSelect={setSelectedYears}
          multiSelect
        />

        <View style={styles.divider} />

        <FilterSection
          title="Difficulty"
          options={['Easy', 'Medium', 'Hard']}
          selected={difficulty}
          onSelect={setDifficulty}
        />

        <View style={styles.divider} />

        <FilterSection
          title="Type Of Question"
          options={['Abs Questions', 'For The Exams']}
          selected={questionType}
          onSelect={setQuestionType}
        />

        <View style={styles.divider} />

        <FilterSection
          title="Topic"
          options={['Algebra', 'Probability']}
          selected={topic}
          onSelect={setTopic}
        />

        <View style={styles.divider} />

        <FilterSection
          title="Practice"
          options={['Practice By Exam', 'AI Smart Practice']}
          selected={practice}
          onSelect={setPractice}
        />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: -1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 36,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Section
  section: {
    paddingVertical: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // Chip
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
 
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: -20,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: COLORS.white,
 
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});