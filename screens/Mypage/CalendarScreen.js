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
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      originalMarkedDates: {
        // '2019-04-14': { selected: true, marked: true, selectedColor: 'red' }
      },
    };

  }

  onDaySelect = null;
  componentDidMount() {
    this.onDaySelect = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.onDaySelect)
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

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          {/* <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" > */}

          <View style={[MyStyles.container]}>
            <Text style={MyStyles.text_header1}>Product Usage{"\n"}Date Registration</Text>
            <Text style={MyStyles.text_desc}>Check the validity period by registering the date of use.</Text>
            <View style={[MyStyles.border_bottom_e5e5e5, { marginTop: 20 }]} />
          </View>

          <CalendarList
            onVisibleMonthsChange={(months) => {
              console.log('now these months are visible', months);
            }}
            onDayPress={(day) => {
              console.log(day);
              this.props.navigation.goBack();
              this.onDaySelect(day);
            }}
            markedDates={this.state.originalMarkedDates}
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}
          />
          {/* </ScrollView> */}
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