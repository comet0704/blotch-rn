import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { MyAppText } from '../../components/Texts/MyAppText';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';

export class TopbarWithBlackBack extends React.Component {
  render() {
    return (
      <View>
        <View style={{ height: MyConstants.STATUSBAR_HEIGHT, backgroundColor: "white" }} />
        <View style={{ flexDirection: "row", justifyContnt: "center", alignItems: "center", backgroundColor: "white", height: MyConstants.TOPBAR_HEIGHT, }}>
          <MyAppText style={{ flex: 1, textAlign: "center", left: 0, right: 0, fontSize: 16, fontWeight: "500", position: "absolute" }}>{this.props.title}</MyAppText>
          {this.props.isRootDepth ?
            <View style={{ padding: 15, width: 45 }}><Image style={[MyStyles.backButton]}
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
            this.props.isTorch == true ? // 카메라 검색  페지이면
              <TouchableOpacity
                onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45, marginTop: 2 }}>
                <Image style={[MyStyles.flashBtn]}
                  source={require("../../assets/images/ic_flash_off.png")}
                />
              </TouchableOpacity>
              :
              this.props.isEditProfile == true ? // editprofile 페지이면
                <TouchableOpacity
                  onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ marginTop: 20, marginRight: 15, width: 196 / 3 }}>
                  <Image style={[MyStyles.ic_edit_pwd]}
                    source={require("../../assets/images/ic_edit_pwd.png")}
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} // 공유버튼일때
                  onPress={this.props.onRightBtnPress} activeOpacity={0.5} style={{ padding: 15, width: 45 }}>
                  <Image style={[MyStyles.shareBtn]}
                    source={require("../../assets/images/ic_share.png")}
                  />
                </TouchableOpacity>
            : null
          }
        </View>
      </View>
    )
  }
}