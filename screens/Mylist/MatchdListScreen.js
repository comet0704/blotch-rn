import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { NavigationEvents } from 'react-navigation';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import { FragmentMatchdBrand } from './FragmentMatchdBrand';
import { FragmentMatchdProduct } from './FragmentMatchdProduct';

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