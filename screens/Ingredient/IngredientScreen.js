// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';

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
  Alert,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';

import { WebBrowser } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { LinearGradient } from 'expo';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';
import Messages from '../../constants/Messages';

export default class IngredientScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      showLoginModal: false,
      searchKeyword: null,
      ingredient_add_type: -1,
      beforeBabyIdx: 0,
      section_allergic_show: false,
      section_potential_show: false,
      section_preferred_show: false,
      searchModalVisible: false,
      saveToModalVisible: false,
      potentialInfoModal: false,
      questionnaire_list: [
      ],
      mylist_result_data: {
        "my_list": [
        ]
      },
      searchIngredient_result_data: {
        "ingredient_list": [
        ]
      },
      selected_questionnaire: {
        id: "",
        value: "Me",
      },
    }
  }
  componentDidMount() {
    handleAndroidBackButton(this, exitAlert);
  }

  componentWillMount() {
    removeAndroidBackButtonHandler()
  }


  onBabySelected = (p_babyName) => {
    const questionnaire_list = [...this.state.questionnaire_list]
    const index = questionnaire_list.findIndex(item => item.title === p_babyName)
    questionnaire_list[this.state.beforeBabyIdx].is_selected = false
    questionnaire_list[index].is_selected = true
    this.state.beforeBabyIdx = index
    this.setState({ questionnaire_list: questionnaire_list })

    this.setState({ loading_end: false })

    this.state.selected_questionnaire = questionnaire_list[index]
    this.setState({ selected_questionnaire: this.state.selected_questionnaire })
    this.requestMyList(this.state.selected_questionnaire.id)
    global.login_info.questionnaire_id = this.state.selected_questionnaire.id
    global.refreshStatus.product_recommend = true
    global.refreshStatus.mypage = true
  }

  renderMyBabies() {
    return (
      <View
        style={{ flex: 1, justifyContent: "center" }}
      >
        <ScrollView
          horizontal
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}>

          {this.state.questionnaire_list.map(item => (
            <View key={item.id} style={{ marginRight: 10, flex: 1, justifyContent: "center" }}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => { this.onBabySelected(item.title) }} style={[item.is_selected ? MyStyles.baby_container_selected : MyStyles.baby_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <MyAppText style={MyStyles.baby_text_selected} numberOfLines={1}>{item.title}</MyAppText> : <MyAppText style={MyStyles.baby_text} numberOfLines={1}>{item.title}</MyAppText>}
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
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            this.setState({ saveToModalVisible: true, selectedIngredient_id: item.id })
          }}>
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
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
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => { this.requestAddUserIngredient(item.id, this.state.ingredient_add_type, this.state.selected_questionnaire.id) }}>
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
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
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            Alert.alert(
              '',
              Messages.would_you_like_to_delete_it,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    this.requestDeleteUserIngredient(item.id, this.state.selected_questionnaire.id)
                  }
                },
              ],
              { cancelable: false },
            );
          }}
          >
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
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
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            Alert.alert(
              '',
              Messages.would_you_like_to_delete_it,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    this.requestDeleteUserIngredient(item.id, this.state.selected_questionnaire.id)
                  }
                },
              ],
              { cancelable: false },
            );

          }}>
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
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
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            Alert.alert(
              '',
              Messages.would_you_like_to_delete_it,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    this.requestDeleteUserIngredient(item.id, this.state.selected_questionnaire.id)
                  }
                },
              ],
              { cancelable: false },
            );
          }}>
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
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
            <TouchableOpacity activeOpacity={0.8} key={item.id} style={{ marginRight: 10 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
              <View style={[MyStyles.productItemContainer, { width: 378 / 3 }]}>
                <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
                {item.is_liked > 0
                  ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductUnlike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductLike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                }
              </View>
              <MyAppText style={[MyStyles.productBrand]} numberOfLines={1}>{item.brand_title}</MyAppText>
              <MyAppText style={[MyStyles.productName]} numberOfLines={1}>{item.title}</MyAppText>
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.requestQuestionnaireList();
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
            if (global.refreshStatus.ingredient == true) {
              this.requestQuestionnaireList();
            }
          }}
        />
        <TopbarWithBlackBack isRootDepth={true} title="My Ingredients" onPress={() => { this.props.navigation.goBack(null) }}></TopbarWithBlackBack>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>

          <View>
            {this.state.questionnaire_list.length > 0 ?
              // {/* 베이비 나열 부분 */}
              <View style={{
                backgroundColor: Colors.color_f8f8f8,
                padding: 15,
                height: 375 / 3
              }}>
                {
                  this.renderMyBabies()
                }
              </View>
              :
              null}

            {/* Allergic Ingredients(Dislikes) 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.ingredient_section]}>
              <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_allergic_show: !this.state.section_allergic_show })
              }}>
                <Image source={require("../../assets/images/ic_allergic_face.png")} style={[MyStyles.ic_allergic_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Allergic Ingredients(Dislikes)</MyAppText>
                  <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(0)}</MyAppText>
                </View>
                {
                  this.state.section_allergic_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>

              {
                this.state.section_allergic_show ?
                  <View>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                    <View style={[MyStyles.padding_main]}>
                      {this.state.mylist_result_data.my_list.map((item, index) => this.renderAllergicIngredients(item, index))}
                    </View>
                  </View>
                  : null
              }

              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 0 }) }}>
                <Image source={require("../../assets/images/ic_plus_button_purple_round.png")} style={[MyStyles.ic_plus_button_purple_round]} />
              </TouchableOpacity>
            </View>


            {/* Potential Allergens 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_potential_allergen_dark }, MyStyles.ingredient_section]}>
              <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_potential_show: !this.state.section_potential_show })
              }}>
                <Image source={require("../../assets/images/ic_potential_face.png")} style={[MyStyles.ic_potential_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Potential Allergens</MyAppText>
                    {this.state.potentialInfoModal ? null :
                      <TouchableOpacity activeOpacity={0.8} style={{
                        backgroundColor: Colors.color_efeeee, overflow: "hidden", borderRadius: 10, marginLeft: 5,
                        width: 15, height: 15, justifyContent: "center"
                      }} onPress={() => { this.setState({ potentialInfoModal: true }) }}>
                        <MyAppText style={[MyStyles.ingredient_section_header_text1, { fontSize: 12, textAlign: "center" }]}>?</MyAppText>
                      </TouchableOpacity>
                    }
                  </View>
                  <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(1)}</MyAppText>
                </View>
                {
                  this.state.section_potential_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>

              {
                this.state.section_potential_show ?
                  <View>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                    <View style={[MyStyles.padding_main]}>
                      {this.state.mylist_result_data.my_list.map((item, index) => this.renderPotentialAllergenIngredients(item, index))}

                      {/* Ingredients that can cause Allergies */}
                      {this.state.mylist_result_data.potential_allergen_ingredient_list != null && this.state.mylist_result_data.potential_allergen_ingredient_list.length > 0 ?
                        <View style={[{ marginTop: 10 }, MyStyles.bg_white]}>
                          <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }]}>
                            <MyAppText style={[{ fontSize: 14, flex: 1, alignSelf: "center", fontWeight: "bold" }]}>Ingredients that can cause Allergies</MyAppText>
                            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_more_cover]} onPress={() =>
                              this.props.navigation.navigate("PotentialAllergenProduct")}>
                              <MyAppText style={MyStyles.txt_more}>more</MyAppText>
                              <Image source={require('../../assets/images/ic_more_right.png')} style={MyStyles.ic_more_right} />
                            </TouchableOpacity>
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
                  </View>
                  : null
              }

              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 1 }) }}>
                <Image source={require("../../assets/images/ic_plus_button_purple_round.png")} style={[MyStyles.ic_plus_button_purple_round]} />
              </TouchableOpacity>
            </View>


            {/* Preferred Ingredients 부분 */}
            <View style={[{ borderLeftColor: Colors.ingredient_preferred_dark, marginBottom: MyConstants.TABBAR_TOP_BORDER_HEIGHT }, MyStyles.ingredient_section]}>
              <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                this.setState({ section_preferred_show: !this.state.section_preferred_show })
              }}>
                <Image source={require("../../assets/images/ic_preferred_face.png")} style={[MyStyles.ic_preferred_face]} />
                <View style={[MyStyles.padding_h_main, { flex: 1 }]}>
                  <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Preferred Ingredients</MyAppText>
                  <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{this.countType(2)}</MyAppText>
                </View>
                {
                  this.state.section_preferred_show ? <Image source={require("../../assets/images/ic_polygon_up.png")} style={[MyStyles.ic_polygon_up]} />
                    : <Image source={require("../../assets/images/ic_polygon_down.png")} style={[MyStyles.ic_polygon_down]} />
                }
              </TouchableOpacity>

              {
                this.state.section_preferred_show ?
                  <View>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                    <View style={[MyStyles.padding_main]}>
                      {this.state.mylist_result_data.my_list.map((item, index) => this.renderPreferedIngredients(item, index))}
                    </View>
                  </View>
                  : null
              }

              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.ingredient_section_plus_btn]} onPress={() => { this.setState({ searchModalVisible: true, ingredient_add_type: 2 }) }}>
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
          <Toast ref='modalToast' />
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg1}>
              <View style={MyStyles.modalContainer}>
                {/* modal header */}
                <View style={MyStyles.modal_header}>
                  <MyAppText style={MyStyles.modal_title}>Ingredient</MyAppText>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ searchModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>
                </View>
                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                {/* body */}
                <View style={[MyStyles.padding_h_main, { paddingTop: 70 / 3, paddingBottom: 75 / 3 }]}>
                  <MyAppText style={[MyStyles.text_13_primary_dark, { fontWeight: "500" }]}>Ingredient Name</MyAppText>
                  <TextInput
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      this.setState({ loading_end: false })
                      if (this.state.searchKeyword == null) {
                        this.refs.modalToast.showBottom("Please input search keyword");
                        return;
                      }
                      this.requestSearchIngredient(this.state.searchKeyword, 0)
                    }}
                    onChangeText={(text) => { this.setState({ searchKeyword: text }) }}
                    value={this.state.searchKeyword}
                    style={[{ borderWidth: 0.5, marginTop: 10, borderColor: Colors.color_e5e6e5, color: Colors.color_656565, fontSize: 13, padding: 10 }]}>
                  </TextInput>
                </View>

                <View style={{ flexDirection: "row", marginBottom: 75 / 3, alignItems: "center", justifyContent: "center" }}>
                  <TouchableOpacity
                    style={[MyStyles.btn_primary_cover, { width: 450 / 3, flex: 0, height: 100 / 3 }]}
                    onPress={
                      () => {
                        this.setState({ loading_end: false })
                        if (this.state.searchKeyword == null) {
                          this.refs.modalToast.showBottom("Please input search keyword");
                          return;
                        }
                        this.requestSearchIngredient(this.state.searchKeyword, 0)
                      }
                    }
                  >
                    <MyAppText style={MyStyles.btn_primary}>Search</MyAppText>
                  </TouchableOpacity>
                </View>

                {
                  this.state.searchIngredient_result_data.ingredient_list.length > 0 ?
                    <ScrollView style={{ width: "100%", maxHeight: 200, marginBottom: 120 / 3 }}
                      onScroll={({ nativeEvent }) => {
                        if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
                          this.requestSearchIngredient(this.state.searchKeyword, this.offset);
                        }
                      }}>
                      <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15, marginBottom: 75 / 3 }]} />
                      <View style={[MyStyles.margin_h_main]}>
                        {this.state.searchIngredient_result_data.ingredient_list.map((item, index) => this.renderSearchModalGoodNormalBadIngredientList(item, index))}
                      </View>
                    </ScrollView>
                    : null
                }
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
                    <MyAppText style={{ color: Colors.primary_dark, fontSize: 16, fontWeight: "500", }}>Save to</MyAppText>
                  </View>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ saveToModalVisible: false })
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>
                </View>

                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                  {/* Allergic Ingredients(Dislike) */}
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 0, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_allergic_ingredient} source={require("../../assets/images/ic_allergic_ingredient.png")} />
                    <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Allergic Ingredients(Dislike)</MyAppText>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
                  </TouchableOpacity>
                  {/* Potential Allergens */}
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 1, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_potential_allergins} source={require("../../assets/images/ic_potential_allergins.png")} />
                    <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Potential Allergens</MyAppText>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
                  </TouchableOpacity>
                  {/* Preferred Ingredients */}
                  <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 2, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_preferred_ingredient} source={require("../../assets/images/ic_preferred_ingredient.png")} />
                    <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Preferred Ingredients</MyAppText>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
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
          <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.setState({ potentialInfoModal: false }) }}>
            <View style={MyStyles.modal_bg}>
              <View style={[MyStyles.modalContainer, { backgroundColor: "transparent", overflow: "visible" }]}>
                {/* <View style={{
                  backgroundColor: Colors.color_efeeee, overflow: "hidden", borderRadius: 10, marginLeft: "55%", marginBottom: 5,
                  width: 15, height: 15, justifyContent: "center"
                }} >
                  <MyAppText style={[MyStyles.ingredient_section_header_text1, { fontSize: 12, textAlign: "center" }]}>?</MyAppText>
                </View> */}
                <View>
                  {/* <Image source={require('../../assets/images/ic_white_polygon.png')} style={[MyStyles.ic_white_polygon, { marginLeft: "55%" }]} /> */}
                  <MyAppText style={[MyStyles.padding_main, MyStyles.text_13_primary_dark, { width: "100%", marginTop: -3, borderRadius: 10, backgroundColor: "white" }]}>We will analyze the common ingredients of
    two or more products and inform you of the
