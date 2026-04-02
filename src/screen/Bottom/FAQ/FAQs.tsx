import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const FAQItem = ({ question, answer }: any) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  return (
    <View style={[styles.faqItem, open && styles.faqItemOpen]}>
      <TouchableOpacity onPress={toggle} style={styles.faqHeader} activeOpacity={0.7}>
        <Text style={styles.question}>{question}</Text>
        <Image
          source={imageIndex.dounArroww}
          style={[styles.arrow, open && { transform: [{ rotate: '180deg' }] }]}
        />
      </TouchableOpacity>
      {open && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
};
export default function FAQs() {
  const faqs = [
    {
      question: 'What services do you offer?',
      answer: 'We offer design, development and consulting services.',
    },
    {
      question: 'How can I get a quote for your services?',
      answer: 'You can contact us via the contact page.',
    },
    {
      question: 'What industries do you cater to?',
      answer: 'We work across multiple industries.',
    },
    {
      question: 'How can I contact your customer support?',
      answer: 'Email or call our support team.',
    },
    {
      question: 'What is your refund policy?',
      answer: 'Refunds depend on project terms.',
    },
    {
      question: 'How long does it take to complete a project?',
      answer: 'It depends on project scope.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="FAQ" />
      {/* Header */}


      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Illustration */}
        <Image
          source={imageIndex.IllustrationPack}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, {
          marginBottom: 15
        }]}>FAQ</Text>
        {/* Title */}
        <Text style={styles.subtitle}>
          Most common question about our services
        </Text>

        {/* FAQ List */}
        <View style={styles.card}>
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    backgroundColor: '#8BC34A',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  image: {
    width: 155,
    height: 155,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop:11
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },

  faqItem: {
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
  },

  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  question: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    color: "black"
  },

  answer: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },

  arrow: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
});

