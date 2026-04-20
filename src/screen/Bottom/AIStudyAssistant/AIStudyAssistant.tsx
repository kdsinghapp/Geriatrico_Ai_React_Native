// AIStudyAssistant.tsx
// React Native — AI Study Assistant Chat UI
//
// Setup:
//   npm install react-native-linear-gradient react-native-svg
//   npx pod-install   (iOS only)
//
// Replace YOUR_API_KEY below with your Anthropic API key.
// ──────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
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
  Keyboard,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateSessionApi, ChatApi, DeleteSessionApi, GetChatHistoryApi, ChatWithFileApi, UploadFileApi } from '../../../Api/apiRequest';
import { errorToast, successToast } from '../../../utils/customToast';
import { pick, types, DocumentPickerResponse } from '@react-native-documents/picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

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
  file?: {
    name: string;
    type: string;
  };
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

const INITIAL_MESSAGES: Message[] = [];

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

// ─── PinIcon ──────────────────────────────────────────────
const PinIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59725 21.9983 8.005 21.9983C6.41275 21.9983 4.88582 21.3658 3.76 20.24C2.63418 19.1142 2.00168 17.5872 2.00168 15.995C2.00168 14.4027 2.63418 12.8758 3.76 11.75L12.33 3.17998C13.0806 2.42943 14.0985 2.00781 15.16 2.00781C16.2215 2.00781 17.2394 2.42943 17.99 3.17998C18.7405 3.93053 19.1622 4.94843 19.1622 6.00998C19.1622 7.07153 18.7405 8.08943 17.99 8.83998L9.41 17.41C9.03473 17.7853 8.52578 17.9961 7.995 17.9961C7.46422 17.9961 6.95527 17.7853 6.58 17.41C6.20473 17.0347 5.99393 16.5258 5.99393 15.995C5.99393 15.4642 6.20473 14.9553 6.58 14.58L15.07 6.09998"
      stroke={C.purple}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── MicIcon ──────────────────────────────────────────────
const MicIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z"
      stroke={C.purple}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.73749 15.637 5 13.8565 5 12V10"
      stroke={C.purple}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 19V23" stroke={C.purple} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 23H16" stroke={C.purple} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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
        <Text selectable style={styles.botText}>{text}</Text>
      </View>
      <Text style={styles.timestamp}>{time}</Text>
    </View>
  </View>
);

