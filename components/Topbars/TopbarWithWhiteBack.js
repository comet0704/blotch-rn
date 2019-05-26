import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';
import MyStyles from '../../constants/MyStyles';


export class TopbarWithWhiteBack extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: "row", justifyContnt: "center", }}>
        <Text style={{ flex: 1, textAlign: "center", left: 0, right: 0, height: 48, top: 35, fontSize: 16, fontWeight: "500", position: "absolute" }}>{this.props.title}</Text>

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