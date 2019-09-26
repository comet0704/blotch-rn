import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MyAppText } from '../../components/Texts/MyAppText';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';


export class TopbarWithWhiteBack extends React.Component {
  render() {
    return (
      <View>
        <View style={{ height: MyConstants.STATUSBAR_HEIGHT, backgroundColor: "white" }} />
        <View style={{ flexDirection: "row", justifyContnt: "center", alignItems: "center", height: MyConstants.TOPBAR_HEIGHT, }}>
          <MyAppText style={{ flex: 1, textAlign: "center", left: 0, right: 0, fontSize: 16, fontWeight: "500", position: "absolute" }}>{this.props.title}</MyAppText>

          <TouchableOpacity
            onPress={this.props.onPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
            <Image style={[MyStyles.backButton]}
              source={require("../../assets/images/ic_back.png")}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
          {this.props.rightBtn == "true" ?
            <TouchableOpacity
              onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
              <Image style={[MyStyles.ic_edit]}
                source={require("../../assets/images/ic_edit.png")}
              />
            </TouchableOpacity>
            : null
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  backButton: {
    width: 11,
    height: 18,
    marginTop: 20,
  }
})