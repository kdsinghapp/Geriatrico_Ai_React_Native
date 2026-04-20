import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import CustomButton from '../../../compoent/CustomButton';
import font from '../../../theme/font';
import LoadingModal from '../../../utils/Loader';
import { ChangePasswordApi } from '../../../Api/apiRequest';
import { errorToast } from '../../../utils/customToast';

const ChangePasswordScreen = () => {
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState(false)
    const isLogin = useSelector((state: any) => state?.auth);

    const [oldpass, setOldPass] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


    const validatePasswords = () => {
        if (!oldpass) {
            errorToast("Please enter your old password.");
        } else if (!password) {
            errorToast("Please enter a new password.");
        } else if (password.length < 6) {
            errorToast("New password must be at least 6 characters long.");
        } else if (!confirmPassword) {
            errorToast("Please confirm your new password.");
        } else if (password !== confirmPassword) {
            errorToast("New Password and Confirm Password do not match.");
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                old_password: oldpass,
                new_password: password
            };
            const res = await ChangePasswordApi(payload, setLoading);
            if (res) {
                navigation.goBack();
            }
        } catch (error) {
            console.error("Change password error:", error);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? <LoadingModal /> : null}

            <StatusBarComponent />
            <CustomHeader
                label="Change Password"

            />
            <View style={{ marginHorizontal: 12, flex: 1 }}>

                <View style={{ marginTop: 35 }}>

                    <View style={styles.inputContainer}>
                        <Image source={imageIndex.lock} style={styles.image} />
                        <TextInput
                            placeholder="Old Password"
                            secureTextEntry={!passwordVisible}
                            style={styles.input}
                            placeholderTextColor={"#ADA4A5"}
                            value={oldpass}
                            onChangeText={setOldPass}
                        />



                    </View>
                    <View style={styles.inputContainer}>
                        <Image source={imageIndex.lock} style={styles.image} />

                        <TextInput
                            placeholder="New Password"
                            secureTextEntry={!passwordVisible}
                            placeholderTextColor={"#ADA4A5"}

                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}

                        />
                        {/* <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Image source={!passwordVisible ? imageIndex.eye : imageIndex.visible} style={styles.image} />

                        </TouchableOpacity> */}
                    </View>

                    {/* New Password */}


                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <Image source={imageIndex.lock} style={styles.image} />
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry={!confirmPasswordVisible}
                            placeholderTextColor={"#ADA4A5"}

                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            <Image source={!confirmPasswordVisible ? imageIndex.hide : imageIndex.hide} style={styles.image} />

                        </TouchableOpacity>
                    </View>
                </View>
                {/* {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null} */}

                <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }}>
                    <CustomButton
                        title="Save"
                        onPress={() => validatePasswords()}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',

    },
    errorText: {
        color: "red",
        marginBottom: 10,
        marginLeft: 5
    },

    image: { tintColor: "#7B6F72", height: 18, width: 18 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#FFF5F3',
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 15,
        height: 60,
        // paddingVertical: 10,
        borderWidth: 2,
        borderColor: "#F7F8F8"
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: "black",
        fontSize: 16,
        fontFamily: font.MonolithRegular
    },

});

export default ChangePasswordScreen;
