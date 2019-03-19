import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export class TopbarWithBlackBack extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: "row", justifyContnt: "center" }}>
        <Text style={{ flex: 1, textAlign: "center", left: 0, right: 0, height: 48, top: 35, fontSize: 16, fontWeight: "500", position: "absolute" }}>{this.props.title}</Text>
        <TouchableOpacity
          onPress={this.props.onPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
          <Image style={[styles.backButton]}
            source={require("../../assets/images/ic_back_black.png")}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>
        {this.props.rightBtn == "true" ?
          <TouchableOpacity
          onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
            <Image style={[styles.shareBtn]}
              source={require("../../assets/images/ic_share.png")}
            />
          </TouchableOpacity> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  backButton: {
    width: 11,
    height: 18,
    marginTop: 20,
  },
  shareBtn: {
    width: 46 / 3,
    height: 53 / 3,
    marginTop: 20,
  }
})