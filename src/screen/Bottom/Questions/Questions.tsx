import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
 
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

const QUESTIONS = [
  {
    id: '1',
    difficulty: 'Easy',
    title: 'What is the probability of getting a head when tossing a coin?',
    attempts: '2.3k attempts',
  },
  {
    id: '2',
    difficulty: 'Easy',
    title: 'Find the sum of first 100 natural numbers',
    attempts: '2.3k attempts',
  },
  {
    id: '3',
    difficulty: 'Medium',
    title: 'What is the probability of getting a head when tossing a coin?',
    attempts: '2.3k attempts',
  },
  {
    id: '4',
    difficulty: 'Hard',
    title: 'Solve the differential equation dy/dx = x² + y²',
    attempts: '1.1k attempts',
  },
  {
    id: '5',
    difficulty: 'Easy',
    title: 'What is the value of sin(90°)?',
    attempts: '3.5k attempts',
  },
];

const DIFFICULTY_TABS = ['All', 'Easy', 'Medium', 'Hard'];


const navigator = (screenName: string) => {
  // Implement your navigation logic here, e.g., using React Navigation
  console.log(`Navigate to: ${screenName}`);
};  
const QuestionCard = ({ item }: { item: (typeof QUESTIONS)[0] }) => {
  const difficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return { bg: '#E8F5E9', text: '#388E3C' };
    case 'Medium':
      return { bg: '#FFF8E1', text: '#F9A825' };
    case 'Hard':
      return { bg: '#FCE4EC', text: '#C62828' };
    default:
      return { bg: '#EDE7F6', text: '#6A0DAD' };
  }
};
const navigator = useNavigation()
  const diff = difficultyColor(item.difficulty);
  return (
    <View style={styles.card}>
      <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
        <Text style={[styles.diffText, { color: diff.text }]}>{item.difficulty}</Text>
      </View>
      <Text style={styles.questionTitle}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.attemptsRow}>
          {/* Person icon */}
          <Image source={imageIndex.users} 
          
          style={{
            height:14,
            width:14,
           }}
          />
          <Text style={styles.attemptsText}>{item.attempts}</Text>
        </View>
        <TouchableOpacity style={styles.solveBtn} activeOpacity={0.85} 
        onPress={()=>{
          navigator.navigate(ScreenNameEnum.FilterScreen)
        }}
        >
          <Image source={imageIndex.light}
           resizeMode='contain'
           style={{
            height:20,
            width:20,
            }} />
          <Text style={styles.solveBtnText}>Solve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function QuestionBankScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = QUESTIONS.filter(q => {
    const matchTab = activeTab === 'All' || q.difficulty === activeTab;
    const matchSearch = q.title.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
     <StatusBarComponent/>

      <Text style={{
        fontSize:18,
        color:"black" ,
        marginLeft:11 ,
        fontWeight:"700"
      }}>Questions</Text>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Question Bank Browse/Search questions"
            placeholderTextColor="#BDBDBD"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchIconBtn}>
           <Image source={imageIndex.search1} 
           resizeMode='contain'
           style={{
            height:22,  
            width:22,
            tintColor:"white"
           }} /> 
           
          </TouchableOpacity>
        </View>
      
      </View>

      {/* Difficulty Tabs */}
      <View style={styles.tabsRow}>
        {DIFFICULTY_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <QuestionCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const PURPLE = '#7625FE';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: PURPLE,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: 0.2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 14,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  searchIconBtn: {
   
    backgroundColor: PURPLE,  
    height:45,
    width:45,
    borderRadius:22.5,
    alignItems:"center",
    justifyContent:"center"

  },
  searchIcon: {
    fontSize: 14,
  },
  filterBtn: {
    backgroundColor: PURPLE,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
    color: '#fff',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 8,
   
  },
  tabBtn: {
  paddingHorizontal: 18,
paddingVertical: 7,
borderRadius: 20,
backgroundColor: '#fff',

// iOS Shadow
shadowColor: '#000',
shadowOffset: {
  width: 0,
  height: 2,
},
shadowOpacity: 0.08,
shadowRadius: 6,

// Android Shadow
elevation: 9,
  },
  tabBtnActive: {
    backgroundColor: PURPLE,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
     shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 10,
  },
  diffBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#251264',
     marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attemptsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  attemptsIcon: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  attemptsText: {
    fontSize: 12,
    color: '#7625FE',
    fontWeight: '500',
  },
  solveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 5,
  },
  solveBtnIcon: {
    fontSize: 13,
  },
  solveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});