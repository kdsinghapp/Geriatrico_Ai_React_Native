import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
 
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNameEnum from '../../../routes/screenName.enum';

const { width } = Dimensions.get('window');

const questions = [
  {
    id: 1,
    question: 'A coin is tossed once. What is the probability of getting heads?',
    options: ['1/4', '1/2', '3/4', '1'],
    correct: 1,
  },
  {
    id: 2,
    question: 'What is the value of π (pi) rounded to 2 decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correct: 1,
  },
  {
    id: 3,
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '13'],
    correct: 2,
  },
];

const TOTAL = 10;
const TIMER_START = 45;

export default function QuestionBank() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const question = questions[currentIndex % questions.length];
  const questionNumber = currentIndex + 1;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: questionNumber / TOTAL,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    setTimeLeft(TIMER_START);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    navigator.navigate(ScreenNameEnum.Explanation)
    // if (selectedOption === null) return;

    // Animated.parallel([
    //   Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    //   Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    // ]).start(() => {
    //   setCurrentIndex(prev => prev + 1);
    //   setSelectedOption(null);
    //   slideAnim.setValue(30);
    //   Animated.parallel([
    //     Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    //     Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    //   ]).start();
    // });
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const timerColor = timeLeft <= 10 ? '#FF4D4D' : '#7B2FBE';
const navigator = useNavigation()
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}
        
        onPress={()=>navigator.goBack()}
        >
          <Image source={imageIndex.back} 
          
          style={{
            height:45,
            width:44
          }}
          />
        </TouchableOpacity>

        <View style={styles.timerPill}>
          <View style={[styles.timerDot, { backgroundColor: timerColor }]} />
          <Text style={[styles.timerText, { color: timerColor }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>{questionNumber}/{TOTAL}</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      {/* Question Card */}
      <Animated.View
        style={[
          styles.questionCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.questionText}>{question.question}</Text>
      </Animated.View>

      {/* Options */}
      <Animated.View
        style={[
          styles.optionsContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              style={[
                styles.optionBtn,
                isSelected && styles.optionBtnSelected,
              ]}
              onPress={() => handleOptionSelect(index)}
            >
              <View style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextSelected]}>
                  {optionLabels[index]}
                </Text>
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, ]}
          // style={[styles.submitBtn, selectedOption === null && styles.submitBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit Answer</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative background blobs */}
     
    </SafeAreaView>
  );
}

const PURPLE = '#7625FE';
const PURPLE_LIGHT = '#F3EAFB';
const PURPLE_MID = '#7625FE';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
 
     alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: PURPLE,
    fontWeight: '700',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  timerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Progress
  progressSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#D5BDFE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PURPLE,
    borderRadius: 10,
  },

  // Question
  questionCard: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    shadowColor: PURPLE,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: PURPLE,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    lineHeight: 27,
    letterSpacing: -0.2,
  },

  // Options
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  optionBtnSelected: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
 
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  optionLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: PURPLE,
  },
  optionLabelTextSelected: {
    color: '#fff',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  submitBtn: {
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    
  },
  submitBtnDisabled: {
    backgroundColor: '#C4A8E0',
  
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Decorative
  blobBottomRight: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: PURPLE_LIGHT,
    opacity: 0.5,
    zIndex: -1,
  },
  blobTopLeft: {
    position: 'absolute',
    top: 60,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EDE0FA',
    opacity: 0.4,
    zIndex: -1,
  },
});