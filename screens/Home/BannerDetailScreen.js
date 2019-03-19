import React from 'react';
import { Image, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';

export default class FaqScreen extends React.Component {

  state = {
  };

  renderComment(image, index) {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => { this.props.navigation.navigate("BannerDetail") }}>
          <View>
            <Image style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: image }} />
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
              <Text style={{ fontSize: 13, color: "white" }}>ESTEE LAUDER</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 24 }}>Advanced Night Repair</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>
            <TopbarWithBlackBack rightBtn="true" title="Banner" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { alert("right") }}></TopbarWithBlackBack>
            <View style={[MyStyles.shadow_1, { height: 6, backgroundColor: "#f1f1f1" }]}></View>
            <View style={[{ flex: 1 }]}>
              {/* Title and Image */}
              <View style={[MyStyles.padding_main]}>
                <Text style={{ color: Colors.color_201f20, fontSize: 21 }}>How to Make up Easy, Fast Drawing From Shis!</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <Image style={{ flex: 1 }} />
                  <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                  <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>73</Text>
                  <Image source={require("../../assets/images/ic_eye.png")} style={[MyStyles.ic_eye, { marginLeft: 10 }]} />
                  <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>173</Text>
                </View>
              </View>

              {/* Description */}
              <View style={{ height: 780 / 3, flex: 1, marginTop: 5 }}>
                <Image style={MyStyles.background_image} source={{ uri: "http://img.mp.itc.cn/upload/20160817/1164b794aeb34c75a3d0182fa2d0ce21_th.jpg" }} />
                <TouchableOpacity style={{ position: "absolute", top: 15, right: 15 }} onPress={() => { alert("onHeartClick") }}>
                  <Image source={require("../../assets/images/ic_heart_button.png")} style={[MyStyles.ic_heart_button, { marginLeft: 10 }]} />
                </TouchableOpacity>
              </View>

              <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
                <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                  <Text style={{ color: Colors.color_949191, paddingLeft: 5, paddingRight: 5, borderWidth: 0.5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }}>Link</Text>
                  <Text onPress={() => { Linking.openURL("https://brunch.co.kr/@sucopy/182") }} style={[MyStyles.link, { marginLeft: 5 }]}>https://brunch.co.kr/@sucopy/182</Text>
                </View>
                <Text style={{ fontSize: 13, color: Colors.color_201f20, marginTop: 10, marginBottom: 5 }}>The House of Chanel is known for the "little black dress", th
e perfume No. 5 de Chanel, and the Chanel Suit. Chanel's u
se of jersey fabric produced garments that were comforta
ble and affordable. Chanel revolutionized fashion — high fa
shion (haute couture) and everyday fashion — by replacing
structured-silhouettes, based upon the corset and the bod
ice, with garments that were functional and at the same ti
me flattering to the woman's figure.
                </Text>
              </View>
              <View style={MyStyles.seperate_line_e5e5e5}></View>

              {/* Comments */}
              <View style={[MyStyles.padding_main, { marginTop: 5 }]}>
                <Text style={{ color: Colors.color_201f20, fontSize: 13, fontWeight: "bold" }}>Comments <Text style={{ fontSize: 13, color: Colors.color_949292 }}>11</Text></Text>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]}></Image>
                  <TextInput placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity style={[MyStyles.purple_btn_r2, { width: 140 / 3, height: 84 / 3, }]}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>
                <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>

                <View>
                  <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                    <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontSize: 15, color: Colors.color_201f20, fontWeight: "bold" }}>Username</Text>
                      <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
  t the top of the screen that can have scroll effects.
  B default, an app-header moves aways from the vie
  wport when scrolling down and if using reveals, the
  header slides back when scrolling back up. For exam
ple</Text>
                      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={MyStyles.seperate_line_e5e5e5}></View>
                </View>

                <View>
                  <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                    <Image source={{uri:"http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"}} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontSize: 15, color: Colors.color_201f20, fontWeight: "bold" }}>Username</Text>
                      <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
  t the top of the screen that can have scroll effects.
  B default, an app-header moves aways from the vie
  wport when scrolling down and if using reveals, the
  header slides back when scrolling back up. For exam
ple</Text>
                      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={MyStyles.seperate_line_e5e5e5}></View>
                </View>

                <View>
                  <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                    <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight:10 }]}></Image>
                    <Image source={{uri:"http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"}} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
                        <Text style={{ fontSize: 15, color: Colors.color_201f20, fontWeight: "bold" }}>Username</Text>
                        <Text style={[MyStyles.purple_bg_text_12,{marginLeft:5, height:50/3}]}>Me</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
  t the top of the screen that can have scroll effects.
  B default, an app-header moves aways from the vie
  wport when scrolling down and if using reveals, the
  header slides back when scrolling back up. For exam
ple</Text>
                      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                        <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete, { marginLeft: 5 }]}></Image>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={MyStyles.seperate_line_e5e5e5}></View>
                </View>


              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}