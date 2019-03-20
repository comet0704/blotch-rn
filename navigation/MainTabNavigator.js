import React from 'react';
import { Platform, Icon , Image} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/Home/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import SignupScreen from '../screens/Login/SignupScreen';
import FindPwdScreen from '../screens/Login/FindPwdScreen';
import FaqScreen from '../screens/Home/FaqScreen';
import AboutUsScreen from '../screens/Home/AboutUsScreen';
import BannerDetailScreen from '../screens/Home/BannerDetailScreen';
import ArticlesScreen from '../screens/Home/Articles';
import Colors from '../constants/Colors';
import ProductContainerScreen from '../screens/Product/ProductContainerScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Faq: FaqScreen,
  BannerDetail: BannerDetailScreen,
  Article: ArticlesScreen,
  AboutUs: {
    screen: AboutUsScreen,
    navigationOptions: () => ({
      tabBarVisible:false,
    })
  },
},
{
  headerMode: 'screen ',
});

// HomeStack.navigationOptions = ({navigation}) => {
//   tabBarLabel = "HOME";

//   let tabBarVisible = true;

//   let routeName = navigation.state.routes[navigation.state.index].routeName;

//   if(routeName == 'AboutUs') {
//     tabBarVisible = false
//   }

//   return {
//     tabBarVisible
//   }
// }

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({focused}) => (
    focused ? <Image style={{width:57/3, height:53/3}} source={require("../assets/images/ic_menu_home_on.png")}/> : <Image style={{width:57/3, height:53/3}} source={require("../assets/images/ic_menu_home_off.png")}/>
  ),
};

const ProductStack = createStackNavigator({
  ProductContainer: ProductContainerScreen,
},
{
  headerMode: 'screen ',
});

ProductStack.navigationOptions = {
  tabBarLabel: 'Product',
  tabBarIcon: ({focused}) => (
    focused ? <Image style={{width:49/3, height:53/3}} source={require("../assets/images/ic_menu_product_on.png")}/> : <Image style={{width:49/3, height:53/3}} source={require("../assets/images/ic_menu_product_off.png")}/>
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const LoginStack = createStackNavigator({
  Login: LoginScreen,
  Signup:  SignupScreen,
  FindPwd:  FindPwdScreen,
},
{
  headerMode: 'screen ',
});

LoginStack.navigationOptions = {
  tabBarLabel: 'Login',
  tabBarIcon: ({focused}) => (
    focused ? <Image style={{width:16.7, height:17.7}} source={require("../assets/images/ic_menu_login_off.png")}/> : <Image style={{width:16.7, height:17.7}} source={require("../assets/images/ic_menu_login_off.png")}/>
  ),

  tabBarVisible:false,
  
};

export default createBottomTabNavigator({
  ProductStack,
  HomeStack,
  LinksStack,
  LoginStack,
  SettingsStack,
}, {
  backBehavior: "history",
  tabBarOptions : {
    activeTintColor:"#a695fe"
  }
});
