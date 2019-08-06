import React from 'react';
import { Image, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            console.log(Date() + ": On Navigation Events")
            this.interval = setInterval(() => {
              this.subinterval = setInterval(() => {
                this.props.navigation.navigate("Home")
                clearInterval(this.subinterval)
              }, 2000)
              clearInterval(this.interval)
            }, 1000)
          }}
        />
        <Image source={require("../../assets/images/splash.png")} style={{ width: "100%", height: "100%" }} />
      </View>
    );
  }
}