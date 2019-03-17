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
  Modal,
  TouchableHighlight,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';

export default class SignupScreen extends React.Component {
  
  Necessarry = (
    <Text style={{color:"#efb5cc", fontSize:13}}>
      *
    </Text>
  );
  
  state = {
    savePressed:false,
    image: null,
    email: null,
    id: null,
    password: null,
    password_confirm: null,
    modalVisible: false,
  };
  
  showAskInputModal = (visible) => {
    this.setState({modalVisible: visible});
  }


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

  onSavePressed = () => {
    this.showAskInputModal();
    return
    // 유효한 값들이 입력되었는지 검사
    if(this.state.email && this.state.id && this.state.password && this.state.password_confirm && this.state.email.length > 0 && this.state.id.length >= 4 && this.state.password.length >=8 && this.state.password == this.state.password_confirm) {
      // 저장하고 저장이 성공하면 추가정보 입력 modal 띄우기.
    } else {      
      this.setState({savePressed: true});
    }

  }

  render() {
    let {savePressed, image, email, id, password, password_confirm } = this.state;
    return (
      
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardDismissMode="on-drag" >
          <TopbarWithBlackBack onPress = {() => {this.props.navigation.goBack()}}></TopbarWithBlackBack>

          <View style={styles.container}>
            <Text style={styles.text_header1}>Welcome!</Text>
            <Text style={styles.text_desc}>Tell us about you !</Text>
            
            <View style={[styles.profile_box]}>
              <TouchableOpacity onPress={this._pickImage} style={styles.camera_box}>
                <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={{width:12, height:11, alignSelf:"center"}}></Image>
              </TouchableOpacity>
              <Image source={image == null ? (require('../../assets/images/Login/ic_avatar.png')) : { uri: image}} style={image == null ? {width:30, height:43, alignSelf:"center"} : {width:75, height:75, borderRadius:37}}></Image>            
            </View>

            <View style={[styles.inputBox, (this.checkValidation(email, "email") == false && savePressed == true) ? {borderColor:"#f33f5b"} : {}]}>
              {this.checkValidation(email, "empty") == false ? <Text style={{color: "#e4e6e5", position:"absolute", top:10}}>Email {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="next"
                onChangeText={(text) => {this.setState({email: text})}}
                onSubmitEditing={() => {this.idTextInput.focus();}}
                keyboardType="email-address"
                />
            </View>
            {
              ((this.checkValidation(email, "email") == false) && savePressed == true)?
              <Text style={styles.warningText}>Please Confirm your Email</Text> : null
            }

            <View style={[styles.inputBox, (this.checkValidation(id, "id") == false && savePressed == true) ? {borderColor:"#f33f5b"} : {}]}>
              {this.checkValidation(id, "empty") == false ? <Text style={{color: "#e4e6e5", position:"absolute", top:10}}>ID {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="next"
                ref={(input) => {this.idTextInput = input;}}
                onSubmitEditing={() => {this.pwdTextInput.focus();}}
                onChangeText={(text) => {this.setState({id: text})}}
                keyboardType="email-address"
                />
            </View>
            {
              ((this.checkValidation(id, "id") == false) && savePressed == true)?
              <Text style={styles.warningText}>Please Enter a ID at least four characters</Text> : null
            }

            <View style={[styles.inputBox, (this.checkValidation(password, "password") == false && savePressed == true) ? {borderColor:"#f33f5b"} : {}]}>
              {this.checkValidation(password, "empty") == false ? <Text style={{color: "#e4e6e5", position:"absolute", top:10}}>Password {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="next"
                ref={(input) => {this.pwdTextInput = input;}}
                onSubmitEditing={() => {this.pwdConfirmTextInput.focus();}}
                onChangeText={(text) => {this.setState({password: text})}}
                secureTextEntry={true}
                />
            </View>
            {
              ((this.checkValidation(password, "password") == false) && savePressed == true)?
              <Text style={styles.warningText}>Please Enter a Password at least eight characters</Text> : null
            }

            <View style={[styles.inputBox, (this.checkValidation(password_confirm, "password_confirm") == false && savePressed == true) ? {borderColor:"#f33f5b"} : {}]}>
              {this.checkValidation(password_confirm, "empty") == false ? <Text style={{color: "#e4e6e5", position:"absolute", top:10}}>Confirm Password {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="done"
                ref={(input) => {this.pwdConfirmTextInput = input;}}
                onChangeText={(text) => {this.setState({password_confirm: text})}}
                secureTextEntry={true}
                />
            </View>
            {
              ((this.checkValidation(password_confirm, "password_confirm") == false) && savePressed == true)?
              <Text style={styles.warningText}>Please Confirm a Password</Text> : null
            }

            <TouchableOpacity style={[styles.btn_primary_cover, {marginTop:35, marginBottom:45}]} onPress = {() => this.onSavePressed()}>
              <Text style={styles.btn_primary}>Save</Text>
            </TouchableOpacity>
            
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
          }}>
          <View style={{flex:1}}>
            <View style={styles.modal_bg}>
            <View style={{backgroundColor:"white", borderRadius:10, justifyContent:"center", overflow:"hidden"}}>
              <TouchableOpacity style={{alignSelf:"flex-end", padding:10}} onPress={() => {
                      this.setState({modalVisible:false});
                      this.props.navigation.navigate('Home')
                    }}>
                <Image style={{width:14, height:14}} source={require("../../assets/images/ic_close.png")}></Image>
              </TouchableOpacity>

              <Image style={{width:31, height:32, alignSelf:"center"}} source={require("../../assets/images/ic_check_on.png")}></Image>
              <Text style={{fontSize:16, color:"black", alignSelf:"center", fontWeight:"bold", marginTop:10, marginBottom:20}}>Tell us little more about you so {"\n"} we can find recommendation!</Text>

              <View style={{flexDirection:"row"}}>
                <TouchableHighlight
                  style={[styles.btn_primary_cover, {borderRadius:0}]}>
                  <Text style={styles.btn_primary}>Yes</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[styles.btn_primary_white_cover, {borderRadius:0}]}
                    onPress={() => {
                      this.setState({modalVisible:false});
                      this.props.navigation.navigate('Home')
                    }}>
                  <Text style={styles.btn_primary_white}>Not now</Text>
                </TouchableHighlight>
              </View>
            </View>
            
            </View>
          </View>
        </Modal>

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

    profile_box : {
      marginTop: 30,
      alignItems: "center",
      borderColor: "#ededed",
      borderWidth: 2,
      width:75,
      height:75,
      borderRadius: 37.5,
      alignSelf: "center",
      justifyContent:"center",
    },

    camera_box : {
      backgroundColor:"white",
      borderColor: "#ededed",
      borderWidth: 2,
      width:23,
      height:23,
      borderRadius: 11.5,
      position:"absolute",
      top:0,
      right:0,
      justifyContent:"center",
      zIndex:1,
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
    },

    modal_bg : {
      paddingLeft:35, 
      paddingRight:35,
      backgroundColor:"#0000009d",
      width:"100%",
      justifyContent:"center",
      height:"100%",
    }
});