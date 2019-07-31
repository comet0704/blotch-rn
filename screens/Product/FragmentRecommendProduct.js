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
import { MyAppText } from '../../components/Texts/MyAppText';
import { NavigationEvents } from 'react-navigation';
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
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import { LoginModal } from '../../components/Modals/LoginModal';
import ModalDropdown from 'react-native-modal-dropdown'
import { ProductItem } from '../../components/Products/ProductItem';

export class FragmentRecommendProduct extends React.Component {

  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = {
      main_all_selected: 1, // 0 => 몇개만 선택, 1 => 전체선택, -1 => 전체 선택해제
      refreshing: false,
      showLoginModal: false,
      filterModalVisible: false,
      refreshFragment: false,

      product_list_result_data: {
        recomment_list: [
        ],
        recomment_count: 0
      },
      mainCategoryItems: Common.categoryItems_recom,
      selected_questionnaire: {
        id: "",
        value: "Me",
      },

      questionnaire_list: [
        // {
        //   id: "",
        //   value: "",
        // }
      ],
      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
      my_age: null,
      my_skin_type: null,
      my_concern: null,
      my_needs: null,
    };

    this.category_array = []
  }

  ScreenWidth = Dimensions.get('window').width;

  componentDidMount() {
    this.onNavigationEvent()
    this.selectAllCategories()
  }

  getRecommendList = (p_offset) => {
    // 전체선택인 경우 All 올려보냄
    if (this.state.main_all_selected > 0) {
      this.requestRecommendList(this.state.selected_questionnaire.id, "All", p_offset)
      return
    }

    this.requestRecommendList(this.state.selected_questionnaire.id, JSON.stringify(this.category_array), p_offset)
  }

  onFilterMainCategorySelect = async (p_catName) => {
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
    this.setCategorySelectStatus()
  }

  onFilterSubCategoryAllSelect = async (p_item) => {
    const w_index = this.state.mainCategoryItems.findIndex(w_item => w_item.categoryName == p_item.categoryName)
    this.state.mainCategoryItems[w_index].sub_all_selected = !this.state.mainCategoryItems[w_index].sub_all_selected
    if (this.state.mainCategoryItems[w_index].sub_all_selected) {
      this.state.mainCategoryItems[w_index].sub_category.forEach(element => {
        element.is_selected = true
      })
    } else {
      this.state.mainCategoryItems[w_index].sub_category.forEach(element => {
        element.is_selected = false
      })
    }

    if (this.state.mainCategoryItems[w_index].sub_all_selected == false) {
      this.state.mainCategoryItems[w_index].is_selected = 1
    } else {
      this.state.mainCategoryItems[w_index].is_selected = 2
    }
    this.setState({ mainCategoryItems: this.state.mainCategoryItems })
    this.setCategorySelectStatus()
  }

  onFilterSubCategorySelect = async (p_item, p_sub_item) => {
    const w_main_index = this.state.mainCategoryItems.findIndex(w_item => w_item.categoryName == p_item.categoryName)
    const w_sub_index = this.state.mainCategoryItems[w_main_index].sub_category.findIndex(w_item1 => w_item1.name == p_sub_item.name)
    this.state.mainCategoryItems[w_main_index].sub_category[w_sub_index].is_selected = !this.state.mainCategoryItems[w_main_index].sub_category[w_sub_index].is_selected
    moreThanOneSelected = false;
    sub_all_selected = true;
    for (i = 0; i < this.state.mainCategoryItems[w_main_index].sub_category.length; i++) {
      if (this.state.mainCategoryItems[w_main_index].sub_category[i].is_selected == true) {
        moreThanOneSelected = true
      } else {
        sub_all_selected = false
      }
    }
    if (moreThanOneSelected) {
      this.state.mainCategoryItems[w_main_index].is_selected = 2
    } else {
      this.state.mainCategoryItems[w_main_index].is_selected = 1
    }

    this.state.mainCategoryItems[w_main_index].sub_all_selected = sub_all_selected

    this.setState({ mainCategoryItems: this.state.mainCategoryItems })
    this.setCategorySelectStatus()
  }

  setCategorySelectStatus = async () => {
    this.state.main_all_selected = 1 // 0 => 몇개만 선택, 1 => 전체선택, -1 => 전체 선택해제
    w_categorySelectCount = 0;
    // p_category 값을 this.state.mainCategoryItems 를 조회하면서 얻어내야함.
    this.category_array = []
    this.state.mainCategoryItems.forEach(element => {
      if (element.is_selected > 0) { // 메인카테고리 선택되었으면
        w_categorySelectCount++ // 하나라도 선택되었는가를 판정하기 위한 값. 0이면 하나도 선택된것이 없으므로 main_all_selected 를 -1 로 만들어 주어야 함.
        if (element.sub_category.length > 0) { // 서브카테고리가 있는가
          temp_array = [];
          element.sub_category.forEach(sub_element => {
            if (sub_element.is_selected) {
              temp_array.push(sub_element.name)
            } else {
              this.state.main_all_selected = 0
            }
          })
          this.category_array.push({ [element.categoryName]: temp_array })
        } else { // 서브카테고리가 없으면
          this.category_array.push({ [element.categoryName]: [] })
        }
      } else {
        this.state.main_all_selected = 0
      }
    })

    if (w_categorySelectCount == 0) { // 실지 선택된 카테고리가 하나도 없으면
      this.state.main_all_selected = -1
    }

    this.setState({ main_all_selected: this.state.main_all_selected })

    await this.setState({ showSubCategory: false })
    this.setState({ showSubCategory: true })
  }


  renderMyInfo() {
    return (
      <View
      >
        <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
          <MyAppText style={{ fontSize: 14, color: Colors.primary_dark, fontWeight: "bold" }}>My Skin Info</MyAppText>
          <View style={{ flex: 1 }}></View>
          <ModalDropdown ref="dropdown_2"
            ref="mModalDropDown"
            style={MyStyles.dropdown_2}
            defaultIndex={this.state.questionnaire_list.findIndex((item) => item.id == global.login_info.questionnaire_id)}
            defaultValue={this.state.selected_questionnaire.value + " ▾"}
            textStyle={MyStyles.dropdown_2_text}
            dropdownStyle={MyStyles.dropdown_2_dropdown}
            options={this.state.questionnaire_list}
            renderButtonText={(rowData) => Common._dropdown_2_renderButtonText(rowData)}
            renderRow={Common._dropdown_2_renderRow.bind(this)}
            onSelect={(idx, rowData) => {
              // rowData : {id:"", value:""}

              this.onQuestionnaireSelected(idx, rowData)
            }}
            renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => Common._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
          />
        </View>
        <View style={{ marginTop: 10, flexDirection: "row" }}>

          {
            this.state.my_age != null && this.state.my_age.length > 0 ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, backgroundColor: Colors.color_f8f8f8, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <MyAppText style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>{this.state.my_age}</MyAppText>
                </View>
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_age}</MyAppText>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <MyAppText style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</MyAppText>
                </View>
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Age</MyAppText>
              </View>
          }
          {
            this.state.my_skin_type != null ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <Image source={this.state.my_skin_type.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_skin_type.typeName}</MyAppText>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <MyAppText style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</MyAppText>
                </View>
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Skin Type</MyAppText>
              </View>
          }

          {
            this.state.my_concern != null ?
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <Image source={this.state.my_concern.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_concern.typeName}</MyAppText>
              </View>
              :
              <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <MyAppText style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</MyAppText>
                </View>
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Concern</MyAppText>
              </View>
          }

          {
            this.state.my_needs != null ?
              <View style={[{}, MyStyles.skin_info_container]}>
                <Image source={this.state.my_needs.image_off} style={[{ alignSelf: "center" }, MyStyles.skin_info_image]} />
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>{this.state.my_needs.typeName}</MyAppText>
              </View>
              :
              <View style={[{}, MyStyles.skin_info_container]}>
                <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, borderWidth: 0.5, justifyContent: "center", alignItems: "center" }, MyStyles.skin_info_image]}>
                  <MyAppText style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>N</MyAppText>
                </View>
                <MyAppText style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>Needs</MyAppText>
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

  selectAllCategories = async () => {
    for (i = 0; i < this.state.mainCategoryItems.length; i++) {
      this.state.mainCategoryItems[i].is_selected = 2
      this.state.mainCategoryItems[i].sub_all_selected = 1
      for (j = 0; j < this.state.mainCategoryItems[i].sub_category.length; j++) {
        this.state.mainCategoryItems[i].sub_category[j].is_selected = true
      }
    }

    this.setState({ mainCategoryItems: this.state.mainCategoryItems })

    this.setCategorySelectStatus();
  }

  resetFilterStatus = async () => {
    for (i = 0; i < this.state.mainCategoryItems.length; i++) {
      this.state.mainCategoryItems[i].is_selected = 0
      this.state.mainCategoryItems[i].sub_all_selected = 0
      for (j = 0; j < this.state.mainCategoryItems[i].sub_category.length; j++) {
        this.state.mainCategoryItems[i].sub_category[j].is_selected = 0
      }
    }

    this.setState({ mainCategoryItems: this.state.mainCategoryItems })

    this.setCategorySelectStatus()
  }

  onQuestionnaireSelected(idx, rowData) {
    this.state.selected_questionnaire = rowData
    this.setState({ selected_questionnaire: this.state.selected_questionnaire })
    this.requestQuestionnaireDetail(this.state.selected_questionnaire.id)
    global.login_info.questionnaire_id = this.state.selected_questionnaire.id
    global.refreshStatus.ingredient = true
    global.refreshStatus.mypage = true
  }

  onWeCanSearchItCallback = (p_skin_type, p_concern, p_needs) => {
    // WecanSeachit에서 입력한 정보들로 메인 questionnaire를 만들어주자.
    this.requestUpdateQuestionnaireItem("Me", p_skin_type, p_concern, p_needs)
  }

  onNavigationEvent = () => {
    if (global.login_info.token == "") {
    } else {
      if (Common.isNeedToAddQuestionnaire() == false && global.refreshStatus.product_recommend == true) { // 이미 설문이 추가된 회원이면 설문목록 얻어오기
        global.refreshStatus.product_recommend = false
        this.setState({ refreshFragment: !this.state.refreshFragment });
        this.requestQuestionnaireList();
      }
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.requestQuestionnaireList()
  }

  renderNoResult = () => {
    return (<View>
      <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
      <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <Image source={require("../../assets/images/ic_search_big.png")} style={[MyStyles.ic_search_big,]} />
          <MyAppText style={{ fontSize: 69 / 3, color: Colors.primary_dark, textAlign: "center", marginTop: 30, fontWeight: "bold" }}>Sorry, no result found</MyAppText>
          <MyAppText style={[{ fontSize: 39 / 3, color: Colors.color_c2c1c1, textAlign: "center", marginTop: 10 }, MyStyles.padding_h_main]}>Tell us about your skin and we'll show you some products that you might want to check out!</MyAppText>
          <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 460 / 3, height: 130 / 3, marginTop: 100 / 3 }]} onPress=
            {() => {
              if (global.login_info.token.length <= 0) {
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
            <MyAppText style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Check Out!</MyAppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    )
  }

  renderMainScreen = () => {
    return (<ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
      onScroll={({ nativeEvent }) => {
        if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
          this.isLoading = true
          this.getRecommendList(this.offset)
        }
      }}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }
    >

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
            <MyAppText style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product({this.state.product_list_result_data.recomment_count})</MyAppText>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main,]} onPress={() => { this.setState({ filterModalVisible: true }) }}>
              <Image source={require("../../assets/images/ic_filter.png")} style={[MyStyles.ic_filter]} />
            </TouchableOpacity>
          </View>
          <FlatGrid
            itemDimension={this.ScreenWidth / 2 - 30}
            items={this.state.product_list_result_data.recomment_list}
            style={MyStyles.gridView}
            spacing={10}
            renderItem={({ item, index }) => (
              <ProductItem item={item} index={index} this={this}></ProductItem>
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
                <MyAppText style={MyStyles.modal_title}>Filter</MyAppText>
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", width: 70 }]} onPress={() => {
                  this.resetFilterStatus();
                }}>
                  <MyAppText style={{ color: Colors.color_dfdfdf, fontSize: 13, fontWeight: "500", }}>reset</MyAppText>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
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
                        <MyAppText style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500" }, MyStyles.modal_close_btn]}>Main Category</MyAppText>
                        <MyAppText style={{ flex: 1, textAlign: "center" }}></MyAppText>
                        <TouchableOpacity activeOpacity={0.8} style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {
                          this.selectAllCategories();
                        }}>
                          <Image style={{ width: 14, height: 14 }} source={this.state.main_all_selected == 1 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                          <MyAppText style={{ marginLeft: 5 }}>All</MyAppText>
                        </TouchableOpacity>

                      </View>

                      <FlatGrid
                        itemDimension={this.ScreenWidth / 3 - 40}
                        items={this.state.mainCategoryItems}
                        style={MyStyles.gridView}
                        spacing={10}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity activeOpacity={0.8} onPress={() => { this.onFilterMainCategorySelect(item.categoryName) }} style={{ borderColor: item.is_selected == 1 ? "#d9b1db" : Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                            <View style={[{ height: 100 / 3, justifyContent: "center", alignItems: "center" }]}>
                              {item.is_selected == 2 ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}

                              {item.is_selected == 2 ?
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                  <Image style={item.image_style_small} source={item.image_on} />
                                  <MyAppText style={[MyStyles.category_text1, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.categoryName}</MyAppText>
                                </View>
                                : item.is_selected == 1 ?
                                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <Image style={item.image_style_small} source={item.image_half} />
                                    <MyAppText style={[MyStyles.category_text2, { marginLeft: 5 }]} numberOfLines={1}>{item.categoryName}</MyAppText>
                                  </View>
                                  : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <Image style={item.image_style_small} source={item.image_off} />
                                    <MyAppText style={[MyStyles.category_text1, { marginLeft: 5 }]} numberOfLines={1}>{item.categoryName}</MyAppText>
                                  </View>}

                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    </View>

                    {this.state.showSubCategory ?
                      <View>
                        {/* Sub Categories */}
                        {this.state.main_all_selected == -1 ? null :
                          <MyAppText style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500", marginLeft: 15, marginBottom: 20 }]}>Sub Category</MyAppText>
                        }


                        {this.state.mainCategoryItems.map((item, index) => (
                          item.is_selected > 0 && item.sub_category.length > 0 ?
                            <View key={index} style={{ marginTop: -30 }}>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MyAppText style={[{ color: Colors.primary_purple, fontSize: 12, fontWeight: "400", marginLeft: 15 }]}>{item.categoryName}</MyAppText>
                                <MyAppText style={{ flex: 1, textAlign: "center" }}></MyAppText>
                                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {

                                  this.onFilterSubCategoryAllSelect(item)
                                }}>
                                  <Image style={{ width: 14, height: 14 }} source={item.sub_all_selected ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                  <MyAppText style={{ marginLeft: 5 }}>All</MyAppText>
                                </TouchableOpacity>
                              </View>

                              <FlatGrid
                                itemDimension={this.ScreenWidth / item.sub_category.length - 40}
                                items={item.sub_category}
                                style={[MyStyles.gridView, { marginTop: -20 }]}
                                spacing={10}
                                renderItem={({ item: sub_item, index: sub_index }) => (
                                  <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    this.onFilterSubCategorySelect(item, sub_item)

                                  }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                    <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                      {sub_item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        {sub_item.is_selected ? <Image style={sub_item.image_style} source={sub_item.image_on} /> : <Image style={sub_item.image_style} source={sub_item.image_off} />}
                                        {sub_item.is_selected ? <MyAppText style={[MyStyles.category_text1, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{sub_item.name}</MyAppText> : <MyAppText style={[MyStyles.category_text1, { marginLeft: 5 }]} numberOfLines={1}>{sub_item.name}</MyAppText>}
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
                  style={[MyStyles.dlg_btn_primary_cover]} onPress={() => {
                    this.setState({ filterModalVisible: false })
                    this.getRecommendList(0)
                  }}>
                  <MyAppText style={MyStyles.btn_primary}>Refine Search</MyAppText>
                </TouchableHighlight>
              </View>
            </View>

          </View>
        </View>
      </Modal>

    </ScrollView>
    )
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
        {this.state.refreshFragment ?
          [global.login_info.token.length <= 0 || Common.isNeedToAddQuestionnaire() ?
            this.renderNoResult()
            :
            this.renderMainScreen()
          ] :
          [global.login_info.token.length <= 0 || Common.isNeedToAddQuestionnaire() ?
            this.renderNoResult()
            :
            this.renderMainScreen()
          ]
        }

        <LoginModal is_transparent={true} this={this} />
      </View>
    );
  }

  requestRecommendList(p_questionnaire_id, p_category, p_offset) {
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
        this.setState({ product_list_result_data: result }, () => {
          this.isLoading = false
        })
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
        this.onProductLiked(p_product_id)
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
        this.onProductUnliked(p_product_id)
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        const data = [];

        responseJson.result_data.questionnaire_list.forEach(element => {
          data.push({ value: element.title, id: element.id })
        });

        // 전반적으로 선택된 인원 같이 변경해야 하므로
        w_selectedQueIdx = data.findIndex((item) => item.id == global.login_info.questionnaire_id)
        this.refs.mModalDropDown.select(w_selectedQueIdx)

        if (data.length > 0) {
          this.state.selected_questionnaire = data[w_selectedQueIdx]
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
    // this.setState({
    //   isLoading: true,
    // });
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        const questionnaireDetail = responseJson.result_data.questionnaire_detail
        this.state.my_age = Common.getAgeFromBirth(questionnaireDetail.birth)
        this.setState({ my_age: this.state.my_age })

        if (questionnaireDetail.skin_type != null && questionnaireDetail.skin_type.length > 0) {
          const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == questionnaireDetail.skin_type)
          const w_item = this.state.skin_types[w_index]
          this.state.my_skin_type = w_item
          this.setState({ my_skin_type: this.state.my_skin_type })
        } else {
          this.state.my_skin_type = null
          this.setState({ my_skin_type: null })
        }

        if (questionnaireDetail.concern != null && questionnaireDetail.concern.length > 0) {
          const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == questionnaireDetail.concern.split(",")[0])
          const w_item = this.state.concern_types[w_index]
          this.state.my_concern = w_item
          this.setState({ my_concern: this.state.my_concern })
        } else {
          this.state.my_concern = null
          this.setState({ my_concern: null })
        }

        if (questionnaireDetail.needs != null && questionnaireDetail.needs.length > 0) {
          const w_index = this.state.need_types.findIndex(item1 => item1.typeName == questionnaireDetail.needs.split(",")[0])
          const w_item = this.state.need_types[w_index]
          this.state.my_needs = w_item
          this.setState({ my_needs: this.state.my_needs })
        } else {
          this.state.my_needs = null
          this.setState({ my_needs: null })
        }

        this.setState({ refreshing: false });
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

  requestUpdateQuestionnaireItem(p_questionnaire_id, p_skin_type, p_concern, p_needs) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.updateQuestionnaireItem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id.toString(),
        title: "Me",
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