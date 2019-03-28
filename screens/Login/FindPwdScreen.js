import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
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

export default class FindPwdScreen extends React.Component {

  Necessarry = (
    <Text style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </Text>
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
              <Text style={MyStyles.text_header1}>Forgot</Text>
              <Text style={[MyStyles.text_header1, { marginTop: 0 }]}>Password?</Text>
              <Text style={MyStyles.text_desc}>Please enter your email address and we will send you an email about how to reset your password.</Text>

              <View style={[MyStyles.inputBox, (this.checkValidation(email, "email") == false && sendPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                {this.checkValidation(email, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Email {this.Necessarry}</Text> : null}
                <TextInput
                  returnKeyType="done"
                  onChangeText={(text) => { this.setState({ email: text }) }}
                  keyboardType="email-address"
                />
              </View>
              {
                ((this.checkValidation(email, "email") == false) && sendPressed == true) ?
                  <Text style={MyStyles.warningText}>Please Confirm your Email</Text> : null
              }

              <View style={{ flex: 1, marginTop: 35, flexDirection: "row" }}>
                <TouchableOpacity style={[MyStyles.btn_primary_cover]} onPress={() => { this.onPressSend(this.state.email) }}>
                  <Text style={MyStyles.btn_primary}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[MyStyles.btn_primary_white_cover, { marginLeft: 20 }]} onPress={() => {this.props.navigation.goBack()}}>
                  <Text style={MyStyles.btn_primary_white}>Back to Login</Text>
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