ingredients that can cause allergies.</MyAppText>
                </View>

              </View>

            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showLoginModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showLoginModal: false });
                  this.props.navigation.navigate('Home')
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>{Messages.you_need_to_login}</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showLoginModal: false });
                    this.props.navigation.navigate('Login')
                  }}
                    style={[MyStyles.dlg_btn_primary_cover]}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_white_cover]}
                    onPress={() => {
                      this.setState({ showLoginModal: false });
                      this.props.navigation.navigate('Home')
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>Not now</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>
        <Image source={require("../../assets/images/ic_tabbar_border.png")} style={{ width: "100%", height: MyConstants.TABBAR_TOP_BORDER_HEIGHT, position: "absolute", bottom: 0 }} />
      </KeyboardAvoidingView >
    );
  }


  requestMyList(p_questionnaire_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.myList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id
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
        global.refreshStatus.ingredient = false

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteUserIngredient(p_ingredient_id, p_questionnaire_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.ingredient.deleteUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString(),
        questionnaire_id: p_questionnaire_id
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

        this.requestMyList(this.state.selected_questionnaire.id);
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
          return;
        }
        const ingredient_list = this.state.searchIngredient_result_data.ingredient_list
        result = { ingredient_list: [...ingredient_list, ...responseJson.result_data.ingredient_list] };
        this.setState({ searchIngredient_result_data: result })
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

  requestAddUserIngredient(p_ingredient_id, p_type, p_questionnaire_id, p_force) {
    // this.setState({
    //   isLoading: true,
    // });
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
        questionnaire_id: p_questionnaire_id,
        force: p_force,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });


        this.setState({ saveToModalVisible: false, searchModalVisible: false });

        if (responseJson.result_code < 0) {
          if (responseJson.result_code == -10) {
            Alert.alert(
              '',
              responseJson.result_msg,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OK', onPress: () => this.requestAddUserIngredient(p_ingredient_id, p_type, p_questionnaire_id, 1) },
              ],
              { cancelable: false },
            );
            return
          } else {
            this.refs.toast.showBottom(responseJson.result_msg);
            return
          }
        }

        this.requestMyList(this.state.selected_questionnaire.id);
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
        this.requestMyList(this.state.selected_questionnaire.id);
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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestMyList(this.state.selected_questionnaire.id);
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


  requestQuestionnaireList() {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.questionnaireList, {
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.questionnaire_list = responseJson.result_data.questionnaire_list

        if (this.state.questionnaire_list.length > 0) {
          // 전반적으로 선택된 인원 같이 변경해야 하므로
          w_selectedQueIdx = this.state.questionnaire_list.findIndex((item) => item.id == global.login_info.questionnaire_id)
          this.state.selected_questionnaire = this.state.questionnaire_list[w_selectedQueIdx]
          this.setState({ selected_questionnaire: this.state.selected_questionnaire })

          this.state.questionnaire_list.forEach(element => {
            element.is_selected = false
          })

          this.state.questionnaire_list[w_selectedQueIdx].is_selected = true
          this.state.beforeBabyIdx = w_selectedQueIdx
          this.setState({ questionnaire_list: this.state.questionnaire_list })

          this.setState({ refreshing: false });
          this.requestMyList(this.state.selected_questionnaire.id)
        }

      })
      .catch((error) => {
        // this.setState({
        //   isLoading: false,
        // });
        this.refs.toast.showBottom(error);
      })
      .done();
  }
};