import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { TouchableWithoutFeedback, Keyboard, AsyncStorage, Button, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import MyStyles from '../../constants/MyStyles';
import Models from '../../Net/Models';
import Net from '../../Net/Net';
import MyConstants from '../../constants/MyConstants';
import { Facebook, Google } from "expo";
import Colors from '../../constants/Colors';

export default class MyPageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loginPressed: false,
      email: null,
      password: null,
      image: null,
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

  onLoginWithFacebook = async () => {
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
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  onLoginWithGoogle = async () => {
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
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  render() {
    const { loginPressed, email, password, image } = this.state;
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
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" onPress={() => { Keyboard.dismiss() }} >
            <View style={{ flex: 1, backgroundColor:Colors.color_f8f8f8 }}>
              {/* 사진, 텍스트 */}
              <View style={[MyStyles.profile_back, MyStyles.padding_h_main , { justifyContent: "center"}]}>
                <Image source={require('../../assets/images/ic_profile_back.png')} style={MyStyles.background_image} />
                <TouchableOpacity style={{ position: "absolute", padding: 15, top: 5, right: 0 }}>
                  <Image source={require('../../assets/images/ic_edit.png')} style={MyStyles.ic_edit} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems:"center" }}>
                  <View style={[MyStyles.profile_box1]}>
                    {/* <TouchableOpacity onPress={() => { this.setState({ photoModalVisible: true }) }} style={MyStyles.camera_box}>
                      <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={{ width: 12, height: 11, alignSelf: "center" }} />
                    </TouchableOpacity> */}
                    <Image source={image == null ? (require('../../assets/images/Login/ic_avatar.png')) : { uri: image }} style={image == null ? { width: 117 / 3, height: 166 / 3, alignSelf: "center" } : { width: 315 / 3, height: 315 / 3, borderRadius: 100, }} />
                  </View>
                  <View style={{marginLeft:15}}>
                    <Text style={{ fontSize: 59 / 3, color: "white", fontWeight: "500" }}>Hello Elliel</Text>
                    <Text style={{ fontSize: 59 / 3, color: "white" }}>Do you need advice?</Text>
                  </View>
                </View>
              </View>

              
            </View>
          </ScrollView>
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
          global.login_user = responseJson.login_user;
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

  requestLoginGoogle(p_email, p_id, p_profile_image) {
    console.log(p_email + "_" + p_id + "_ " + p_profile_image)
    this.setState({
      isLoading: true,
    });
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
          global.login_user = responseJson.login_user;
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

  requestLoginFacebook(p_email, p_id, p_profile_image) {
    this.setState({
      isLoading: true,
    });
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
          global.login_user = responseJson.login_user;
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
