import React from 'react';
import { TouchableWithoutFeedback, Keyboard, AsyncStorage, Button, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import MyStyles from '../../constants/MyStyles';
import Models from '../../Net/Models';
import Net from '../../Net/Net';
import MyConstants from '../../constants/MyConstants';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loginPressed: false,
      email: null,
      password: null,
    };
  }

  checkValidation = (value, check_type) => {
    if (value == null || value.length == 0) {
      return false
    }

    if (check_type == "id") {
      if (value.length < 4) {
        return false
      }
    }

    if (check_type == "password") {
      if (value.length < 8) {
        return false
      }
    }

    if (check_type == "password_confirm") {
      if (value != this.state.password) {
        return false
      }
    }

    return true
  }

  onPressLogin = (email, pass) => {
    this.setState({ loginPressed: true });
    if (this.checkValidation(this.state.email, "email") && this.checkValidation(this.state.password, "password")) { // 이메일, 패스워드 모두 유효한 값이면
      this.requestLogin(email, pass)
    }
  }

  onPressForgetPassword() {
    this.props.navigation.navigate('FindPwd')
  }

  onPressSignup = () => {
    this.props.navigation.navigate('Signup')
  }

  static navigationOptions = {
    header: null,
  };

  Signup = (
    <Text onPress={() => this.onPressSignup()} style={{ color: "#a695fe", fontSize: 13 }}>
      Sign Up!
    </Text>
  );

  onLoginWithFacebook = () => {

  }

  render() {
    const { loginPressed, email, password } = this.state;
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
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardDismissMode="on-press"  /*keyboardVerticalOffset={100}*/>

          <TouchableWithoutFeedback style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" onPress={() => { Keyboard.dismiss() }} >
            <View style={{ flex: 1 }}>
              <Image source={require('../../assets/images/Login/login_bg.png')} style={MyStyles.background_image} />
              <TopbarWithWhiteBack onPress={() => { this.props.navigation.navigate("Home") }}></TopbarWithWhiteBack>
              <Image style={{ flex: 100 }}></Image>
              <Image source={require('../../assets/images/Login/logo.png')} style={[MyStyles.h_auto, { width: "30%", }]} resizeMode="contain"></Image>
              <Text style={{ marginLeft: "auto", marginRight: "auto", color: "white", marginTop: -20, fontSize: 12, fontWeight: "100" }} >Your Beauty Counselor</Text>
              <Image style={{ flex: 80 }}></Image>
              <View style={[MyStyles.h_auto, { width: "85%", borderRadius: 15, backgroundColor: "white", paddingVertical: 40, paddingHorizontal: 18 }]}>
                <View style={[MyStyles.inputBox, (this.checkValidation(email, "email") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                  {this.checkValidation(email, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Email {this.Necessarry}</Text> : null}
                  <TextInput
                    returnKeyType="next"
                    onChangeText={(text) => { this.setState({ email: text }) }}
                    onSubmitEditing={() => { this.pwdTextInput.focus(); }}
                    keyboardType="email-address"
                  />
                </View>
                {
                  ((this.checkValidation(email, "email") == false) && loginPressed == true) ?
                    <Text style={MyStyles.warningText}>Please Confirm your Email</Text> : null
                }

                <View style={[MyStyles.inputBox, (this.checkValidation(password, "password") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                  {this.checkValidation(password, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Password {this.Necessarry}</Text> : null}
                  <TextInput
                    returnKeyType="done"
                    ref={(input) => { this.pwdTextInput = input; }}
                    onChangeText={(text) => { this.setState({ password: text }) }}
                    secureTextEntry={true}
                  />
                </View>
                {
                  ((this.checkValidation(password, "password") == false) && loginPressed == true) ?
                    <Text style={MyStyles.warningText}>Please Confirm your password</Text> : null
                }

                <Text style={{ marginTop: 10, marginLeft: "auto", fontSize: 12 }} onPress={() => this.onPressForgetPassword()}>
                  Forget Password
                </Text>

                <TouchableOpacity style={{ marginTop: 30 }}>
                  <Button onPress={() => this.onPressLogin(this.state.email, this.state.password)} color="#a695fe" style={{ margin: 60, borderRadius: 5, color: "white", fontSize: 15 }} title="LOGIN" />
                </TouchableOpacity>

                <View style={{ alignItems: "center", fontSize: 13, marginTop: 25 }}>
                  <Text style={{ color: "#aeaeae" }}>Don't have an account?  {this.Signup}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, justifyContent: 'space-between' }}>
                  <View
                    style={{
                      alignItems: "flex-start",
                      borderBottomColor: '#aeaeae',
                      borderBottomWidth: 1,
                      width: "30%",
                    }}
                  />
                  <Text
                    style={{ textAlign: "center", color: "#aeaeae" }}
                  >or Login with</Text>
                  <View
                    style={{
                      alignItems: "flex-end",
                      borderBottomColor: '#aeaeae',
                      borderBottomWidth: 1,
                      width: "30%",
                    }}
                  />
                </View>

                <View style={{ flex: 1, flexDirection: "row", marginTop: 20, marginBottom: 40 }}>
                  <TouchableOpacity style={MyStyles.FacebookStyle} activeOpacity={0.5} onPress={() => {this.onLoginWithFacebook()}}>
                    {/*We can use any component which is used to shows something inside 
                  TouchableOpacity. It shows the item inside in horizontal orientation */}
                    <Image
                      //We are showing the Image from online
                      source={require("../../assets/images/Login/ic_facebook.png")}
                      //You can also show the image from you project directory like below
                      //source={require('./Images/facebook.png')}
                      //Image Style
                      style={MyStyles.ImageIconStyle}
                    />
                    <Text style={MyStyles.TextStyle}>Facebook</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={MyStyles.GooglePlusStyle} activeOpacity={0.5}>
                    {/*We can use any component which is used to shows something inside 
                  TouchableOpacity. It shows the item inside in horizontal orientation */}
                    <Image
                      //We are showing the Image from online
                      source={require("../../assets/images/Login/ic_google.png")}
                      //You can also show the image from you project directory like below
                      //source={require('./Images/facebook.png')}
                      //Image Style
                      style={MyStyles.ImageIconStyle}
                    />
                    <Text style={MyStyles.TextStyle}>Google</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Image style={{ flex: 45 }}></Image>
              <Text style={{ color: "white", marginTop: 20, marginBottom: 10, textAlign: "center", fontSize: 12, fontWeight: "100" }}>copyright © 2019 by Chemi. all rights reserved</Text>
              <Image style={{ flex: 30 }}></Image>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }

  requestLogin(p_email, p_pwd) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        password: p_pwd,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        } else {
          Models.login_user = responseJson.login_user;
          global.login_user = Models.login_user;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          this.props.navigation.navigate("Home")
        }

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

  }
}
