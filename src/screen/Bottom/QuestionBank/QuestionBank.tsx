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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { GetQuizByIdApi, QuizQuestion, SubmitQuizApi, SubmitQuizPayload, GetPyqByIdApi, SubmitPyqApi } from '../../../Api/apiRequest';
import CustomLoader from '../../../compoent/CustomLoader';
import { useSelector } from 'react-redux';
import { errorToast, successToast } from '../../../utils/customToast';

const TIMER_START = 45;

export default function QuestionBank() {
  const route = useRoute();
  const isFocused = useIsFocused();
  const { quiz_id, pyq_id } = (route.params as any) || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ question_index: number; selected_index: number }[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const userData = useSelector((state: any) => state.auth.userData);
  const userId = userData?._id ?? userData?.id ?? '';

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const totalQuestions = quizQuestions.length;
  const question = quizQuestions[currentIndex];
  const questionNumber = currentIndex + 1;

  useEffect(() => {
    if (quiz_id) {
      fetchQuiz();
    } else if (pyq_id) {
      fetchPyq();
    }
  }, [quiz_id, pyq_id]);

  useEffect(() => {
    let interval: any;
    if (isFocused && !loading) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocused, loading]);

  const fetchPyq = async () => {
    const res = await GetPyqByIdApi(pyq_id, setLoading);
    if (res && res.questions) {
      setQuizQuestions(res.questions);
    }
  };

  const fetchQuiz = async () => {
    const res = await GetQuizByIdApi(quiz_id, setLoading);
    if (res && res.data && res.data.questions) {
      const questions = res.data.questions;
      setQuizQuestions(questions);
      // const allowedTime = questions.length * 3;
      // setTotalTimeAllowed(allowedTime);
      // setTimeLeft(allowedTime);
    }
  };

  useEffect(() => {
    if (totalQuestions > 0) {
      Animated.timing(progressAnim, {
        toValue: questionNumber / totalQuestions,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, totalQuestions]);

  // useEffect(() => {
  //   if (totalTimeAllowed <= 0) return;

  //   const interval = setInterval(() => {
  //     setTimeLeft(prev => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         handleTimeOut();
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [totalTimeAllowed]);

  const handleTimeOut = () => {
    errorToast('Time is up! Submitting your answers.');
    handleSubmit(true); // Special flag for auto-submit
  };

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && selectedOption === null) {
      errorToast('Please select an option');
      return;
    }

    let updatedAnswers = [...userAnswers];
    if (selectedOption !== null) {
      const currentAnswer = {
        question_index: currentIndex,
        selected_index: selectedOption,
      };
      // Check if already answered (shouldn't happen with current flow but safe)
      if (!updatedAnswers.find(a => a.question_index === currentIndex)) {
        updatedAnswers.push(currentAnswer);
      }
    }

    if (!isAutoSubmit && currentIndex < totalQuestions - 1) {
      // Move to next question
      setUserAnswers(updatedAnswers);
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Submit Quiz
      if (quiz_id) {
        const payload: SubmitQuizPayload = {
          quiz_id: quiz_id,
          user_id: `${userId}`,
          answers: updatedAnswers,
          time_spent_seconds: timeSpent,
        };
        console.log(payload, 'payload')
        const res = await SubmitQuizApi(payload, setLoading);
        if (res) {
          successToast('Quiz submitted successfully!');
          (navigator as any).navigate(ScreenNameEnum.Explanation, {
            resultData: res,
          });
        }
      } else if (pyq_id) {
        const payload: SubmitPyqPayload = {
          pyq_id: pyq_id,
          user_id: `${userId}`,
          answers: updatedAnswers.map(a => ({
            question_no: a.question_index,
            selected_index: a.selected_index,
          })),
          time_spent_seconds: timeSpent,
        };
        const res = await SubmitPyqApi(payload, setLoading);
        if (res) {
          successToast('PYQ submitted successfully!');
          (navigator as any).navigate(ScreenNameEnum.Explanation, {
            resultData: res,
          });
        }
      }
    }
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
          onPress={() => navigator.goBack()}
        >
          <Image source={imageIndex.back}
            style={{
              height: 45,
              width: 44
            }}
          />
        </TouchableOpacity>

        <View style={styles.timerPill}>
          <View style={[styles.timerDot, { backgroundColor: '#7B2FBE' }]} />
          <Text style={[styles.timerText, { color: '#7B2FBE' }]}>
            {formatTime(timeSpent)}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>{questionNumber}/{totalQuestions}</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {!loading && question ? (
          <>
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
          </>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <CustomLoader message="Loading Quiz Details..." />
            ) : (
              <Text>No questions found for this quiz.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          activeOpacity={0.85}
          onPress={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>
              {currentIndex === totalQuestions - 1 ? 'Submit Quiz' : 'Next Question'}
            </Text>
          )}
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
    flex: 1,
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