import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import StatusBarComponent from "../../compoent/StatusBarCompoent";
import CustomHeader from "../../compoent/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const FractionAnswer = ({ numerator, denominator, correct }:any) => {
  return (
    <View style={{ alignItems: "center"  , justifyContent:"center"}}>
      <Text style={correct ? styles.answerValueCorrect : styles.answerValue}>
        {numerator}/{denominator}
      </Text>

       
    </View>
  );
};

export default function Explanation() {
  const [pressed, setPressed] = useState(false);
const navigator = useNavigation()
  return (
    <SafeAreaView style={styles.safeArea}>
      
       <StatusBarComponent />
      <CustomHeader label="Explanation" />

      <View style={styles.screen}>

        

        <ScrollView 
        
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

          {/* Result Card */}
          <View style={styles.resultCard}>
            <View style={{
              justifyContent:"center" ,
              alignItems:"center"
            }}>
              <Text style={[styles.correctText,{
                textAlign:"center"
              }]}>Correct! 🎉</Text>
            </View>

            <Text style={styles.subText}>
              Great job on getting it right
            </Text>

            <View style={styles.answerRow}>
              <View style={styles.answerBox}>
                <Text style={[styles.answerLabel,{
                  textAlign:"center"
                }]}>Correct answer</Text>
                <FractionAnswer numerator="1" denominator="2" />
              </View>

              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>Your answer</Text>
                <FractionAnswer numerator="1" denominator="2" correct />
              </View>
            </View>
          </View>

          {/* AI Explanation */}
          <View style={styles.aiCard}>
            <Text style={[styles.aiTitle,{
              marginTop:8
            }]}>🤖 AI Explanation</Text>

            <Text style={styles.aiBody}>
              Since a fair coin has two outcomes and both are equally likely,
              probability of heads is{" "}
              <Text style={styles.highlight}>1/2 or 50%</Text>.
            </Text>

            <View style={styles.formulaBox}>
              <Text style={styles.formulaText}>
                P(Event) = Favorable outcomes / Total outcomes
              </Text>
              <Text style={styles.formulaLabel}>P(Heads) = 1/2</Text>
            </View>
          </View>

          {/* Performance */}
          <View style={styles.perfCard}>
            <Text style={styles.perfTitle}>Performance Insights</Text>

            <View style={styles.perfRow}>
              <View style={styles.perfStat}>
                <Text style={styles.perfStatLabel}>Time taken</Text>
                <Text style={styles.perfStatValue}>12 sec</Text>
              </View>

              
            </View>
            <View style={[styles.perfRow,{
              marginTop:11
            }]}>
              <View style={styles.perfStat}>
                <Text style={styles.perfStatLabel}>Suggestion</Text>
                <Text style={styles.perfStatValue}> Try more similar questions</Text>
              </View>

              
            </View>

            
          </View>

        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            style={[
              styles.primaryBtn,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.primaryText}>Next Question</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          
          onPress={()=> navigator.goBack()}
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
    textAlign:"center" ,
    fontSize:15 ,
    marginTop:5
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
    alignItems:"center",
    justifyContent:"center"
  },
  answerLabel: {
    color: "black",
    fontSize: 15,
    textAlign:"center",
    fontWeight:"500" ,
    marginBottom:5
  },

  answerValue: {
    fontSize: 24,
    color: "#111",
    fontWeight: "bold",
        textAlign:"center"

  },
  answerValueCorrect: {
    fontSize: 24,
    color: "#7C6FFF",
    fontWeight: "bold",
    textAlign:"center"
  },

  fractionLine: {
    height: 2,
    backgroundColor: "#DDD",
    width: "100%",
    marginVertical: 4,
        textAlign:"center"

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
    marginTop:5
  },
  highlight: {
    color: "black",
    fontWeight: "bold",
    fontSize:15
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
    textAlign:"center",
    fontSize:16
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
    fontWeight:"600"
  },
  perfStatValue: {
    color: "#7625FE",
    fontWeight: "bold",
    fontSize: 18,
    marginTop:5,
    marginBottom:6
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
        fontSize:15

  },
  secondaryBtn: {
    color: "black",
    textAlign: "center",
    fontSize:17
  },
});