import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Modal, TouchableHighlight, StatusBar, TouchableWithoutFeedback, Keyboard, AsyncStorage, Button, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import MyStyles from '../../constants/MyStyles';
import Models from '../../Net/Models';
import Net from '../../Net/Net';
import MyConstants from '../../constants/MyConstants';
import { Updates, Facebook, Google } from "expo";
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';
import Common from '../../assets/Common';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loginPressed: false,
      email: null,
      password: null,
      askInputQueModal: false,
    };
  }

  componentDidMount() {
    handleAndroidBackButton(this, () => {
      this.props.navigation.navigate('Home')
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler()
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
    <MyAppText onPress={() => this.onPressSignup()} style={{ color: "#a695fe", fontSize: 13 }}>
      Sign Up!
    </MyAppText>
  );

  onLoginWithFacebook = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const result = await Facebook.logInWithReadPermissionsAsync(MyConstants.FACEBOOK_APP_ID, {
        permissions: ['public_profile', 'email'],
      });
      if (result.type === 'success') {
        console.log(result)
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
        const result_info = await response.json();
        console.log(result_info)

        this.requestLoginFacebook(result_info.name, result_info.id, "");
      } else {
        // type === 'cancel'
        this.setState({
          isLoading: false,
        });
      }
    } catch ({ message }) {
      this.setState({
        isLoading: false,
      });
      alert(`Facebook Login Error: ${message}`);
    }
  }

  onLoginWithGoogle = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const result = await Google.logInAsync({
        androidClientId:
          MyConstants.ANDROID_CLIENT_ID,
        iosClientId:
          MyConstants.IOS_CLIENT_ID,
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        console.log(result);
        this.requestLoginGoogle(result.user.email, result.user.id, result.user.photoUrl)

      } else {
        console.log("cancelled")
        this.setState({
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({
        isLoading: false,
      });
      console.log("error", e)
    }
  }

  render() {
    const { loginPressed, email, password } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/* <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
        /> */}
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
            <View style={{ flex: 310 }}>
              <Image source={require('../../assets/images/Login/login_bg.png')} style={MyStyles.background_image} />
              <TopbarWithWhiteBack onPress={() => { this.props.navigation.navigate('Home') }}></TopbarWithWhiteBack>
              <Image style={{ flex: 100 }} />
              <View style={[MyStyles.h_auto, { justifyContent: "center", flexDirection: "row" }]}>
                <Image style={{ width: 10 }} />
                <Image source={require('../../assets/images/Login/logo.png')} style={[MyStyles.h_auto, MyStyles.ic_logo]} />
              </View>
              <MyAppText style={{ marginLeft: "auto", marginRight: "auto", color: "white", marginTop: 8, fontSize: 12, fontWeight: "100" }} >Your Beauty Counselor</MyAppText>
              <Image style={{ flex: 200 }} />
              <View style={[MyStyles.h_auto, { width: "85%", borderRadius: 15, backgroundColor: "white", paddingVertical: 40, paddingHorizontal: 18 }]}>
                <View style={[MyStyles.inputBox, { marginTop: -20 }, (this.checkValidation(email, "email") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                  {this.checkValidation(email, "empty") == false ? <MyAppText style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Email {this.Necessarry}</MyAppText> : null}
                  <TextInput
                    returnKeyType="next"
                    onChangeText={(text) => { this.setState({ email: text }) }}
                    onSubmitEditing={() => { this.pwdTextInput.focus(); }}
                    keyboardType="email-address"
                  />
                </View>
                {
                  ((this.checkValidation(email, "email") == false) && loginPressed == true) ?
                    <MyAppText style={MyStyles.warningText}>Please Confirm your Email</MyAppText> : null
                }

                <View style={[MyStyles.inputBox, (this.checkValidation(password, "password") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                  {this.checkValidation(password, "empty") == false ? <MyAppText style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Password {this.Necessarry}</MyAppText> : null}
                  <TextInput
                    returnKeyType="done"
                    ref={(input) => { this.pwdTextInput = input; }}
                    onChangeText={(text) => { this.setState({ password: text }) }}
                    secureTextEntry={true}
                  />
                </View>
                {
                  ((this.checkValidation(password, "password") == false) && loginPressed == true) ?
                    <MyAppText style={MyStyles.warningText}>Please Confirm your password</MyAppText> : null
                }

                <MyAppText style={{ marginTop: 10, marginLeft: "auto", fontSize: 12 }} onPress={() => this.onPressForgetPassword()}>
                  Forget Password
                </MyAppText>

                <TouchableOpacity activeOpacity={0.8} style={{ marginTop: 27, backgroundColor: Colors.primary_purple, borderRadius: 5, height: 135 / 3, justifyContent: "center" }} onPress={() => {
                  this.onPressLogin(this.state.email, this.state.password)
                }}>
                  <MyAppText style={{ color: "white", fontSize: 15, textAlign: "center", fontWeight: "500" }}>LOGIN</MyAppText>
                </TouchableOpacity>

                <View style={{ alignItems: "center", fontSize: 13, marginTop: 18 }}>
                  <MyAppText style={{ color: "#aeaeae" }}>Don't have an account?  {this.Signup}</MyAppText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, justifyContent: 'space-between' }}>
                  <View
                    style={{
                      alignItems: "flex-start",
                      borderBottomColor: Colors.color_e3e5e4,
                      borderBottomWidth: 1,
                      width: "30%",
                    }}
                  />
                  <MyAppText
                    style={{ textAlign: "center", color: "#aeaeae" }}
                  >or Login with</MyAppText>
                  <View
                    style={{
                      alignItems: "flex-end",
                      borderBottomColor: Colors.color_e3e5e4,
                      borderBottomWidth: 1,
                      width: "30%",
                    }}
                  />
                </View>

                <View style={{ flex: 1, flexDirection: "row", marginTop: 20, marginBottom: 40 }}>
                  <TouchableOpacity activeOpacity={0.8} style={MyStyles.FacebookStyle} activeOpacity={0.5} onPress={() => { this.onLoginWithFacebook() }}>
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
                    <MyAppText style={MyStyles.TextStyle}>Facebook</MyAppText>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} style={MyStyles.GooglePlusStyle} activeOpacity={0.5} onPress={() => { this.onLoginWithGoogle() }}>
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
                    <MyAppText style={MyStyles.TextStyle}>Google</MyAppText>
                  </TouchableOpacity>
                </View>
              </View>
              <Image style={{ flex: 100 }} />
              <MyAppText style={{ color: "white", marginBottom: 50 / 3, textAlign: "center", fontSize: 12, fontWeight: "100" }}>copyright © 2019 by Chemi. all rights reserved</MyAppText>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.askInputQueModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ askInputQueModal: false });
                  // 로그인 되었으면 앱을 리로딩
                  Updates.reload()
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Tell us little more about you so {"\n"} we can find recommendation!</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ askInputQueModal: false });
                    this.props.navigation.navigate("Questionnare", { [MyConstants.NAVIGATION_PARAMS.is_from_sign_up]: true })
                  }}
                    style={[MyStyles.dlg_btn_primary_cover]}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_white_cover]}
                    onPress={() => {
                      this.setState({ askInputQueModal: false });
                      // 로그인 되었으면 앱을 리로딩
                      Updates.reload()
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>Not now</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>
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
          global.login_info = responseJson.result_data.login_user;
          global.setting = responseJson.result_data.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.user_pwd, p_pwd);
          // this.props.navigation.navigate("Home")
          // 로그인 되었으면 앱을 리로딩
          Updates.reload()
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

  requestLoginGoogle(p_email, p_id, p_profile_image) {
    console.log(p_email + "_" + p_id + "_ " + p_profile_image)
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.auth.loginGoogle, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        id: p_id,
        profile_image: p_profile_image,
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
          global.login_info = responseJson.result_data.login_user;
          global.setting = responseJson.result_data.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));
          // 처음 가입하는 회원의 경우 추가정보입력 팝업 현시
          if (responseJson.result_data.new_user == 1) {
            this.props.navigation.navigate('SnsMoreInfo')
          } else {
            Updates.reload()
          }
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

  requestLoginFacebook(p_email, p_id, p_profile_image) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.auth.loginFacebook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        id: p_id,
        profile_image: p_profile_image,
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
          global.login_info = responseJson.result_data.login_user;
          global.setting = responseJson.result_data.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));

          // 처음 가입하는 회원의 경우 추가정보입력 팝업 현시
          if (responseJson.result_data.new_user == 1) {
            this.props.navigation.navigate('SnsMoreInfo')
          } else {
            Updates.reload()
          }
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
