import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  AsyncStorage,
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
      alarm_all_selected: 1,
      alarm_result_data: {
        alarm_reply: 0,
        alarm_answer: 0,
        alarm_event: 0,
        alarm_point: 0,
        alarm_questionnaire: 0
      }
    };
  }

  componentDidMount() {
    this.requestGetAlarm()
  }

  checkSwitchStatus() {
    if (this.state.alarm_result_data.alarm_reply &&
      this.state.alarm_result_data.alarm_answer &&
      this.state.alarm_result_data.alarm_event &&
      this.state.alarm_result_data.alarm_point) {

      this.state.alarm_all_selected = 1
    } else {
      this.state.alarm_all_selected = 0
    }
    this.setState({ alarm_result_data: this.state.alarm_result_data });
  }

  toggoleSwitch = (p_switchType) => {
    if (p_switchType == "all") {
      this.state.alarm_all_selected = !this.state.alarm_all_selected;
      if (this.state.alarm_all_selected == 1) {
        this.state.alarm_result_data.alarm_reply = 1
        this.state.alarm_result_data.alarm_answer = 1
        this.state.alarm_result_data.alarm_event = 1
        this.state.alarm_result_data.alarm_point = 1
      } else {
        this.state.alarm_result_data.alarm_reply = 0
        this.state.alarm_result_data.alarm_answer = 0
        this.state.alarm_result_data.alarm_event = 0
        this.state.alarm_result_data.alarm_point = 0
      }
    } else if (p_switchType == "reply") {
      this.state.alarm_result_data.alarm_reply = 1 - this.state.alarm_result_data.alarm_reply;
    } else if (p_switchType == "alarm_answer") {
      this.state.alarm_result_data.alarm_answer = 1 - this.state.alarm_result_data.alarm_answer;
    } else if (p_switchType == "event") {
      this.state.alarm_result_data.alarm_event = 1 - this.state.alarm_result_data.alarm_event;
    } else if (p_switchType == "point") {
      this.state.alarm_result_data.alarm_point = 1 - this.state.alarm_result_data.alarm_point;
    }

    this.requestUpdateAlarm(this.state.alarm_result_data.alarm_reply,
      this.state.alarm_result_data.alarm_answer,
      this.state.alarm_result_data.alarm_event,
      this.state.alarm_result_data.alarm_point,
      this.state.alarm_result_data.alarm_questionnaire)
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
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("all") }} value={this.state.alarm_all_selected == 1 ? true : false} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Reply</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("reply") }} value={this.state.alarm_result_data.alarm_reply == 1 ? true : false} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Ask Answer</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("alarm_answer") }} value={this.state.alarm_result_data.alarm_answer == 1 ? true : false} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Event</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("event") }} value={this.state.alarm_result_data.alarm_event == 1 ? true : false} />
              </View>
              <View style={[{ flexDirection: "row", height: 180 / 3, alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
                <Text style={{ flex: 1, fontSize: 15, color: Colors.primary_dark }}>Point</Text>
                <Switch thumbColor={"white"} trackColor={{ false: "#9891bb", true: Colors.primary_purple }} onValueChange={() => { this.toggoleSwitch("point") }} value={this.state.alarm_result_data.alarm_point == 1 ? true : false} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }

  requestUpdateAlarm(p_alarm_reply, p_alarm_answer, p_alarm_event, p_alarm_point, p_alarm_questionnaire) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.updateAlarm, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        alarm_reply: p_alarm_reply.toString(),
        alarm_answer: p_alarm_answer.toString(),
        alarm_event: p_alarm_event.toString(),
        alarm_point: p_alarm_point.toString(),
        alarm_questionnaire: p_alarm_questionnaire.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        // this.setState({
        //   isLoading: false
        // });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        this.checkSwitchStatus();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

  }

  requestGetAlarm() {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.getAlarm, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        // this.setState({
        //   isLoading: false
        // });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        this.state.alarm_result_data = responseJson.result_data
        this.checkSwitchStatus();
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