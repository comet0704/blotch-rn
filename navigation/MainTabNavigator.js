import React from 'react';
import { Platform, Icon, Image } from 'react-native';
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
import ArticlesScreen from '../screens/Home/ArticlesScreen';
import Colors from '../constants/Colors';
import ProductContainerScreen from '../screens/Product/ProductContainerScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import ArticleDetailScreen from '../screens/Home/ArticleDetailScreen';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import PotentialAllergensProductScreen from '../screens/Ingredient/PotentialAllergensProductScreen';
import SearchMainScreen from '../screens/Home/Search/SearchMainScreen';
import SearchResultScreen from '../screens/Home/Search/SearchResultScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Article: ArticlesScreen,
  ArticleDetail: ArticleDetailScreen,
  Faq: FaqScreen,
  BannerDetail: BannerDetailScreen,
  ProductDetail: ProductDetailScreen,
  SearchMain: SearchMainScreen,
  SearchResult: SearchResultScreen,
  AboutUs: AboutUsScreen,
},
  {
    headerMode: 'screen ',
  });

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'Home') {
    tabBarVisible = true
  }

  return {
    tabBarLabel: "Home",
    tabBarIcon: ({ focused }) => (
      focused ? <Image style={{ width: 57 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_home_on.png")} /> : <Image style={{ width: 57 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_home_off.png")} />
    ),
    tabBarVisible: tabBarVisible
  }
}

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
//   tabBarIcon: ({focused}) => (
//     focused ? <Image style={{width:57/3, height:53/3}} source={require("../assets/images/ic_menu_home_on.png")}/> : <Image style={{width:57/3, height:53/3}} source={require("../assets/images/ic_menu_home_off.png")}/>
//   ),
// };

const ProductStack = createStackNavigator({
  ProductContainer: ProductContainerScreen,
  ProductDetail: ProductDetailScreen,
  BannerDetail: BannerDetailScreen,
},
  {
    headerMode: 'screen ',
  });

ProductStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'ProductContainer') {
    tabBarVisible = true
  }

  return {
    tabBarLabel: 'Product',
    tabBarIcon: ({ focused }) => (
      focused ? <Image style={{ width: 49 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_product_on.png")} /> : <Image style={{ width: 49 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_product_off.png")} />
    ),
    tabBarVisible: tabBarVisible
  }
}

const IngredientStack = createStackNavigator({
  Ingredient: IngredientScreen,
  PotentialAllergenProduct: PotentialAllergensProductScreen,
  ProductDetail: ProductDetailScreen,
},
  {
    headerMode: 'screen ',
  });

IngredientStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'Ingredient') {
    tabBarVisible = true
  }

  return {
    tabBarLabel: 'Ingredient',
    tabBarIcon: ({ focused }) => (
      focused ? <Image style={{ width: 42 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_ingredient_on.png")} /> : <Image style={{ width: 42 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_ingredient_off.png")} />
    ),
    tabBarVisible: tabBarVisible
  }
}

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
  Signup: SignupScreen,
  FindPwd: FindPwdScreen,
},
  {
    headerMode: 'screen ',
  });

LoginStack.navigationOptions = {
  tabBarLabel: 'Login',
  tabBarIcon: ({ focused }) => (
    focused ? <Image style={{ width: 16.7, height: 17.7 }} source={require("../assets/images/ic_menu_login_off.png")} /> : <Image style={{ width: 16.7, height: 17.7 }} source={require("../assets/images/ic_menu_login_off.png")} />
  ),

  tabBarVisible: false,

};
global.login_info = {};
export default createBottomTabNavigator({
  HomeStack,
  ProductStack,
  IngredientStack,
  LoginStack,
  LinksStack,
  // SettingsStack,
}, {
    backBehavior: "history",
    tabBarOptions: {
      activeTintColor: "#a695fe"
    }
  });
