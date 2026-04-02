import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/Constant';
import { color } from '../../../constant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  card: {
    // marginTop: hp(5),
    borderRadius: 20,
    padding: 20,
    paddingTop: 0
  },

  logoText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  subTitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 6,
    marginBottom: 45,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryCode: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.primary,
    justifyContent: 'center',
    marginRight: 10,
  },

  codeText: {
    fontSize: 16,
    fontWeight: '600',
  },

  loginBtn: {
    marginTop: 25,
    borderRadius: 25,
  },



  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },

  signUpText: {
    fontSize: 15,
    color: '#9DB2BF',
  },

  signUpLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D5AFE',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#035093',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 58,
    marginTop: 12,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    shadowRadius: 4,
  },

  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 8,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },

  countryText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },

  chevron: {
    width: 14,
    height: 14,
    tintColor: color.primary,
  },

  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    paddingVertical: 0,
  },
});

export default styles;
