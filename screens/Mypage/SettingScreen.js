import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  Button,
  AsyncStorage,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles'
import Net from '../../Net/Net';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyConstants from '../../constants/MyConstants';
import { Updates, LinearGradient } from 'expo';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';

let pkg = require('../../app.json')
export default class SettingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    console.log(pkg.expo.version)
  }

  async doLogout() {
    await AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, "");

    // 이제는 앱을 로그아웃 상태로 만들어야 하겠는데 그러자면 재기동하자.
    this.requestLogout(global.login_info.email);
  }

  requestLogout(p_email) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.logout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        email: p_email
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });
        global.login_info = null;
        Updates.reload()
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding">

          <TopbarWithBlackBack title="Setting" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={MyStyles.container}>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Version</MyAppText>
                <MyAppText style={{ fontSize: 12, color: Colors.primary_purple }}>Ver {pkg.expo.version} {pkg.expo.version == global.setting.version_name ? "(Latest Version)" : null}</MyAppText>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.props.navigation.navigate("Policy") }}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Privacy Policy</MyAppText>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.props.navigation.navigate("Notification") }}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Notification</MyAppText>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.props.navigation.navigate("Announcements") }}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Announcements</MyAppText>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.props.navigation.navigate("ContactUs") }}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Contact Us</MyAppText>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]} onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure?',
                  [
                    {
                      text: 'No',
                      onPress: () => { },
                      style: 'cancel',
                    },
                    {
                      text: 'Yes', onPress: () => {
                        this.doLogout()
                      }
                    },
                  ],
                  { cancelable: false },
                );

              }}>
                <MyAppText style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Logout</MyAppText>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }
}