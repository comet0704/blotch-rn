import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
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
import SearchBrandDetailScreen from '../screens/Home/Search/SearchBrandDetailScreen';
import SearchResultProductMoreScreen from '../screens/Home/Search/SearchResultProductMoreScreen';
import SearchResultIngredientMoreScreen from '../screens/Home/Search/SearchResultIngredientMoreScreen';
import MyListScreen from '../screens/Mylist/MyListScreen';
import SearchCameraScreen from '../screens/Home/Search/SearchCameraScreen';
import MatchdListScreen from '../screens/Mylist/MatchdListScreen';
import BlotchdListScreen from '../screens/Mylist/BlotchdListScreen';
import HeartListScreen from '../screens/Mylist/HeartListScreen';
import FavoriteArticlesScreen from '../screens/Mylist/FavoriteArticlesScreen';
import MyPageScreen from '../screens/Mypage/MyPageScreen';
import EditProfileScreen from '../screens/Mypage/EditProfileScreen';
import ChangePwdScreen from '../screens/Mypage/ChangePwdScreen';
import MyPointScreen from '../screens/Mypage/MyPointScreen';
import MyReviewScreen from '../screens/Mypage/MyReviewScreen';

const HomeStack = createStackNavigator({
  Article: ArticlesScreen,
  Home: HomeScreen,
  ArticleDetail: ArticleDetailScreen,
  Faq: FaqScreen,
  BannerDetail: BannerDetailScreen,
  ProductDetail: ProductDetailScreen,
  SearchMain: SearchMainScreen,
  SearchResult: SearchResultScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
  SearchResultProductMore: SearchResultProductMoreScreen,
  SearchResultIngredientMore: SearchResultIngredientMoreScreen,
  SearchCamera:SearchCameraScreen,
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

const MyListStack = createStackNavigator({
  FavoriteArticles: FavoriteArticlesScreen,
  HeartList: HeartListScreen,
  BlotchdList: BlotchdListScreen,
  MatchdList: MatchdListScreen,
  MyList: MyListScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
  SearchCamera:SearchCameraScreen,
},
  {
    headerMode: 'screen ',
  });

MyListStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'MyList') {
    tabBarVisible = true
  }

  return {
    tabBarLabel: 'My List',
    tabBarIcon: ({ focused }) => (
      focused ? <Image style={{ width: 60 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_mylist_on.png")} /> : <Image style={{ width: 60 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_mylist_off.png")} />
    ),
    tabBarVisible: tabBarVisible
  }
}


const MyPageStack = createStackNavigator({
  MyReview: MyReviewScreen,
  MyPoint: MyPointScreen,
  ChangePwd: ChangePwdScreen,
  EditProfile: EditProfileScreen,
  MyPage: MyPageScreen,
},
  {
    headerMode: 'screen ',
  });

MyPageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = false;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName == 'MyPage') {
    tabBarVisible = true
  }

  return {
    tabBarLabel: 'My Page',
    tabBarIcon: ({ focused }) => (
      focused ? <Image style={{ width: 39 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_mypage_on.png")} /> : <Image style={{ width: 39 / 3, height: 53 / 3 }} source={require("../assets/images/ic_menu_mypage_off.png")} />
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

global.login_info = {};
export default createBottomTabNavigator({
  MyPageStack,
  MyListStack,
  HomeStack,
  ProductStack,
  IngredientStack,
  LoginStack,
  // LinksStack,  
  // SettingsStack,
}, {
    backBehavior: "history",
    tabBarOptions: {
      activeTintColor: "#a695fe"
    }
  });
