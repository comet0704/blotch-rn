// common
import React from 'react';
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
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      weatherType: "dry",
      weatherInfo: "Seoul. -6˚C",
      result_data: {
        recommend_product_list: [],
        banner_list: [],
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
      }
    };
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
        <TouchableHighlight onPressIn={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "Home" })
        }}>
          <View>
            <Image style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
              <Text style={{ fontSize: 13, color: "white" }} numberOfLines={1}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }} numberOfLines={3}>{item.content}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderNewProductBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 200, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "Home" }) }}>
          <View style={{ flex: 1 }}>
            <Image style={{ width: 83, height: 53, alignSelf: "center", marginTop: 40 }} source={{ uri: Common.getImageUrl(item.image_list) }} />
            <TouchableHighlight style={[{ position: "absolute", right: 15, top: 15 }, MyStyles.heart]}>
              <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
            </TouchableHighlight>
            <View style={{ position: "absolute", bottom: 0, maxWidth: 130, paddingBottom: 30, alignSelf: "center" }}>
              <Text style={{ fontSize: 12, color: "#949393", textAlign: "center" }}>{item.brand_title}</Text>
              <Text style={{ fontSize: 14, color: "black", marginTop: 5, textAlign: "center" }}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderBestProductBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 200, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "Home" }) }}>
          <View style={{ flex: 1 }}>
            <Image style={{ width: 83, height: 53, alignSelf: "center", marginTop: 40 }} source={{ uri: Common.getImageUrl(item.image_list) }} />
            <TouchableHighlight style={[{ position: "absolute", right: 15, top: 15 }, MyStyles.heart]}>
              <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
            </TouchableHighlight>
            <View style={{ position: "absolute", bottom: 0, maxWidth: 130, paddingBottom: 30, alignSelf: "center" }}>
              <Text style={{ fontSize: 12, color: "#949393", textAlign: "center" }}>{item.brand_title}</Text>
              <Text style={{ fontSize: 14, color: "black", marginTop: 5, textAlign: "center" }}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  renderTodayArticleBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 166, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "Home" }) }}>
          <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
            <Image style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
            <TouchableHighlight style={[{ position: "absolute", right: 15, top: 15 }, MyStyles.heart]}>
              <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
            </TouchableHighlight>
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
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
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "Home" }) }}>
                <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
                  <Image style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
                  <TouchableHighlight style={[{ position: "absolute", right: 15, top: 15 }, MyStyles.heart]}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableHighlight>
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
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { alert("go product detail") }}>
                <Image style={{ width: 85, height: 85, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image_list) }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: "#949393", marginTop: 5, textAlign: "center" }} numberOfLines={1}>{item.brand_title}</Text>
              <Text style={{ fontSize: 13, color: "#212122", fontWeight: "bold", textAlign: "center" }} numberOfLines={1}>{item.title}</Text>

            </View>
          ))}
        </ScrollView>
      </View>
    );
  }


  render() {
    const { weatherType, weatherInfo } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={payload => {
            AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.login_info, (err, result) => {
              global.login_info = JSON.parse(result);
              if (global.login_info == null) {
                global.login_info = {
                  token: ""
                }
              }
              this.requestHomeList()
            });
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

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={{ backgroundColor: "#f8f8f8" }}>
              {/* Search bar */}
              <View style={[{ flex: 1, marginTop: 27, height: 40, paddingTop: 2, paddingBottom: 2, justifyContent: "center", flexDirection: "row", }, MyStyles.container, MyStyles.bg_white]}>
                <Image source={require("../../assets/images/Home/ic_logo_purple.png")} style={{ width: 58, height: 18, alignSelf: "center" }} />
                <View style={[{ flex: 1, marginLeft: 12, borderRadius: 20, borderWidth: 0.5, borderBottomWidth: 2, flexDirection: "row", width: "100%", borderColor: "#f8f8f8", paddingLeft: 13, paddingRight: 13 }]}>
                  <Image source={require('../../assets/images/Home/ic_search.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                  <TextInput style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} placeholder="Search keyword"></TextInput>
                  <Image source={require('../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                </View>
              </View>

              {/* Today's Beauty Information */}
              <View style={[{ paddingTop: 25, borderBottomLeftRadius: 20, borderWidth: 0, borderBottomWidth: 2, borderBottomColor: "#dadada", borderLeftColor: "#dadada", borderLeftWidth: 2 }, MyStyles.container, MyStyles.bg_white]}>
                <Text style={[{ color: "#949393", fontSize: 12 }]}>Today's counselor</Text>
                <Text style={[MyStyles.text_20, { marginTop: 10 }]}>Today's Beauty Information</Text>
                <View style={[{ borderRadius: 3, overflow: "hidden", width: "100%", height: 125, marginTop: 20, padding: 15, marginBottom: 23 }]}>
                  <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} />

                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[{ fontSize: 15, fontWeight: "500", color: "white" }]}>Beauty Advice</Text>
                      <View style={[MyStyles.seperate_line_white, { marginTop: 10, marginBottom: 10 }]} />
                      <View style={[{ flexDirection: "row", color: "white" }]}>
                        <Image source={require('../../assets/images/Home/ic_weather_type.png')} style={{ width: 13, height: 7, alignSelf: "center" }} />
                        <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>It's<Text style={{ fontWeight: "bold" }}> {weatherType}</Text> today</Text>
                      </View>
                      <View style={[{ flexDirection: "row", color: "white" }]}>
                        <Image source={require('../../assets/images/Home/ic_face_type.png')} style={{ width: 13, height: 10, alignSelf: "center" }} />
                        <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>It's<Text style={{ fontWeight: "bold" }}> {weatherType}</Text> today</Text>
                      </View>
                      <View style={[{ flexDirection: "row", color: "white" }]}>
                        <Image source={require('../../assets/images/Home/ic_snow.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                        <Text style={{ color: "white", fontSize: 13, marginLeft: 5 }}>It's<Text style={{ fontWeight: "bold" }}> {weatherType}</Text> today</Text>
                      </View>
                    </View>
                    <View style={{ alignSelf: "center", marginLeft: 10, justifyContent: "center" }}>
                      <Image source={require('../../assets/images/Home/ic_cloud.png')} style={{ width: 51, height: 41, alignSelf: "center" }} />
                      <Text style={{ fontSize: 13, color: "white", alignSelf: "center", marginLeft: 10 }}>{weatherInfo}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* We can search it */}
              <TouchableOpacity style={[MyStyles.container, { marginTop: 23 }]} onPress={() => { alert("2차 개발 준비중입니다.") }}>
                <View style={[{ paddingLeft: 23, paddingRight: 23, paddingTop: 10, paddingBottom: 10, flexDirection: "row", borderRadius: 35 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>We can Search it !</Text>
                    <Text style={{ fontSize: 12, color: "#949393", marginTop: 3 }}>Please set up your skin type</Text>
                  </View>

                  <Image source={require('../../assets/images/Home/ic_avatar_woman.png')} style={{ width: 30, height: 42, alignSelf: "center" }} />
                </View>
              </TouchableOpacity>

              {/* We recommend It! 로그인 했을때 나타나는 정보 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>We recommend It!</Text>
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                    this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>more ></Text>
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
                    this.renderRecommendingScroll()
                  }
                </View>
              </View>

              {/* 배너 부분 */}
              <View style={{ borderTopRightRadius: 20, overflow: "hidden", marginTop: 10 }}>
                <Carousel
                  autoplay
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
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }}
                    onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 0 }) }}>more ></Text>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30, }}>
                  <View style={{ borderBottomRightRadius: 15, flex: 1, overflow: "hidden", justifyContent: "center" }}>
                    <Image source={{ uri: Common.getImageUrl(this.state.newProductBanner.image_list) }} style={[MyStyles.background_image]} />
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "500", textAlign: "center", padding: 10 }}>{this.state.newProductBanner.title}</Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
                      autoplay={false}
                      onPageChanged={(index) => {
                        this.setState({
                          'newProductBanner': {
                            'image_list': this.state.result_data.new_product_list[index].image_list,
                            'title': this.state.result_data.new_product_list[index].title,
                          }
                        })
                      }}
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
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() => { this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 1 }) }}>more ></Text>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
                      autoplay={false}
                      onPageChanged={(index) => {
                        try {
                          this.setState({
                            'bestProductBanner': {
                              'image_list': this.state.result_data.best_product_list[index].image_list,
                              'title': this.state.result_data.best_product_list[index].title,
                            }
                          })
                        } catch (error) {
                        }
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
                    <Image source={{ uri: Common.getImageUrl(this.state.bestProductBanner.image_list) }} style={[MyStyles.background_image]} />
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "500", textAlign: "center", padding: 10 }}>{this.state.bestProductBanner.title}</Text>
                  </View>

                </View>
              </View>


              {/* Today's Article & What's Trending 부분 */}
              <View style={[{ marginTop: 10, borderBottomLeftRadius: 20, marginBottom: 10 }, MyStyles.bg_white, MyStyles.shadow_2]}>
                {/* Today's Article */}
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_20, { flex: 1, alignSelf: "center" }]}>Today's Article</Text>
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() => { this.props.navigation.navigate("Article") }}>more ></Text>
                </View>
                <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, marginBottom: 30, justifyContent: "center", marginLeft: 15 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Carousel
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
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() => { this.props.navigation.navigate("Article") }}>more ></Text>
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
                <View style={{ flexDirection: "row", justifyContent: "center", flex: 1, height: 53 }}>
                  <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => { this.props.navigation.navigate("Faq") }}>
                    <Text style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>FAQ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={() => { this.props.navigation.navigate("AboutUs"); }}>
                    <Text style={{ color: "#949393", fontSize: 13, textAlign: "center" }}>About Chemi</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
        console.log(responseJson);
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
        // this.props.navigation.navigate("BannerDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: 1, [MyConstants.NAVIGATION_PARAMS.back_page] : "Home"}) 
        // this.props.navigation.navigate("Article");
        // this.props.navigation.navigate("ProductContainer") 
        // this.props.navigation.navigate("ProductDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: 1, [MyConstants.NAVIGATION_PARAMS.back_page] : "Home"}) 
        // this.props.navigation.navigate("ArticleDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: 1, [MyConstants.NAVIGATION_PARAMS.back_page] : "Home"}) 
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
