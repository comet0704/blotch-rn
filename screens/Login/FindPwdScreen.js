import React from 'react';
import { KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';

export default class FindPwdScreen extends React.Component {

  Necessarry = (
    <MyAppText style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </MyAppText>
  );

  state = {
    sendPressed: false,
    image: null,
    email: null,
    id: null,
    password: null,
    password_confirm: null,
  };

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

  onPressSend = (email) => {
    this.setState({ sendPressed: true });
    if (this.checkValidation(this.state.email, "email")) { // 이메일, 패스워드 모두 유효한 값이면
      this.requestForgetPassword(email)
    }
  }

  render() {
    let { sendPressed, image, email, id, password, password_confirm } = this.state;
    return (
      <View style={{flex:1}}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={MyStyles.container}>
              <MyAppText style={MyStyles.text_header1}>Forgot</MyAppText>
              <MyAppText style={[MyStyles.text_header1, { marginTop: 0 }]}>Password?</MyAppText>
              <MyAppText style={MyStyles.text_desc}>Please enter your email address and we will send you an email about how to reset your password.</MyAppText>

              <View style={[MyStyles.inputBox, (this.checkValidation(email, "email") == false && sendPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                {this.checkValidation(email, "empty") == false ? <MyAppText style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Email {this.Necessarry}</MyAppText> : null}
                <TextInput
                  returnKeyType="done"
                  onChangeText={(text) => { this.setState({ email: text }) }}
                  keyboardType="email-address"
                />
              </View>
              {
                ((this.checkValidation(email, "email") == false) && sendPressed == true) ?
                  <MyAppText style={MyStyles.warningText}>Please Confirm your Email</MyAppText> : null
              }

              <View style={{ flex: 1, marginTop: 35, flexDirection: "row" }}>
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_primary_cover]} onPress={() => { this.onPressSend(this.state.email) }}>
                  <MyAppText style={MyStyles.btn_primary}>Send</MyAppText>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_primary_white_cover, { marginLeft: 20 }]} onPress={() => {this.props.navigation.goBack()}}>
                  <MyAppText style={MyStyles.btn_primary_white}>Back to Login</MyAppText>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }

  requestForgetPassword(p_email) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.forgotPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
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
        }

        this.refs.toast.showBottom("Temperary passcode has been sent to your email.");

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