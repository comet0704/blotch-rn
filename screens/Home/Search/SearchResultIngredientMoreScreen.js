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
  Modal,
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

export default class SearchResultIngredientMoreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveToModalVisible: false,
      result_data: {
        "ingredient_count": 30,
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
          {
            "id": 3,
            "title": "ingredient-3",
            "content": "ingredient-3",
            "type": 0
          },
          {
            "id": 4,
            "title": "ingredient-4",
            "content": "ingredient-4",
            "type": 0
          },
          {
            "id": 5,
            "title": "ingredient-5",
            "content": "ingredient-5",
            "type": 0
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
            this.setState({ saveToModalVisible: true, selectedIngredient_id: item.id })
          }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</Text>
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
                    this.props.navigation.goBack(null)
                  }} activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
                  <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
                    source={require("../../../assets/images/ic_back_black.png")}
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[MyStyles.searchBoxCover, { paddingLeft: 0 }]}>
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingRight: 5 }} value="Ubbusffree"></TextInput>
                    <TouchableOpacity style={{ padding: 8, alignSelf: "center" }}>
                      <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>


              {/* Ingredients 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white" }]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <TouchableOpacity style={{ marginRight: 10, alignSelf: "center", }} onPress={() => { this.props.navigation.goBack() }}>
                    <Image source={require("../../../assets/images/ic_back3.png")} style={[MyStyles.ic_back3,]} />
                  </TouchableOpacity>
                  <Text style={[MyStyles.text_14, { flex: 1, textAlignVertical: "center", marginTop: -8 }]}>Ingredient({this.state.result_data.ingredient_count})</Text>
                </View>
                <View style={[MyStyles.container]}>
                  {this.state.result_data.ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
                </View>
              </View>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>

            </View>
          </ScrollView>
          {/* Save to modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.saveToModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  {/* modal header */}
                  <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50 }}>
                    <View style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute" }]}>
                      <Text style={{ color: Colors.primary_dark, fontSize: 16, fontWeight: "500", }}>Save to</Text>
                    </View>
                    <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                      this.setState({ saveToModalVisible: false })
                    }}>
                      <Image style={{ width: 14, height: 14 }} source={require("../../../assets/images/ic_close.png")}></Image>
                    </TouchableOpacity>
                  </View>

                  <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                  <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                    {/* Allergic Ingredients(Dislike) */}
                    <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 0)
                      }}>
                      <Image style={MyStyles.ic_allergic_ingredient} source={require("../../../assets/images/ic_allergic_ingredient.png")}></Image>
                      <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Allergic Ingredients(Dislike)</Text>
                      <Image style={{ flex: 1 }}></Image>
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")}></Image>
                    </TouchableOpacity>
                    {/* Potential Allergens */}
                    <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 1)
                      }}>
                      <Image style={MyStyles.ic_potential_allergins} source={require("../../../assets/images/ic_potential_allergins.png")}></Image>
                      <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Potential Allergens</Text>
                      <Image style={{ flex: 1 }}></Image>
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")}></Image>
                    </TouchableOpacity>
                    {/* Preferred Ingredients */}
                    <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 2)
                      }}>
                      <Image style={MyStyles.ic_preferred_ingredient} source={require("../../../assets/images/ic_preferred_ingredient.png")}></Image>
                      <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Preferred Ingredients</Text>
                      <Image style={{ flex: 1 }}></Image>
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")}></Image>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
          </Modal>
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