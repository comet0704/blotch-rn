import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { TouchableWithoutFeedback, Keyboard, AsyncStorage, Button, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithWhiteBack } from '../../components/Topbars/TopbarWithWhiteBack';
import MyStyles from '../../constants/MyStyles';
import Models from '../../Net/Models';
import Net from '../../Net/Net';
import MyConstants from '../../constants/MyConstants';
import Colors from '../../constants/Colors';
import Common from '../../assets/Common';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
export default class MyPageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      profileEdited: false,
      weatherInfo: {
        main: "",
        temp: "",
        icon: "",
        city: "",
      },
      result_data: {
        "detail": null,
        "recommend_list": [
        ],
        "mypage": {
          "my_point": 0,
          "my_last_review_date": "0000-00-00 00:00:00",
          "my_beautybox_count": 0,
          "my_questionnaire": ""
        }
      },
      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
      my_skin_type_img: null,
      my_concern_img: null,
      my_needs_img: null,
    };
  }

  componentDidMount() {
    this.requestMyPage();
    this.requestGetMyPosition();
    handleAndroidBackButton(this, exitAlert);

    if (global.login_info.skin_type != null && global.login_info.skin_type.length > 0) {
      const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == global.login_info.skin_type)
      const w_item = this.state.skin_types[w_index]
      this.setState({ my_skin_type_img: w_item.image_on })
    }
    if (global.login_info.concern != null && global.login_info.concern.length > 0) {
      const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == global.login_info.concern)
      const w_item = this.state.concern_types[w_index]
      this.setState({ my_concern_img: w_item.image_on })
    }
    if (global.login_info.needs != null && global.login_info.needs.length > 0) {
      const w_index = this.state.need_types.findIndex(item1 => item1.typeName == global.login_info.needs)
      const w_item = this.state.need_types[w_index]
      this.setState({ my_needs_img: w_item.image_on })
    }
  }

  componentWillMount() {
    removeAndroidBackButtonHandler()
  }

  static navigationOptions = {
    header: null,
  };

  onProfileEdited = () => {
    this.setState({ profileEdited: !this.state.profileEdited });
  }

  renderRecommendingScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.result_data.recommend_list.map(item => (
            <View key={item.id} style={{ flex: 1, marginRight: 10, width: 85 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                <ImageLoad style={{ width: 85, height: 85, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image_list) }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: "#949393", marginTop: 5, textAlign: "center" }} numberOfLines={1}>{item.brand_title}</Text>
              <Text style={{ fontSize: 13, color: "#212122", fontWeight: "bold", textAlign: "center" }} numberOfLines={1}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  renderTrack() {
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
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardDismissMode="on-press"  /*keyboardVerticalOffset={100}*/>
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" onPress={() => { Keyboard.dismiss() }} >
            <View style={{ flex: 1, backgroundColor: Colors.color_f8f8f8 }}>
              {/* 사진, 텍스트 */}
              <View style={[MyStyles.profile_back, MyStyles.padding_h_main, { justifyContent: "center" }]}>
                <Image source={require('../../assets/images/ic_profile_back.png')} style={MyStyles.background_image} />
                {
                  global.login_info.profile_image != null ?
                    <Image source={{ uri: Common.getImageUrl(global.login_info.profile_image) }} opacity={0.2} style={MyStyles.background_image} />
                    :
                    null
                }

                <TouchableOpacity style={{ position: "absolute", padding: 15, top: 5, right: 0 }} onPress={() => {
                  this.props.navigation.navigate("EditProfile", { [MyConstants.NAVIGATION_PARAMS.onProfileEdited]: this.onProfileEdited })
                }}>
                  <Image source={require('../../assets/images/ic_edit.png')} style={MyStyles.ic_edit} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[MyStyles.profile_box1]}>
                    {/* <TouchableOpacity onPress={() => { this.setState({ photoModalVisible: true }) }} style={MyStyles.camera_box}>
                    <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={{ width: 12, height: 11, alignSelf: "center" }} />
                  </TouchableOpacity> */}
                    <Image source={global.login_info.profile_image == null ? (require('../../assets/images/Login/ic_avatar.png')) : { uri: Common.getImageUrl(global.login_info.profile_image) }} style={global.login_info.profile_image == null ? { width: 117 / 3, height: 166 / 3, alignSelf: "center" } : { width: 315 / 3, height: 315 / 3, borderRadius: 100, }} />
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text style={{ fontSize: 59 / 3, color: "white", fontWeight: "500" }}>Hello {global.login_info.user_id}</Text>
                    <Text style={{ fontSize: 59 / 3, color: "white" }}>Do you need advice?</Text>
                  </View>
                </View>
              </View>

              {/* Weather, SkinType, Concern, Needs */}
              <View style={[MyStyles.padding_main, { flexDirection: "row" }]}>
                <View style={[MyStyles.meta_info_box]}>
                  {this.state.weatherInfo.icon.length > 0 ?
                    <Image source={{ uri: this.state.weatherInfo.icon }} style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
                    :
                    null
                  }
                  <Text style={[MyStyles.meta_text]}>Weather</Text>
                  <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 5 }} onPress={() => { this.requestGetMyPosition() }}>
                    <Image source={(require('../../assets/images/ic_weather_sync.png'))} style={[MyStyles.ic_weather_sync]} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  {
                    this.state.my_skin_type_img != null ?
                      <Image source={this.state.my_skin_type_img} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                      :
                      <Image source={(require('../../assets/images/ic_pink_ellipse.png'))} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                  }
                  <Text style={[MyStyles.meta_text]}>Skin Type</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  {
                    this.state.my_concern_img != null ?
                      <Image source={this.state.my_concern_img} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                      :
                      <Image source={(require('../../assets/images/ic_pink_ellipse.png'))} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                  }
                  <Text style={[MyStyles.meta_text]}>Concern</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  {
                    this.state.my_needs_img != null ?
                      <Image source={this.state.my_needs_img} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                      :
                      <Image source={(require('../../assets/images/ic_pink_ellipse.png'))} style={[{ alignSelf: "center" }, MyStyles.ic_pink_ellipse]} />
                  }
                  <Text style={[MyStyles.meta_text]}>Needs</Text>
                </View>
              </View>


              {/* It's dry today, Moisturize your face, You're interedsted in Whitening */}
              <View style={[{ flex: 1 }, MyStyles.padding_h_main]}>
                <View style={[MyStyles.ic_one_line_desc_box]}>
                  <Image source={require('../../assets/images/ic_weather_type1.png')} style={[{ alignSelf: "center" }, MyStyles.ic_weather_type1]} />
                  <Text style={{ color: Colors.color_212122, fontSize: 13, marginLeft: 5 }}>It's<Text style={{ fontWeight: "bold" }}> {"dry"}</Text> today</Text>
                </View>
                <View style={[MyStyles.ic_one_line_desc_box]}>
                  <Image source={require('../../assets/images/ic_face_type1.png')} style={[{ alignSelf: "center" }, MyStyles.ic_weather_type1]} />
                  <Text style={{ color: Colors.color_212122, fontSize: 13, marginLeft: 5 }}><Text style={{ fontWeight: "bold" }}>{global.login_info.needs} </Text>your face</Text>
                </View>
                <View style={[MyStyles.ic_one_line_desc_box]}>
                  <Image source={require('../../assets/images/ic_snow1.png')} style={[{ alignSelf: "center" }, MyStyles.ic_snow1]} />
                  <Text style={{ color: Colors.color_212122, fontSize: 13, marginLeft: 5 }}>You're interested in <Text style={{ fontWeight: "bold" }}> {global.login_info.concern}</Text></Text>
                </View>
              </View>

              {/* We recommend It! 로그인 했을때 나타나는 정보 */}
              <View style={[{ marginTop: 20 }]}>
                <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>We recommend It!</Text>
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                    this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>more ></Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 20
                }}>
                  {/* <View style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_h_main]}>
                  <Text style={[MyStyles.text_13_656565, { flex: 1 }]}>Tell us about your skin and we'll show you some product that you might want to check out!</Text>
                  <TouchableOpacity>
                    <Image source={require('../../assets/images/ic_btn_right.png')} style={[{ alignSelf: "center" }, MyStyles.ic_btn_right]} />
                  </TouchableOpacity>
                </View> */}
                  {
                    this.renderRecommendingScroll()
                  }
                </View>
              </View>


              {/* My Point 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.props.navigation.navigate("MyPoint")
                }}>
                  <Image source={require("../../assets/images/ic_point_big.png")} style={[MyStyles.ic_point_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>My Point</Text>
                    <Text style={[MyStyles.ingredient_section_header_text2]}>{this.state.result_data.mypage.my_point}P</Text>
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>

              {/* My Review 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.props.navigation.navigate("MyReview")
                }}>
                  <Image source={require("../../assets/images/ic_review_big.png")} style={[MyStyles.ic_review_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>My Review</Text>
                    {this.state.result_data.mypage.my_last_review_date != null && this.state.result_data.mypage.my_last_review_date.length > 0 ?
                      <Text style={[MyStyles.ingredient_section_header_text2]}>Recent Review<Text style={{ marginLeft: 5, fontSize: 12, color: Colors.color_949292, fontWeight: "400" }}>  {this.state.result_data.mypage.my_last_review_date.substring(0, 10)}</Text></Text>
                      :
                      <Text style={[MyStyles.ingredient_section_header_text2]}>Please write a review</Text>
                    }
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>

              {/* My Beauty Box 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.props.navigation.navigate("MyBeautyBox")
                }}>
                  <Image source={require("../../assets/images/ic_beauty_box_big.png")} style={[MyStyles.ic_beauty_box_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>My Beauty Box</Text>
                    {this.state.result_data.mypage.my_beautybox_count > 0 ?
                      <Text style={[MyStyles.ingredient_section_header_text2]}>{this.state.result_data.mypage.my_beautybox_count} Product in use</Text>
                      :
                      <Text style={[MyStyles.ingredient_section_header_text2]}>There is no Product in use</Text>
                    }
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>

              {/* Questionnaire 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0, marginBottom: 40 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.props.navigation.navigate("Questionnare")
                }}>
                  <Image source={require("../../assets/images/ic_questionnare_big.png")} style={[MyStyles.ic_questionnare_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[MyStyles.ingredient_section_header_text1]}>Questionnaire</Text>
                      {this.state.result_data.mypage.my_questionnaire != null && this.state.result_data.mypage.my_questionnaire.length > 0 ?
                        <Text style={{ marginLeft: 10, borderRadius: 10, borderColor: Colors.color_f8f8f8, paddingLeft: 10, paddingRight: 10, borderWidth: 0.5, fontSize: 12, color: Colors.color_949292, fontWeight: "400" }}>Me</Text>
                        :
                        <Text style={{ marginLeft: 10, borderRadius: 10, borderColor: Colors.color_f8f8f8, paddingLeft: 10, paddingRight: 10, borderWidth: 0.5, fontSize: 12, color: Colors.color_949292, fontWeight: "400" }}>-</Text>
                      }
                    </View>

                    {this.state.result_data.mypage.my_questionnaire_status > 0 ?
                      <Text style={[MyStyles.ingredient_section_header_text2]}>Completed</Text>
                      :
                      <Text style={[MyStyles.ingredient_section_header_text2]}>-</Text>
                    }
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>


            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <TouchableOpacity style={{ position: "absolute", bottom: 30, right: 0 }} onPress={() => { this.props.navigation.navigate("Setting") }}>
          <Image source={require('../../assets/images/ic_setting.png')} style={MyStyles.ic_setting} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    if (this.state.profileEdited) {
      return this.renderTrack()
    } else {
      return this.renderTrack()
    }
  }


  requestMyPage() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.myPage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        global.login_info.point = responseJson.result_data.mypage.my_point // 포인트만은 여기서 건사했다 저장시켜야 함.
        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(global.login_info));
        this.state.result_data = responseJson.result_data
        this.setState(this.state.result_data)

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  // 현재위치로부터 날씨 api를 호출해서 지역정보를 얻는다.
  requestGetMyPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //현재 위치 가져옴 position = 현재위치, JSON 형태
        console.log(position)
        this._getWeather(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        //가져오기 실패 했을 경우.
        // this.refs.toast.showBottom("Please allow location permissions in Settings.")
      }, {
        //Accuracy가 높아야하는지, 위치를 가져오는데 max 시간, 가져온 위치의 마지막 시간과 현재의 차이
        enableHighAccuracy: false, timeout: 20000, maximumAge: 1000
      });
  }

  _getWeather = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${MyConstants.WEATHER_MAP_API_KET}`)
      .then(response => response.json()) // 응답값을 json으로 변환
      .then(json => {
        console.log("1111111111" + JSON.stringify(json));
        this.state.weatherInfo.main = json.weather[0].main
        this.state.weatherInfo.temp = json.main.temp // 켈빈으로 내려옴
        this.state.weatherInfo.icon = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
        this.state.weatherInfo.city = json.name
        this.setState(this.state.weatherInfo)
      });
  }
}
