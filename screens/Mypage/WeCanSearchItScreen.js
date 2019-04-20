// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';

import Carousel from 'react-native-banner-carousel';
import {
  Image,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import { FlatGrid } from 'react-native-super-grid';
import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { LinearGradient } from 'expo';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';

export default class WeCanSearcnItScreen extends React.Component {

  // 스킨타입 선택하고 여기로 진입한 스크린의 함수를 호출해주는 콜백보관
  onWeCanSearchItCallback = null;
  constructor(props) {
    super(props)
    this.state = {
      section_step1_show: false,
      section_step2_show: false,
      section_step3_show: false,
      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
    }
  }

  componentDidMount() {
    // questionnaire 나 홈에서 navigation 파람으로 넘어오는 값들 저장 (반점으로 구분된 값들)
    const selected_skin_type = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type)
    const selected_concern = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.questionnaire_concern)
    const selected_needs = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.questionnaire_needs)
    this.onWeCanSearchItCallback = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback)

    // 위 값들은 선택된 상태로 만들어줌
    if (selected_skin_type != null && selected_skin_type.length > 0) {
      selected_skin_type.split(",").forEach((element) => {
        const index = this.state.skin_types.findIndex(item => item.typeName == element)
        this.state.skin_types[index].is_selected = true
        this.setState(this.state.skin_types)
      })
    }
    if (selected_concern != null && selected_concern.length > 0) {
      selected_concern.split(",").forEach((element) => {
        const index = this.state.concern_types.findIndex(item => item.typeName == element)
        this.state.concern_types[index].is_selected = true
        this.setState(this.state.concern_types)
      })
    }
    if (selected_needs != null && selected_needs.length > 0) {
      selected_needs.split(",").forEach((element) => {
        const index = this.state.need_types.findIndex(item => item.typeName == element)
        this.state.need_types[index].is_selected = true
        this.setState(this.state.need_types)
      })
    }
  }

  componentWillMount() {
  }

  ScreenWidth = Dimensions.get('window').width;

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <View style={{ height: 430 / 3 }}>
          <Image source={require('../../assets/images/Login/login_bg.png')} style={MyStyles.background_image} />
          <TopbarWithWhiteBack onPress={() => { this.props.navigation.goBack(null) }}></TopbarWithWhiteBack>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center" }}>We can Search it !</Text>
            <Text style={{ fontSize: 12, color: "white", textAlign: "center" }}>We will consult your Skin</Text>
          </View>
        </View>
        <View style={[MyStyles.padding_h_main, { height: 120 / 3, alignItems: "center", flexDirection: "row", backgroundColor: "white" }]}>
          <Image source={require("../../assets/images/ic_search_medium.png")} style={[MyStyles.ic_search_small]} />
          <Text style={{ marginLeft: 5, color: Colors.primary_dark, fontWeight: "500", fontSize: 12 }}>Please set up your skin type</Text>
        </View>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag">

          <View>

            {/* Step1 */}
            <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_step1_show: !this.state.section_step1_show })
              }}>
                <View style={[{ flex: 1 }]}>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>Step 01</Text>
                  <Text style={[MyStyles.ingredient_section_header_text1]}>Select your Skin Type</Text>
                </View>
                {
                  this.state.section_step1_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

              {
                this.state.section_step1_show ?
                  <FlatGrid
                    itemDimension={this.ScreenWidth / 3 - 40}
                    items={this.state.skin_types}
                    style={[MyStyles.gridView, { marginTop: 10 }]}
                    spacing={10}

                    // staticDimension={300}
                    // fixed
                    // spacing={20}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => {
                        // 여기서는 오직 하나만 선택되어야 함
                        this.state.skin_types.forEach(element => {
                          element.is_selected = false
                        })

                        const w_index = this.state.skin_types.findIndex(p_item => p_item.typeName == item.typeName)
                        this.state.skin_types[w_index].is_selected = true
                        this.setState(this.state.skin_types)
                      }} style={{ alignItems: "center" }} >
                        <Image source={item.is_selected ? item.image_on : item.image_off} style={[MyStyles.ic_skin_types_big]} />
                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 13, marginTop: 2 }}>{item.typeName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  : null
              }
            </View>

            {/* Step2 */}
            <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 3 }]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_step2_show: !this.state.section_step2_show })
              }}>
                <View style={[{ flex: 1 }]}>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>Step 02</Text>
                  <Text style={[MyStyles.ingredient_section_header_text1]}>Select your Concerns</Text>
                </View>
                {
                  this.state.section_step2_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

              {
                this.state.section_step2_show ?
                  <FlatGrid
                    itemDimension={this.ScreenWidth / 3 - 40}
                    items={this.state.concern_types}
                    style={[MyStyles.gridView, { marginTop: 10 }]}
                    spacing={10}

                    // staticDimension={300}
                    // fixed
                    // spacing={20}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => {
                        const w_index = this.state.concern_types.findIndex(p_item => p_item.typeName == item.typeName)
                        this.state.concern_types[w_index].is_selected = !this.state.concern_types[w_index].is_selected
                        this.setState(this.state.concern_types)
                      }} style={{ alignItems: "center" }} >
                        <Image source={item.is_selected ? item.image_on : item.image_off} style={[MyStyles.ic_skin_types_big]} />
                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 13, marginTop: 2 }}>{item.typeName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  : null
              }
            </View>

            {/* Step3 */}
            <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 3 }]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_step3_show: !this.state.section_step3_show })
              }}>
                <View style={[{ flex: 1 }]}>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>Step 03</Text>
                  <Text style={[MyStyles.ingredient_section_header_text1]}>Select your Needs</Text>
                </View>
                {
                  this.state.section_step3_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

              {
                this.state.section_step3_show ?
                  <FlatGrid
                    itemDimension={this.ScreenWidth / 3 - 40}
                    items={this.state.need_types}
                    style={[MyStyles.gridView, { marginTop: 10 }]}
                    spacing={10}

                    // staticDimension={300}
                    // fixed
                    // spacing={20}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity onPress={() => {
                        const w_index = this.state.need_types.findIndex(p_item => p_item.typeName == item.typeName)
                        this.state.need_types[w_index].is_selected = !this.state.need_types[w_index].is_selected
                        this.setState(this.state.need_types)
                      }} style={{ alignItems: "center" }} >
                        <Image source={item.is_selected ? item.image_on : item.image_off} style={[MyStyles.ic_skin_types_big]} />
                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 13, marginTop: 2 }}>{item.typeName}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  : null
              }
            </View>


            <View style={[MyStyles.padding_main, { flexDirection: "row", marginBottom: 30 }]}>
              <TouchableOpacity style={[{ backgroundColor: Colors.primary_purple, height: 135 / 3, borderRadius: 2, justifyContent: "center", flex: 1, marginRight: 10 }]}
                onPress={() => {
                  // 반점으로 구분하여 돌려줘야 하는 값들
                  returnSkinType = ""
                  returnConcern = ""
                  returnNeeds = ""

                  this.state.skin_types.map((item, index) => {
                    if(item.is_selected) {
                      if(returnSkinType != "") {
                        returnSkinType += ","
                      }
                      returnSkinType += item.typeName
                    }                    
                  })

                  this.state.concern_types.map((item, index) => {
                    if(item.is_selected) {
                      if(returnConcern != "") {
                        returnConcern += ","
                      }
                      returnConcern += item.typeName
                    }                    
                  })

                  this.state.need_types.map((item, index) => {
                    if(item.is_selected) {
                      if(returnNeeds != "") {
                        returnNeeds += ","
                      }
                      returnNeeds += item.typeName
                    }                    
                  })
                  

                  this.onWeCanSearchItCallback(returnSkinType, returnConcern, returnNeeds)
                  this.navigation.goBack();
                }}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[{ borderColor: Colors.primary_purple, height: 135 / 3, borderWidth: 1, borderRadius: 2, justifyContent: "center", flex: 1, marginLeft: 10 }]}>
                <Text style={{ textAlign: "center", color: Colors.primary_purple, fontSize: 13 }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    );
  }
};