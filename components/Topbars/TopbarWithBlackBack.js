import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';

export class TopbarWithBlackBack extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: "row", justifyContnt: "center", backgroundColor: Colors.color_white }}>
        <Text style={{ flex: 1, textAlign: "center", left: 0, right: 0, height: 48, top: 35, fontSize: 16, fontWeight: "500", position: "absolute" }}>{this.props.title}</Text>
        {this.props.isRootDepth ? <View style={{ padding: 15, width: 45 }}><Image style={[MyStyles.backButton]}
          source={require("../../assets/images/ic_back.png")}
        /></View> :
          <TouchableOpacity
            onPress={this.props.onPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
            <Image style={[MyStyles.backButton]}
              source={require("../../assets/images/ic_back_black.png")}
            />
          </TouchableOpacity>
        }
        <View style={{ flex: 1 }}></View>
        {this.props.rightBtn == "true" ?
          this.props.isTorch == true ? // 카메라 인식  페지이면
            <TouchableOpacity
              onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
              <Image style={[MyStyles.flashBtn]}
                source={require("../../assets/images/ic_flash_off.png")}
              />
            </TouchableOpacity>
            :
            this.props.isEditProfile == true ? // editprofile 페지이면
              <TouchableOpacity
                onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{marginTop:20, marginRight:15, width: 196/3 }}>
                <Image style={[MyStyles.ic_edit_pwd]}
                  source={require("../../assets/images/ic_edit_pwd.png")}
                />
              </TouchableOpacity>
              :
              <TouchableOpacity // 공유버튼일때
                onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
                <Image style={[MyStyles.shareBtn]}
                  source={require("../../assets/images/ic_share.png")}
                />
              </TouchableOpacity>
          : null
        }
      </View>
    )
  }
}