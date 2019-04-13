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
import { LinearGradient } from 'expo';

export default class PolicyScreen extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <View style={{ flex: 1 }}>
          <TopbarWithBlackBack title="Privacy Policy" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

          <View style={[MyStyles.container, { flex: 1 }]}>
            <WebView
              source={{ uri: 'https://github.com/facebook/react-native' }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}