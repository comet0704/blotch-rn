import React from 'react';
import { Image, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, TouchableHighlight, Linking } from 'react-native';
import { LinearGradient } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';

export default class ArticlesScreen extends React.Component {

  state = {
  };

  renderArticle(image, index) {
    return (
      null
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <TopbarWithBlackBack rightBtn="false" title="Articles" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>

            <View style={[MyStyles.container, { flex: 1 }]}>
              <View style={[{ marginTop: 15, flex: 1, flexDirection: "row" }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>How to Make up Easy
                    ing From Shis! How to Make up E
asy, Fast Drawing From Shis! </Text>
                  <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
                    www.makeup.com
                </Text>
                </View>

                <View style={{ width: 316 / 3, height: 230 / 3, borderRadius: 2, overflow: "hidden", marginLeft: 10 }}>
                  <Image source={{ uri: "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg" }} style={MyStyles.background_image}></Image>
                  <TouchableHighlight style={[{ position: "absolute", right: 5, top: 5 }, MyStyles.heart]}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableHighlight>
                </View>
              </View>

              <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10 }]}></View>
            </View>

            <View style={[MyStyles.container, { flex: 1 }]}>
              <View style={[{ marginTop: 15, flex: 1, flexDirection: "row" }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>How to Make up Easy
asy, Fast Drawing From Shis! </Text>
                  <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
                    www.makeup.com
                </Text>
                </View>

                <View style={{ width: 316 / 3, height: 230 / 3, borderRadius: 2, overflow: "hidden", marginLeft: 10 }}>
                  <Image source={{ uri: "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg" }} style={MyStyles.background_image}></Image>
                  <TouchableHighlight style={[{ position: "absolute", right: 5, top: 5 }, MyStyles.heart]}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableHighlight>
                </View>
              </View>

              <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10 }]}></View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}