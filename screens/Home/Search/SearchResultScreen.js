// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
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
  Keyboard,
  ScrollView,
  Text,
  Modal,
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
import { BrandItem } from '../../../components/Search/BrandItem';

export default class SearchResultScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: "",
      request_brand_name: "",
      request_product_name: "",
      no_search_result: false,
      isLogined: false,
      requestProductModalVisible: false,
      result_data: {
        "product_count": 0,
        "product_list": [
        ],
        "ingredient_count": 0,
        "ingredient_list": [
        ],
        "brand_count": 0,
        "brand_list": []
      },
    };
  }

  componentDidMount() {
    w_searchWord = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.search_word)
    this.setState({ searchWord: w_searchWord })
    this.requestSearchAll(w_searchWord)
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
            <BrandItem key={item.id} item_width={((this.ScreenWidth - 60) / 3)} item={item} this={this} />
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

  submitReport() {
    if (this.state.request_brand_name == "" || this.state.request_product_name == "") {
      this.refs.toast.showTop("Please input Brand name and Product name");
      return;
    }
    this.setState({ requestProductModalVisible: false });
    this.requestProductRequest(this.state.request_brand_name, this.state.product_name)
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
                <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} value={this.state.searchWord}></TextInput>
                <TouchableOpacity style={{ padding: 8, alignSelf: "center" }} onPress={() => { this.props.navigation.navigate("SearchCamera") }}>
                  <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>

          {this.state.no_search_result == false ?
            <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
              <View style={{ backgroundColor: "white" }}>
                {this.state.result_data.brand_count > 0 ?
                  <View>
                    {/* brand 검색결과 나열 */}
                    <View style={[MyStyles.bg_white]}>
                      <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                        <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Brands({this.state.result_data.brand_count})</Text>
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
                  </View>
                  : null}

                {this.state.result_data.product_count > 0 ?
                  <View>
                    {/* product 검색결과 나열 */}
                    <View style={[{ flex: 1, backgroundColor: "white" }]}>
                      <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                        <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Product({this.state.result_data.product_count})</Text>
                        <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() =>
                          this.props.navigation.navigate("SearchResultProductMore", { [MyConstants.NAVIGATION_PARAMS.search_word]: this.state.searchWord })}>
                          <Text style={MyStyles.txt_more}>more</Text>
                          <Image source={require('../../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                        </TouchableOpacity>
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
                          <ProductItem2 item={item} index={index} this={this} />
                        )}
                      />
                    </View>
                    <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>
                  </View>
                  : null}

                {this.state.result_data.ingredient_count > 0 ?
                  <View>
                    {/* Ingredients 검색결과 나열 */}
                    <View style={[{ flex: 1, backgroundColor: "white" }]}>
                      <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                        <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>Ingredients({this.state.result_data.ingredient_count})</Text>
                        <TouchableOpacity style={[MyStyles.btn_more_cover]} onPress={() =>
                          this.props.navigation.navigate("SearchResultIngredientMore", { [MyConstants.NAVIGATION_PARAMS.search_word]: this.state.searchWord })}>
                          <Text style={MyStyles.txt_more}>more</Text>
                          <Image source={require('../../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                        </TouchableOpacity>
                      </View>
                      <View style={[MyStyles.container]}>
                        {this.state.result_data.ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
                      </View>
                    </View>
                    <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15, marginTop: 30 }]}></View>
                  </View>
                  : null}
              </View>
            </ScrollView>
            :
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={{ alignItems: "center" }}>
                  <Image source={require("../../../assets/images/ic_search_big.png")} style={[MyStyles.ic_search_big,]} />
                  <Text style={{ fontSize: 69 / 3, color: Colors.primary_dark, textAlign: "center", marginTop: 30, fontWeight: "bold" }}>Sorry, no result found</Text>
                  <Text style={[{ fontSize: 39 / 3, color: Colors.color_c2c1c1, textAlign: "center", marginTop: 10 }, MyStyles.padding_h_main]}>Not finding what you are looking for?{"\n"}Let us know and we'll do the search for you.</Text>
                  <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 460 / 3, height: 130 / 3, marginTop: 100 / 3 }]} onPress={() => { this.setState({ requestProductModalVisible: true }) }}>
                    <Text style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Report us</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.requestProductModalVisible}
            onRequestClose={() => {
            }}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
              <View style={{ flex: 1 }}>
                <View style={MyStyles.modal_bg}>
                  <View style={MyStyles.modalContainer}>
                    {/* modal header */}
                    <View style={MyStyles.modal_header}>
                      <Text style={MyStyles.modal_title}>Product Registeration Request</Text>
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ requestProductModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../../assets/images/ic_close.png")} />
                      </TouchableOpacity>
                    </View>
                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                    <View style={[MyStyles.container, { paddingTop: 20, paddingBottom: 120 / 3 }]}>
                      <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Brand Name</Text>
                      <TextInput
                        returnKeyType="next"
                        onSubmitEditing={() => { this.product_name_input.focus(); }}
                        onChangeText={(text) => { console.log(text); this.setState({ request_brand_name: text }) }}
                        style={MyStyles.text_input_with_border}>
                      </TextInput>
                      <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginTop: 20, marginBottom: 10 }}>Product Name</Text>
                      <TextInput
                        onSubmitEditing={() => {
                          this.submitReport()
                        }}
                        ref={(input) => { this.product_name_input = input; }}
                        onChangeText={(text) => { console.log(text); this.setState({ request_product_name: text }) }}
                        style={MyStyles.text_input_with_border}>
                      </TextInput>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight
                        style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {
                          this.submitReport()
                        }}>
                        <Text style={MyStyles.btn_primary}>Submit</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </KeyboardAvoidingView>
      </View >
    );
  }

  requestSearchAll(p_keyword) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.searchAll, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        keyword: p_keyword
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
          return;
        }
        this.setState({
          result_data: responseJson.result_data
        });

        if (responseJson.result_data.product_count + responseJson.result_data.brand_count + responseJson.result_data.ingredient_count == 0) {
          this.setState({ no_search_result: true })
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
        console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchAll(this.state.searchWord);
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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchAll(this.state.searchWord);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestBrandLike(p_brand_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.brand.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchAll(this.state.searchWord);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestBrandUnlike(p_brand_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.brand.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchAll(this.state.searchWord);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }


  requestProductRequest(p_brand_name, p_product_name) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.request, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_name: p_brand_name,
        product_name: p_product_name
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
        this.refs.toast.showBottom("We have received your report");
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