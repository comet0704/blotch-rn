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

export default class AboutUsScreen extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        {/* <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" > */}
          <View style={{flex:1}}>
            <TopbarWithBlackBack title="About Us" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
            <View style={[MyStyles.container, {flex:1}]}>
              <WebView
                source={{ uri: 'https://github.com/facebook/react-native' }}
                style={{ flex: 1}}
              />
            </View>
          </View>
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    );
  }
}