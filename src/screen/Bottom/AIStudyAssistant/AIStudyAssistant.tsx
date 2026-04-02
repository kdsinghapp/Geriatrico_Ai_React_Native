// AIStudyAssistant.tsx
// React Native — AI Study Assistant Chat UI
//
// Setup:
//   npm install react-native-linear-gradient react-native-svg
//   npx pod-install   (iOS only)
//
// Replace YOUR_API_KEY below with your Anthropic API key.
// ──────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Config ───────────────────────────────────────────────
const API_KEY = 'YOUR_API_KEY'; // ← replace with your key
const MODEL = 'claude-sonnet-4-20250514';
const SYSTEM =
  'You are an AI Study Assistant that answers questions based on uploaded study material. ' +
  'Be concise and educational. Reference "your study material" when relevant. ' +
  'Keep answers short and student-friendly.';

// ─── Theme ────────────────────────────────────────────────
const C = {
  purple: '#7C3AED',
  lightPurple: '#8B5CF6',
  bg: '#F9F9F9',
  white: '#FFFFFF',
  grayText: '#333333',
  timestamp: '#AAAAAA',
  inputBg: '#F5F0FF',
  iconBg: '#F3EEFF',
  borderLight: '#F0EAFF',
  bubbleBorder: '#EFEFEF',
};

// ─── Types ────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

// ─── Helpers ──────────────────────────────────────────────
const getNow = (): string => {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: 'user', text: 'What is photosynthesis', time: '11:31 AM' },
  {
    id: 2, role: 'bot',
    text: 'Photosynthesis is a process in which plants use sunlight, carbon dioxide, and water to produce glucose and release oxygen. This is covered in Chapter 2 of your Biology Notes.pdf.',
    time: '11:35 AM',
  },
  { id: 3, role: 'user', text: 'Explain in simple words', time: '11:36 AM' },
  { id: 4, role: 'bot', text: 'In simple terms: plants make their own food using sunlight.', time: '11:36 AM' },
];

// ─── BotAvatar ────────────────────────────────────────────
const BotAvatar: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <View style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2 }]}>
    <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="20" fill={C.purple} />
      <Path d="M20 8C20 8 14 14 14 20C14 26 20 32 20 32C20 32 26 26 26 20C26 14 20 8 20 8Z" fill="white" opacity={0.9} />
      <Path d="M8 20C8 20 14 14 20 14C26 14 32 20 32 20C32 20 26 26 20 26C14 26 8 20 8 20Z" fill="white" opacity={0.5} />
    </Svg>
  </View>
);

// ─── SendIcon ─────────────────────────────────────────────
const SendIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── UserBubble ───────────────────────────────────────────
const UserBubble: React.FC<{ text: string; time: string }> = ({ text, time }) => (
  <View style={styles.userRow}>
    <View>
      <LinearGradient
        colors={[C.purple, C.lightPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.userBubble, {
          height: 60
        }]}
      >
        <Text style={styles.userText}>{text}</Text>
      </LinearGradient>
      <View style={styles.userMeta}>
        <Text style={styles.timestamp}>{time}</Text>
        <Text style={styles.ticks}> ✓✓</Text>
      </View>
    </View>
  </View>
);

// ─── BotBubble ────────────────────────────────────────────
const BotBubble: React.FC<{ text: string; time: string }> = ({ text, time }) => (
  <View style={styles.botRow}>
    <Image source={imageIndex.app2}

      style={{
        height: 22,
        width: 22
      }}
    />
    <View style={{ flex: 1 }}>
      <View style={styles.botBubble}>
        <Text style={styles.botText}>{text}</Text>
      </View>
      <Text style={styles.timestamp}>{time}</Text>
    </View>
  </View>
);

// ─── TypingIndicator ──────────────────────────────────────
const TypingIndicator: React.FC = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
          Animated.delay(600),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.botRow}>
      <BotAvatar size={32} />
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────
const AIStudyAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const scrollToBottom = () => listRef.current?.scrollToEnd({ animated: true });

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text, time: getNow() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build conversation history for the API (user/assistant turns only)
    const history = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }));

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1000,
          system: SYSTEM,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply: string = data?.content?.[0]?.text ?? "Sorry, I couldn't find an answer.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply, time: getNow() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Something went wrong. Please try again.',
        time: getNow(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) =>
    item.role === 'user'
      ? <UserBubble text={item.text} time={item.time} />
      : <BotBubble text={item.text} time={item.time} />;
  // : <BotBubble  text={item.text} time={item.time} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={styles.header}>
        <Image source={imageIndex.app2} />
        <Text style={styles.headerTitle}>AI Study Assistant</Text>
        <Text style={styles.headerSub}>Answers based on your uploaded material</Text>
      </View>

      {/* Chat + Input */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={listRef}
          data={messages}
          // data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          ListFooterComponent={loading ? <TypingIndicator /> : null}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything from your study..."
              placeholderTextColor={C.timestamp}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={send}
            />

          </View>

          <TouchableOpacity onPress={send} disabled={loading || !input.trim()} activeOpacity={0.8}>
            <LinearGradient
              colors={loading || !input.trim() ? ['#C4A7F7', '#C4A7F7'] : [C.purple, C.lightPurple]}
              style={styles.sendBtn}
            >
              {loading
                ? <ActivityIndicator color={C.white} size="small" />
                : <SendIcon />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 16,

  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.3, marginTop: 6 },
  headerSub: { fontSize: 12, color: '#888888', fontWeight: '500' },

  // Avatar
  avatarWrap: { backgroundColor: C.iconBg, alignItems: 'center', justifyContent: 'center' },

  // List
  list: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 8 },

  // User
  userRow: {


    flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 14, paddingLeft: 48
  },
  userBubble: {
    borderRadius: 18, borderBottomRightRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10, maxWidth: 240,

  },
  userText: { color: C.white, fontSize: 14.5, fontWeight: '600', lineHeight: 20 },
  userMeta: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 3 },
  ticks: { color: C.lightPurple, fontSize: 11 },

  // Bot
  botRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14, paddingRight: 48, gap: 8 },
  botBubble: {
    backgroundColor: C.white,
    borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10, maxWidth: 260,
    borderWidth: 1, borderColor: C.bubbleBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  botText: { color: C.grayText, fontSize: 14, lineHeight: 21 },
  timestamp: { color: C.timestamp, fontSize: 11, marginTop: 3 },

  // Typing
  typingBubble: {
    backgroundColor: C.white,
    borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: C.bubbleBorder, elevation: 10,
  },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.purple, opacity: 0.7 },

  // Input
  inputBar: {
  flexDirection: 'row',
alignItems: 'center',
backgroundColor: C.white,

paddingHorizontal: 12,
paddingVertical: 10,
gap: 8,

bottom: 80,
marginHorizontal: 10,
borderRadius: 20,

// iOS Shadow
shadowColor: '#000',
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity: 0.15,
shadowRadius: 6,

// Android Shadow
elevation: 10,
  
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    height: 60,
    marginHorizontal: 15,
    borderRadius: 20
  },
  textInput: { flex: 1, fontSize: 13.5, color: C.grayText, maxHeight: 80, paddingTop: 0, paddingBottom: 0 },
  iconBtn: { padding: 2 },
  iconEmoji: { fontSize: 18 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.purple, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 10,
  },
});

export default AIStudyAssistant;