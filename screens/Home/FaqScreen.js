import React from 'react';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import { KeyboardAvoidingView, 
        View, 
        Image,
        Text,
        TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo';
import MyStyles from '../../constants/MyStyles';

export default class FaqScreen extends React.Component {

  state = {
  };

  render() {
    let { sendPressed, image, email, id, password, password_confirm } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <TopbarWithBlackBack title="FAQ" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <ScrollableTabView
          style={{ height: 20, borderBottomWidth: 0, marginTop: 10 }}
          initialPage={0}
          tabBarInactiveTextColor={Colors.color_dcdedd}
          tabBarActiveTextColor={Colors.primary_dark}
          tabBarTextStyle={{ fontWeight: "400", fontSize: 14 }}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary_purple }}
          renderTabBar={() => <DefaultTabBar />}
        >
          <View tabLabel="All">
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

            <View>
              <View style={[{flexDirection:"row", alignItems:"center"}, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{backgroundColor:"red", fontSize:12, borderRadius:2, paddingLeft:5, paddingRight:5, color:"white"}}>Category</Text>
                <Text style={{flex:1, marginLeft:10, marginRight:10, color:Colors.primary_dark, fontSize:15}}>Question?</Text>
                <TouchableOpacity>
                  <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')}></Image>
                </TouchableOpacity>
              </View>

              <View style={[MyStyles.padding_main, {backgroundColor:Colors.color_f8f8f8}]}>
                <Text style={{fontSize:13, color:Colors.color_949191}}>This means you were either born in Australia, became a citize
n by descent (if one of your parents is an Australian citizen an
d your birth is registered here)</Text>
              </View>
            </View>
          </View>
          <View tabLabel="Category"></View>
        </ScrollableTabView>

      </KeyboardAvoidingView>
    );
  }
};