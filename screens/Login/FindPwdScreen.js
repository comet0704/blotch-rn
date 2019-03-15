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
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';

export default class FindPwdScreen extends React.Component {
  
  Necessarry = (
    <Text style={{color:"#efb5cc", fontSize:13}}>
      *
    </Text>
  );
  
  state = {
    sendPressed:false,
    image: null,
    email: null,
    id: null,
    password: null,
    password_confirm: null,
  };

  checkValidation = (value, check_type) => {
    if(value == null || value.length == 0) {
      return false
    }

    if(check_type == "id") {
      if(value.length < 4) {
        return false
      }
    }

    if(check_type == "password") {
      if(value.length < 8) {
        return false
      }
    }

    if(check_type == "password_confirm") {
      if(value != this.state.password) {
        return false
      }
    }

    return true
  }

  render() {
    let {sendPressed, image, email, id, password, password_confirm } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardDismissMode="on-drag" >
        <TopbarWithBlackBack onPress = {() => {this.props.navigation.goBack()}}></TopbarWithBlackBack>

          <View style={styles.container}>
            <Text style={styles.text_header1}>Forgot</Text>
            <Text style={[styles.text_header1, {marginTop:0}]}>Password?</Text>
            <Text style={styles.text_desc}>Please enter your email address and we will send you an email about how to reset your password.</Text>
            
            <View style={[styles.inputBox, (this.checkValidation(email, "email") == false && sendPressed == true) ? {borderColor:"#f33f5b"} : {}]}>
              {this.checkValidation(email, "empty") == false ? <Text style={{color: "#e4e6e5", position:"absolute", top:10}}>Email {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="done"
                onChangeText={(text) => {this.setState({email: text})}}
                keyboardType="email-address"
                />
            </View>
            {
              ((this.checkValidation(email, "email") == false) && sendPressed == true)?
              <Text style={styles.warningText}>Please Confirm your Email</Text> : null
            }

            <View style={{flex:1, marginTop:35, flexDirection:"row"}}>
              <TouchableOpacity style={[styles.btn_primary_cover]} onPress = {() => {this.setState({sendPressed: true})}}>
                <Text style={styles.btn_primary}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn_primary_white_cover,{marginLeft:20}]} onPress = {() => {}}>
                <Text style={styles.btn_primary_white}>Back to Login</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    container : {
      paddingLeft: 15,
      paddingRight: 15,
    },

    text_header1 : {
      marginTop:10,
      fontSize: 30,
      color:"black",
    },

    text_desc : {
      fontSize: 13,
      marginTop: 10,
      color:"#949292",
    },

    inputBox : {
      height: 40, 
      borderBottomWidth:1, 
      borderColor:"#e3e5e4",
      marginTop:20,
      justifyContent:"center"
    },

    warningText : {
      color: "#f33f5b",
      fontSize:12,
      marginTop:5,
    },

    btn_primary_cover : {
      flex:1,
      borderRadius:5,
      height:45,
      backgroundColor: "#a695fe",
      justifyContent:"center",
    },

    btn_primary : {
      color:"white",
      fontSize:13,
      justifyContent:"center",
      textAlign:"center",
    },

    btn_primary_white_cover : {
      flex:1,
      borderRadius:5,
      borderWidth:1,
      height:45,
      borderColor: "#a695fe",
      justifyContent:"center",
    },

    btn_primary_white : {
      color:"#a695fe",
      fontSize:13,
      justifyContent:"center",
      textAlign:"center",
    }
});