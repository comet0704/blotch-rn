import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import { MyAppText } from '../components/Texts/MyAppText';
import MyStyles from '../constants/MyStyles';
// import ModalDropdown from './ModalDropdown';
export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text style={[MyStyles.text_20,]}>This is Regular Text</Text>
        <MyAppText style={[MyStyles.text_20, { color: "red" }]}>This is Regular Text</MyAppText>
        {/* <MyAppText style={[MyStyles.text_20, { color: "red" }]}>This is Regular Text</MyAppText>
        <MyAppText style={[MyStyles.text_20, { marginTop: 5 }]}>Today's Beauty Information</MyAppText>
        <Text style={[MyStyles.text_20, { marginTop: 5 }]}>Today's Beauty Information</Text> */}
      </View>
    );
  }
}
