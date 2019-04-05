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

export default class SearchResultScreen extends React.Component {
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
        ],
        "ingredient_count": 2,
        "ingredient_list": [
          {
            "id": 1,
            "title": "ingredient-1",
            "content": "ingredient-1",
            "type": 0
          },
          {
            "id": 2,
            "title": "ingredient-2",
            "content": "ingredient-2",
            "type": 0
          },
        ],
        "brand_count": 1,
        "brand_list": [
          {
            "id": 3,
            "title": "BOBBI BROWN",
            "information": "",
            "image": "uploads/brand/logo_03.jpg",
            "is_liked": 4
          }]
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

  renderBrandsScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.result_data.brand_list.map(item => (
            <View key={item.id} style={{ flex: 1, marginRight: 20, width: 85 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                <Image style={{ width: 85, height: 85, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image) }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: Colors.color_949191, marginTop: 5, textAlign: "center" }} numberOfLines={2}>Products{"\n" + item.title}</Text>
              {
                item.is_liked > 0
                  ?
                  <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { this.requestProductUnlike(item.id) }}>
                    <Image source={require('../../../assets/images/ic_heart2_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { this.requestProductLike(item.id) }}>
                    <Image source={require('../../../assets/images/ic_heart2_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }


  renderGoodNormalBadIngredientList(item, index) {
    style_container = {};
    style_container_selected = {};
    style_text = {};
    style_text_selected = {};
    style_content_text = {};
    if (item.type == 0) { // Normal 인경우
      style_container = MyStyles.ingredient_normal_container
      style_container_selected = MyStyles.ingredient_normal_container_selected
      style_text = MyStyles.ingredient_normal_text;
      style_text_selected = MyStyles.ingredient_normal_text_selected;
      style_content_text = MyStyles.ingredient_normal_content_text;
    } else if (item.type == 1) { // Good 인 경우        
      style_container = MyStyles.ingredient_good_container
      style_container_selected = MyStyles.ingredient_good_container_selected
      style_text = MyStyles.ingredient_good_text;
      style_text_selected = MyStyles.ingredient_good_text_selected;
      style_content_text = MyStyles.ingredient_good_content_text;
    } else { // Bad 인 경우
      style_container = MyStyles.ingredient_bad_container
      style_container_selected = MyStyles.ingredient_bad_container_selected
      style_text = MyStyles.ingredient_bad_text;
      style_text_selected = MyStyles.ingredient_bad_text_selected;
      style_content_text = MyStyles.ingredient_bad_content_text;
    }

    return (
      <View key={item.id} style={{ flex: 1 }}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {
          }}>
            <Icon.Ionicons
              name={Platform.OS === 'ios' ? 'ios-arrow-dropdown' : 'md-arrow-dropdown'}
              size={26}
              style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}
              color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

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
                    if (this.state.searchBoxFocused) {
                      this.setState({ searchBoxFocused: false })
                      this.refs.searchBox.blur()
                      return
                    }
                    this.props.navigation.goBack(null)
                  }} activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
                  <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
                    source={require("../../../assets/images/ic_back_black.png")}
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[MyStyles.searchBoxCover, MyStyles.shadow_2]}>
                    <Image source={require('../../../assets/images/Home/ic_search.png')} style={{ width: 13, height: 11, alignSelf: "center" }} />
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} placeholder="Search keyword"></TextInput>
                    <TouchableOpacity style={{ padding: 8, alignSelf: "center" }}>
                      <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>

              {/* brand 검색결과 나열 */}
              <View style={[MyStyles.bg_white]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Brands({this.state.result_data.brand_count})</Text>
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
                    this.renderBrandsScroll()
                  }
                </View>
              </View>

              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>

              {/* product 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white" }]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Product({this.state.result_data.product_count})</Text>
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                    this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>more ></Text>
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


              {/* Ingredients 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white"}]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Ingredients({this.state.result_data.ingredient_count})</Text>
                  <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                    this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>more ></Text>
                </View>
                <View style={[MyStyles.container]}>
                  {this.state.result_data.ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
                </View>
              </View>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15, marginTop:30 }]}></View>
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