import React from 'react';
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

export default class ProductContainerScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            const initialPage = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.product_container_initial_page)
            this.setState({initialPage, initialPage});
          }}
        />
        <TopbarWithBlackBack title="Product" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
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
            <FragmentRecommendProduct navigation={this.props.navigation} ></FragmentRecommendProduct>
          </View>
        </ScrollableTabView>

      </KeyboardAvoidingView>
    );
  }
};