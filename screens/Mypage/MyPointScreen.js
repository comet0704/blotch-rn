import React from 'react';
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';

export default class MyPointScreen extends React.Component {

  Necessarry = (
    <MyAppText style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </MyAppText>
  );

  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = {
      "result_data": {
        "point_history": [

        ]
      }
    };
  }

  componentDidMount() {
    this.requestPointHistory(0);
  }

  renderPointHistory(item, index) {
    if (item.type == 1) {
      {/* 리뷰작성으로 인한 지급 */ }
      <View key={index} style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: -3 }]}>
        <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_header]} onPress={() => {
          this.setState({ section_allergic_show: !this.state.section_allergic_show })
        }}>
          <Image source={require("../../assets/images/ic_review_big.png")} style={[MyStyles.ic_review_big]} />
          <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
            <MyAppText style={[MyStyles.ingredient_section_header_text1]}>My Review</MyAppText>
            <MyAppText style={[MyStyles.ingredient_section_header_text2, { color: Colors.color_949292 }]}>{item.desc}</MyAppText>
          </View>
          <MyAppText style={{ color: Colors.color_212122, fontSize: 18, fontWeight: "bold" }}>{item.point}<MyAppText style={{ color: Colors.primary_purple }}>P</MyAppText></MyAppText>
          <Image source={require("../../assets/images/ic_hidden_pt_mark.png")} style={[MyStyles.ic_hidden_pt_mark, { position: "absolute", right: -65 / 3 }]} />
        </TouchableOpacity>
      </View>
    } else if (item.type == 2) { // 미등록 제품스캔, 사진 업로드로 인한  인한 지급
      return (
        <View key={index} style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
          <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_header]} onPress={() => {
            this.setState({ section_allergic_show: !this.state.section_allergic_show })
          }}>
            <Image source={require("../../assets/images/ic_product_approval.png")} style={[MyStyles.ic_product_approval]} />
            <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
              <View style={{ flexDirection: "row" }}>
                <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Product approval</MyAppText>
              </View>

              <MyAppText style={[MyStyles.ingredient_section_header_text2, { color: Colors.color_949292 }]}>{item.desc}</MyAppText>
            </View>
            <MyAppText style={{ color: Colors.color_212122, fontSize: 18, fontWeight: "bold" }}>{item.point}<MyAppText style={{ color: Colors.primary_purple }}>P</MyAppText></MyAppText>
            <Image source={require("../../assets/images/ic_hidden_pt_mark.png")} style={[MyStyles.ic_hidden_pt_mark, { position: "absolute", right: -65 / 3 }]} />
          </TouchableOpacity>
        </View>
      );

    } else if (item.type == 3) {
      {/* Questionnaire 완료시 지급 */ }
      return (
        <View key={index} style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
          <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_header]} onPress={() => {
            this.setState({ section_allergic_show: !this.state.section_allergic_show })
          }}>
            <Image source={require("../../assets/images/ic_questionnare_big.png")} style={[MyStyles.ic_questionnare_big]} />
            <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
              <View style={{ flexDirection: "row" }}>
                <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Questionnaire</MyAppText>
              </View>

              <MyAppText style={[MyStyles.ingredient_section_header_text2, { color: Colors.color_949292 }]}>{item.desc}</MyAppText>
            </View>
            <MyAppText style={{ color: Colors.color_212122, fontSize: 18, fontWeight: "bold" }}>{item.point}<MyAppText style={{ color: Colors.primary_purple }}>P</MyAppText></MyAppText>

            <Image source={require("../../assets/images/ic_hidden_pt_mark.png")} style={[MyStyles.ic_hidden_pt_mark, { position: "absolute", right: -65 / 3 }]} />
          </TouchableOpacity>
        </View>
      );
    }

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack title="My Point" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
            onScroll={({ nativeEvent }) => {
              if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
                this.isLoading = true
                this.requestPointHistory(this.offset)
              }
            }}
          >
            <View>
              <View style={[{ flexDirection: "row", height: 200 / 3, margin: 15, overflow: "hidden", alignItems: "center", borderRadius: 5, marginBottom: 30 }, MyStyles.padding_main]}>
                <Image style={[MyStyles.background_image]} source={require("../../assets/images/ic_gradient_bg.png")} />
                <View style={{ flex: 1 }}>
                  <MyAppText style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>{global.login_info.user_id}'s</MyAppText>
                  <MyAppText style={{ color: "white", fontSize: 13 }}>holding point</MyAppText>
                </View>
                <MyAppText style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>{global.login_info.point}<MyAppText style={{ fontWeight: "300" }}>P</MyAppText></MyAppText>
              </View>


              {this.state.result_data.point_history.map((item, index) => this.renderPointHistory(item, index))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }

  requestPointHistory(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.pointHistory, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        offset: p_offset.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        this.offset += responseJson.result_data.point_history.length
        if (responseJson.result_data.point_history.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        const point_history = this.state.result_data.point_history
        result = { point_history: [...point_history, ...responseJson.result_data.point_history] };
        this.setState({ result_data: result }, () => {
          this.isLoading = false
        })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

}