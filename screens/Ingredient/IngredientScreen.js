// common
import React from 'react';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';

import Carousel from 'react-native-banner-carousel';
import {
  Image,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { LinearGradient } from 'expo';

export default class IngredientScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props)
    this.state = {
      alreadyLoaded:false,
      showLoginModal: false,
      searchKeyword: null,
      ingredient_add_type: -1,
      beforeBabyIdx: 0,
      section_allergic_show: false,
      section_potential_show: false,
      section_preferred_show: false,
      searchModalVisible: false,
      searchResultModalVisible: false,
      saveToModalVisible: false,
      potentialInfoModal: false,
      babyItems: [
        {
          id: 1,
          name: "Me",
          is_selected: true
        },
        {
          id: 2,
          name: "Baby2"
        },
        {
          id: 3,
          name: "Baby3"
        },
        {
          id: 4,
          name: "Baby4"
        },
        {
          id: 5,
          name: "Baby5"
        },
      ],
      mylist_result_data: {
        "my_list": [
        ]
      },
      searchIngredient_result_data: {
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
            "type": 2
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
            "type": 1
          },
          {
            "id": 5,
            "title": "ingredient-5",
            "content": "ingredient-5",
            "type": 0
          },
          {
            "id": 6,
            "title": "ingredient-6",
            "content": "ingredient-6",
            "type": 2
          },
          {
            "id": 7,
            "title": "ingredient-7",
            "content": "ingredient-7",
            "type": 0
          },
          {
            "id": 8,
            "title": "ingredient-8",
            "content": "ingredient-8",
            "type": 1
          },
          {
            "id": 9,
            "title": "ingredient-9",
            "content": "ingredient-9",
            "type": 0
          }
        ]
      },
    }
  }
  componentDidMount() {

  }


  onBabySelected = (p_babyName) => {
    const babyItems = [...this.state.babyItems]
    const index = babyItems.findIndex(item => item.name === p_babyName)
    babyItems[this.state.beforeBabyIdx].is_selected = false
    babyItems[index].is_selected = true
    this.state.beforeBabyIdx = index
    this.setState({ babyItems: babyItems })

    this.setState({ loading_end: false })
  }

  renderMyBabies() {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView
          horizontal
          style={{ flex: 1}}
          showsHorizontalScrollIndicator={false}>

          {this.state.babyItems.map(item => (
            <View key={item.name} style={{ marginRight: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => { this.onBabySelected(item.name) }} style={[item.is_selected ? MyStyles.baby_container_selected : MyStyles.baby_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Text style={MyStyles.baby_text_selected} numberOfLines={1}>{item.name}</Text> : <Text style={MyStyles.baby_text} numberOfLines={1}>{item.name}</Text>}
              </TouchableOpacity>
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

  renderSearchModalGoodNormalBadIngredientList(item, index) {
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
          <TouchableOpacity onPress={() => { this.requestAddUserIngredient(item.id, this.state.ingredient_add_type) }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  renderAllergicIngredients(item, index) {
    if (item.type != 0) { // allergic 성분이 아니면 pass 한다
      return;
    }
    style_container = MyStyles.ingredient_allergic_container
    style_container_selected = MyStyles.ingredient_allergic_container_selected
    style_text = MyStyles.ingredient_allergic_text;
    style_text_selected = MyStyles.ingredient_allergic_text_selected;
    style_content_text = MyStyles.ingredient_allergic_content_text;
    return (
      <View key={item.id}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => { this.requestDeleteUserIngredient(item.id) }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  renderPotentialAllergenIngredients(item, index) {
    if (item.type != 1) { // potential 성분이 아니면 pass 한다
      return;
    }
    style_container = MyStyles.ingredient_potential_allergen_container
    style_container_selected = MyStyles.ingredient_potential_allergen_container_selected
    style_text = MyStyles.ingredient_potential_allergen_text;
    style_text_selected = MyStyles.ingredient_potential_allergen_text_selected;
    style_content_text = MyStyles.ingredient_potential_allergen_content_text;
    return (
      <View key={item.id}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => { this.requestDeleteUserIngredient(item.id) }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  renderPreferedIngredients(item, index) {
    if (item.type != 2) { // allergic 성분이 아니면 pass 한다
      return;
    }
    style_container = MyStyles.ingredient_preferred_container
    style_container_selected = MyStyles.ingredient_preferred_container_selected
    style_text = MyStyles.ingredient_preferred_text;
    style_text_selected = MyStyles.ingredient_preferred_text_selected;
    style_content_text = MyStyles.ingredient_preferred_content_text;
    return (
      <View key={item.id}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => { this.requestDeleteUserIngredient(item.id) }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  renderPotentialAllergenProductScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.mylist_result_data.potential_allergen_product_list.map(item => (
            <TouchableOpacity key={item.id} style={{ marginRight: 10 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
              <View style={[MyStyles.productItemContainer, { width: 378 / 3 }]}>
                <Image source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
                {item.is_liked > 0
                  ?
                  <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestProductUnlike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestProductLike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                }
              </View>
              <Text style={[MyStyles.productBrand]}>{item.brand_title}</Text>
              <Text style={[MyStyles.productName]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  countType(type) {
    const countTypes = this.state.mylist_result_data.my_list.filter(item => item.type === type);
    return countTypes.length;
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            if (global.login_info.token == null || global.login_info.token.length < 1) {
              this.setState({ showLoginModal: true });
              return;
            }
            if(this.state.alreadyLoaded == false) {
              this.requestMyList();
            }
          }}
        />
        <TopbarWithBlackBack title="My Ingredients" onPress={() => { this.props.navigation.goBack(null) }}></TopbarWithBlackBack>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag">

          <View>
            {/* 카테고리 나열 부분 */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.color_f8f8f8,
              padding: 15,
              height: 400 / 3
            }}>
              {
                this.renderMyBabies()
              }
            </View>

            {/* Allergic Ingredients(Dislikes) 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.ingredient_section]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_allergic_show: !this.state.section_allergic_show })
              }}>
                <Image source={require("../../assets/images/ic_allergic_face.png")} style={[MyStyles.ic_allergic_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <Text style={[MyStyles.ingredient_section_header_text1]}>Allergic Ingredients(Dislikes)</Text>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(0)}</Text>
                </View>
                {
                  this.state.section_allergic_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></Image>

              {
                this.state.section_allergic_show ?
                  <View style={[MyStyles.padding_main]}>
                    {this.state.mylist_result_data.my_list.map((item, index) => this.renderAllergicIngredients(item, index))}
                  </View>
                  : null
              }

              <TouchableOpacity style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 0 }) }}>
                <Image source={require("../../assets/images/ic_plus_button_purple_round.png")} style={[MyStyles.ic_plus_button_purple_round]} />
              </TouchableOpacity>
            </View>


            {/* Potential Allergens 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_potential_allergen_dark }, MyStyles.ingredient_section]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_potential_show: !this.state.section_potential_show })
              }}>
                <Image source={require("../../assets/images/ic_potential_face.png")} style={[MyStyles.ic_potential_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[MyStyles.ingredient_section_header_text1]}>Potential Allergens</Text>
                    <TouchableOpacity style={{
                      backgroundColor: Colors.color_efeeee, overflow: "hidden", borderRadius: 10, marginLeft: 5,
                      width: 15, height: 15, justifyContent: "center"
                    }} onPress={() => { this.setState({ potentialInfoModal: true }) }}>
                      <Text style={[MyStyles.ingredient_section_header_text1, { fontSize: 12, textAlign: "center" }]}>?</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(1)}</Text>
                </View>
                {
                  this.state.section_potential_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></Image>

              {
                this.state.section_potential_show ?
                  <View style={[MyStyles.padding_main]}>
                    {this.state.mylist_result_data.my_list.map((item, index) => this.renderPotentialAllergenIngredients(item, index))}

                    {/* Ingredients that can cause Allergies */}
                    {this.state.mylist_result_data.potential_allergen_ingredient_list != null && this.state.mylist_result_data.potential_allergen_ingredient_list.length > 0 ?
                      <View style={[{ marginTop: 10 }, MyStyles.bg_white]}>
                        <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }]}>
                          <Text style={[{ fontSize: 14, flex: 1, alignSelf: "center", fontWeight: "bold" }]}>Ingredients that can cause Allergies</Text>
                          <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                            this.props.navigation.navigate("PotentialAllergenProduct")}>more ></Text>
                        </View>
                        <View>
                          {
                            this.renderPotentialAllergenProductScroll()
                          }

                          <View style={{ marginTop: 20 }}>
                            {this.state.mylist_result_data.potential_allergen_ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
                          </View>
                        </View>
                      </View>
                      : null
                    }
                  </View>
                  : null
              }

              <TouchableOpacity style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 1 }) }}>
                <Image source={require("../../assets/images/ic_plus_button_purple_round.png")} style={[MyStyles.ic_plus_button_purple_round]} />
              </TouchableOpacity>
            </View>


            {/* Preferred Ingredients 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_preferred_dark }, MyStyles.ingredient_section]}>
              <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_preferred_show: !this.state.section_preferred_show })
              }}>
                <Image source={require("../../assets/images/ic_preferred_face.png")} style={[MyStyles.ic_preferred_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <Text style={[MyStyles.ingredient_section_header_text1]}>Preferred Ingredients</Text>
                  <Text style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(2)}</Text>
                </View>
                {
                  this.state.section_preferred_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>
              <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></Image>

              {
                this.state.section_preferred_show ?
                  <View style={[MyStyles.padding_main]}>
                    {this.state.mylist_result_data.my_list.map((item, index) => this.renderPreferedIngredients(item, index))}
                  </View>
                  : null
              }

              <TouchableOpacity style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 2 }) }}>
                <Image source={require("../../assets/images/ic_plus_button_purple_round.png")} style={[MyStyles.ic_plus_button_purple_round]} />
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>

        {/* 성분검색 팝업 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.searchModalVisible}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg1}>
              <View style={MyStyles.modalContainer}>
                {/* modal header */}
                <View style={MyStyles.modal_header}>
                  <Text style={MyStyles.modal_title}>Ingredient</Text>
                  <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ searchModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                  </TouchableOpacity>
                </View>
                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                {/* body */}
                <View style={[MyStyles.padding_h_main, { paddingTop: 70 / 3, paddingBottom: 120 / 3 }]}>
                  <Text style={[MyStyles.text_13_primary_dark, { fontWeight: "500" }]}>Ingredient Name</Text>
                  <TextInput
                    onChangeText={(text) => { this.setState({ searchKeyword: text }) }}
                    value={this.state.searchKeyword}
                    style={[{ borderWidth: 0.5, marginTop: 10, borderColor: Colors.color_e5e6e5, color: Colors.color_656565, fontSize: 13, padding: 10 }]}>
                  </TextInput>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ loading_end: false })
                    if (this.state.searchKeyword == null) {
                      this.refs.toast.showBottom("Please input search keyword");
                      return;
                    }
                    this.requestSearchIngredient(this.state.searchKeyword, 0)
                  }
                  }
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <Text style={MyStyles.btn_primary}>Search</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* 성분검색결과 팝업 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.searchResultModalVisible}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg1}>
              <View style={MyStyles.modalContainer}>
                {/* modal header */}
                <View style={MyStyles.modal_header}>
                  <Text style={MyStyles.modal_title}>Ingredient</Text>
                  <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ searchResultModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                  </TouchableOpacity>
                </View>
                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                {/* body */}
                <View style={[MyStyles.padding_h_main, { paddingTop: 70 / 3, paddingBottom: 120 / 3, }]}>
                  {this.state.searchIngredient_result_data.ingredient_list.length > 0 ? null : <Text style={[MyStyles.text_normal, { textAlign: "center" }]}>Sorry, no result found</Text>}
                  <ScrollView style={{ width: "100%", maxHeight: 200, }}
                    onScroll={({ nativeEvent }) => {
                      if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
                        this.requestSearchIngredient(this.state.searchKeyword, this.offset);
                      }
                    }}>
                    <View>
                      {this.state.searchIngredient_result_data.ingredient_list.map((item, index) => this.renderSearchModalGoodNormalBadIngredientList(item, index))}
                    </View>
                  </ScrollView>
                </View>

              </View>
            </View>
          </View>
        </Modal>


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
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                  </TouchableOpacity>
                </View>

                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                  {/* Allergic Ingredients(Dislike) */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 0)
                    }}>
                    <Image style={MyStyles.ic_allergic_ingredient} source={require("../../assets/images/ic_allergic_ingredient.png")}></Image>
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Allergic Ingredients(Dislike)</Text>
                    <Image style={{ flex: 1 }}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                  {/* Potential Allergens */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 1)
                    }}>
                    <Image style={MyStyles.ic_potential_allergins} source={require("../../assets/images/ic_potential_allergins.png")}></Image>
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Potential Allergens</Text>
                    <Image style={{ flex: 1 }}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                  {/* Preferred Ingredients */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 2)
                    }}>
                    <Image style={MyStyles.ic_preferred_ingredient} source={require("../../assets/images/ic_preferred_ingredient.png")}></Image>
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Preferred Ingredients</Text>
                    <Image style={{ flex: 1 }}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        {/* Potential Info modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.potentialInfoModal}
          onRequestClose={() => {
            this.setState({ potentialInfoModal: false })
          }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ potentialInfoModal: false }) }}>
            <View style={MyStyles.modal_bg}>
              <View style={[MyStyles.modalContainer, { backgroundColor: "transparent", overflow: "visible" }]}>

                <View>
                  <Image source={require('../../assets/images/ic_white_polygon.png')} style={[MyStyles.ic_white_polygon, { marginLeft: "55%" }]}></Image>
                  <Text style={[MyStyles.padding_main, MyStyles.text_13_primary_dark, { width: "100%", marginTop: -3, borderRadius: 10, backgroundColor: "white" }]}>We will analyze the common ingredients of
two or more products and inform you of the
ingredients that can cause allergies.</Text>
                </View>

              </View>

            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showLoginModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showLoginModal: false });
                  this.props.navigation.navigate('Home')
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")}></Image>
                <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>You need to login</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showLoginModal: false });
                    this.props.navigation.navigate('Login')
                  }}
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <Text style={MyStyles.btn_primary}>Yes</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ showLoginModal: false });
                      this.props.navigation.navigate('Home')
                    }}>
                    <Text style={MyStyles.btn_primary_white}>Not now</Text>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    );
  }


  requestMyList() {
    this.setState({
      isLoading: true,
      alreadyLoaded : true,
    });
    return fetch(Net.ingredient.myList, {
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

        this.setState({ mylist_result_data: responseJson.result_data })

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteUserIngredient(p_ingredient_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.deleteUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString()
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

        this.requestMyList();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestSearchIngredient(p_ingredient_name, p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.searchIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_name: p_ingredient_name,
        offset: p_offset.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showTop(responseJson.result_msg);
          return
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }

        this.offset += responseJson.result_data.ingredient_list.length
        if (responseJson.result_data.ingredient_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        if (p_offset == 0) {
          this.setState({
            searchIngredient_result_data: responseJson.result_data
          });
          this.setState({ searchResultModalVisible: true, searchModalVisible: false })
          return;
        }
        const ingredient_list = this.state.searchIngredient_result_data.ingredient_list
        result = { ingredient_list: [...ingredient_list, ...responseJson.result_data.ingredient_list] };
        this.setState({ searchIngredient_result_data: result })
        this.setState({ searchResultModalVisible: true, searchModalVisible: false })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
        showTop.showBottom(error);
      })
      .done();
  }

  requestAddUserIngredient(p_ingredient_id, p_type) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.addUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString(),
        type: p_type.toString(),
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

        this.setState({ searchResultModalVisible: false })
        this.setState({ saveToModalVisible: false });

        this.requestMyList();
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
        this.requestMyList();

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
        this.requestMyList();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }
};