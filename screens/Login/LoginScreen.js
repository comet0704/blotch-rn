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
} from 'react-native';

function onPressLogin() {
  alert("A");
}

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
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ScrollView style={{}}>
        <Image source={require('../../assets/images/Login/login_bg.png')} style={styles.loginBg} resizeMode="contain"/>
        <Image source={require('../../assets/images/Login/logo.png')} style={[styles.h_auto, {width:"30%", marginTop:110}]} resizeMode ="contain"></Image>
        <Text style={{marginLeft:"auto", marginRight:"auto", color:"white", marginTop:-20, fontSize:12}} >Your Beauty Counselor</Text>

        <View style={[styles.h_auto, {width:"85%", marginTop: 90, height : 420, borderRadius : 15, backgroundColor:"white", paddingVertical: 40, paddingHorizontal:18}]}>
          <TextInput
              style={styles.inputBox}
              placeholder="Email"
              onChangeText={(text) => this.setState({text})}
            />
            
           <TextInput
              style={[styles.inputBox, {marginTop: 20}]}
              placeholder="Password"
              onChangeText={(text) => this.setState({text})}
            />
          <Text style={{marginTop:10, marginLeft:"auto", fontSize: 12}}>
            Forget Password
          </Text>

          <Button onPress={onPressLogin} style={{marginTop:20, borderRadius:5, backgroundColor:"#a695fe", color:"white", fontSize:15}} title="LOGIN"/>
        </View>
      </ScrollView>
    );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => Bananas);


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
    position:"absolute"
  },
  inputBox : {
    height: 40, borderBottomWidth:1, borderColor:"#e3e5e4",
  }
});