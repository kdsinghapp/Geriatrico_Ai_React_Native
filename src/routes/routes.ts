import OnboardingScreen from "../screen/auth/Onboarding/Onboarding";
import ScreenNameEnum from "./screenName.enum";
import NotificationsScreen from "../screen/Notification/Notification";
import Sinup from "../screen/auth/sinup/Sinup";
import ChangePassword from "../screen/Profile/ChangePassword/ChangePassword";
import HelpScreen from "../screen/Profile/Help/Helps";
import Splash from "../screen/auth/Splash/Splash";
 import OtpScreen from "../screen/auth/OTPScreen/OtpScreen";
import LegalPoliciesScreen from "../screen/Profile/LegalPoliciesScreen";
import PrivacyPolicy from "../screen/Profile/PrivacyPolicy";
import EditProfile from "../screen/Profile/EditProfile/EditProfile";
import CreatePassword from "../screen/auth/CreateNewPassword/CreateNewPassword";

  
    
 import UserRoleSetting from "../screen/UserRole/UserRoleSetting/UserRoleSetting";
import Login from "../screen/auth/Login/PhoneLogin";
import BottomTabNavigator from "../navigators/BottomTabNavigator";
import FilterScreen from "../screen/Bottom/FilterSection/FilterSection";
import QuestionBank from "../screen/Bottom/QuestionBank/QuestionBank";
import PasswordReset from "../screen/auth/passwordReset/PasswordReset";
import FAQs from "../screen/Bottom/FAQ/FAQs";
import Explanation from "../screen/Explanation/Explanation";
 
 const _routes: any = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.SPLASH_SCREEN,
      Component: Splash,
    },
    {
      name: ScreenNameEnum.Sinup,
      Component: Sinup,
    },
    {
      name: ScreenNameEnum.FAQ,
      Component: FAQs,
    },
    {
      name: ScreenNameEnum.Explanation,
      Component: Explanation,
    },
    {
      name: ScreenNameEnum.BottomTabNavigator,
      Component: BottomTabNavigator,
    },
 
  

    
   
   
    {
      name: ScreenNameEnum.FilterScreen,
      Component: FilterScreen,
    },
 
   
   
    {
      name: ScreenNameEnum.PasswordReset,
      Component: PasswordReset,
    },
 
   
   
    {
      name: ScreenNameEnum.QuestionBank,
      Component: QuestionBank,
    },
 
  

    
   
   
    




    {
      name: ScreenNameEnum.OnboardingScreen,
      Component: OnboardingScreen,
    },


    {
      name: ScreenNameEnum.EditProfile,
      Component: EditProfile,
    },
    {
      name: ScreenNameEnum.OtpScreen,
      Component: OtpScreen,
    },


    {
      name: ScreenNameEnum.PhoneLogin,
      Component: Login,
    },

    

  
    {
      name: ScreenNameEnum.changePassword,
      Component: ChangePassword,
    },

    {
      name: ScreenNameEnum.Help,
      Component: HelpScreen,
    },
    //    {
    //   name: ScreenNameEnum.TabNavigator,
    //   Component: TabNavigator,
    // },

    {
      name: ScreenNameEnum.PrivacyPolicy,
      Component: PrivacyPolicy,
    },
 
 
  
  
   
    {
      name: ScreenNameEnum.ProfileScreen,
      Component: EditProfile,
    },
 
   
    {
      name: ScreenNameEnum.LegalPoliciesScreen,
      Component: LegalPoliciesScreen,
    },



    {
      name: ScreenNameEnum.NotificationsScreen,
      Component: NotificationsScreen,
    },
    {
      name: ScreenNameEnum.setting,
      Component: UserRoleSetting,
    },

    //    {
    //   name: ScreenNameEnum.DocumentShow,
    //   Component: DocumentShow,
    // },

    {
      name: ScreenNameEnum.CreatePassword,
      Component: CreatePassword,
    },
  ],


};

export default _routes;
