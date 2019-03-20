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
import { MyStyles } from '../../constants/MyStyles'

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

  render() {
    let { sendPressed, image, email, id, password, password_confirm } = this.state;
    return (
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
              <TouchableOpacity style={[MyStyles.btn_primary_cover]} onPress={() => { this.setState({ sendPressed: true }) }}>
                <Text style={MyStyles.btn_primary}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[MyStyles.btn_primary_white_cover, { marginLeft: 20 }]} onPress={() => { }}>
                <Text style={MyStyles.btn_primary_white}>Back to Login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

}