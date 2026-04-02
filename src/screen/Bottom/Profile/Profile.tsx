import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import ScreenNameEnum from '../../../routes/screenName.enum';
import LogoutModal from '../../../compoent/LogoutModal';
import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Image source={icon} style={styles.icon} />
      <View>
        <Text style={styles.menuText}>{title}</Text>
        {subtitle && <Text style={styles.subText}>{subtitle}</Text>}
      </View>
    </View>
    <Image source={imageIndex.black} style={styles.arrow} />
  </TouchableOpacity>
);

export default function ProfileSetting() {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
 

      <ScrollView showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginTop: 10 }}
      >

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Itunuoluwa Abidoye</Text>
            <Text style={styles.username}>@itunuoluwa</Text>
          </View>
         
        </View>

        {/* Menu */}
        <View style={styles.card}>
          <MenuItem
            icon={imageIndex.EditProfile}
            title="Edit Profile"
            onPress={() => navigation.navigate(ScreenNameEnum.EditProfile)}
          />
          <MenuItem
            icon={imageIndex.ChangePassword}
            title="Change Password"
                        onPress={() => navigation.navigate(ScreenNameEnum.changePassword)}

           />
          <MenuItem
            icon={imageIndex.Notification}
            title="Notification"
            onPress={() => navigation.navigate(ScreenNameEnum.NotificationsScreen)}

          />
           
        </View>

        <View style={styles.card}>
          <MenuItem
            icon={imageIndex.ContactUs}
            title="FAQs"
            onPress={() => navigation.navigate(ScreenNameEnum.FAQ)}
          />
          <MenuItem
            icon={imageIndex.logout}
            title="Log out"
            subtitle="Further secure your account for safety"
            onPress={() => setVisible(true)}
          />
        </View>
        <LogoutModal visible={visible}
          onLogout={() => {
            setVisible(false);
            // Handle logout logic here
          }}
          onCancel={() => setVisible(false)}
        />


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
    backgroundColor: '#d9f99d',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  backIcon: {
    width: 16,
    height: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7625FE',
    padding: 15,
    borderRadius: 40,
    marginBottom: 20,
    marginTop:12
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  name: {
    color: '#fff',
    fontWeight: '600',
  },

  username: {
    color: '#ccc',
    fontSize: 12,
  },

  editIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 12,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android Shadow
    elevation: 8,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },

  arrow: {
    width: 16,
    height: 16,
    color: 'black',
  },

  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',

  },

  subText: {
    fontSize: 11,
    color: 'black',

  },
});