import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
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


export default class NotificationScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      switch: {
        all: false,
        reply: false,
        ask_answer: false,
        event: false,
        point: false,
      }
    };
  }

  checkSwitchStatus() {
    if(this.state.switch.reply && this.state.switch.ask_answer && this.state.switch.event && this.state.switch.point) {
      this.state.switch.all=true
    } else {
      this.state.switch.all=false
    }
    this.setState(this.state.switch);
  }

  toggoleSwitch = (p_switchType) => {
    if (p_switchType == "all") {
      this.state.switch.all = !this.state.switch.all;
      if (this.state.switch.all == true) {
        this.state.switch.reply = true
        this.state.switch.ask_answer = true
        this.state.switch.event = true
        this.state.switch.point = true
      } else {
        this.state.switch.reply = false
        this.state.switch.ask_answer = false
        this.state.switch.event = false
        this.state.switch.point = false
      }
    } else if (p_switchType == "reply") {
      this.state.switch.reply = !this.state.switch.reply;
    } else if (p_switchType == "ask_answer") {
      this.state.switch.ask_answer = !this.state.switch.ask_answer;
    } else if (p_switchType == "event") {
      this.state.switch.event = !this.state.switch.event;
    } else if (p_switchType == "point") {
      this.state.switch.point = !this.state.switch.point;
    }

    this.setState({ switch: this.state.switch });
    this.checkSwitchStatus();
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

          <TopbarWithBlackBack title="Notification" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={MyStyles.container}>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>All</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("all") }} value={this.state.switch.all} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Reply</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("reply") }} value={this.state.switch.reply} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Ask Answer</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("ask_answer") }} value={this.state.switch.ask_answer} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Event</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("event") }} value={this.state.switch.event} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Point</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("point") }} value={this.state.switch.point} />
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