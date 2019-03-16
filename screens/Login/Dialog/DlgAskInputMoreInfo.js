import React, {Component} from 'react';
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

export default class DlgAskInputMoreInfo extends React.Component {
  
  render() {
    return (
      <View >
      </View>
    );
  }
  
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

}

const styles = StyleSheet.create({
    dlgBackBg : {
      backgroundColor: "#0000009D",
      position:"absolute",
      width:"100%",
      height:"100%",
      paddingLeft:"35",
      paddingRight:"35",
    }
});