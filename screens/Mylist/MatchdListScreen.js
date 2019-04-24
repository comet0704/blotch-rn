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
import { FragmentMatchdProduct } from './FragmentMatchdProduct';
import { NavigationEvents } from 'react-navigation';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
import { FragmentMatchdBrand } from './FragmentMatchdBrand';

export default class MatchdListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0
    }
  }
  componentDidMount() {
  }

  componentWillMount() {
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <TopbarWithBlackBack title="Match'd List" onPress={() => {
          this.props.navigation.goBack(null)
        }}></TopbarWithBlackBack>
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
          <View tabLabel="Product" style={{ flex: 1 }}>
            <FragmentMatchdProduct navigation={this.props.navigation} ></FragmentMatchdProduct>
          </View>
          <View tabLabel="Brand" style={{ flex: 1 }}>
            <FragmentMatchdBrand navigation={this.props.navigation} ></FragmentMatchdBrand>
          </View>
        </ScrollableTabView>

      </KeyboardAvoidingView>
    );
  }
};