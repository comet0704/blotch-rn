import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import {
  KeyboardAvoidingView,
  View,
  Image,
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient } from 'expo';
import MyStyles from '../../constants/MyStyles';
import { FlatGrid } from 'react-native-super-grid';
import MyConstants from '../../constants/MyConstants';
import { FragmentNewProduct } from './FragmentNewProduct';
import { FragmentBestProduct } from './FragmentBestProduct';
import { FragmentRecommendProduct } from './FragmentRecommendProduct';
import { NavigationEvents } from 'react-navigation';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';

export default class ProductContainerScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0
    }
  }
  componentDidMount() {
    handleAndroidBackButton(this, exitAlert);
  }

  componentWillMount() {
    removeAndroidBackButtonHandler()
  }
  
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            const initialPage = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.product_container_initial_page)
            this.setState({initialPage, initialPage});
            try {
              this.refs.recommendationTAB.onNavigationEvent()
            } catch (error) {

            }
          }}
        />
        <TopbarWithBlackBack title="Product" isRootDepth={true} onPress={() => {
           this.props.navigation.goBack(null) }}></TopbarWithBlackBack>
        <ScrollableTabView
          style={{ height: 20, borderBottomWidth: 0, marginTop: 10 }}
          initialPage={this.state.initialPage}
          tabBarInactiveTextColor={Colors.color_dcdedd}
          page={this.state.initialPage}
          tabBarActiveTextColor={Colors.primary_dark}
          tabBarTextStyle={{ fontWeight: "400", fontSize: 14 }}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary_purple }}
          renderTabBar={() => <DefaultTabBar />}
        >
          <View tabLabel="New" style={{ flex: 1 }}>
            <FragmentNewProduct navigation={this.props.navigation} ></FragmentNewProduct>
          </View>
          <View tabLabel="Best" style={{ flex: 1 }}>
            <FragmentBestProduct navigation={this.props.navigation} ></FragmentBestProduct>
          </View>
          <View tabLabel="Recommendation" style={{ flex: 1 }}>
            <FragmentRecommendProduct ref='recommendationTAB' navigation={this.props.navigation} ></FragmentRecommendProduct>
          </View>
        </ScrollableTabView>

      </KeyboardAvoidingView>
    );
  }
};