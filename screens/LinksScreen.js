import React from 'react';
import {
  Text,
} from 'react-native';

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Colors from '../constants/Colors';

export default () => {
  return <ScrollableTabView
    style={{height:20, borderBottomWidth:0, marginTop:10}}
    initialPage={1}
    tabBarUnderlineStyle={{backgroundColor:Colors.color_primary_purple}}
    renderTabBar={() => <DefaultTabBar />}
  >
    <Text tabLabel='Tab #1'>My</Text>
    <Text tabLabel='Tab #2'>favorite</Text>
    <Text tabLabel='Tab #3'>project</Text>
  </ScrollableTabView>;
}