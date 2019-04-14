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
  TouchableHighlight,
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
import DropdownMenu from 'react-native-dropdown-menu';

export default class ContactUsScreen extends React.Component {


  state = {
  };
  render() {

    var data = [["C", "Java", "JavaScript", "PHP"], ["Python", "Ruby"], ["Swift", "Objective-C"]];

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
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={MyStyles.container}>

              <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Category</Text>
              <View style={{ flex: 1 }}>
                <View style={{ height: 64 }} />
                <DropdownMenu
                  style={{ flex: 1 }}
                  bgColor={'white'}
                  tintColor={'#666666'}
                  activityTintColor={'green'}
                  // arrowImg={}      
                  // checkImage={}   
                  // optionTextStyle={{color: '#333333'}}
                  // titleStyle={{color: '#333333'}} 
                  // maxHeight={300} 
                  handler={(selection, row) => this.setState({ text: data[selection][row] })}
                  data={data}
                >

                  <View style={{ flex: 1 }}>
                    <Text>
                      {this.state.text} is the best language in the world
            </Text>
                  </View>

                </DropdownMenu>
              </View>
              {/* <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Category</Text>
              <TextInput
                onSubmitEditing={() => {
                  this.addMyList()
                }}
                ref={(input) => { this.request_list_name = input; }}
                onChangeText={(text) => { console.log(text); this.setState({ request_product_name: text }) }}
                style={MyStyles.text_input_with_border}>
              </TextInput> */}

              {/* <View style={{ flexDirection: "row" }}>
                <TouchableHighlight
                  style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {

                  }}>
                  <Text style={MyStyles.btn_primary}>Submit</Text>
                </TouchableHighlight>
              </View> */}

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