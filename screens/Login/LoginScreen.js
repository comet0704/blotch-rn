import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  NavigationActions
} from 'react-native';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import SignupScreen from './SignupScreen';
import FindPwdScreen from './FindPwdScreen';

class Greetings extends Component {
  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text>Hello {this.props.name}</Text>
      </View>
    )
  }
}
export default class LoginScreen extends React.Component {

  Signup = (
    <Text onPress={() => this.onPressSignup()} style={{ color: "#a695fe", fontSize: 13 }}>
      Sign Up!
    </Text>
  );


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

  state = {
    isSignUpPressed: false,
    loginPressed: false,
    isFindPwdPressed: false,
    email: null,
    password: null,
  };

  onPressLogin = (email, pass) => {
    this.setState({ loginPressed: true });
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

  render() {
    const { isSignUpPressed, loginPressed, isFindPwdPressed, email, password } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <Image source={require('../../assets/images/Login/login_bg.png')} style={styles.background_image} />
            <TopbarWithWhiteBack onPress={() => { this.props.navigation.navigate("Home") }}></TopbarWithWhiteBack>
            <Image source={require('../../assets/images/Login/logo.png')} style={[styles.h_auto, { width: "30%", marginTop: 110 }]} resizeMode="contain"></Image>
            <Text style={{ marginLeft: "auto", marginRight: "auto", color: "white", marginTop: -20, fontSize: 12, fontWeight: "100" }} >Your Beauty Counselor</Text>

            <View style={[styles.h_auto, { width: "85%", marginTop: 90, borderRadius: 15, backgroundColor: "white", paddingVertical: 40, paddingHorizontal: 18 }]}>
              <View style={[styles.inputBox, (this.checkValidation(email, "email") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
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
                  <Text style={styles.warningText}>Please Confirm your Email</Text> : null
              }

              <View style={[styles.inputBox, (this.checkValidation(password, "password") == false && loginPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
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
                  <Text style={styles.warningText}>Please Confirm your password</Text> : null
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

              <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.5}>
                  {/*We can use any component which is used to shows something inside 
                  TouchableOpacity. It shows the item inside in horizontal orientation */}
                  <Image
                    //We are showing the Image from online
                    source={require("../../assets/images/Login/ic_facebook.png")}
                    //You can also show the image from you project directory like below
                    //source={require('./Images/facebook.png')}
                    //Image Style
                    style={styles.ImageIconStyle}
                  />
                  <Text style={styles.TextStyle}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5}>
                  {/*We can use any component which is used to shows something inside 
                  TouchableOpacity. It shows the item inside in horizontal orientation */}
                  <Image
                    //We are showing the Image from online
                    source={require("../../assets/images/Login/ic_google.png")}
                    //You can also show the image from you project directory like below
                    //source={require('./Images/facebook.png')}
                    //Image Style
                    style={styles.ImageIconStyle}
                  />
                  <Text style={styles.TextStyle}>Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={{ color: "white", marginTop: 45, marginBottom: 20, textAlign: "center", fontSize: 12, fontWeight: "100" }}>copyright © 2019 by Chemi. all rights reserved</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  h_auto: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  background_image: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },
  inputBox: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#e3e5e4",
    marginTop: 20,
    justifyContent: "center"
  },

  warningText: {
    color: "#f33f5b",
    fontSize: 12,
    marginTop: 5,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    marginLeft: 5,
  },
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
});