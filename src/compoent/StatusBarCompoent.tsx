import React from 'react';
import { StatusBar } from 'react-native';

type StatusBarComponentProps = {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
};

const StatusBarComponent: React.FC<StatusBarComponentProps> = ({
  barStyle = 'dark-content',
  backgroundColor = 'black',
  translucent = false,
}) => {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
      animated={true}
    />
  );
};

export default StatusBarComponent;