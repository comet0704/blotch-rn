import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles'
import Net from '../../Net/Net';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyConstants from '../../constants/MyConstants';

export default class ChangePwdScreen extends React.Component {

  Necessarry = (
    <Text style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </Text>
  );

  state = {
    sendPressed: false,
    cur_password: null,
    password: null,
    password_confirm: null,
  };

  checkValidation = (value, check_type) => {
    if (value == null || value.length == 0) {
      return false
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

  onResetPwd = (old_pwd, pwd1, pwd2) => {
    this.setState({ sendPressed: true });
    if (this.checkValidation(old_pwd, "empty") && this.checkValidation(pwd1, "password") && this.checkValidation(pwd1, "password_confirm")) { // 이메일, 패스워드 모두 유효한 값이면
      this.requestChangePassword(old_pwd, pwd1, pwd2)
    }
  }

  render() {
    let { sendPressed, cur_password, password, password_confirm } = this.state;
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

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={MyStyles.container}>
              <Text style={MyStyles.text_header1}>Change Password</Text>
              <Text style={MyStyles.text_desc}>It's a good idea to use a strong password{"\n"}that you're not using elsewhere.</Text>

              <View style={[MyStyles.inputBox, (this.checkValidation(cur_password, "empty") == false && sendPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                {this.checkValidation(cur_password, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Current Password {this.Necessarry}</Text> : null}
                <TextInput
                  returnKeyType="next"
                  onSubmitEditing={() => { this.pwdTextInput.focus(); }}
                  onChangeText={(text) => { this.setState({ cur_password: text }) }}
                  secureTextEntry={true}
                />
              </View>
              {
                ((this.checkValidation(cur_password, "empty") == false) && sendPressed == true) ?
                  <Text style={MyStyles.warningText}>Please Confirm your Password</Text> : null
              }

              <View style={[MyStyles.inputBox, (this.checkValidation(password, "password") == false && sendPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                {this.checkValidation(password, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>New Password {this.Necessarry}</Text> : null}
                <TextInput
                  returnKeyType="next"
                  ref={(input) => { this.pwdTextInput = input; }}
                  onSubmitEditing={() => { this.pwdConfirmTextInput.focus(); }}
                  onChangeText={(text) => { this.setState({ password: text }) }}
                  secureTextEntry={true}
                />
              </View>
              {
                ((this.checkValidation(password, "password") == false) && sendPressed == true) ?
                  <Text style={MyStyles.warningText}>Please Enter a Password at least eight characters</Text> : null
              }

              <View style={[MyStyles.inputBox, (this.checkValidation(password_confirm, "password_confirm") == false && sendPressed == true) ? { borderColor: "#f33f5b" } : {}]}>
                {this.checkValidation(password_confirm, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Confirm Password {this.Necessarry}</Text> : null}
                <TextInput
                  returnKeyType="done"
                  ref={(input) => { this.pwdConfirmTextInput = input; }}
                  onChangeText={(text) => { this.setState({ password_confirm: text }) }}
                  secureTextEntry={true}
                />
              </View>
              {
                ((this.checkValidation(password_confirm, "password_confirm") == false) && sendPressed == true) ?
                  <Text style={MyStyles.warningText}>Please Confirm a Password</Text> : null
              }

              <View style={{ flex: 1, marginTop: 35, flexDirection: "row" }}>
                <TouchableOpacity style={[MyStyles.btn_primary_cover]} onPress={() => { this.onResetPwd(this.state.cur_password, this.state.password, this.state.password_confirm) }}>
                  <Text style={MyStyles.btn_primary}>Reset Password</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }

  requestChangePassword(p_pwd_old, p_pwd1, p_pwd2) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.changePassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        password_old: p_pwd_old,
        password: p_pwd1,
        password2: p_pwd2,
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
        // 변경된 패서드 저장.
        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.user_pwd, p_pwd1);

        Alert.alert(
          '',
          'The password has been changed.',
          [
            {
              text: 'OK', onPress: () => {
                this.props.navigation.pop(2)
              }
            },
          ],
          { cancelable: false },
        );
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