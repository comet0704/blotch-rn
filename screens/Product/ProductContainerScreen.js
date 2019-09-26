import React from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { NavigationEvents } from 'react-navigation';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import { FragmentBestProduct } from './FragmentBestProduct';
import { FragmentNewProduct } from './FragmentNewProduct';
import { FragmentRecommendProduct } from './FragmentRecommendProduct';

export default class ProductContainerScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    handleAndroidBackButton(this, exitAlert);
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler()
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            var initialPage = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.product_container_initial_page)

            this.props.navigation.setParams({ [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: null })
            if (initialPage == undefined || initialPage == null) {
            } else {
              this.interval = setInterval(() => {
                this.tabView.goToPage(initialPage);
                clearInterval(this.interval)
              }, 200)
            }

            try {
              this.refs.recommendationTAB.onNavigationEvent()
            } catch (error) {

            }
          }}
        />
        <TopbarWithBlackBack title="Product" isRootDepth={true} onPress={() => {
          this.props.navigation.goBack(null)
        }}></TopbarWithBlackBack>
        <ScrollableTabView
          ref={(tabView) => { this.tabView = tabView }}
          style={{ height: 20, borderBottomWidth: 0, marginTop: 10 }}
          tabBarInactiveTextColor={Colors.color_dcdedd}
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
        <Image source={require("../../assets/images/ic_tabbar_border.png")} style={{ width: "100%", height: MyConstants.TABBAR_TOP_BORDER_HEIGHT, position: "absolute", bottom: 0 }} />
      </KeyboardAvoidingView>
    );
  }
};