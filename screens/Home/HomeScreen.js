// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles';
import MyConstants from '../../constants/MyConstants';
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  WebView,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  BackHandler,
  RefreshControl,
  Linking,
} from 'react-native';
import { Updates, Notifications, Permissions } from 'expo';
import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
import { LoginModal } from '../../components/Modals/LoginModal';
import { MyPagination } from '../../components/MyPagination';
/**
 *
 */
import { SearchModal } from '../../components/Modals/SearchModal';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.currentRouteName = 'Main';
    this.state = {
      activeBannerIndex: 0,
      activeArticleIndex: 0,
      refreshing: false,
      showLoginModal: false,
      refreshOneLineInfo: false,
      isGpsOn: true,
      oneline_review_ko: "",
      oneline_review_en: "",
      weatherInfo: {
        main: "_____",
        temp: "",
        icon: "",
        city: "",
      },
      result_data: {
        recommend_product_list: [],
        banner_list: [],
        banner_list2: [],
        banner_list3: [],
        new_product_list: [],
        best_product_list: [],
        latest_article_list: [],
        trend_article_list: [],
      },
      newProductBanner: {
        image_list: "",
        title: "",
      },
      bestProductBanner: {
        image_list: "",
        title: "",
      },
      modalVisible: false
    };
  }

  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.

    return fetch(Net.user.updateFcmToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        fcm_token: token,
      }),
    })
  }

  _handleNotification = (p_notification) => {
    // p_notification 의 구조

    // Object {
    //   "actionId": null,
    //   "data": Object {
    //     "custom_data": "{\"type\":\"article\",\"id\":\"1\"}",
    //     "type": "1",
    //   },
    //   "isMultiple": false,
    //   "notificationId": -472762171,
    //   "origin": "received", // 선택하면 'selected'
    //   "remote": true,
    //   "userText": null,
    // }

    if (p_notification.origin == "selected") {
      if (p_notification.data.type == MyConstants.FCM_TYPES.FCM_TYPE_COMMENT) { // 댓글알림이면
        custom_data = JSON.parse(p_notification.data.custom_data)
        if (custom_data.type == 'article') {
          this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: custom_data.id })
        } else if (custom_data.type == 'banner') {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: custom_data.id })
        } else if (custom_data.type == 'product') {
          this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: custom_data.id })
        }
      }

      if (p_notification.data.type == MyConstants.FCM_TYPES.FCM_TYPE_CONTACTUS ||
        p_notification.data.type == MyConstants.FCM_TYPES.FCM_TYPE_NOTICE) { // 문의답변알림, 공지알림이면 공지페지로 이행
        this.props.navigation.navigate("Announcements")
      }
    }
  }

  async componentDidMount() {
    // Home 에서 Notification을 조종해 주겠음
    Notifications.addListener(this._handleNotification);

    if (global.login_info.token.length > 0) { // 회원이면 expo 토큰 등록
      this.registerForPushNotificationsAsync()
    }

    this.requestHomeList(global.login_info.questionnaire_id);
    this.requestGetMyPosition();
    handleAndroidBackButton(this, exitAlert);

    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.is_tutorial_shown, (err, result) => {
      if (result == null) {
        this.props.navigation.navigate("Tutorial")
      }
    });

    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  componentWillUpdate() {
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler()
  }

  static navigationOptions = {
    header: null,
  };

  BannerHeight = 265;
  ScreenWidth = Dimensions.get('window').width;
  newCarouselIndicator = null;
  bestCarouselIndicator = null;

  renderBanner = ({ item, index }) => {
    return (
      <View key={index} style={{ height: this.BannerHeight }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          if (item.is_direct_link > 0) {
            Linking.openURL(Common.getLinkUrl(item.url))
          } else {
            this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item })
          }
        }}>
          <View>
            <ImageLoad style={{ width: this.ScreenWidth, height: "100%" }} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={[MyStyles.banner_title]}>
              <MyAppText style={{ fontSize: 13, color: "white" }} numberOfLines={1}>{item.title}</MyAppText>
              <MyAppText style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }} numberOfLines={3}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderBanner2 = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          if (item.is_direct_link > 0) {
            Linking.openURL(Common.getLinkUrl(item.url))
          } else {
            this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item })
          }
        }}>
          <View style={{ width: this.ScreenWidth / 2, height: "100%", justifyContent: "center", alignItems: "center" }}>
            <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
            <MyAppText style={{ fontSize: 20, color: "white", fontWeight: "bold", lineHeight: 26 }} numberOfLines={3}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderBanner3 = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          if (item.is_direct_link > 0) {
            Linking.openURL(Common.getLinkUrl(item.url))
          } else {
            this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item })
          }
        }}>
          <View style={{ width: this.ScreenWidth / 2, height: "100%", justifyContent: "center", alignItems: "center" }}>
            <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
            <MyAppText style={{ fontSize: 20, color: "white", fontWeight: "bold", lineHeight: 26 }} numberOfLines={3}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderNewProductBanner = ({ item, index }) => {
    return (
      <View key={index} style={[{ width: "100%", flex: 1 }, MyStyles.product_banneritem1]}>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
          <View style={{ flex: 1 }}>
            <ImageLoad style={MyStyles.product_thumbnail1} source={{ uri: Common.getImageUrl(item.image_list) }} />
            {
              item.is_liked > 0
                ?
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item2]} onPress={() => { this.requestProductUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item2]} onPress={() => { this.requestProductLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
            }
            <View style={[MyStyles.productbanner1_text_cover]}>
              <MyAppText style={{ fontSize: 12, color: "#949393", textAlign: "center" }} numberOfLines={1}>{item.brand_title}</MyAppText>
              <MyAppText style={{ fontSize: 14, color: "black", textAlign: "center", lineHeight: 14, marginTop: 3 }} numberOfLines={2}>{item.title}</MyAppText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderBestProductBanner = ({ item, index }) => {
    return (
      <View key={index} style={[{ width: "100%", flex: 1 }, MyStyles.product_banneritem1]}>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
          <View style={{ flex: 1 }}>
            <ImageLoad style={MyStyles.product_thumbnail1} source={{ uri: Common.getImageUrl(item.image_list) }} />
            {
              item.is_liked > 0
                ?
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item2]} onPress={() => { this.requestProductUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item2]} onPress={() => { this.requestProductLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
            }
            <View style={[MyStyles.productbanner1_text_cover]}>
              <MyAppText style={{ fontSize: 12, color: "#949393", textAlign: "center" }} numberOfLines={1}>{item.brand_title}</MyAppText>
              <MyAppText style={{ fontSize: 14, color: "black", textAlign: "center", lineHeight: 14, marginTop: 3 }} numberOfLines={2}>{item.title}</MyAppText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  renderTodayArticleBanner = ({ item, index }) => {
    return (
      <View key={index} style={{ width: "100%", height: 166, flex: 1 }}>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
          <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
            <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={[MyStyles.banner_title]}>
              <MyAppText style={{ fontSize: 13, color: "white" }}>{item.title}</MyAppText>
              <MyAppText style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderTrendingScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.result_data.trend_article_list.map(item => (
            <View key={item.id} style={{ width: 150, height: 75, flex: 1, marginRight: 10 }}>
              <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
                <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
                  <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
                  <View style={{ position: "absolute", bottom: 5, left: 5, maxWidth: 120 }}>
                    <MyAppText style={{ fontSize: 12, color: "white" }}>{item.title}</MyAppText>
                    <MyAppText style={{ fontSize: 14, color: "white", fontWeight: "bold" }} numberOfLines={1}>{item.content}</MyAppText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  renderRecommendingScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.result_data.recommend_product_list.map(item => (
            <View key={item.id} style={{ flex: 1, marginRight: 10, width: 85 }}>
              <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
                <ImageLoad style={{ width: 85, height: 85, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image_list) }} />
              </TouchableOpacity>
              <MyAppText style={{ fontSize: 12, color: "#949393", marginTop: 5, textAlign: "center" }} numberOfLines={1}>{item.brand_title}</MyAppText>
              <MyAppText style={{ fontSize: 13, color: "#212122", fontWeight: "bold", textAlign: "center" }} numberOfLines={1}>{item.title}</MyAppText>

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
      this.requestOnelineReview(global.login_info.skin_type, global.login_info.concern, global.login_info.needs, this.state.weatherInfo.main)
      this.setState({ refreshOneLineInfo: !this.state.refreshOneLineInfo });
      return;
    } else {
      // WecanSeachit에서 입력한 정보들로 메인 questionnaire를 만들어주자.
      this.requestUpdateQuestionnaireItem(global.login_info.questionnaire_id, p_skin_type, p_concern, p_needs)
      global.refreshStatus.mylist = true
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.requestHomeList(global.login_info.questionnaire_id);
    this.setState({ refreshing: false });
  }

  renderOneLineInfoSection() {
    return (
      <View>
        <View style={[{ flexDirection: "row", color: "white" }]}>
          {/* <Image source={require('../../assets/images/Home/ic_face_type.png')} style={{ width: 13, height: 10, alignSelf: "center" }} /> */}
          <MyAppText style={{ color: "white", fontSize: 13,/* marginLeft: 5*/ }}><MyAppText>{this.state.oneline_review_en} </MyAppText></MyAppText>
        </View>
        {/* <View style={[{ flexDirection: "row", color: "white" }]}>
          <Image source={require('../../assets/images/Home/ic_snow.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
          <MyAppText style={{ color: "white", fontSize: 13, marginLeft: 5 }}>You're interested in <MyAppText style={{ fontWeight: "bold" }}> {global.login_info.concern.split(",")[0]}</MyAppText></MyAppText>
        </View> */}
      </View>
    )
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
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
          <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: "white" }} keyboardDismissMode="on-drag"
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />} >
            <View style={{ backgroundColor: "#f8f8f8", marginTop: MyConstants.STATUSBAR_HEIGHT, paddingBottom: MyConstants.TABBAR_TOP_BORDER_HEIGHT }}>
              {/* Search bar */}
              <View style={[MyStyles.searchBoxCommon, MyStyles.container, MyStyles.bg_white, { marginTop: 0 }]}>
                <Image source={require("../../assets/images/Home/ic_logo_purple.png")} style={{ width: 964 / 16, height: 345 / 16, alignSelf: "center" }} />
                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[{ marginLeft: 12, }, MyStyles.searchBoxCover,]}>
                    <Image source={require("../../assets/images/ic_search_box_bg.png")} style={MyStyles.background_image_stretch} />
                    <Image source={require('../../assets/images/Home/ic_search.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} placeholder="Search keyword"></TextInput>
                    {/* OCR */}
                    <TouchableOpacity activeOpacity={0.8} style={{ padding: 8, alignSelf: "center" }}
                      // onPress={() => { this.props.navigation.navigate("SearchCamera") }}>
                      onPress={() => { this.setState({ modalVisible: true }) }}>
                      <Image source={require('../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {/* Today's Beauty Information */}
              <View style={[{ paddingTop: 20, borderBottomLeftRadius: 20, }, MyStyles.container, MyStyles.bg_white]}>
                {/* borderTop에 그림자 효과 가리기 위한 뷰 */}
                <View style={{ position: "absolute", height: 2, top: -2, left: 0, right: 0, backgroundColor: "white" }} />

                <MyAppText style={[{ color: "#949393", fontSize: 12 }]}>Today's counselor</MyAppText>
                <MyAppText style={[MyStyles.text_20, { marginTop: 5 }]}>Today's Beauty Information</MyAppText>
                <View style={[{ borderRadius: 3, overflow: "hidden", width: "100%", minHeight: 125, marginTop: 20, padding: 15, marginBottom: 23 }]}>
                  <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} />
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <MyAppText style={[{ fontSize: 15, fontWeight: "500", color: "white" }]}>Beauty Advice</MyAppText>
                      <View style={[MyStyles.seperate_line_white, { marginTop: 10, marginBottom: 10 }]} />
                      {/* 날씨 감춤 */}
                      {/* <View style={[{ flexDirection: "row", color: "white" }]}>
                        <Image source={require('../../assets/images/Home/ic_weather_type.png')} style={{ width: 13, height: 7, alignSelf: "center" }} />
                        <MyAppText style={{ color: "white", fontSize: 13, marginLeft: 5 }}>It's<MyAppText style={{ fontWeight: "bold" }}> {this.state.weatherInfo.main.toLowerCase()}</MyAppText> today</MyAppText>
                      </View> */}
                      {this.state.refreshOneLineInfo ?
                        !(Common.isNeedToAddQuestionnaire()) ?
                          this.renderOneLineInfoSection()
                          : global.login_info.token.length > 0 ? // 로그인한 회원의 경우만 설문 작성유무 판정
                            <MyAppText style={{ color: "white", fontSize: 13 }}>Please complete the Questionnaire</MyAppText>
                            : null
                        :
                        !(Common.isNeedToAddQuestionnaire()) ?
                          this.renderOneLineInfoSection()
                          : global.login_info.token.length > 0 ? // 로그인한 회원의 경우만 설문 작성유무 판정
                            <MyAppText style={{ color: "white", fontSize: 13 }}>Please complete the Questionnaire</MyAppText>
                            : null
                      }
                    </View>
                    {this.state.weatherInfo.icon.length > 0 ?
                      <View style={{ alignSelf: "center", marginLeft: 10, justifyContent: "center" }}>
                        <Image source={{ uri: this.state.weatherInfo.icon }} style={{ width: 50, height: 50, alignSelf: "center" }} />
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: -5, alignItems: "center" }}>
                          <MyAppText style={{ fontSize: 13, color: "white", alignSelf: "center" }}>{this.state.weatherInfo.city + "." + parseFloat(this.state.weatherInfo.temp - 273.15).toFixed(0).toString() + "˚C"}</MyAppText>
                          <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {
                            this.state.weatherInfo.icon = ""
                            this.setState({ weatherInfo: this.state.weatherInfo })
                            this.requestGetMyPosition();
                          }}>
                            <Image source={(require('../../assets/images/ic_weather_sync1.png'))} style={[MyStyles.ic_weather_sync1]} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      :
                      <View style={{ alignSelf: "center", marginLeft: 10, width: 50, justifyContent: "center" }}>
                        {this.state.isGpsOn ?
                          <View style={{ width: 15, height: 15, alignSelf: "center" }}>
                            <Image source={require('../../assets/images/weather_loading.gif')} style={{ width: 15, height: 15, alignSelf: "center" }} />
                          </View>
                          : null}
                      </View>
                    }

                  </View>
                </View>
                {/* We recommend It! 로그이 되고 기초 설문작성되었 나타나는 정보 */}
                {global.login_info.token.length > 0 && Common.isNeedToAddQuestionnaire() == false ?
                  <View style={[{ borderBottomLeftRadius: 20 }, MyStyles.bg_white]}>
                    <View style={[MyStyles.seperate_line_e5e5e5, { marginRight: -15, marginTop: -5 }]} />
                    <View style={[{ flexDirection: "row", flex: 1, marginTop: 10, justifyContent: "center" }]}>
                      <MyAppText style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>We recommend It!</MyAppText>
                      <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_more_cover]} onPress={() =>
                        this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}
                      >
                        <MyAppText style={MyStyles.txt_more}>more</MyAppText>
                        <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                      </TouchableOpacity>
                    </View>
                    <View style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: -15,
                      paddingBottom: 30
                    }}>
                      {
                        this.renderRecommendingScroll()
                      }
                    </View>
                  </View>
                  : null}
              </View>
              <Image source={require("../../assets/images/ic_main_shadow.png")} style={[MyStyles.ic_main_shadow, { marginBottom: -10 }]} />


              {/* We can search it */}
              {this.state.refreshOneLineInfo ?
                global.login_info.token.length <= 0 || Common.isNeedToAddQuestionnaire() ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.container, { marginTop: 10 }]} onPress=
                    {() => {
                      // 로직변경후
                      if (global.login_info.token.length <= 0) { // 비회원의 경우 로그인페이지로 유도
                        this.setState({ showLoginModal: true });
                      } else {
                        this.props.navigation.navigate("WeCanSearchIt", {
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                          [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                        })
                      }

                    }
                    }
                  >
                    <View style={[MyStyles.we_can_search_it_cover,]}>
                      <Image source={require("../../assets/images/ic_we_can_search_it_bg.png")} style={MyStyles.background_image_stretch} />
                      <View style={{ flex: 1 }}>
                        <MyAppText style={{ fontSize: 16, fontWeight: "bold" }}>We can Search it !</MyAppText>
                        <MyAppText style={{ fontSize: 12, color: "#949393" }}>Please set up your skin type</MyAppText>
                      </View>

                      <Image source={require('../../assets/images/Home/ic_avatar_woman.png')} style={{ width: 30, height: 42, alignSelf: "center" }} />
                    </View>
                  </TouchableOpacity>
                  : null
                :
                global.login_info.token.length <= 0 || Common.isNeedToAddQuestionnaire() ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.container, { marginTop: 10 }]} onPress=
                    {() => {
                      // 로직변경후
                      if (global.login_info.token.length <= 0) { // 비회원의 경우 로그인페이지로 유도
                        this.setState({ showLoginModal: true });
                      } else {
                        this.props.navigation.navigate("WeCanSearchIt", {
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                          [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                          [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                        })
                      }
                    }
                    }
                  >
                    <View style={[MyStyles.we_can_search_it_cover]}>
                      <Image source={require("../../assets/images/ic_we_can_search_it_bg.png")} style={MyStyles.background_image_stretch} />
                      <View style={{ flex: 1 }}>
                        <MyAppText style={{ fontSize: 16, fontWeight: "bold" }}>We can Search it !</MyAppText>
                        <MyAppText style={{ fontSize: 12, color: "#949393" }}>Please set up your skin type</MyAppText>
                      </View>

                      <Image source={require('../../assets/images/Home/ic_avatar_woman.png')} style={{ width: 30, height: 42, alignSelf: "center" }} />
                    </View>
                  </TouchableOpacity>
                  : null
              }

              {/* 배너 부분 */}
              <View style={{ borderTopRightRadius: 20, overflow: "hidden", marginTop: 10, height: this.BannerHeight }}>

                {this.state.result_data.banner_list.length > 0 ?
                  <View style={{
                    height: this.BannerHeight,
                  }}>
                    <Carousel
                      inactiveSlideScale={1}
                      data={this.state.result_data.banner_list}
                      sliderWidth={this.ScreenWidth}
                      itemWidth={this.ScreenWidth}
                      renderItem={this.renderBanner}
                      autoplay={true}
                      loop={true}
                      autoplayInterval={2000}
                      onSnapToItem={(index) => this.setState({ activeBannerIndex: index })}
                    />
                    <MyPagination list={this.state.result_data.banner_list} activeDotIndex={this.state.activeBannerIndex} />
                  </View>
                  :
                  null
                }
              </View>

              {/* Hi, It's New 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20, borderTopRightRadius: 20 }, MyStyles.bg_white]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <MyAppText style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Hi, It's New</MyAppText>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 0 }) }}>
                    <MyAppText style={MyStyles.txt_more}>more</MyAppText>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>

                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30, marginTop: 10, height: 600 / 3, }}>

                  <View style={{ borderBottomRightRadius: 15, flex: 1, overflow: "hidden", justifyContent: "center" }}>

                    {this.state.result_data.banner_list2.length > 0 ?
                      <View style={{
                        height: 600 / 3,
                      }}>
                        <Carousel
                          inactiveSlideScale={1}
                          data={this.state.result_data.banner_list2}
                          sliderWidth={this.ScreenWidth / 2}
                          itemWidth={this.ScreenWidth / 2}
                          renderItem={this.renderBanner2}
                          autoplay={true}
                          loop={true}
                          autoplayInterval={2500}
                        />
                      </View>
                      :
                      null
                    }
                  </View>

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    {this.state.result_data.new_product_list.length > 0 ?
                      <View style={{
                        height: 600 / 3,
                        width: this.ScreenWidth / 2,
                        overflow: "hidden"
                      }}>
                        <Carousel
                          inactiveSlideScale={1}
                          data={this.state.result_data.new_product_list}
                          sliderWidth={this.ScreenWidth / 2}
                          itemWidth={this.ScreenWidth / 2}
                          renderItem={this.renderNewProductBanner}
                          autoplay={false}
                          loop={true}
                          ref={(carousel) => { this.newCarouselIndicator = carousel }}
                        />
                      </View>
                      :
                      null}
                    <View style={MyStyles.carousel_selector}>
                      <TouchableOpacity activeOpacity={0.8} style={{ padding: 15 }} onPress={() => { this.newCarouselIndicator.snapToPrev(); }}>
                        <Image source={require('../../assets/images/ic_prev_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}></View>
                      <TouchableOpacity activeOpacity={0.8} style={{ padding: 15 }} onPress={() => { this.newCarouselIndicator.snapToNext(); }}>
                        <Image source={require('../../assets/images/ic_next_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <Image source={require("../../assets/images/ic_main_shadow.png")} style={[MyStyles.ic_main_shadow, { marginBottom: -10 }]} />

              {/* Best Choice 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20, borderTopRightRadius: 20 }, MyStyles.bg_white]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <MyAppText style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Best Choice</MyAppText>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 1 }) }}
                  >
                    <MyAppText style={MyStyles.txt_more}>more</MyAppText>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30, marginTop: 10, height: 600 / 3, }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    {this.state.result_data.best_product_list.length > 0 ?
                      <View style={{
                        height: 600 / 3,
                        overflow: "hidden",
                        width: this.ScreenWidth / 2
                      }}>
                        <Carousel
                          inactiveSlideScale={1}
                          data={this.state.result_data.best_product_list}
                          sliderWidth={this.ScreenWidth / 2}
                          itemWidth={this.ScreenWidth / 2}
                          renderItem={this.renderBestProductBanner}
                          autoplay={false}
                          loop={true}
                          ref={(carousel) => { this.bestCarouselIndicator = carousel }}
                        />
                      </View>
                      :
                      null
                    }
                    <View style={MyStyles.carousel_selector}>
                      <TouchableOpacity activeOpacity={0.8} style={{ padding: 15 }} onPress={() => { this.bestCarouselIndicator.snapToPrev(); }}>
                        <Image source={require('../../assets/images/ic_prev_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}></View>
                      <TouchableOpacity activeOpacity={0.8} style={{ padding: 15 }} onPress={() => { this.bestCarouselIndicator.snapToNext(); }}>
                        <Image source={require('../../assets/images/ic_next_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ borderBottomLeftRadius: 15, flex: 1, overflow: "hidden", justifyContent: "center" }}>
                    {this.state.result_data.banner_list3.length > 0 ?
                      <View style={{
                        height: 600 / 3,
                        width: this.ScreenWidth / 2
                      }}>
                        <Carousel
                          inactiveSlideScale={1}
                          data={this.state.result_data.banner_list3}
                          sliderWidth={this.ScreenWidth / 2}
                          itemWidth={this.ScreenWidth / 2}
                          renderItem={this.renderBanner3}
                          autoplay={true}
                          loop={true}
                          autoplayInterval={2500}
                        />
                      </View>
                      :
                      null
                    }
                  </View>

                </View>
              </View>
              <Image source={require("../../assets/images/ic_main_shadow.png")} style={[MyStyles.ic_main_shadow, { marginBottom: -10 }]} />

              {/* Today's Article & What's Trending 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20, borderTopRightRadius: 20 }, MyStyles.bg_white]}>
                {/* Today's Article */}
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <MyAppText style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Today's Article</MyAppText>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("Article") }}
                  >
                    <MyAppText style={MyStyles.txt_more}>more</MyAppText>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", flex: 1, marginBottom: 30, justifyContent: "center", marginLeft: 15, marginTop: 10 }}>
                  <View style={{ flex: 1, height: 500 / 3, justifyContent: "center" }}>
                    {this.state.result_data.banner_list3.length > 0 ?
                      <View style={{
                        height: 500 / 3,
                        overflow: "hidden",
                        width: this.ScreenWidth - 30
                      }}>
                        <Carousel
                          inactiveSlideScale={1}
                          data={this.state.result_data.latest_article_list}
                          sliderWidth={this.ScreenWidth - 30}
                          itemWidth={this.ScreenWidth - 30}
                          itemHeight={500 / 3}
                          renderItem={this.renderTodayArticleBanner}
                          autoplay={true}
                          autoplayDelay={3000}
                          loop={true}
                          onSnapToItem={(index) => this.setState({ activeArticleIndex: index })}
                        />
                        <MyPagination list={this.state.result_data.latest_article_list} activeDotIndex={this.state.activeArticleIndex} />
                      </View>
                      :
                      null
                    }
                  </View>
                </View>

                {/* What's trending */}
                <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }, MyStyles.container]}>
                  <MyAppText style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>What's Trending</MyAppText>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 30,
                  marginTop: 10
                }}>
                  {
                    this.renderTrendingScroll()
                  }
                </View>

                {/* FAQ, About 버튼 부분 */}
                <View style={[MyStyles.seperate_line_e5e5e5]}></View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1, height: 53 }}>
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, justifyContent: "center" }} onPress={() => { this.props.navigation.navigate("Faq") }}>
                    <MyAppText style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>FAQ</MyAppText>
                  </TouchableOpacity>
                  <Image style={[MyStyles.seperate_v_line_e5e5e5, { height: 30 / 3 }]} />
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, justifyContent: "center" }} onPress={() => {
                    // this.props.navigation.navigate("AboutUs");
                    Alert.alert(
                      '',
                      "It's being completed",
                      [
                        { text: 'OK', onPress: () => { } },
                      ],
                      { cancelable: false },
                    );
                  }}>
                    <MyAppText style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>About Us</MyAppText>
                  </TouchableOpacity>
                </View>
              </View>

              <Image source={require("../../assets/images/ic_main_shadow.png")} style={[MyStyles.ic_main_shadow]} />
            </View>

            <LoginModal is_transparent={true} this={this} />
          </ScrollView>
        </KeyboardAvoidingView>
        <Image source={require("../../assets/images/ic_tabbar_border.png")} style={{ width: "100%", height: MyConstants.TABBAR_TOP_BORDER_HEIGHT, position: "absolute", bottom: 0 }} />
        {/* OCR */}
        <SearchModal
          navigation={this.props.navigation}
          visible={this.state.modalVisible}
          onClose={() => { this.setState({ modalVisible: false }) }} />
      </View >
    );
  }

  requestHomeList(p_questionnaire_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.homeList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          result_data: responseJson.result_data
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        if (Common.isNeedToAddQuestionnaire() == false) {
          this.requestOnelineReview(global.login_info.skin_type, global.login_info.concern, global.login_info.needs, this.state.weatherInfo.main)
        }

        try {
          this.setState({
            'newProductBanner': {
              'image_list': this.state.result_data.new_product_list[0].image_list,
              'title': this.state.result_data.new_product_list[0].title,
            }
          })
        } catch (error) {

        }
        try {
          this.setState({
            'bestProductBanner': {
              'image_list': this.state.result_data.best_product_list[0].image_list,
              'title': this.state.result_data.best_product_list[0].title,
            }
          })
        } catch (error) {

        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestProductLike(p_product_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestHomeList(global.login_info.questionnaire_id);
        global.refreshStatus.mylist = true
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestProductUnlike(p_product_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestHomeList(global.login_info.questionnaire_id);
        global.refreshStatus.mylist = true
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
        this._getWeather(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        //가져오기 실패 했을 경우.
        this.refs.toast.showBottom("Please allow location permissions in Settings.")
        this.setState({ isGpsOn: false })
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
        this.requestHomeList(global.login_info.questionnaire_id);
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
    console.log(p_skin_type + ":" + p_concerns + ":" + p_needs + ":" + p_weather + ":")
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
        console.log(JSON.stringify(responseJson))
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        console.log(responseJson.result_data.oneline_review.comment_en);
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
