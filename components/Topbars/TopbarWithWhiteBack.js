import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

export class TopbarWithWhiteBack extends React.Component {
  render() {
    return (
        <TouchableOpacity onPress={this.props.onPress} activeOpacity={0.5} style={{padding:15, width:45}}>
              {/*We can use any component which is used to shows something inside 
                TouchableOpacity. It shows the item inside in horizontal orientation */}
              <Image style={styles.backButton}
                //We are showing the Image from online
                source={require("../../assets/images/ic_back.png")}
                //You can also show the image from you project directory like below
                //source={require('./Images/facebook.png')}
                //Image Style
              />
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    backButton: {
        width:11,
        height:18,
        marginTop:20,
    }
})