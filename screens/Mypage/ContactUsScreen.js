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
  Alert,
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
import { Dropdown } from 'react-native-material-dropdown';

export default class ContactUsScreen extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      category_list: []
    };
  }

  componentDidMount() {

    this.requestContactUsCategory();
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

          <TopbarWithBlackBack title="Contact us" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={MyStyles.container}>

              {/* <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Category</Text> */}
              <Dropdown
                dropdownPosition={0}
                labelFontSize={11}
                textColor={Colors.color_656565}
                itemColor={Colors.color_656565}
                selectedItemColor={Colors.color_656565}
                baseColor={Colors.primary_dark}
                label='Category'
                onChangeText={(value, index, data) => {
                  this.setState({ contact_category: value })
                }}
                data={this.state.category_list}
              />
              <Text style={{ fontSize: 13, color: Colors.color_212122, marginTop: 10, marginBottom: 7 }}>Contents</Text>
              <TextInput
                textAlignVertical="top"
                multiline={true}
                returnKeyType="go"
                value={this.state.contact_content}
                ref={(input) => { this.request_list_name = input; }}
                onChangeText={(text) => { this.setState({ contact_content: text }) }}
                style={[MyStyles.text_input_with_border, { height: 180 }]}>
              </TextInput>

              <View style={{ flexDirection: "row", marginTop: 30, marginBottom: 20 }}>
                <TouchableHighlight
                  style={[MyStyles.btn_primary_cover, { borderRadius: 5 }]} onPress={() => {
                    if (this.state.contact_category == null || this.state.contact_category.length == 0) {
                      this.refs.toast.showBottom("Please select contact type.");
                      return
                    }
                    if (this.state.contact_content == null || this.state.contact_content.length == 0) {
                      this.refs.toast.showBottom("Please input contact contents.");
                      return
                    }
                    this.requestContactUs(this.state.contact_category, this.state.contact_content);
                  }}>
                  <Text style={MyStyles.btn_primary}>Submit</Text>
                </TouchableHighlight>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }

  requestContactUsCategory() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.contactUsCategory, {
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
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        const data = [];

        responseJson.result_data.contact_us_category.forEach(element => {
          data.push({ value: element.title })
        });

        // data.push({ value: "Other" }) // 나중에 직접입력 항목 추가해주어야 함

        this.setState({ category_list: data })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestContactUs(p_category, p_content) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.contactUs, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        category: p_category,
        content: p_content,
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

        Alert.alert(
          '',
          'Successfully submitted',
          [
            { text: 'OK', onPress: () => { this.props.navigation.goBack() } },
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