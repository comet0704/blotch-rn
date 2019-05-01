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
import { NavigationEvents } from 'react-navigation';
import Carousel from 'react-native-banner-carousel';
import {
  KeyboardAvoidingView,
  View,
  Image,
  Modal,
  Dimensions,
  WebBrowser,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import { QuestionnaireListModal } from '../../components/Modals/QuestionnaireListModal';
import { LoginModal } from '../../components/Modals/LoginModal';

export class FragmentRecommendProduct extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      qlistModalVisible: false,
      main_all_selected: false,
      showLoginModal: false,
      isLogined: false,
      filterModalVisible: false,

      product_list_result_data: {
        recomment_list: [
        ]
      },
      mainCategoryItems: Common.categoryItems_recom,
      selected_questionnaire: "",

      questionnaire_list: [

      ],
      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
      my_age: null,
      my_skin_type: null,
      my_concern: null,
      my_needs: null,
    };
  }

  ScreenWidth = Dimensions.get('window').width;

  componentDidMount() {
    this.onNavigationEvent()
  }

  getRecommendList = (p_offset) => {
    // 전체선택인 경우 All 올려보냄
    if (this.state.main_all_selected) {
      this.requestRecommendList(this.state.selected_questionnaire.id, "All", p_offset)
      return
    }
    // 먼저 p_category 값을 this.state.mainCategoryItems 를 조회하면서 얻어내야함.
    category_array = [];
    this.state.mainCategoryItems.forEach(element => {
      if (element.is_selected > 0) { // 메인카테고리 선택되었으면
        if (element.sub_category.length > 0) { // 서브카테고리가 있는가
          temp_array = [];
          element.sub_category.forEach(sub_element => {
            if (sub_element.is_selected) {
              temp_array.push(sub_element.name)
            }
          })
          category_array.push({ [element.categoryName]: temp_array })
        } else { // 서브카테고리가 없으면
          category_array.push({ [element.categoryName]: [] })
        }
      }
    })
    console.log(category_array);
    console.log(JSON.stringify(category_array));
    this.requestRecommendList(this.state.selected_questionnaire.id, JSON.stringify(category_array), p_offset)
  }

  onCategorySelect = async (p_catName) => {
    const categoryItems = [...this.state.mainCategoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    if (categoryItems[index].is_selected > 0) {
      categoryItems[index].is_selected = 0
    } else if (categoryItems[index].sub_category.length > 0) {
      categoryItems[index].is_selected = 1
    } else {
      categoryItems[index].is_selected = 2
    }

    this.setState({ mainCategoryItems: categoryItems })
    console.log(this.state.mainCategoryItems);
    this.setState({ main_all_selected: false })
    await this.setState({ showSubCategory: false })
    this.setState({ showSubCategory: true })
  }


  renderMyInfo() {
    return (
      <View
      >
        <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
          <Text style={{ fontSize: 14, color: Colors.primary_dark, fontWeight: "bold" }}>My Skin Info</Text>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity style={[{ height: 20 }, MyStyles.purple_round_btn]} onPress={() => {
            this.setState({ qlistModalVisible: true })
          }}>
            <Text style={{ fontSize: 13, color: "white" }}>{this.state.selected_questionnaire.value}</Text>
            <Image source={require("../../assets/images/ic_arrow_down_white_small.png")} style={[MyStyles.ic_arrow_down_white_small, { marginLeft: 5 }]} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10, flexDirection: "row" }}>

          {
            this.state.my_age != null && this.state.my_age.length > 0 ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, backgroundColor: Colors.color_f8f8f8, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>{this.state.my_age}</Text>
                </View>
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_age}</Text>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>Age</Text>
                </View>
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Age</Text>
              </View>
          }
          {
            this.state.my_skin_type != null ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <Image source={this.state.my_skin_type.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_skin_type.typeName}</Text>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</Text>
                </View>
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Skin Type</Text>
              </View>
          }

          {
            this.state.my_concern != null ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <Image source={this.state.my_concern.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_concern.typeName}</Text>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</Text>
                </View>
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Concern</Text>
              </View>
          }

          {
            this.state.my_needs != null ?
              <View style={[{}, MyStyles.skin_info_container]}>
                <Image source={this.state.my_needs.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_needs.typeName}</Text>
              </View>
              :
              <View style={[{}, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</Text>
                </View>
                <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Needs</Text>
              </View>
          }
        </View>
      </View>
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.recomment_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { recomment_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.recomment_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { recomment_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  resetFilterStatus = () => {
    this.setState({ main_all_selected: true })
    for (i = 0; i < this.state.mainCategoryItems.length; i++) {
      this.state.mainCategoryItems[i].is_selected = 0
      for (j = 0; j < this.state.mainCategoryItems[i].sub_category.length; j++) {
        this.state.mainCategoryItems[i].sub_category[j].is_selected = false
      }
    }

    this.setState({ mainCategoryItems: this.state.mainCategoryItems })
  }

  // QuestionnaireListModal 에서 돌아오는 콜백
  onQuestionnaireSelected(value, index, data) {
    console.log(data[index])
    this.state.selected_questionnaire = data[index]
    this.setState({ selected_questionnaire: this.state.selected_questionnaire })
    this.setState({ qlistModalVisible: false });
    this.requestQuestionnaireDetail(this.state.selected_questionnaire.id)
  }

  onWeCanSearchItCallback = (p_skin_type, p_concern, p_needs) => {
    // WecanSeachit에서 입력한 정보들로 메인 questionnaire를 만들어주자.
    this.requestAddQuestionnaireItem("Me", p_skin_type, p_concern, p_needs)
  }

  onNavigationEvent = () => {
    const beforeLoginState = this.state.isLogined;
    if (global.login_info.token == "") {
      this.state.isLogined = false
      this.setState({ isLogined: this.state.isLogined })
    } else {
      this.state.isLogined = true
      this.setState({ isLogined: this.state.isLogined })
      if (Common.isNeedToAddQuestionnaire() == false) { // 이미 설문이 추가된 회원이면 설문목록 얻어오기
        this.requestQuestionnaireList();
      }
    }
  }

  render() {
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
        {this.state.isLogined == false || Common.isNeedToAddQuestionnaire() ?
          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
            <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Image source={require("../../assets/images/ic_search_big.png")} style={[MyStyles.ic_search_big,]} />
                <Text style={{ fontSize: 69 / 3, color: Colors.primary_dark, textAlign: "center", marginTop: 30, fontWeight: "bold" }}>Sorry, no result found</Text>
                <Text style={[{ fontSize: 39 / 3, color: Colors.color_c2c1c1, textAlign: "center", marginTop: 10 }, MyStyles.padding_h_main]}>Tell us about your skin and we'll show you some products that you might want to check out!</Text>
                <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 460 / 3, height: 130 / 3, marginTop: 100 / 3 }]} onPress=
                  {() => {
                    if (this.state.isLogined == false) {
                      this.setState({ showLoginModal: true })
                    } else {
                      this.props.navigation.navigate("WeCanSearchIt", {
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: global.login_info.skin_type,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: global.login_info.concern,
                        [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: global.login_info.needs,
                        [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                      })
                    }
                  }
                  }>
                  <Text style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Check Out!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          :
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
            onScroll={({ nativeEvent }) => {
              if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
                this.getRecommendList(this.offset)
              }
            }}>

            <View>
              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

              {/* My Skin Info 부분 */}
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.color_f8f8f8,
                padding: 15,
              }}>
                {
                  this.renderMyInfo()
                }
              </View>

              {/* product 나열 */}
              <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
                <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", alignItems: "center" }}>
                  <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product({this.state.product_list_result_data.recomment_list.length})</Text>
                  <View style={{ flex: 1 }}></View>
                  <TouchableOpacity style={[MyStyles.padding_h_main,]} onPress={() => { this.setState({ filterModalVisible: true }) }}>
                    <Image source={require("../../assets/images/ic_filter.png")} style={[MyStyles.ic_filter]} />
                  </TouchableOpacity>
                </View>
                <FlatGrid
                  itemDimension={this.ScreenWidth / 2 - 30}
                  items={this.state.product_list_result_data.recomment_list}
                  style={MyStyles.gridView}
                  spacing={10}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                      <View style={[MyStyles.productItemContainer]}>
                        <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
                        {item.is_liked > 0
                          ?
                          <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductUnlike(item.id) }}>
                            <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductLike(item.id) }}>
                            <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                          </TouchableOpacity>
                        }
                        {/* {index < 3 ?
                       <View style={[{ position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" }, MyStyles.ic_best_ranking]}>
                         <Image source={require('../../assets/images/ic_best_ranking.png')} style={[MyStyles.background_image]} />
                         <Text style={{ position: "absolute", fontSize: 15, fontWeight: "500", textAlign: "center", color: "white" }}>{index + 1}</Text>
                       </View>
                       : null} */}
                      </View>
                      <Text style={[MyStyles.productBrand]}>{item.brand_title}</Text>
                      <Text style={[MyStyles.productName]}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.filterModalVisible}
              onRequestClose={() => {
              }}>
              <View style={{ flex: 1 }}>
                <View style={MyStyles.modal_bg1}>
                  <View style={[MyStyles.modalContainer, { height: 500 }]}>
                    {/* modal header */}
                    <View style={MyStyles.modal_header}>
                      <Text style={MyStyles.modal_title}>Filter</Text>
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", width: 70 }]} onPress={() => {
                        this.resetFilterStatus();
                      }}>
                        <Text style={{ color: Colors.color_dfdfdf, fontSize: 13, fontWeight: "500", }}>reset</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ filterModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                      </TouchableOpacity>
                    </View>

                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
                    <View style={{ flex: 1 }}>
                      <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                          {/* Main Category */}
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Text style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500" }, MyStyles.modal_close_btn]}>Main Category</Text>
                              <Text style={{ flex: 1, textAlign: "center" }}></Text>
                              <TouchableOpacity style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {
                                this.setState({ main_all_selected: true })
                                this.resetFilterStatus();
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.main_all_selected ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={{ marginLeft: 5 }}>All</Text>
                              </TouchableOpacity>

                            </View>

                            <FlatGrid
                              itemDimension={this.ScreenWidth / 3 - 40}
                              items={this.state.mainCategoryItems}
                              style={MyStyles.gridView}
                              spacing={10}
                              renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => { this.onCategorySelect(item.categoryName) }} style={{ borderColor: item.is_selected == 1 ? "#d9b1db" : Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                  <View style={[{ height: 100 / 3, justifyContent: "center", alignItems: "center" }]}>
                                    {item.is_selected == 2 ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}

                                    {item.is_selected == 2 ?
                                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <Image style={item.image_style_small} source={item.image_on} />
                                        <Text style={[MyStyles.category_text1, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.categoryName}</Text>
                                      </View>
                                      : item.is_selected == 1 ?
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                          <Image style={item.image_style_small} source={item.image_half} />
                                          <Text style={[MyStyles.category_text2, { marginLeft: 5 }]} numberOfLines={1}>{item.categoryName}</Text>
                                        </View>
                                        : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                          <Image style={item.image_style_small} source={item.image_off} />
                                          <Text style={[MyStyles.category_text1, { marginLeft: 5 }]} numberOfLines={1}>{item.categoryName}</Text>
                                        </View>}

                                  </View>
                                </TouchableOpacity>
                              )}
                            />
                          </View>

                          {this.state.showSubCategory ?
                            <View>
                              {/* Sub Categories */}
                              {this.state.main_all_selected ? null :
                                <Text style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500", marginLeft: 15, marginBottom: 20 }]}>Sub Category</Text>
                              }


                              {this.state.mainCategoryItems.map((item, index) => (
                                item.is_selected > 0 && item.sub_category.length > 0 ?
                                  <View key={index} style={{ marginTop: -30 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                      <Text style={[{ color: Colors.primary_purple, fontSize: 12, fontWeight: "400", marginLeft: 15 }]}>{item.categoryName}</Text>
                                      <Text style={{ flex: 1, textAlign: "center" }}></Text>
                                      <TouchableOpacity style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {
                                        this.state.mainCategoryItems[index].sub_all_selected = !this.state.mainCategoryItems[index].sub_all_selected
                                        if (this.state.mainCategoryItems[index].sub_all_selected) {
                                          this.state.mainCategoryItems[index].sub_category.forEach(element => {
                                            element.is_selected = true
                                          })
                                        } else {
                                          this.state.mainCategoryItems[index].sub_category.forEach(element => {
                                            element.is_selected = false
                                          })
                                        }

                                        if (this.state.mainCategoryItems[index].sub_all_selected == false) {
                                          this.state.mainCategoryItems[index].is_selected = 1
                                        } else {
                                          this.state.mainCategoryItems[index].is_selected = 2
                                        }
                                        this.setState({ mainCategoryItems: this.state.mainCategoryItems })
                                      }}>
                                        <Image style={{ width: 14, height: 14 }} source={this.state.mainCategoryItems[index].sub_all_selected ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                        <Text style={{ marginLeft: 5 }}>All</Text>
                                      </TouchableOpacity>
                                    </View>

                                    <FlatGrid
                                      itemDimension={this.ScreenWidth / item.sub_category.length - 40}
                                      items={item.sub_category}
                                      style={[MyStyles.gridView, { marginTop: -20 }]}
                                      spacing={10}
                                      renderItem={({ item: sub_item, index: sub_index }) => (
                                        <TouchableOpacity onPress={() => {
                                          this.state.mainCategoryItems[index].sub_category[sub_index].is_selected = !this.state.mainCategoryItems[index].sub_category[sub_index].is_selected
                                          moreThanOneSelected = false;
                                          sub_all_selected = true;
                                          for (i = 0; i < this.state.mainCategoryItems[index].sub_category.length; i++) {
                                            if (this.state.mainCategoryItems[index].sub_category[i].is_selected == true) {
                                              moreThanOneSelected = true
                                            } else {
                                              sub_all_selected = false
                                            }
                                          }
                                          if (moreThanOneSelected) {
                                            this.state.mainCategoryItems[index].is_selected = 2
                                          } else {
                                            this.state.mainCategoryItems[index].is_selected = 1
                                          }

                                          this.state.mainCategoryItems[index].sub_all_selected = sub_all_selected

                                          this.setState({ mainCategoryItems: this.state.mainCategoryItems })
                                        }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                          <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                            {sub_item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                              {sub_item.is_selected ? <Image style={sub_item.image_style} source={sub_item.image_on} /> : <Image style={sub_item.image_style} source={sub_item.image_off} />}
                                              {sub_item.is_selected ? <Text style={[MyStyles.category_text1, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{sub_item.name}</Text> : <Text style={[MyStyles.category_text1, { marginLeft: 5 }]} numberOfLines={1}>{sub_item.name}</Text>}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      )}
                                    />

                                  </View>
                                  : null))}

                            </View> : null}
                        </View>
                      </ScrollView>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight
                        style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {
                          this.setState({ filterModalVisible: false })
                          this.getRecommendList(0)
                        }}>
                        <Text style={MyStyles.btn_primary}>Refine Search</Text>
                      </TouchableHighlight>
                    </View>
                  </View>

                </View>
              </View>
            </Modal>

            {/* 설문선택 모달 */}
            <QuestionnaireListModal this={this} />
          </ScrollView>
        }

        <LoginModal is_transparent={true} this={this} />
      </View>
    );
  }

  requestRecommendList(p_questionnaire_id, p_category, p_offset) {
    console.log("category= " + p_category);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.recommendList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id,
        category: p_category == null ? "All" : p_category,
        offset: p_offset.toString()
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
          return;
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.recomment_list.length
        if (responseJson.result_data.recomment_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const recomment_list = this.state.product_list_result_data.recomment_list
        result = { recomment_list: [...recomment_list, ...responseJson.result_data.recomment_list] };
        this.setState({ product_list_result_data: result })
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
        this.onProductLiked(p_product_id)

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
        this.onProductUnliked(p_product_id)

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
    this.setState({
      isLoading: true,
    });
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
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        const data = [];

        responseJson.result_data.questionnaire_list.forEach(element => {
          data.push({ value: element.title, id: element.id })
        });

        if (data.length > 0) {
          this.state.selected_questionnaire = data[0]
          this.setState({ selected_questionnaire: this.state.selected_questionnaire })
          this.requestQuestionnaireDetail(this.state.selected_questionnaire.id)
        }
        this.setState({ questionnaire_list: data })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestQuestionnaireDetail(p_questionnaire_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.questionnaireDetail, {
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

        const questionnaireDetail = responseJson.result_data.questionnaire_detail
        this.state.my_age = Common.getAgeFromBirth(questionnaireDetail.birth)
        this.setState({my_age: this.state.my_age})

        if (questionnaireDetail.skin_type != null && questionnaireDetail.skin_type.length > 0) {
          const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == questionnaireDetail.skin_type)
          const w_item = this.state.skin_types[w_index]
          this.state.my_skin_type = w_item
          this.setState(this.state.my_skin_type)
        }
        if (questionnaireDetail.concern != null && questionnaireDetail.concern.length > 0) {
          const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == questionnaireDetail.concern.split(",")[0])
          const w_item = this.state.concern_types[w_index]
          this.state.my_concern = w_item
          this.setState(this.state.my_concern)
        }
        if (questionnaireDetail.needs != null && questionnaireDetail.needs.length > 0) {
          const w_index = this.state.need_types.findIndex(item1 => item1.typeName == questionnaireDetail.needs.split(",")[0])
          const w_item = this.state.need_types[w_index]
          this.state.my_needs = w_item
          this.setState(this.state.my_needs)
        }
        this.getRecommendList(0);


      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
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
        console.log(responseJson);
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

        this.requestQuestionnaireList();


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