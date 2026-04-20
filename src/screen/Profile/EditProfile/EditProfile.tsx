import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
import CustomInput from "../../../compoent/CustomInput";
import CustomButton from "../../../compoent/CustomButton";
import ImagePickerModal from "../../../compoent/ImagePickerModal";
import imageIndex from "../../../assets/imageIndex";
import { GetAuthProfileApi, UpdateAuthProfileApi, UpdateAuthProfilePhotoApi, DeleteAuthProfileApi, DeleteAuthProfilePhotoApi, GetProfileApi, UpdateProfile } from "../../../Api/apiRequest";
import { loginSuccess, logout, updateUserData } from "../../../redux/feature/authSlice";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { errorToast, successToast } from "../../../utils/customToast";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

const EditProfile = () => {
  const navigation = useNavigation();
  const userData: any = useSelector((state: any) => state.auth.userData);

  const [fullName, setFullName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phoneNo, setPhoneNo] = useState(userData?.phone_no || "");
  const [countryCode, setCountryCode] = useState(userData?.country_code || "+91");
  const [image, setImage] = useState<any>(userData?.profile_photo || null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [isFocused]);

  const getProfile = async () => {
    const res = await GetAuthProfileApi(setIsLoading);
    if (res && res.profile) {
      dispatch(updateUserData(res.profile));
      const p = res.profile;
      setFullName(p.name || "");
      setEmail(p.email || "");
      setPhoneNo(p.phone_no || "");
      setCountryCode(p.country_code || "+91");
      setImage(p.profile_photo || null);
    }
  };

  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setIsModalVisible(false);
      }
    });
  };

  const takePhotoFromCamera = () => {

  };

  const deletePhoto = async () => {
    const res = await DeleteAuthProfilePhotoApi(setIsLoading);
    if (res) {
      setImage(null);
      getProfile();
    }
  };

  const handleSave = async () => {
    if (!fullName) {
      errorToast("Name is required");
      return;
    }

    try {
      // 1. Update Profile Photo if changed
      if (image && typeof image === 'object' && image.uri) {
        await UpdateAuthProfilePhotoApi(image, setIsLoading);
      }

      // 2. Update Profile Data
      const payload = {
        name: fullName,
        country_code: countryCode,
        phone_no: phoneNo,
      };

      const res = await UpdateAuthProfileApi(payload, setIsLoading);
      if (res && res.profile) {
        dispatch(updateUserData(res.profile));
        successToast("Profile updated successfully");
        navigation.goBack();
      } else if (res) {
        // Fallback if res doesn't contain profile but was successful
        getProfile();
        successToast("Profile updated successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader label="Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust offset if needed

      >
        <ScrollView contentContainerStyle={styles.container}

        >
          <View style={styles.profileContainer}>
            <Image
              source={image ? { uri: image.uri || image } : imageIndex.prfile}
              style={styles.profileImage}
              resizeMode="cover"
            />

            {/* Edit Icon */}
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setIsModalVisible(true)}
            >
              <Image
                source={imageIndex.eoditphots}
                style={styles.editIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon={<Image source={imageIndex.profiel} style={styles.icon} />}
              />
              <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Image source={imageIndex.mess} style={styles.icon} />}
              />
              {/* <CustomInput
                placeholder="Country Code"
                value={countryCode}
                onChangeText={setCountryCode}
                leftIcon={<Image source={imageIndex.profiel} style={styles.icon} />}
              /> */}
              <CustomInput
                placeholder="Phone Number"
                value={phoneNo}
                onChangeText={setPhoneNo}
                keyboardType="numeric"
                leftIcon={<Image source={imageIndex.profiel} style={styles.icon} />}
              />
            </View>
          </View>

          {/* Image Picker Modal */}
          <ImagePickerModal
            modalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            pickImageFromGallery={pickImageFromGallery}
            takePhotoFromCamera={takePhotoFromCamera}
            removePhoto={image ? deletePhoto : undefined}
          />
          {/* Delete Account */}
          <TouchableOpacity
            style={{ marginTop: 20, marginBottom: 10 }}
            onPress={async () => {
              // In a real app, show a confirmation modal first
              const res = await DeleteAuthProfileApi(setIsLoading);
              if (res) {
                dispatch(logout());
                navigation.reset({
                  index: 0,
                  routes: [{ name: ScreenNameEnum.PhoneLogin }],
                });
              }
            }}
          >
            <Text style={{ color: "red", fontWeight: "600" }}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <CustomButton title="Update" onPress={handleSave} loading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative", // needed for absolute edit icon
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
  editIconContainer: {
    position: "relative",
    bottom: 20,
    right: 0,
    padding: 5,
    left: 16

  },
  editIcon: {
    width: 33,
    height: 33,
    // tintColor: "#E03B65"
  },
  inputContainer: {
    marginTop: 20,
    width: "90%",
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: "#E03B65"
  },
  buttonContainer: {
    marginBottom: 30,
    marginHorizontal: 15,
  },
});

export default EditProfile;
