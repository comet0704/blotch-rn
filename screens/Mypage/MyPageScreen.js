import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { TouchableWithoutFeedback, Dimensions, Keyboard, AsyncStorage, Button, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
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
import { NavigationEvents } from 'react-navigation';
import MovableView from 'react-native-movable-view'

export default class MyPageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      refreshing: false,
      oneline_review_ko: "",
      oneline_review_en: "",
      profileEdited: false,
      refreshOneLineInfo: false,
      weatherInfo: {
        main: "_____",
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
      settingButtonDisabled: true,
      refreshSettingBtn: false,
    };

    this.settingButtonOffset = null
    this.settingBtnPos = { bottom: 30, right: 0 }
  }

  componentDidMount() {
    this.requestMyPage();
    this.requestGetMyPosition();
    handleAndroidBackButton(this, exitAlert);

    if (global.login_info.skin_type != null && global.login_info.skin_type.length > 0) {
      const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == global.login_info.skin_type.split(",")[0])
      const w_item = this.state.skin_types[w_index]
      this.setState({ my_skin_type_img: w_item.image_on })
    }
    if (global.login_info.concern != null && global.login_info.concern.length > 0) {
      const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == global.login_info.concern.split(",")[0])
      const w_item = this.state.concern_types[w_index]
      this.setState({ my_concern_img: w_item.image_on })
    }
    if (global.login_info.needs != null && global.login_info.needs.length > 0) {
      const w_index = this.state.need_types.findIndex(item1 => item1.typeName == global.login_info.needs.split(",")[0])
      const w_item = this.state.need_types[w_index]
      this.setState({ my_needs_img: w_item.image_on })
    }

    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.settingButtonOffset, (err, result) => {
      if (result != null) {
        this.settingButtonOffset = JSON.parse(result);
        this.settingBtnPos.bottom = Math.max(0, Math.min(this.ScreenHeight - MyConstants.TABBAR_HEIGHT - this.settingButtonOffset.y - MyStyles.ic_setting.height, this.ScreenHeight - MyStyles.ic_setting.height - MyConstants.TABBAR_HEIGHT))
        this.settingBtnPos.right = Math.max(0, Math.min(this.ScreenWidth - this.settingButtonOffset.x - MyStyles.ic_setting.width, this.ScreenWidth - MyStyles.ic_setting.width))
        this.setState({ refreshSettingBtn: !this.state.refreshSettingBtn })

      }
    });
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

  renderOneLineInfoSection() {
    return (
      <View style={[{ marginTop: 10 }]}>
        <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }, MyStyles.container]}>
          <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>We recommend It!</Text>
          {Common.isNeedToAddQuestionnaire() ? null :
            <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() =>
              this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>
              <Text style={MyStyles.txt_more}>more</Text>
              <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
            </TouchableOpacity>
          }
        </View>

        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          paddingBottom: 15
        }}>
          {Common.isNeedToAddQuestionnaire() ?
            <TouchableOpacity style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_h_10]}
              onPress=
              {() => {
                this.props.navigation.navigate("WeCanSearchIt", {
                  [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                  [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                  [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                  [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                })
              }
              }>
              <Text style={[MyStyles.text_13_656565, { flex: 1 }]}>Tell us about your skin and we'll show you some product that you might want to check out!</Text>
              <View>
                <Image source={require('../../assets/images/ic_btn_right.png')} style={[{ alignSelf: "center" }, MyStyles.ic_btn_right]} />
              </View>
            </TouchableOpacity> :
            this.renderRecommendingScroll()
          }
        </View>
      </View>

    )

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

  onWeCanSearchItCallback = (p_skin_type, p_concern, p_needs) => {

    if (global.login_info.token.length <= 0) { // 로그인 하지 않은 회원의 경우 임시로 보여주기만 하자.
      global.login_info.skin_type = p_skin_type
      global.login_info.concern = p_concern
      global.login_info.needs = p_needs
      this.setState({ refreshOneLineInfo: !this.state.refreshOneLineInfo });
      return;
    } else {
      // WecanSeachit에서 입력한 정보들로 메인 questionnaire를 만들어주자.
      this.requestUpdateQuestionnaireItem(global.login_info.questionnaire_id, p_skin_type, p_concern, p_needs)
    }
  }


  ScreenWidth = Dimensions.get('window').width;
  ScreenHeight = Dimensions.get('window').height;
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
          <NavigationEvents
            onWillFocus={payload => {
              if (global.login_info.token == null || global.login_info.token.length < 1) {
                this.setState({ showLoginModal: true });
                return;
              }
              if (global.refreshStatus.mypage == true) {
                global.refreshStatus.mypage = false
                this.requestMyPage();
              }
            }}
          />
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" onPress={() => { Keyboard.dismiss() }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
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
                <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={[{ alignSelf: "center" }, MyStyles.ic_camera]} />
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
                    <Image style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
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

              <View style={[{ flex: 1, minHeight: 125, marginTop: 5 }, MyStyles.padding_h_main]}>
                <View style={[{ flex: 1, backgroundColor: "white", borderRadius: 5 }, MyStyles.shadow_2, MyStyles.padding_h_main, MyStyles.padding_v_10]}>
                  <Text style={[{ fontSize: 15, fontWeight: "500", color: Colors.primary_dark }]}>Beauty Advice</Text>
                  <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10, marginBottom: 10 }]} />
                  {this.state.refreshOneLineInfo ?
                    !(Common.isNeedToAddQuestionnaire()) ?
                      <View>
                        <View style={[{ flexDirection: "row", color: "white" }]}>
                          <Text style={{ color: Colors.color_656565, fontSize: 13, }}><Text style={{}}>{this.state.oneline_review_en} </Text></Text>
                        </View>
                      </View>
                      : null
                    :
                    !(Common.isNeedToAddQuestionnaire()) ?
                      <View>
                        <View style={[{ flexDirection: "row", color: "white" }]}>
                          <Text style={{ color: Colors.color_656565, fontSize: 13, }}><Text style={{}}>{this.state.oneline_review_en} </Text></Text>
                        </View>
                      </View>
                      : null
                  }
                </View>
              </View>

              {/* We recommend It! 로그인 했을때 나타나는 정보 */}
              {this.state.refreshOneLineInfo ?
                this.renderOneLineInfoSection()
                :
                this.renderOneLineInfoSection()
              }


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

        <MovableView
          ref={ref => this.move = ref}
          disabled={true}
          onDragEnd={() => {
            this.move.changeDisableStatus(); this.setState({ settingButtonDisabled: true });
            this.settingBtn.measure((x, y, width, height, pageX, pageY) => {
              console.log("ScreenWidth: " + this.ScreenWidth + "---ScreenHeight: " + this.ScreenHeight)
              console.log(x, y, width, height, pageX, pageY);
              this.settingButtonOffset.x = pageX
              this.settingButtonOffset.y = pageY
              AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.settingButtonOffset, JSON.stringify(this.settingButtonOffset));
            })
          }}
        >
          {this.state.refreshSettingBtn ?
            <TouchableOpacity
              ref={(ref) => { this.settingBtn = ref }}
              activeOpacity={0.8}
              onLongPress={() => { this.move.changeDisableStatus(), this.setState({ settingButtonDisabled: false }) }}
              style={[{
                position: "absolute",
                transform: this.state.settingButtonDisabled ? [{ scaleX: 1 }, { scaleY: 1 }] : [{ scaleX: 1.1 }, { scaleY: 1.1 }]
              },
              // { bottom: 30, right: 0, }
              this.settingButtonOffset == null ? { bottom: 30, right: 0, } :
                {
                  bottom: this.settingBtnPos.bottom,
                  right: this.settingBtnPos.right
                }
              ]}
              onPress={() => { this.props.navigation.navigate("Setting") }}>
              <Image source={require('../../assets/images/ic_setting.png')} style={MyStyles.ic_setting} />
            </TouchableOpacity>
            : <TouchableOpacity
              ref={(ref) => { this.settingBtn = ref }}
              activeOpacity={0.8}
              onLongPress={() => { this.move.changeDisableStatus(), this.setState({ settingButtonDisabled: false }) }}
              style={[{
                position: "absolute",
                transform: this.state.settingButtonDisabled ? [{ scaleX: 1 }, { scaleY: 1 }] : [{ scaleX: 1.1 }, { scaleY: 1.1 }]
              },
              // { bottom: 30, right: 0, }
              this.settingButtonOffset == null ? { bottom: 30, right: 0, } :
                {
                  bottom: this.settingBtnPos.bottom,
                  right: this.settingBtnPos.right
                }
              ]}
              onPress={() => { this.props.navigation.navigate("Setting") }}>
              <Image source={require('../../assets/images/ic_setting.png')} style={MyStyles.ic_setting} />
            </TouchableOpacity>
          }

        </MovableView>
      </View >
    );
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.requestMyPage();
    this.setState({ refreshing: false });
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
        // console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestOnelineReview(global.login_info.skin_type, global.login_info.concern, global.login_info.needs, this.state.weatherInfo.main)

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
        // console.log(position)
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
        this.state.weatherInfo.main = json.weather[0].main
        this.state.weatherInfo.temp = json.main.temp // 켈빈으로 내려옴
        this.state.weatherInfo.icon = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
        this.state.weatherInfo.city = json.name
        this.setState(this.state.weatherInfo)
        if (Common.isNeedToAddQuestionnaire() == false) {
          this.requestOnelineReview(global.login_info.skin_type, global.login_info.concern, global.login_info.needs, this.state.weatherInfo.main)
        }
      });
  }

  requestUpdateQuestionnaireItem(p_questionnaire_id, p_skin_type, p_concern, p_needs) {
    // console.log(p_questionnaire_id)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.updateQuestionnaireItem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id.toString(),
        title: "Me",
        skin_type: p_skin_type,
        concern: p_concern,
        needs: p_needs,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        global.login_info.skin_type = p_skin_type
        global.login_info.concern = p_concern
        global.login_info.needs = p_needs
        this.setState({ refreshOneLineInfo: !this.state.refreshOneLineInfo });
        this.requestMyPage();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestOnelineReview(p_skin_type, p_concerns, p_needs, p_weather) {
    return fetch(Net.user.onelineReview, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        skin_type: p_skin_type,
        concerns: p_concerns,
        needs: p_needs,
        weather: p_weather,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        this.setState({
          oneline_review_en: responseJson.result_data.oneline_review.comment_en,
          oneline_review_ko: responseJson.result_data.oneline_review.comment_ko
        });
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
