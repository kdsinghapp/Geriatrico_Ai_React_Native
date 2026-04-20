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
import { useEffect } from 'react';
import { GetQuizzesApi, Quiz, GetPyqListApi, PyqPaper } from '../../../Api/apiRequest';
import CustomLoader from '../../../compoent/CustomLoader';

const DIFFICULTY_TABS = ['All', 'easy', 'medium', 'hard'];
const CATEGORIES = ['Material', 'Previous Year Question'];

const PyqCard = ({ item }: { item: PyqPaper }) => {
  const navigator = useNavigation();
  return (
    <View style={styles.card}>
      <View style={[styles.diffBadge, { backgroundColor: '#E3F2FD' }]}>
        <Text style={[styles.diffText, { color: '#1976D2' }]}>{item.year}</Text>
      </View>
      <Text style={styles.questionTitle}>{item.subject}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.attemptsRow}>
          <Image source={imageIndex.users}
            style={{
              height: 14,
              width: 14,
            }}
          />
          <Text style={styles.attemptsText}>{item.total_questions} Questions</Text>
        </View>
        <TouchableOpacity style={styles.solveBtn} activeOpacity={0.85}
          onPress={() => {
            (navigator as any).navigate(ScreenNameEnum.QuestionBank, { pyq_id: item.pyq_id })
          }}
        >
          <Image source={imageIndex.light}
            resizeMode='contain'
            style={{
              height: 20,
              width: 20,
            }} />
          <Text style={styles.solveBtnText}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const QuestionCard = ({ item }: { item: Quiz }) => {
  const difficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return { bg: '#E8F5E9', text: '#388E3C' };
      case 'medium':
        return { bg: '#FFF8E1', text: '#F9A825' };
      case 'hard':
        return { bg: '#FCE4EC', text: '#C62828' };
      default:
        return { bg: '#EDE7F6', text: '#6A0DAD' };
    }
  };
  const navigator = useNavigation()
  const diff = difficultyColor(item.level);
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <View style={[styles.diffBadge, { backgroundColor: diff.bg, marginBottom: 0 }]}>
          <Text style={[styles.diffText, { color: diff.text }]}>{item.level.charAt(0).toUpperCase() + item.level.slice(1)}</Text>
        </View>
        {item.topic && (
          <View style={[styles.diffBadge, { backgroundColor: '#E0F7F0', marginBottom: 0 }]}>
            <Text style={[styles.diffText, { color: '#10B981' }]}>{item.topic}</Text>
          </View>
        )}
      </View>
      <Text style={styles.questionTitle}>{item.quiz_name}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.attemptsRow}>
          {/* Person icon */}
          <Image source={imageIndex.users}
            style={{
              height: 14,
              width: 14,
            }}
          />
          <Text style={styles.attemptsText}>{item.total_questions} Questions</Text>
        </View>
        <TouchableOpacity style={styles.solveBtn} activeOpacity={0.85}
          onPress={() => {
            (navigator as any).navigate(ScreenNameEnum.QuestionBank, { quiz_id: item.quiz_id })
          }}
        >
          <Image source={imageIndex.light}
            resizeMode='contain'
            style={{
              height: 20,
              width: 20,
            }} />
          <Text style={styles.solveBtnText}>Solve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function QuestionBankScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('Material');
  const [searchText, setSearchText] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pyqs, setPyqs] = useState<PyqPaper[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeCategory === 'Material') {
      fetchQuizzes();
    } else {
      fetchPyqs();
    }
  }, [activeCategory]);

  const fetchQuizzes = async () => {
    const res = await GetQuizzesApi(setLoading);
    if (res && res.quizzes) {
      setQuizzes(res.quizzes);
    }
  };

  const fetchPyqs = async () => {
    const res = await GetPyqListApi(setLoading);
    if (res && res.papers) {
      setPyqs(res.papers);
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    const matchTab = activeTab === 'All' || q.level.toLowerCase() === activeTab.toLowerCase();
    const matchSearch = q.quiz_name.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  const filteredPyqs = pyqs.filter(p => {
    return p.subject.toLowerCase().includes(searchText.toLowerCase()) ||
           p.year.includes(searchText);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />

      <Text style={{
        fontSize: 18,
        color: "black",
        marginLeft: 11,
        fontWeight: "700"
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
                height: 22,
                width: 22,
                tintColor: "white"
              }} />

          </TouchableOpacity>
        </View>

      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Difficulty Tabs - Only show for Material */}
      {activeCategory === 'Material' && (
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
      )}

      {/* Question List */}
      <FlatList
        data={activeCategory === 'Material' ? filteredQuizzes : filteredPyqs}
        keyExtractor={item => (activeCategory === 'Material' ? (item as Quiz).quiz_id : (item as PyqPaper).pyq_id)}
        renderItem={({ item }) => (
          activeCategory === 'Material' 
            ? <QuestionCard item={item as Quiz} /> 
            : <PyqCard item={item as PyqPaper} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {loading && <CustomLoader message={`Loading ${activeCategory}...`} />}
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
    height: 45,
    width: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center"

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
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#ece9e9ff",
    // iOS Shadow
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: 6,

    // Android Shadow
    // elevation: 9,
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
    paddingBottom: 100
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
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 10,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryBtnActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  categoryTextActive: {
    color: '#fff',
  },
});