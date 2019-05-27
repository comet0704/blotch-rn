import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Platform, Icon, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/Home/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
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
import SearchBarcodeScreen from '../screens/Home/Search/SearchBarcodeScreen';
import MatchdListScreen from '../screens/Mylist/MatchdListScreen';
import BlotchdListScreen from '../screens/Mylist/BlotchdListScreen';
import HeartListScreen from '../screens/Mylist/HeartListScreen';
import FavoriteArticlesScreen from '../screens/Mylist/FavoriteArticlesScreen';
import MyPageScreen from '../screens/Mypage/MyPageScreen';
import EditProfileScreen from '../screens/Mypage/EditProfileScreen';
import ChangePwdScreen from '../screens/Mypage/ChangePwdScreen';
import MyPointScreen from '../screens/Mypage/MyPointScreen';
import MyReviewScreen from '../screens/Mypage/MyReviewScreen';
import SettingScreen from '../screens/Mypage/SettingScreen';
import PolicyScreen from '../screens/Mypage/PolicyScreen';
import NotificationScreen from '../screens/Mypage/NotificationScreen';
import AnnouncementsScreen from '../screens/Mypage/AnnouncementsScreen';
import ContactUsScreen from '../screens/Mypage/ContactUsScreen';
import MyBeautyBoxScreen from '../screens/Mypage/MyBeautyBoxScreen';
import CalendarScreen from '../screens/Mypage/CalendarScreen';
import QuestionnareScreen from '../screens/Mypage/QuestionnareScreen';
import WeCanSearchItScreen from '../screens/Mypage/WeCanSearchItScreen';
import MyOwnListScreen from '../screens/Mylist/MyOwnListScreen';
import MyConstants from '../constants/MyConstants';
import MyStyles from '../constants/MyStyles';
import TutorialScreen from '../screens/Tutorial/TutorialScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Tutorial: TutorialScreen,
  WeCanSearchIt: WeCanSearchItScreen,
  Article: ArticlesScreen,
  ArticleDetail: ArticleDetailScreen,
  Faq: FaqScreen,
  BannerDetail: BannerDetailScreen,
  ProductDetail: ProductDetailScreen,
  SearchMain: SearchMainScreen,
  SearchResult: SearchResultScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
  SearchResultProductMore: SearchResultProductMoreScreen,
  SearchResultIngredientMore: SearchResultIngredientMoreScreen,
  SearchCamera: SearchCameraScreen,
  SearchBarcode: SearchBarcodeScreen,
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
  WeCanSearchIt: WeCanSearchItScreen,
  ProductDetail: ProductDetailScreen,
  BannerDetail: BannerDetailScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
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
  WeCanSearchIt: WeCanSearchItScreen,
  Questionnare: QuestionnareScreen,
  Calendar: CalendarScreen,
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
  MyList: MyListScreen,
  FavoriteArticles: FavoriteArticlesScreen,
  Article: ArticlesScreen,
  ArticleDetail: ArticleDetailScreen,
  HeartList: HeartListScreen,
  BlotchdList: BlotchdListScreen,
  MatchdList: MatchdListScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
  SearchCamera: SearchCameraScreen,
  SearchBarcode: SearchBarcodeScreen,
  ProductDetail: ProductDetailScreen,
  MyOwnList: MyOwnListScreen,
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
  MyPage: MyPageScreen,
  WeCanSearchIt: WeCanSearchItScreen,
  Questionnare: QuestionnareScreen,
  MyBeautyBox: MyBeautyBoxScreen,
  ContactUs: ContactUsScreen,
  Announcements: AnnouncementsScreen,
  Notification: NotificationScreen,
  Policy: PolicyScreen,
  Setting: SettingScreen,
  MyReview: MyReviewScreen,
  MyPoint: MyPointScreen,
  ChangePwd: ChangePwdScreen,
  EditProfile: EditProfileScreen,
  ProductDetail: ProductDetailScreen,
  SearchBrandDetail: SearchBrandDetailScreen,
  Calendar: CalendarScreen,
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


export default createBottomTabNavigator({
  LinksStack,
  HomeStack,
  ProductStack,
  IngredientStack,
  MyListStack,
  // LoginStack,
  MyPageStack,
}, {
    backBehavior: "history",
    tabBarOptions: {
      activeTintColor: "#a695fe",
      inactiveTintColor: "#c3c3c3",
      labelStyle: { marginBottom: 8, marginTop: 10, fontWeight: "bold" },
      style: [{ backgroundColor: "transparent", height: MyConstants.TABBAR_HEIGHT, borderTopColor: "transparent" }],
    }
  });
