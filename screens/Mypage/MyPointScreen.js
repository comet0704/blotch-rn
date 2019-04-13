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
import Colors from '../../constants/Colors';

export default class MyPointScreen extends React.Component {

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

          <TopbarWithBlackBack title="My Point" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View>
              <View style={[{ flexDirection: "row", height: 200 / 3, margin: 15, overflow: "hidden", alignItems: "center", borderRadius: 5 }, MyStyles.padding_main]}>
                <Image style={[MyStyles.background_image]} source={require("../../assets/images/ic_gradient_bg.png")} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>Ellie's</Text>
                  <Text style={{ color: "white", fontSize: 13 }}>holding point</Text>
                </View>
                <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>150<Text style={{ fontWeight: "300" }}>P</Text></Text>
              </View>

              {/* Questionnaire 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.setState({ section_allergic_show: !this.state.section_allergic_show })
                }}>
                  <Image source={require("../../assets/images/ic_questionnare_big.png")} style={[MyStyles.ic_questionnare_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[MyStyles.ingredient_section_header_text1]}>Questionnaire</Text>
                    </View>

                    <Text style={[MyStyles.ingredient_section_header_text2, { color: Colors.color_949292 }]}>Completed</Text>
                  </View>
                  <Text style={{ color: Colors.color_212122, fontSize: 18, fontWeight: "bold" }}>150<Text style={{ color: Colors.primary_purple }}>P</Text></Text>
                </TouchableOpacity>
              </View>

              {/* My Review 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.setState({ section_allergic_show: !this.state.section_allergic_show })
                }}>
                  <Image source={require("../../assets/images/ic_review_big.png")} style={[MyStyles.ic_review_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>My Review</Text>
                    <Text style={[MyStyles.ingredient_section_header_text2, { color: Colors.color_949292 }]}>Recent Review</Text>
                  </View>
                  <Text style={{ color: Colors.color_212122, fontSize: 18, fontWeight: "bold" }}>150<Text style={{ color: Colors.primary_purple }}>P</Text></Text>
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