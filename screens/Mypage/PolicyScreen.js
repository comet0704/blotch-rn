import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  WebView,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';
import { LinearGradient } from 'expo';

export default class PolicyScreen extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        {/* <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" > */}
        <View style={{ flex: 1 }}>
          <TopbarWithBlackBack title="Privacy Policy" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <View style={[MyStyles.container, { flex: 1 }]}>
            <WebView
              source={{ uri: Net.user.terms_privacy }}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={{ position: "absolute", top: 0, width: "100%", }}>
          <TopbarWithBlackBack title="Privacy Policy" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        </View>
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    );
  }
}