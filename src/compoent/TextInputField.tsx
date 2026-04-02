import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import imageIndex from '../assets/imageIndex';
import { color } from '../constant';
import ErrorText from './ErrorText';

export default function TextInputField({ error, ...props }: any) {
  const [showPassword, setShowPassword] = useState(props.hide);
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const onChangeText = (value: string) => {
    if (props.onChangeText) {
      props.onChangeText(value);
    }
  };

  return (
    <View
      style={[
        {
          height: hp(7),
          justifyContent: 'center',
          marginVertical: 12,
        },
      ]}
    >

        <View
        style={[
          {
            flexDirection: 'row',
            backgroundColor: '#F8F4FF',
            borderColor: isFocused ? '#035093' : 'transparent',
            height: 62,
            borderRadius: 15,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: isFocused ? 1 : 0,
 marginBottom:20,
            // ✅ Android shadow fix
 
            // ✅ iOS shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,

          },
          props.style,
        ]}>

        {props.firstLogo && (
          <View
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '10%',
            }}>
            <Image
              source={props.img}
              style={[{ width: 22, height: 22, tintColor: isFocused ? '#035093' : color.primary }, props.imgStyle]}
              resizeMode="contain"
            />

          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: props.showEye ? '70%' : '85%',
            marginLeft: props.firstLogo ? 0 : 15,
            height: 50,

          }}>
          <View style={{ width: '80%' }}>
            <TextInput
              placeholderTextColor={props.placeholderTextColor || "black"}
              style={[
                {
                  color: 'black',
                  fontWeight: '500',
                  fontSize: 14,
                  flex: 1,

                },
                props.textStyle,
              ]}
              autoComplete='off'
              onChangeText={onChangeText}
              value={props.text || props.value} // Directly using parent `email` state
              placeholder={props.placeholder}
              secureTextEntry={showPassword}
              maxLength={props.maxLength}
              keyboardType={props.type || props.keyboardType}
              returnKeyType='done'
              autoFocus={false}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              editable={props.editable}
              multiline={props.multiline}
              numberOfLines={props.numberOfLines}
              textAlignVertical={props.textAlignVertical}
            />
          </View>
        </View>
        {props.showEye && (
          <TouchableOpacity
            onPress={PasswordVisibility}
            style={{
              height: 42,
              width: 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={showPassword ? imageIndex.eye : imageIndex.view}
              style={{ width: 24, height: 24, tintColor: isFocused ? '#035093' : color.primary }}
            />
          </TouchableOpacity>
        )}
      </View>
      <ErrorText error={error} style={{   }} />
    </View>
  );
}
