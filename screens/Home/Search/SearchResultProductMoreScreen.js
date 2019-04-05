// common
import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../../constants/MyStyles'
import MyConstants from '../../../constants/MyConstants'
import Common from '../../../assets/Common';
import Net from '../../../Net/Net';
import Colors from '../../../constants/Colors';
import { Icon } from 'expo';
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
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { FlatGrid } from 'react-native-super-grid';
import { ProductItem2 } from '../../../components/Products/ProductItem2';

export default class SearchResultProductMoreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogined: false,
      result_data: {
        "product_count": 30,
        "product_list": [
          {
            "id": 1,
            "title": "Product-1",
            "image_list": "uploads/product/ana-francisconi-1382802-unsplash.jpg",
            "visit_count": 275,
            "like_count": 14,
            "comment_count": 2,
            "grade": 3,
            "is_liked": null,
            "brand_title": "LUSH"
          },
          {
            "id": 2,
            "title": "Product-2",
            "image_list": "uploads/product/caleb-simpson-1394514-unsplash.jpg",
            "visit_count": 275,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "BEAUTY"
          },
          {
            "id": 3,
            "title": "Product-3",
            "image_list": "uploads/product/charisse-kenion-746077-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": 3,
            "brand_title": "BOBBI BROWN"
          },
          {
            "id": 4,
            "title": "Product-4",
            "image_list": "uploads/product/dose-juice-1184453-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "THE BODY SHOP"
          },
          {
            "id": 5,
            "title": "Product-5",
            "image_list": "uploads/product/hyunwon-jang-724426-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 4,
            "is_liked": null,
            "brand_title": "GENESIS"
          },
          {
            "id": 6,
            "title": "Product-6",
            "image_list": "uploads/product/jake-peterson-463095-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "GATHER"
          },
          {
            "id": 7,
            "title": "Product-7",
            "image_list": "uploads/product/jakub-dziubak-618225-unsplash.jpg",
            "visit_count": 268,
            "like_count": 15,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "ROSITA"
          },
          {
            "id": 8,
            "title": "Product-8",
            "image_list": "uploads/product/jazmin-quaynor-470729-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "CM"
          },
          {
            "id": 9,
            "title": "Product-9",
            "image_list": "uploads/product/j-kelly-brito-383355-unsplash.jpg",
            "visit_count": 268,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "MIA"
          },
        ],
      },
    };
  }

  componentDidMount() {
    // this.requestHomeList()
  }

  static navigationOptions = {
    header: null,
  };

  ScreenWidth = Dimensions.get('window').width;

  render() {
    const { weatherType, weatherInfo } = this.state;

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

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={{ backgroundColor: "white" }}>
              {/* Search bar */}
              <View style={[MyStyles.searchBoxCommon, { paddingRight: 15, }, MyStyles.bg_white]}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack(null)
                  }} activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
                  <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
                    source={require("../../../assets/images/ic_back_black.png")}
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[MyStyles.searchBoxCover, {paddingLeft:0}]}>
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingRight: 5 }} value="Ubbusffree"></TextInput>
                    <TouchableOpacity style={{ padding: 8, alignSelf: "center" }}>
                      <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>


              {/* product 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white" }]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent:"center" }, MyStyles.container]}>
                  <TouchableOpacity style={{ marginRight: 10, alignSelf:"center",  }} onPress={() => { this.props.navigation.goBack() }}>
                    <Image source={require("../../../assets/images/ic_back3.png")} style={[MyStyles.ic_back3,]} />
                  </TouchableOpacity>
                  <Text style={[MyStyles.text_14, { flex: 1, textAlignVertical:"center", marginTop:-8 }]}>Product({this.state.result_data.product_count})</Text>
                </View>
                <FlatGrid
                  itemDimension={this.ScreenWidth}
                  items={this.state.result_data.product_list}
                  style={[MyStyles.gridView, MyStyles.padding_h_5]}
                  spacing={10}
                  // staticDimension={300}
                  // fixed
                  // spacing={20}
                  renderItem={({ item, index }) => (
                    <ProductItem2 item={item} index={index} this={this}></ProductItem2>
                  )}
                />
              </View>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>

            </View>
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
        // console.log(responseJson);
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
    this.setState({
      isLoading: true,
    });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        // this.requestHomeList();

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
    this.setState({
      isLoading: true,
    });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestHomeList();
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