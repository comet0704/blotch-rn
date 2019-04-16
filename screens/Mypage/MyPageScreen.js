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

export default class MyPageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loginPressed: false,
      email: null,
      password: null,
      image: null,
      result_data: {
        "detail": null,
        "recommend_list": [
          {
            "id": 10,
            "title": "Product-10",
            "image_list": "uploads/product/mahdiar-mahmoodi-655027-unsplash.jpg",
            "visit_count": 270,
            "like_count": 14,
            "comment_count": 1,
            "grade": 4.25,
            "is_liked": 6,
            "brand_title": "ASTRAEA"
          },
          {
            "id": 24,
            "title": "Product-24",
            "image_list": "uploads/product/dose-juice-1184434-unsplash.jpg###uploads/product/siora18-1186301-unsplash.jpg",
            "visit_count": 270,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "THE BODY SHOP"
          },
          {
            "id": 25,
            "title": "Product-25",
            "image_list": "uploads/product/eco-warrior-princess-740692-unsplash.jpg",
            "visit_count": 270,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "GENESIS"
          },
          {
            "id": 9,
            "title": "Product-9",
            "image_list": "uploads/product/j-kelly-brito-383355-unsplash.jpg",
            "visit_count": 270,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "MIA"
          },
          {
            "id": 26,
            "title": "Product-26",
            "image_list": "uploads/product/element5-digital-611469-unsplash.jpg###uploads/product/rahul-chakraborty-556155-unsplash.jpg",
            "visit_count": 270,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "GATHER"
          }
        ],
        "mypage": {
          "my_point": 120,
          "my_last_review_date": "2019-04-03 15:21:00",
          "my_beautybox_count": 6,
          "my_questionnaire": "Me"
        }
      }
    };
  }

  static navigationOptions = {
    header: null,
  };

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

  render() {
    const { loginPressed, email, password, image } = this.state;
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
                <Image source={{ uri: Common.getImageUrl("uploads/product/siora18-1186283-unsplash.jpg") }} opacity={0.2} style={MyStyles.background_image} />
                <TouchableOpacity style={{ position: "absolute", padding: 15, top: 5, right: 0 }} onPress={() => {
                  this.props.navigation.navigate("EditProfile")
                }}>
                  <Image source={require('../../assets/images/ic_edit.png')} style={MyStyles.ic_edit} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={[MyStyles.profile_box1]}>
                    {/* <TouchableOpacity onPress={() => { this.setState({ photoModalVisible: true }) }} style={MyStyles.camera_box}>
                      <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={{ width: 12, height: 11, alignSelf: "center" }} />
                    </TouchableOpacity> */}
                    <Image source={image == null ? (require('../../assets/images/Login/ic_avatar.png')) : { uri: image }} style={image == null ? { width: 117 / 3, height: 166 / 3, alignSelf: "center" } : { width: 315 / 3, height: 315 / 3, borderRadius: 100, }} />
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text style={{ fontSize: 59 / 3, color: "white", fontWeight: "500" }}>Hello Elliel</Text>
                    <Text style={{ fontSize: 59 / 3, color: "white" }}>Do you need advice?</Text>
                  </View>
                </View>
              </View>

              {/* Weather, SkinType, Concern, Needs */}
              <View style={[MyStyles.padding_main, { flexDirection: "row" }]}>
                <View style={[MyStyles.meta_info_box]}>
                  <Image source={(require('../../assets/images/Login/ic_avatar.png'))} style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
                  <Text style={[MyStyles.meta_text]}>Weather</Text>
                  <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 5 }}>
                    <Image source={(require('../../assets/images/ic_weather_sync.png'))} style={[MyStyles.ic_weather_sync]} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  <Image source={(require('../../assets/images/Login/ic_avatar.png'))} style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
                  <Text style={[MyStyles.meta_text]}>Skin Type</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  <Image source={(require('../../assets/images/Login/ic_avatar.png'))} style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
                  <Text style={[MyStyles.meta_text]}>Concern</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={[MyStyles.meta_info_box]}>
                  <Image source={(require('../../assets/images/Login/ic_avatar.png'))} style={[{ alignSelf: "center" }, MyStyles.weather_icon]} />
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
                    <Text style={[MyStyles.ingredient_section_header_text2]}>{150}P</Text>
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
                    <Text style={[MyStyles.ingredient_section_header_text2]}>Recent Review<Text style={{ marginLeft: 5, fontSize: 12, color: Colors.color_949292, fontWeight: "400" }}>  5 minuts ago</Text></Text>
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>

              {/* My Beauty Box 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.setState({ section_allergic_show: !this.state.section_allergic_show })
                }}>
                  <Image source={require("../../assets/images/ic_beauty_box_big.png")} style={[MyStyles.ic_beauty_box_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>My Beauty Box</Text>
                    <Text style={[MyStyles.ingredient_section_header_text2]}>10 Product in use</Text>
                  </View>
                  <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                </TouchableOpacity>
              </View>

              {/* Questionnaire 부분 */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0, marginBottom: 40 }]}>
                <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                  this.setState({ section_allergic_show: !this.state.section_allergic_show })
                }}>
                  <Image source={require("../../assets/images/ic_questionnare_big.png")} style={[MyStyles.ic_questionnare_big]} />
                  <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[MyStyles.ingredient_section_header_text1]}>Questionnaire</Text>
                      <Text style={{ marginLeft: 10, borderRadius: 10, borderColor: Colors.color_f8f8f8, paddingLeft: 10, paddingRight: 10, borderWidth: 0.5, fontSize: 12, color: Colors.color_949292, fontWeight: "400" }}>Me</Text>
                    </View>

                    <Text style={[MyStyles.ingredient_section_header_text2]}>Completed</Text>
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

  requestLogin(p_email, p_pwd) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        password: p_pwd,
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
        } else {
          global.login_user = responseJson.login_user;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          this.props.navigation.navigate("Home")
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

  requestLoginGoogle(p_email, p_id, p_profile_image) {
    console.log(p_email + "_" + p_id + "_ " + p_profile_image)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.loginGoogle, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        id: p_id,
        profile_image: p_profile_image,
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
        } else {
          global.login_user = responseJson.login_user;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          this.props.navigation.navigate("Home")
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

  requestLoginFacebook(p_email, p_id, p_profile_image) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.loginFacebook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        id: p_id,
        profile_image: p_profile_image,
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
        } else {
          global.login_user = responseJson.login_user;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          this.props.navigation.navigate("Home")
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
}
