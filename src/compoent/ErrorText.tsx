import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ErrorTextProps {
  error?: string;
  style?: any;
}

const ErrorText: React.FC<ErrorTextProps> = ({ error, style }) => {
  if (!error) return null;

  return (
    <Text style={[styles.error, style]}>
      {error}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default ErrorText;
