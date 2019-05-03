// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';

import Carousel from 'react-native-banner-carousel';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  BackHandler,
  RefreshControl,
} from 'react-native';

import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
import { LoginModal } from '../../components/Modals/LoginModal';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.currentRouteName = 'Main';
    this.state = {      
      refreshing: false,
      isLogined: false,
      showLoginModal: false,
      refreshOneLineInfo: false,
      weatherInfo: {
        main: "",
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
    };
  }

  componentDidMount() {
    if (global.login_info.token.length <= 0) {
      this.requestHomeList()
    }
    this.requestGetMyPosition();
    handleAndroidBackButton(this, exitAlert);
  }

  componentWillMount() {
    removeAndroidBackButtonHandler()
  }

  static navigationOptions = {
    header: null,
  };

  BannerHeight = 265;
  BannerWidth = Dimensions.get('window').width;
  newCarouselIndicator = null;
  bestCarouselIndicator = null;

  renderBanner(item, index) {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id })
        }}>
          <View>
            <ImageLoad style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={[MyStyles.banner_title]}>
              <Text style={{ fontSize: 13, color: "white" }} numberOfLines={1}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }} numberOfLines={3}>{item.content}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderBanner2(item, index) {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id })
        }}>
          <View style={{ width: this.BannerWidth / 2, height: "100%", justifyContent: "center", alignItems: "center" }}>
            <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold", lineHeight: 26 }} numberOfLines={3}>{item.content}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderBanner3(item, index) {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id })
        }}>
          <View style={{ width: this.BannerWidth / 2, height: "100%", justifyContent: "center", alignItems: "center" }}>
            <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold", lineHeight: 26 }} numberOfLines={3}>{item.content}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderNewProductBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 200, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <View style={{ flex: 1 }}>
            <ImageLoad style={MyStyles.product_thumbnail1} source={{ uri: Common.getImageUrl(item.image_list) }} />
            {
              item.is_liked > 0
                ?
                <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
            }
            <View style={{ position: "absolute", bottom: 0, maxWidth: 130, paddingBottom: 30, alignSelf: "center" }}>
              <Text style={{ fontSize: 12, color: "#949393", textAlign: "center" }} numberOfLines={1}>{item.brand_title}</Text>
              <Text style={{ fontSize: 14, color: "black", textAlign: "center", lineHeight: 14, marginTop: 3 }} numberOfLines={2}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderBestProductBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 200, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <View style={{ flex: 1 }}>
            <ImageLoad style={MyStyles.product_thumbnail1} source={{ uri: Common.getImageUrl(item.image_list) }} />
            {
              item.is_liked > 0
                ?
                <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableOpacity>
            }
            <View style={{ position: "absolute", bottom: 0, maxWidth: 130, paddingBottom: 30, alignSelf: "center" }}>
              <Text style={{ fontSize: 12, color: "#949393", textAlign: "center" }} numberOfLines={1}>{item.brand_title}</Text>
              <Text style={{ fontSize: 14, color: "black", textAlign: "center", lineHeight: 14, marginTop: 3 }} numberOfLines={2}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  renderTodayArticleBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 166, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
            <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={[MyStyles.banner_title]}>
              <Text style={{ fontSize: 13, color: "white" }}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }}>{item.content}</Text>
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
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
                  <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
                  <View style={{ position: "absolute", bottom: 5, left: 5, maxWidth: 120 }}>
                    <Text style={{ fontSize: 12, color: "white" }}>{item.title}</Text>
                    <Text style={{ fontSize: 14, color: "white", fontWeight: "bold" }} numberOfLines={1}>{item.content}</Text>
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

    if (this.state.isLogined == false) { // 로그인 하지 않은 회원의 경우 임시로 보여주기만 하자.
      global.login_info.skin_type = p_skin_type
      global.login_info.concern = p_concern
      global.login_info.needs = p_needs
      this.setState({ refreshOneLineInfo: !this.state.refreshOneLineInfo });
      return;
    } else {
      // WecanSeachit에서 입력한 정보들로 메인 questionnaire를 만들어주자.
      this.requestAddQuestionnaireItem("Me", p_skin_type, p_concern, p_needs)
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.requestHomeList()
    this.setState({ refreshing: false });
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            const beforeLoginState = this.state.isLogined;
            if (global.login_info.token == "") {
              this.setState({ isLogined: false })
            } else {
              this.setState({ isLogined: true })
            }
            if (beforeLoginState != this.state.isLogined) {
              this.requestHomeList()
            }
          }}
        />
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

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />} >
            <View style={{ backgroundColor: "#f8f8f8" }}>
              {/* Search bar */}
              <View style={[MyStyles.searchBoxCommon, MyStyles.container, MyStyles.bg_white]}>
                <Image source={require("../../assets/images/Home/ic_logo_purple.png")} style={{ width: 58, height: 18, alignSelf: "center" }} />
                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[{ marginLeft: 12, }, MyStyles.searchBoxCover, MyStyles.shadow_2]}>
                    <Image source={require('../../assets/images/Home/ic_search.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} placeholder="Search keyword"></TextInput>
                    <TouchableOpacity style={{ padding: 8, alignSelf: "center" }} onPress={() => { this.props.navigation.navigate("SearchCamera") }}>
                      <Image source={require('../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {/* Today's Beauty Information */}
              <View style={[{ paddingTop: 20, borderBottomLeftRadius: 20, }, MyStyles.container, MyStyles.bg_white, MyStyles.shadow_2]}>
                {/* borderTop에 그림자 효과 가리기 위한 뷰 */}
                <View style={{ position: "absolute", height: 2, top: -2, left: 0, right: 0, backgroundColor: "white" }} />

                <Text style={[{ color: "#949393", fontSize: 12 }]}>Today's counselor</Text>
                <Text style={[MyStyles.text_20, { marginTop: 5 }]}>Today's Beauty Information</Text>
                <View style={[{ borderRadius: 3, overflow: "hidden", width: "100%", height: 125, marginTop: 20, padding: 15, marginBottom: 23 }]}>
                  <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} />
                  {/* <Spinner
                    size={"small"}
                    //visibility of Overlay Loading Spinner
                    visible={this.state.weatherInfo.icon.length <= 0}
                  /> */}
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[{ fontSize: 15, fontWeight: "500", color: "white" }]}>Beauty Advice</Text>
                      <View style={[MyStyles.seperate_line_white, { marginTop: 10, marginBottom: 10 }]} />
                      <View style={[{ flexDirection: "row", color: "white" }]}>
                        <Image source={require('../../assets/images/Home/ic_weather_type.png')} style={{ width: 13, height: 7, alignSelf: "center" }} />
                        <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>It's<Text style={{ fontWeight: "bold" }}> {this.state.weatherInfo.main.toLowerCase()}</Text> today</Text>
                      </View>
                      {this.state.refreshOneLineInfo ?
                        !(Common.isNeedToAddQuestionnaire()) ?
                          <View>
                            <View style={[{ flexDirection: "row", color: "white" }]}>
                              <Image source={require('../../assets/images/Home/ic_face_type.png')} style={{ width: 13, height: 10, alignSelf: "center" }} />
                              <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}><Text style={{ fontWeight: "bold" }}>{global.login_info.needs.split(",")[0]} </Text>your face</Text>
                            </View>
                            <View style={[{ flexDirection: "row", color: "white" }]}>
                              <Image source={require('../../assets/images/Home/ic_snow.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                              <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>You're interested in <Text style={{ fontWeight: "bold" }}> {global.login_info.concern.split(",")[0]}</Text></Text>
                            </View>
                          </View>
                          : null
                        :
                        !(Common.isNeedToAddQuestionnaire()) ?
                          <View>
                            <View style={[{ flexDirection: "row", color: "white" }]}>
                              <Image source={require('../../assets/images/Home/ic_face_type.png')} style={{ width: 13, height: 10, alignSelf: "center" }} />
                              <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}><Text style={{ fontWeight: "bold" }}>{global.login_info.needs.split(",")[0]} </Text>your face</Text>
                            </View>
                            <View style={[{ flexDirection: "row", color: "white" }]}>
                              <Image source={require('../../assets/images/Home/ic_snow.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                              <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>You're interested in <Text style={{ fontWeight: "bold" }}> {global.login_info.concern.split(",")[0]}</Text></Text>
                            </View>
                          </View>
                          : null
                      }
                    </View>
                    {this.state.weatherInfo.icon.length > 0 ?
                      <View style={{ alignSelf: "center", marginLeft: 10, justifyContent: "center" }}>
                        <Image source={{ uri: this.state.weatherInfo.icon }} style={{ width: 50, height: 50, alignSelf: "center" }} />
                        <Text style={{ fontSize: 13, color: "white", alignSelf: "center", marginTop: -15 }}>{this.state.weatherInfo.city + "." + parseFloat(this.state.weatherInfo.temp - 273.15).toFixed(0).toString() + "˚C"}</Text>
                      </View>
                      :
                      <View style={{ alignSelf: "center", marginLeft: 10, width: 50, justifyContent: "center" }}>
                        <Image source={require('../../assets/images/weather_loading.gif')} style={{ width: 15, height: 15, alignSelf: "center" }} />
                      </View>
                    }

                  </View>
                </View>
                {/* We recommend It! 로그인 했을때 나타나는 정보 */}
                {this.state.isLogined ?
                  <View style={[{ borderBottomLeftRadius: 20 }, MyStyles.bg_white]}>
                    <View style={[MyStyles.seperate_line_e5e5e5, { marginRight: -15, marginTop: -5 }]} />
                    <View style={[{ flexDirection: "row", flex: 1, marginTop: 10, justifyContent: "center" }]}>
                      <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>We recommend It!</Text>
                      <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() =>
                        this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}
                      >
                        <Text style={MyStyles.txt_more}>more</Text>
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


              {/* We can search it */}
              {this.state.refreshOneLineInfo ?
                this.state.isLogined == false || Common.isNeedToAddQuestionnaire() ?
                  <TouchableOpacity style={[MyStyles.container, { marginTop: 20 }]} onPress=
                    {() => {
                      this.props.navigation.navigate("WeCanSearchIt", {
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                        [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                      })
                    }
                    }
                  >
                    <View style={[MyStyles.we_can_search_it_cover, MyStyles.shadow_2]}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>We can Search it !</Text>
                        <Text style={{ fontSize: 12, color: "#949393" }}>Please set up your skin type</Text>
                      </View>

                      <Image source={require('../../assets/images/Home/ic_avatar_woman.png')} style={{ width: 30, height: 42, alignSelf: "center" }} />
                    </View>
                  </TouchableOpacity>
                  : null
                :
                this.state.isLogined == false || Common.isNeedToAddQuestionnaire() ?
                  <TouchableOpacity style={[MyStyles.container, { marginTop: 20 }]} onPress=
                    {() => {
                      this.props.navigation.navigate("WeCanSearchIt", {
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                        [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                      })
                    }
                    }
                  >
                    <View style={[MyStyles.we_can_search_it_cover, MyStyles.shadow_2]}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>We can Search it !</Text>
                        <Text style={{ fontSize: 12, color: "#949393" }}>Please set up your skin type</Text>
                      </View>

                      <Image source={require('../../assets/images/Home/ic_avatar_woman.png')} style={{ width: 30, height: 42, alignSelf: "center" }} />
                    </View>
                  </TouchableOpacity>
                  : null
              }

              {/* 배너 부분 */}
              <View style={{ borderTopRightRadius: 20, overflow: "hidden", marginTop: 20 }}>
                <Carousel
                  pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                  activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                  indicatorColor={'#b2fe76ab'}
                  inactiveIndicatorColor=''
                  autoplay={true}
                  autoplayTimeout={3000}
                  loop
                  index={0}
                  pageSize={this.BannerWidth}
                >
                  {this.state.result_data.banner_list.map((item, index) => this.renderBanner(item, index))}
                </Carousel>
              </View>

              {/* Hi, It's New 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Hi, It's New</Text>
                  <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 0 }) }}>
                    <Text style={MyStyles.txt_more}>more</Text>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>

                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30, }}>

                  <View style={{ borderBottomRightRadius: 15, flex: 1, overflow: "hidden", justifyContent: "center" }}>
                    <Carousel
                      pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                      activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                      autoplay={true}
                      onPageChanged={(index) => {
                      }}
                      showsPageIndicator={true}
                      loop
                      index={0}

                      pageSize={this.BannerWidth / 2}
                      ref={(carousel) => { this.bestCarouselIndicator = carousel }}
                    >
                      {this.state.result_data.banner_list2.map((item, index) => this.renderBanner2(item, index))}
                    </Carousel>
                    {/* <Image source={{ uri: Common.getImageUrl(this.state.bestProductBanner.image_list) }} style={[MyStyles.background_image]} />
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "500", textAlign: "center", padding: 10 }}>{this.state.bestProductBanner.title}</Text> */}
                  </View>

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
                      pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                      activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                      autoplay={false}
                      autoplayTimeout={3500}
                      showsPageIndicator={false}
                      loop
                      index={0}
                      pageSize={this.BannerWidth / 2}
                      ref={(carousel) => { this.newCarouselIndicator = carousel }}
                    >
                      {this.state.result_data.new_product_list.map((item, index) => this.renderNewProductBanner(item, index))}
                    </Carousel>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", flexDirection: "row", position: "absolute", marginTop: 90 }}>
                      <TouchableOpacity style={{ alignSelf: "flex-start", padding: 15 }} onPress={() => { this.newCarouselIndicator.gotoPage(this.newCarouselIndicator.currentIndex - 1); }}>
                        <Image source={require('../../assets/images/ic_prev_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}></View>
                      <TouchableOpacity style={{ alignSelf: "flex-end", padding: 15 }} onPress={() => { this.newCarouselIndicator.gotoNextPage(); }}>
                        <Image source={require('../../assets/images/ic_next_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>


              {/* Best Choice 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Best Choice</Text>
                  <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 1 }) }}
                  >
                    <Text style={MyStyles.txt_more}>more</Text>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
                      pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                      activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                      autoplay={false}
                      onPageChanged={(index) => {
                      }}
                      showsPageIndicator={false}
                      loop
                      index={0}
                      pageSize={this.BannerWidth / 2}
                      ref={(carousel) => { this.bestCarouselIndicator = carousel }}
                    >
                      {this.state.result_data.best_product_list.map((item, index) => this.renderBestProductBanner(item, index))}
                    </Carousel>
                    <View style={{ flex: 1, width: "100%", justifyContent: "center", flexDirection: "row", position: "absolute", marginTop: 90 }}>
                      <TouchableOpacity style={{ alignSelf: "flex-start", padding: 15 }} onPress={() => { this.bestCarouselIndicator.gotoPage(this.bestCarouselIndicator.currentIndex - 1); }}>
                        <Image source={require('../../assets/images/ic_prev_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}></View>
                      <TouchableOpacity style={{ alignSelf: "flex-end", padding: 15 }} onPress={() => { this.bestCarouselIndicator.gotoNextPage(); }}>
                        <Image source={require('../../assets/images/ic_next_grey.png')} style={[{ width: 30, height: 42, alignSelf: "center" }, MyStyles.banner_control]} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ borderBottomLeftRadius: 15, flex: 1, overflow: "hidden", justifyContent: "center" }}>
                    <Carousel
                      pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                      activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                      autoplay={true}
                      autoplayTimeout={2500}
                      showsPageIndicator={true}
                      loop
                      index={0}
                      pageSize={this.BannerWidth / 2}
                    >
                      {this.state.result_data.banner_list3.map((item, index) => this.renderBanner3(item, index))}
                    </Carousel>
                    {/* <Image source={{ uri: Common.getImageUrl(this.state.bestProductBanner.image_list) }} style={[MyStyles.background_image]} />
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "500", textAlign: "center", padding: 10 }}>{this.state.bestProductBanner.title}</Text> */}
                  </View>

                </View>
              </View>


              {/* Today's Article & What's Trending 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20, marginBottom: 10 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                {/* Today's Article */}
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Today's Article</Text>
                  <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() => { this.props.navigation.navigate("Article") }}
                  >
                    <Text style={MyStyles.txt_more}>more</Text>
                    <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", flex: 1, marginBottom: 30, justifyContent: "center", marginLeft: 15 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
                      pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                      activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                      autoplay={true}
                      autoplayTimeout={3000}
                      loop
                      index={0}
                      pageSize={this.BannerWidth - 30}
                      style={{ alignSelf: "center", flex: 1 }}
                    >
                      {this.state.result_data.latest_article_list.map((item, index) => this.renderTodayArticleBanner(item, index))}
                    </Carousel>
                  </View>
                </View>

                {/* What's trending */}
                <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>What's Trending</Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 30
                }}>
                  {
                    this.renderTrendingScroll()
                  }
                </View>

                {/* FAQ, About 버튼 부분 */}
                <View style={[MyStyles.seperate_line_e5e5e5]}></View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1, height: 53 }}>
                  <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => { this.props.navigation.navigate("Faq") }}>
                    <Text style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>FAQ</Text>
                  </TouchableOpacity>
                  <Image style={[MyStyles.seperate_v_line_e5e5e5, { height: 30 / 3 }]} />
                  <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => { this.props.navigation.navigate("AboutUs"); }}>
                    <Text style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>About Chemi</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            <LoginModal is_transparent={true} this={this} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View >
    );
  }

  requestHomeList() {
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
        // this.props.navigation.navigate("BannerDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: 1}) 
        // this.props.navigation.navigate("Article");
        // this.props.navigation.navigate("ProductContainer") 
        // this.props.navigation.navigate("ProductDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: 1}) 
        // this.props.navigation.navigate("SearchMain") 
        // this.props.navigation.navigate("SearchResult", { [MyConstants.NAVIGATION_PARAMS.search_word]: "pro" }) 
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
        this.requestHomeList();
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
        this.requestHomeList();
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
        this.state.weatherInfo.main = json.weather[0].main
        this.state.weatherInfo.temp = json.main.temp // 켈빈으로 내려옴
        this.state.weatherInfo.icon = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png"
        this.state.weatherInfo.city = json.name
        this.setState(this.state.weatherInfo)
      });
  }

  requestAddQuestionnaireItem(p_title, p_skin_type, p_concern, p_needs) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.addQuestionnaireItem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        title: p_title,
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
