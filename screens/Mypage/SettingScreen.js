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
import { LinearGradient } from 'expo';
import Colors from '../../constants/Colors';


export default class SettingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,      
    };
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

          <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
          
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={MyStyles.container}>
              <View style={[{flexDirection:"row", height:180/3, alignItems:"center"}, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{flex:1, fontSize:15, color:Colors.primary_dark}}>Version</Text>
                <Text style={{fontSize:12, color:Colors.primary_purple}}>Ver 1.4 (Latest Version)</Text>
              </View>
              <View style={[{flexDirection:"row", height:180/3, alignItems:"center"}, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{flex:1, fontSize:15, color:Colors.primary_dark}}>Privacy Policy</Text>
                <Image style={MyStyles.ic_arrow_right_gray2} source={require("../../assets/images/ic_arrow_right_gray2.png")}/>
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