const FilePreview: React.FC<{ file: any; onClear: () => void }> = ({ file, onClear }) => (
  <View style={styles.filePreviewBar}>
    <View style={styles.filePreviewInfo}>
      <Text style={styles.fileIconText}>📄</Text>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.fileNameText}>{file.name}</Text>
        <Text style={styles.fileSizeText}>Ready to upload</Text>
      </View>
    </View>
    <TouchableOpacity onPress={onClear}>
      <Text style={styles.clearFileText}>✕</Text>
    </TouchableOpacity>
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const listRef = useRef<FlatList>(null);
  const { userData } = useSelector((state: any) => state.auth);
  const userId = userData?._id || userData?.id || userData?.user_id || null;

  console.log('--- AIStudyAssistant Component Render ---');
  console.log('userData from Redux:', userData);
  console.log('computed userId:', userId);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('--- useFocusEffect: Screen Focused ---');
      let activeSessionId: string | null = null;

      const initSession = async () => {
        if (!userId) {
          console.log('--- Session Init Failed: No User ID found ---', userData);
          return;
        }

        console.log('--- Initializing Session (Focus) ---');
        console.log('Requesting session for User ID:', userId);

        try {
          const res = await CreateSessionApi(userId, () => { });
          console.log('CreateSessionApi Raw Response:', JSON.stringify(res, null, 2));

          const sid = typeof res === 'string' ? res : res?.session_id;
          console.log('Extracted Session ID:', sid);

          if (sid) {
            setSessionId(sid);
            activeSessionId = sid;
            console.log('Session successfully set in state:', sid);

            const historyRes = await GetChatHistoryApi(sid, () => { });
            console.log('Chat History Response:', JSON.stringify(historyRes, null, 2));

            const historyData = Array.isArray(historyRes) ? historyRes : (historyRes?.data && Array.isArray(historyRes.data) ? historyRes.data : null);
            if (historyData) {
              const historyMsgs: Message[] = historyData.map((m: any, idx: number) => ({
                id: idx,
                role: (m.role === 'assistant' ? 'bot' : 'user') as 'bot' | 'user',
                text: m.message || m.reply || '',
                time: getNow(),
              }));
              setMessages(historyMsgs);
              console.log('Loaded history messages:', historyMsgs.length);
            }
          } else {
            console.error('Session ID was not returned by API');
            errorToast("Unable to start AI session");
          }
        } catch (err) {
          console.error('Error during session initialization:', err);
          errorToast("Critical error starting session");
        }
      };

      if (userId) {
        initSession();
      } else {
        console.warn('--- useFocusEffect: userId is missing, skipping session init ---');
      }

      return () => {
        console.log('--- useFocusEffect: Screen Blurred ---');
        if (activeSessionId) {
          console.log('--- Deleting Session (Blur/Switch Tab) ---', activeSessionId);
          DeleteSessionApi(activeSessionId, () => { });
          setSessionId(null);
          setMessages([]); // Optional: clear messages for a fresh start next time
        }
      };
    }, [userId])
  );

  const scrollToBottom = () => listRef.current?.scrollToEnd({ animated: true });

  const handleFilePick = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

        await request(permission);
      }

      const [res] = await pick({
        type: [types.pdf, types.docx, types.doc, types.plainText],
      });
      // Automatically send the file after picking
      await send(res);
    } catch (err) {
      if (err instanceof Error && err.message === 'User cancelled') return;
      console.error('Pick error', err);
    }
  };

  const send = async (pickedFile?: DocumentPickerResponse) => {

    const text = input.trim();
    const fileToSend = pickedFile || selectedFile;
    if (!text || loading || !sessionId) return;
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: text || (fileToSend ? `Uploaded: ${fileToSend.name}` : ''),
      time: getNow(),
      file: fileToSend ? { name: fileToSend.name || 'document', type: fileToSend.type || '' } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);

    try {
      if (fileToSend) {
        setLoading(true);
        const upRes = await UploadFileApi(sessionId, fileToSend, () => { });
        if (!upRes) {
          errorToast("File upload failed");
          setLoading(false);
          return;
        }
      }

      const res = await ChatApi(sessionId, text, setLoading);
      const reply: string = (typeof res === 'string' && res.trim().length > 0)
        ? res
        : (res?.reply ?? res?.message ?? res?.data ?? res?.answer ?? "Sorry, I couldn't find an answer.");
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply, time: getNow() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Something went wrong. Please try again.',
        time: getNow(),
      }]);
    }
  };

  const renderItem = ({ item }: { item: Message }) =>
    item.role === 'user'
      ? <UserBubble text={item.text} time={item.time} />
      : <BotBubble text={item.text} time={item.time} />;
  // : <BotBubble  text={item.text} time={item.time} />;
  const inset = useSafeAreaInsets()
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image source={imageIndex.empty} style={styles.emptyImg} />
              <Text style={styles.emptyTitle}>Hello</Text>
              <Text style={styles.emptySub}>How can I assist you today?</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* File Preview if selected */}
        {selectedFile && <FilePreview file={selectedFile} onClear={() => setSelectedFile(null)} />}

        {/* Input bar */}
        <View style={[styles.inputBar, { marginBottom: keyboardVisible ? 10 : 65 + inset.bottom }]}>
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
              onSubmitEditing={() => send()}
              underlineColorAndroid="transparent"
            />
          </View>

          {/* <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={handleFilePick}>
            <PinIcon />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <MicIcon />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => send()} disabled={loading || !input.trim()} activeOpacity={0.8}>
            <LinearGradient
              colors={loading || !input.trim() ? ['#C4A7F7', '#C4A7F7'] : [C.purple, C.lightPurple]}
              style={styles.sendBtn}
            >
              {loading ? <ActivityIndicator color={C.white} size="small" /> : <SendIcon />}
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 8,
    marginHorizontal: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: C.borderLight,
    // Shadows
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  emptySub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: C.grayText,
    maxHeight: 80,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  iconBtn: { padding: 2 },
  iconEmoji: { fontSize: 18 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.purple, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 10,
  },
  filePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    marginHorizontal: 15,
    marginBottom: 5,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  filePreviewInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileIconText: { fontSize: 24 },
  fileNameText: { fontSize: 13, fontWeight: '600', color: C.grayText },
  fileSizeText: { fontSize: 11, color: C.purple },
  clearFileText: { fontSize: 18, color: '#FF4D4D', paddingHorizontal: 5 },
});

export default AIStudyAssistant;