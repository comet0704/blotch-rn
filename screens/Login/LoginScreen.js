import React, {Component} from 'react';
import {
  AppRegistry,
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
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import SignupScreen from './SignupScreen';

class Greetings extends Component {
  render() {
    return (
      <View style={{alignItems : 'center'}}>
      <Text>Hello {this.props.name}</Text>
      </View>
    )
  }
}
export default class LoginScreen extends React.Component {

  Signup = (
    <Text onPress={() => this.onPressSignup()} style={{color:"#a695fe", fontSize:13}}>
      Sign Up!
    </Text>
  );
  
  state = {
    isSignUpPressed:false
  };
  
  onPressLogin = (email, pass) => {
    alert('email: ' + email + ' password: ' + pass);
  }
  onPressForgetPassword() {
    alert("B");
  }

  onPressSignup = () => {
    // this.props.navigation.navigate("SignupScreen");
    this.setState({
      isSignUpPressed:true
    })
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const {isSignUpPressed} = this.state;
    return (
      <View style={{flex:1}}>
        {isSignUpPressed ? (<SignupScreen></SignupScreen>) : (<KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

<ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardDismissMode="on-drag" >
  <Image source={require('../../assets/images/Login/login_bg.png')} style={styles.loginBg}/>
  <TopbarWithWhiteBack></TopbarWithWhiteBack>
  <Image source={require('../../assets/images/Login/logo.png')} style={[styles.h_auto, {width:"30%", marginTop:110}]} resizeMode ="contain"></Image>
  <Text style={{marginLeft:"auto", marginRight:"auto", color:"white", marginTop:-20, fontSize:12, fontWeight:"100"}} >Your Beauty Counselor</Text>

  <View style={[styles.h_auto, {width:"85%", marginTop: 90, height : 420, borderRadius : 15, backgroundColor:"white", paddingVertical: 40, paddingHorizontal:18}]}>
    
      <TextInput
          style={styles.inputBox}
          placeholder="Email"
          returnKeyLabel="next"
          onChangeText={(text) => this.setState({email: text})}
          keyboardType="email-address"
          ref={ref => {
            this.inputEmail = ref;
          }}
        />
    
     <TextInput
        style={[styles.inputBox, {marginTop: 20}]}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => this.setState({password: text})}
      />
    <Text style={{marginTop:10, marginLeft:"auto", fontSize: 12}} onPress={this.onPressForgetPassword}>
      Forget Password
    </Text>

    <TouchableOpacity style={{marginTop:30}}>
        <Button onPress={() => this.onPressLogin(this.state.email, this.state.password)} color="#a695fe" style={{margin:60, borderRadius:5, color:"white", fontSize:15}} title="LOGIN"/>
    </TouchableOpacity>

    <View style={{alignItems:"center", fontSize:13, marginTop:25}}>
      <Text style={{color:"#aeaeae"}}>Don't have an account?  {this.Signup}</Text>
    </View>

    <View style={{flexDirection:"row", alignItems:"center", marginTop:20, justifyContent: 'space-between'}}>
      <View
          style={{
            alignItems:"flex-start",
            borderBottomColor: '#aeaeae',
            borderBottomWidth: 1,
            width:"30%",
          }}
        />
      <Text
      style={{textAlign:"center", color:"#aeaeae"}}
      >or Login with</Text>
      <View
        style={{
          alignItems:"flex-end",
          borderBottomColor: '#aeaeae',
          borderBottomWidth: 1,
          width:"30%",
        }}
      />
    </View>

      <View style={{flex:1, flexDirection:"row", marginTop:20}}>
        <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.5}>
        {/*We can use any component which is used to shows something inside 
          TouchableOpacity. It shows the item inside in horizontal orientation */}
        <Image
          //We are showing the Image from online
          source={require("../../assets/images/Login/ic_facebook.png")}
          //You can also show the image from you project directory like below
          //source={require('./Images/facebook.png')}
          //Image Style
          style={styles.ImageIconStyle}
        />
        <Text style={styles.TextStyle}>Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5}>
        {/*We can use any component which is used to shows something inside 
          TouchableOpacity. It shows the item inside in horizontal orientation */}
        <Image
          //We are showing the Image from online
          source={require("../../assets/images/Login/ic_google.png")}
          //You can also show the image from you project directory like below
          //source={require('./Images/facebook.png')}
          //Image Style
          style={styles.ImageIconStyle}
        />
        <Text style={styles.TextStyle}>Google</Text>
      </TouchableOpacity>
    </View>
  </View>

<Text style={{color:"white", marginTop:45, marginBottom:20, textAlign:"center", fontSize:12, fontWeight:"100"}}>copyright © 2019 by Chemi. all rights reserved</Text>
</ScrollView>
</KeyboardAvoidingView>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  h_auto: {
    marginLeft:"auto",
    marginRight: "auto",
  },
  loginBg : {
    left:0, 
    right:0,
    top:0, 
    bottom:0,
    position:"absolute",
    flex:1,
    height:null,
    width:null,
    resizeMode:"cover",
  },
  inputBox : {
    height: 40, borderBottomWidth:1, borderColor:"#e3e5e4",
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex:1,
    borderRadius: 5,
    justifyContent:"center",
    marginLeft: 5,
  },
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex:1,
    borderRadius: 5,
    justifyContent:"center",
    marginRight: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
});