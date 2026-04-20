import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import StatusBarComponent from "../../compoent/StatusBarCompoent";
import CustomHeader from "../../compoent/CustomHeader";
import imageIndex from "../../assets/imageIndex";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenNameEnum from "../../routes/screenName.enum";

const FractionAnswer = ({ numerator, denominator, correct }: any) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={correct ? styles.answerValueCorrect : styles.answerValue}>
        {numerator}/{denominator}
      </Text>


    </View>
  );
};

export default function Explanation() {
  const [pressed, setPressed] = useState(false);
  const navigator = useNavigation();
  const route = useRoute();
  const {
    question,
    options,
    correct_index,
    selected_index,
    explanation,
    isLast,
    onNext,
    resultData,
    timeTaken // Added
  } = (route.params as any) || {};

  // If we have full result data, render the summary view
  if (resultData) {
    const {
      score,
      ai_insights,
      question_breakdown,
      quiz_name,
      topic,
      breakdown
    } = resultData;

    const finalBreakdown = question_breakdown || breakdown

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBarComponent />
        <CustomHeader
          label="Explanation"
          leftPress={() => navigator.goBack()}
        />

        <View style={styles.screen}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>

            {/* Main Result Card (Matching Screenshot style) */}
            <View style={styles.screenshotCard}>
              <View style={styles.successCircle}>
                <Text style={{ fontSize: 30 }}>✅</Text>
              </View>

              <Text style={styles.screenshotCorrectText}>
                {score.percentage >= 50 ? "Correct! 🎉" : "Keep Improving! 💪"}
              </Text>
              <Text style={styles.screenshotSubText}>
                Great job on completing the quiz
              </Text>

              <View style={styles.screenshotAnswerRow}>
                <View style={styles.screenshotAnswerBox}>
                  <Text style={styles.screenshotAnswerLabel}>Total Questions</Text>
                  <Text style={styles.screenshotAnswerValue}>{score.total_questions}</Text>
                </View>
                <View style={styles.screenshotAnswerBox}>
                  <Text style={styles.screenshotAnswerLabel}>Score (%)</Text>
                  <Text style={styles.screenshotAnswerValue}>{score.percentage}%</Text>
                </View>
              </View>
            </View>

            {/* AI Explanation Card (Matching Screenshot style) */}
            <View style={styles.screenshotAiCard}>
              <View style={styles.screenshotAiHeader}>
                <Image source={imageIndex.light} style={styles.robotIcon} />
                <Text style={styles.screenshotAiTitle}>AI Explanation</Text>
              </View>
              <Text style={styles.screenshotAiBody}>{ai_insights}</Text>
            </View>

            {/* Performance Insights (Matching Screenshot style) */}
            <View style={styles.screenshotPerfCard}>
              <Text style={styles.screenshotPerfTitle}>Performance Insights</Text>
              <View style={[styles.screenshotPerfStat, { backgroundColor: '#F3EAFB' }]}>
                <Text style={styles.screenshotPerfStatLabel}>Total Correct</Text>
                <Text style={styles.screenshotPerfStatValue}>{score.correct}</Text>
              </View>
            </View>

            {/* Questions Breakdown */}
            <Text style={styles.breakdownTitle}>Question Breakdown</Text>
            {finalBreakdown?.map((item: any, index: number) => (
              <View key={index} style={[styles.questionItem, { borderLeftColor: item.is_correct ? "#22C55E" : "#EF4444" }]}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionIndex}>Question {index + 1}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.is_correct ? "#E8F5E9" : "#FFEBEE" }]}>
                    <Text style={[styles.statusText, { color: item.is_correct ? "#2E7D32" : "#C62828" }]}>
                      {item.is_correct ? "Correct" : "Incorrect"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.breakdownQuestionText}>{item.question}</Text>

                <View style={styles.breakdownAnswers}>
                  <View style={styles.breakdownAnswerRow}>
                    <Text style={styles.breakdownLabel}>Your Answer: </Text>
                    <Text style={[styles.breakdownValue, { color: item.is_correct ? "#2E7D32" : "#C62828" }]}>
                      {item.your_answer}
                    </Text>
                  </View>
                  {!item.is_correct && (
                    <View style={styles.breakdownAnswerRow}>
                      <Text style={styles.breakdownLabel}>Correct Answer: </Text>
                      <Text style={[styles.breakdownValue, { color: "#2E7D32" }]}>{item.correct_answer}</Text>
                    </View>
                  )}
                </View>

                {/* Question Explanation */}
                {item.explanation && (
                  <View style={styles.breakdownExplanationCard}>
                    <Text style={styles.breakdownExplanationTitle}>🎓 Explanation:</Text>
                    <Text style={styles.breakdownExplanationText}>{item.explanation}</Text>
                  </View>
                )}
              </View>
            ))}

          </ScrollView>

          <View style={styles.bottomActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (navigator as any).navigate(ScreenNameEnum.BottomTabNavigator)}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryText}>Back to Question Bank</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Fallback to single question explanation view
  const isCorrect = correct_index === selected_index;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader
        label="Explanation"
        leftPress={() => (navigator as any).navigate(ScreenNameEnum.Questions)}
      />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* Result Card */}
          <View style={[styles.resultCard, { borderColor: isCorrect ? "#22C55E" : "#EF4444", borderWidth: 1 }]}>
            <View style={{
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={[styles.correctText, {
                textAlign: "center",
                color: isCorrect ? "#22C55E" : "#EF4444"
              }]}>
                {isCorrect ? "Correct! 🎉" : "Incorrect! ❌"}
              </Text>
            </View>

            <Text style={styles.subText}>
              {isCorrect ? "Great job on getting it right" : "Don't worry, keep learning!"}
            </Text>

            <View style={styles.answerRow}>
              <View style={styles.answerBox}>
                <Text style={[styles.answerLabel, { textAlign: "center" }]}>Correct answer</Text>
                <Text style={styles.answerValueCorrect}>{options?.[correct_index]}</Text>
              </View>

              {!isCorrect && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerLabel}>Your answer</Text>
                  <Text style={[styles.answerValue, { color: "#EF4444" }]}>{options?.[selected_index]}</Text>
                </View>
              )}
            </View>
          </View>

          {/* AI Explanation */}
          <View style={styles.aiCard}>
            <Text style={[styles.aiTitle, { marginTop: 8 }]}>🤖 AI Explanation</Text>
            <Text style={styles.aiBody}>{explanation}</Text>
          </View>

          {/* Performance Insight (Optional) */}
          <View style={styles.perfCard}>
            <Text style={styles.perfTitle}>Performance Insights</Text>
            <View style={styles.perfRow}>
              <View style={styles.perfStat}>
                <Text style={styles.perfStatLabel}>Status</Text>
                <Text style={[styles.perfStatValue, { color: isCorrect ? "#22C55E" : "#EF4444" }]}>
                  {isCorrect ? "Mastered" : "Review Needed"}
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigator.goBack();
              onNext?.();
            }}
            style={[
              styles.primaryBtn,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.primaryText}>{isLast ? "Finish Quiz" : "Next Question"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => (navigator as any).navigate(ScreenNameEnum.Questions)}
          >
            <Text style={styles.secondaryBtn}>
              Back to Question Store
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 50,
    backgroundColor: "#EEF0F6",
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "700",
  },

  scrollContent: {
    padding: 18,
  },

  // RESULT CARD
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  correctText: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "800",
  },
  subText: {
    color: "black",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 15,
    marginTop: 5
  },

  answerRow: {
    flexDirection: "row",
    gap: 10,
  },
  answerBox: {
    flex: 1,
    backgroundColor: "#FBF6FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  answerLabel: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 5
  },

  answerValue: {
    fontSize: 24,
    color: "#111",
    fontWeight: "bold",
    textAlign: "center"

  },
  answerValueCorrect: {
    fontSize: 24,
    color: "#7C6FFF",
    fontWeight: "bold",
    textAlign: "center"
  },

  fractionLine: {
    height: 2,
    backgroundColor: "#DDD",
    width: "100%",
    marginVertical: 4,
    textAlign: "center"

  },
  fractionLineCorrect: {
    height: 2,
    backgroundColor: "#7C6FFF",
    width: "100%",
    marginVertical: 4,
  },

  // AI CARD
  aiCard: {
    backgroundColor: "#FBF6FF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  aiTitle: {
    color: "#111",
    fontWeight: "700",
    marginBottom: 8,
  },
  aiBody: {
    color: "black",
    fontSize: 14,
    marginTop: 5
  },
  highlight: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15
  },

  formulaBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  formulaText: {
    color: "#333",
  },
  formulaLabel: {
    color: "#7C6FFF",
    fontWeight: "bold",
  },

  // PERFORMANCE
  perfCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 13,
  },
  perfTitle: {
    color: "#111",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 16
  },

  perfRow: {
    flexDirection: "row",
    gap: 10,
  },
  perfStat: {
    flex: 1,
    backgroundColor: "#FBF6FF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  perfStatLabel: {
    color: "black",
    fontSize: 15,
    fontWeight: "600"
  },
  perfStatValue: {
    color: "#7625FE",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 6
  },

  suggestionBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },

  // BUTTONS
  bottomActions: {
    padding: 16,
    backgroundColor: "#F8F9FB",
  },
  primaryBtn: {
    backgroundColor: "#7C6FFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15

  },
  secondaryBtn: {
    color: "black",
    textAlign: "center",
    fontSize: 17
  },

  // SCREENSHOT MATCHING STYLES
  screenshotCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  successCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  checkIcon: {
    width: 30,
    height: 30,
    tintColor: "#22C55E",
  },
  screenshotCorrectText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  screenshotSubText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  screenshotAnswerRow: {
    flexDirection: "row",
    gap: 12,
  },
  screenshotAnswerBox: {
    flex: 1,
    backgroundColor: "#FBF6FF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  screenshotAnswerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7625FE",
    marginBottom: 8,
    textAlign: "center",
  },
  screenshotAnswerValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#7625FE",
  },

  screenshotAiCard: {
    backgroundColor: "#FBF6FF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  screenshotAiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  robotIcon: {
    width: 28,
    height: 28,
  },
  screenshotAiTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  screenshotAiBody: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  screenshotPerfCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  screenshotPerfTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 20,
  },
  screenshotPerfStat: {
    backgroundColor: "#FBF6FF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  screenshotPerfStatLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  screenshotPerfStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#7625FE",
  },

  // NEW STYLES for Result Summary
  scoreHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  quizNameText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#251264",
    textAlign: "center",
  },
  topicText: {
    fontSize: 14,
    color: "#7625FE",
    fontWeight: "600",
    marginTop: 4,
  },
  scoreRingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBF6FF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    marginTop: 2,
  },

  // Breakdown Styles
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#251264",
    marginTop: 24,
    marginBottom: 16,
    paddingLeft: 4,
  },
  questionItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionIndex: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  breakdownQuestionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 22,
    marginBottom: 12,
  },
  breakdownAnswers: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  breakdownAnswerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  breakdownLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  breakdownExplanationCard: {
    marginTop: 12,
    backgroundColor: "#FBF6FF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  breakdownExplanationTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#7625FE",
    marginBottom: 4,
  },
  breakdownExplanationText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
    fontWeight: "500",
  },
});