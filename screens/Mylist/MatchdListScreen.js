import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';
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
    }
  }
  componentDidMount() {
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            this.refs.MatchdProductTab.onNavigationEvent()
            if (this.refs.MatchdBrandTab != null) {
              this.refs.MatchdBrandTab.onNavigationEvent()
            }
          }}
        />
        <TopbarWithBlackBack title="Match'd List" onPress={() => {
          this.props.navigation.goBack(null)
        }}></TopbarWithBlackBack>
        <ScrollableTabView
          style={{ height: 20, borderBottomWidth: 0, marginTop: 10 }}
          tabBarInactiveTextColor={Colors.color_dcdedd}
          tabBarActiveTextColor={Colors.primary_dark}
          tabBarTextStyle={{ fontWeight: "400", fontSize: 14 }}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary_purple }}
          renderTabBar={() => <DefaultTabBar />}
        >
          <View tabLabel="Product" style={{ flex: 1 }}>
            <FragmentMatchdProduct ref="MatchdProductTab" navigation={this.props.navigation} ></FragmentMatchdProduct>
          </View>
          <View tabLabel="Brand" style={{ flex: 1 }}>
            <FragmentMatchdBrand ref="MatchdBrandTab" navigation={this.props.navigation} ></FragmentMatchdBrand>
          </View>
        </ScrollableTabView>

      </KeyboardAvoidingView>
    );
  }
};