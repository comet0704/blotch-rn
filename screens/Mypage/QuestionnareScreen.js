import { Updates } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dropdown } from 'react-native-material-dropdown';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { BrandItem } from '../../components/Search/BrandItem';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';
import GlobalState from "../../store/GlobalState";


export default class QuestionnareScreen extends React.Component {

  constructor(props) {
    super(props);
    this.qnaCompleted = false
    this.state = {
      section_basic_info: false,
      section_skin_type: false,
      section_product_reference: false,
      section_skin_routine: false,

      noCompletedQuestionnaireModalVisible: false,
      countrySelectModalVisible: false,
      addBabyModalVisible: false,
      searchBrandModalVisible: false,

      searchBrandForFavorite: true, // brand_favorite_list에 brand추가를 위해 띄워주면 true, brand_mostly_list에 brand 추가를 위해 띄워주면 false
      selected_brand_item: {}, // 브랜드 검색 모달에서 선택된 브랜드 객체.
      country_list: [],
      edit_baby_id: 0, // 0  이면 add_baby, > 0 이면 edit_baby
      request_list_name: "",
      beforeBabyIdx: 0,
      morningRoutineSelected: true,
      search_brand_list: [

      ],
      questionnaire_detail: {
        "id": "",
        "uid": "",
        "title": "",
        "birth": "",
        "gender": "",
        "location": "",
        "marital_status": "N",
        "is_kids": "N",
        "skin_type": "",
        "needs": "",
        "concern": "",
        "brand_favourite": "",
        "brand_mostly": "",
        "buy_products_from": 0,
        "product_count_in_day": 0,
        "time_for_care": 0,
        "skincare_routine_morning": null,
        "skincare_routine_night": null,
        "create_date": "0000-00-00 00:00:00",
        "update_date": null,
        "brand_favourite_list": [
          // {
          //   "id": 1,
          //   "title": "LUSH",
          //   "information": "",
          //   "image": "uploads/brand/logo_01.jpg",
          //   "like_count": 1,
          //   "is_liked": 9
          // }
        ],
        "brand_mostly_list": [
          // {
          //   "id": 2,
          //   "title": "BEAUTY",
          //   "information": "",
          //   "image": "uploads/brand/logo_02.jpg",
          //   "like_count": 0,
          //   "is_liked": 1
          // }
        ]
      },

      questionnaire_list: [

      ],

      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
      morning_cleansing_types: Common.getCleansingTypes(),
      morning_care_types: Common.getCareTypes(),
      night_cleansing_types: Common.getCleansingTypes(),
      night_care_types: Common.getCareTypes(),
    };
  }

  componentDidMount() {
    is_from_sign_up = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.is_from_sign_up) // 회원가입후 곧장 넘어왓는지 체크

    this.requestQuestionnaireList()
    this.requestCountryList()

    // questionnaire에 들어왔댔으면 기본 설문 변경여부에 상관없이 ingredient와 product_recommend 화면을 재그리기 시키자
    global.refreshStatus.ingredient = true
    global.refreshStatus.product_recommend = true
    global.refreshStatus.mypage = true
  }

  ScreenWidth = Dimensions.get('window').width;
  onBabySelected = (p_babyName) => {
    const questionnaire_list = [...this.state.questionnaire_list]
    const index = questionnaire_list.findIndex(item => item.title === p_babyName)
    if (index == this.state.beforeBabyIdx) {// 선택했떤것을 또 선택했을때는 Questionnaire 편집으로 진행
      this.setState({ edit_baby_id: questionnaire_list[index].id, request_list_name: questionnaire_list[index].title, addBabyModalVisible: true })
      return
    }
    questionnaire_list[this.state.beforeBabyIdx].is_selected = false
    questionnaire_list[index].is_selected = true
    this.state.beforeBabyIdx = index
    this.setState({ questionnaire_list: questionnaire_list, edit_baby_id: questionnaire_list[index].id })
    this.setState({ loading_end: false })
    this.requestQuestionnaireDetail(this.state.questionnaire_list[index].id)
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
            <View key={item.id} style={{ marginRight: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => { this.onBabySelected(item.title) }} style={[item.is_selected ? MyStyles.baby_container_selected1 : MyStyles.baby_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <MyAppText style={MyStyles.baby_text_selected} numberOfLines={1}>{item.title}</MyAppText> : <MyAppText style={MyStyles.baby_text} numberOfLines={1}>{item.title}</MyAppText>}
              </TouchableOpacity>
            </View>
          ))}

          {/* 목록 다 돌린 후에는  추가버튼 추가*/}
          <View style={{ marginRight: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {
              this.setState({ edit_baby_id: 0, request_list_name: "", addBabyModalVisible: true })
            }
            } style={[MyStyles.baby_container]}>
              <MyAppText style={[MyStyles.baby_text, { fontSize: 25 }]} numberOfLines={1}>+</MyAppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  addQuestionnaire() {
    if (this.state.request_list_name == "") {
      this.refs.modal_toast.showTop("Please input name");
      return;
    }
    this.setState({ addBabyModalVisible: false });
    this.requestAddQuestionnaireItem(this.state.request_list_name)
  }

  checkCompleteStatus() {
    if (this.state.questionnaire_detail.birth != null &&
      this.state.questionnaire_detail.birth.length > 0 &&
      this.state.questionnaire_detail.gender != null &&
      this.state.questionnaire_detail.gender.length > 0 &&
      this.state.questionnaire_detail.location != null &&
      this.state.questionnaire_detail.location.length > 0 &&
      this.state.questionnaire_detail.is_kids != null &&
      this.state.questionnaire_detail.is_kids.length > 0 &&
      this.state.questionnaire_detail.skin_type != null &&
      this.state.questionnaire_detail.skin_type.length > 0 &&
      this.state.questionnaire_detail.concern != null &&
      this.state.questionnaire_detail.concern.length > 0 &&
      this.state.questionnaire_detail.needs != null &&
      this.state.questionnaire_detail.needs.length > 0 &&
      this.state.questionnaire_detail.brand_favourite_list != null &&
      this.state.questionnaire_detail.brand_favourite_list.length > 0 &&
      this.state.questionnaire_detail.brand_mostly_list != null &&
      this.state.questionnaire_detail.brand_mostly_list.length > 0 &&
      this.state.questionnaire_detail.buy_products_from != null &&
      this.state.questionnaire_detail.buy_products_from > 0 &&
      this.state.questionnaire_detail.product_count_in_day != null &&
      this.state.questionnaire_detail.product_count_in_day > 0 &&
      this.state.questionnaire_detail.time_for_care != null &&
      this.state.questionnaire_detail.time_for_care > 0 &&
      this.state.morning_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
      this.state.morning_care_types.findIndex(item => item.is_selected == true) >= 0 &&
      this.state.night_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
      this.state.night_care_types.findIndex(item => item.is_selected == true) >= 0) {
      this.qnaCompleted = true
      this.updateQuestionnaireItem()
    } else {
      this.setState({ noCompletedQuestionnaireModalVisible: true })
      this.qnaCompleted = false
    }
  }

  updateQuestionnaireItem() {
    // 반점으로 구분하여 돌려줘야 하는 값들
    updateBrandFavorite = ""
    updateBrandMostly = ""
    updateMorningCleansing = ""
    updateMorningCare = ""
    updateNightCleansing = ""
    updateNightCare = ""

    this.state.questionnaire_detail.brand_favourite_list.map((item, index) => {
      if (updateBrandFavorite != "") {
        updateBrandFavorite += ","
      }
      updateBrandFavorite += item.id
    })
    this.state.questionnaire_detail.brand_favourite = updateBrandFavorite

    this.state.questionnaire_detail.brand_mostly_list.map((item, index) => {
      if (updateBrandMostly != "") {
        updateBrandMostly += ","
      }
      updateBrandMostly += item.id
    })
    this.state.questionnaire_detail.brand_mostly = updateBrandMostly


    this.state.morning_cleansing_types.map((item, index) => {
      if (item.is_selected) {
        if (updateMorningCleansing != "") {
          updateMorningCleansing += ","
        }
        updateMorningCleansing += item.typeName
      }
    })
    this.state.questionnaire_detail.morning_cleansing = updateMorningCleansing

    this.state.morning_care_types.map((item, index) => {
      if (item.is_selected) {
        if (updateMorningCare != "") {
          updateMorningCare += ","
        }
        updateMorningCare += item.typeName
      }
    })
    this.state.questionnaire_detail.morning_care = updateMorningCare

    this.state.night_cleansing_types.map((item, index) => {
      if (item.is_selected) {
        if (updateNightCleansing != "") {
          updateNightCleansing += ","
        }
        updateNightCleansing += item.typeName
      }
    })
    this.state.questionnaire_detail.night_cleansing = updateNightCleansing

    this.state.night_care_types.map((item, index) => {
      if (item.is_selected) {
        if (updateNightCare != "") {
          updateNightCare += ","
        }
        updateNightCare += item.typeName
      }
    })
    this.state.questionnaire_detail.night_care = updateNightCare

    this.setState(this.state.questionnaire_detail)

    this.requestUpdateQuestionnaireItem()

  }

  onDaySelect = (selectedDay) => {
    this.state.questionnaire_detail.birth = selectedDay.dateString
    this.setState(this.state.questionnaire_detail)
  }
  onBrandSelect = (p_brand_item) => {
    // 여기서는 오직 하나만 선택되어야 함
    this.state.search_brand_list.forEach(element => {
      element.is_selected = false
    })
    const w_index = this.state.search_brand_list.findIndex(p_item => p_item.id === p_brand_item.id)
    this.state.search_brand_list[w_index].is_selected = true
    this.setState(this.state.search_brand_list)
    this.setState({ selected_brand_item: p_brand_item })
  }

  onWeCanSearchItCallback = (p_skin_type, p_concern, p_needs) => {
    this.state.questionnaire_detail.skin_type = p_skin_type
    this.state.questionnaire_detail.concern = p_concern
    this.state.questionnaire_detail.needs = p_needs
    this.setState(this.state.questionnaire_detail)
  }

  // 브랜드 검색 팝업에서 검색결과현시에 이용
  renderBrandsScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.search_brand_list.map(item => (
            <BrandItem is_add_modal={true} key={item.id} item_width={235 / 3} item={item} this={this} />
          ))}
        </ScrollView>
      </View>
    );
  }


  render() {

    return (
      <View style={{ flex: 1, backgroundColor: Colors.color_f8f8f8 }}>
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

          <TopbarWithBlackBack title="Questionnaire" onPress={() => {
            if (is_from_sign_up) {
              // 로그인 되었으면 상태변경
              GlobalState.loginStatus = 1
            } else {
              this.props.navigation.goBack()
            }
          }}></TopbarWithBlackBack>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={{ backgroundColor: Colors.color_f8f8f8 }}>
              {/* 카테고리 나열 부분 */}
              <View style={{
                backgroundColor: Colors.color_f8f8f8,
                padding: 15,
                height: 330 / 3
              }}>
                {
                  this.renderMyBabies()
                }
              </View>

              {this.state.questionnaire_list.length > 0 ?
                <View>
                  {/* Step 01 : Basic Info */}
                  <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section, { marginTop: 0 }]}>
                    <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_basic_info: true })
                      this.setState({ section_skin_type: false })
                      this.setState({ section_product_reference: false })
                      this.setState({ section_skin_routine: false })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_basic_info ?
                          <MyAppText style={[MyStyles.question_section_opened]}>Step 01</MyAppText>
                          : <MyAppText style={[MyStyles.question_section_closed]}>Step 01</MyAppText>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Basic Info</MyAppText>
                          { // 섹션1 완성상태 체크
                            this.state.questionnaire_detail.birth != null &&
                              this.state.questionnaire_detail.birth.length > 0 &&
                              this.state.questionnaire_detail.gender != null &&
                              this.state.questionnaire_detail.gender.length > 0 &&
                              this.state.questionnaire_detail.location != null &&
                              this.state.questionnaire_detail.location.length > 0 &&
                              this.state.questionnaire_detail.is_kids != null &&
                              this.state.questionnaire_detail.is_kids.length > 0 ?
                              <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} />
                              : null
                          }
                        </View>
                      </View>
                      { // 섹션1 완성상태 체크
                        this.state.questionnaire_detail.birth != null &&
                          this.state.questionnaire_detail.birth.length > 0 &&
                          this.state.questionnaire_detail.gender != null &&
                          this.state.questionnaire_detail.gender.length > 0 &&
                          this.state.questionnaire_detail.location != null &&
                          this.state.questionnaire_detail.location.length > 0 &&
                          this.state.questionnaire_detail.is_kids != null &&
                          this.state.questionnaire_detail.is_kids.length > 0 ?
                          <Image source={require("../../assets/images/ic_hidden_chk_mark.png")} style={[MyStyles.ic_hidden_chk_mark, { position: "absolute", right: -65 / 3 }]} />
                          : null
                      }
                    </TouchableOpacity>

                    {
                      this.state.section_basic_info ?
                        <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                        : null}

                    {
                      this.state.section_basic_info ?
                        <View style={[MyStyles.padding_main]}>
                          {/* Day of Birth */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Date of Birth</MyAppText>
                            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect, [MyConstants.NAVIGATION_PARAMS.selectedDate]: this.state.questionnaire_detail.birth, [MyConstants.NAVIGATION_PARAMS.isFromQuestionnaire]: true })}>
                              <TextInput value={this.state.questionnaire_detail.birth} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="YYYY - MM - DD" />
                              <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
                            </TouchableOpacity>
                          </View>
                          {/* Gender */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Gender</MyAppText>
                            <View style={{ marginTop: 10, flexDirection: "row" }}>

                              {this.state.questionnaire_detail.gender == "F" ?
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_on}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "F"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }
                                >
                                  <Image source={require("../../assets/images/ic_gender_female_on.png")} style={[MyStyles.ic_gender_female]} />
                                  <MyAppText style={{ fontSize: 12, marginTop: 5, color: Colors.color_primary_pink }}>Female</MyAppText>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_off}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "F"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }
                                >
                                  <Image source={require("../../assets/images/ic_gender_female.png")} style={[MyStyles.ic_gender_female]} />
                                  <MyAppText style={{ fontSize: 12, marginTop: 5, color: Colors.color_e3e5e4 }}>Female</MyAppText>
                                </TouchableOpacity>
                              }


                              <View style={{ flex: 1 }} />

                              {this.state.questionnaire_detail.gender == "M" ?
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_on}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "M"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }>
                                  <Image source={require("../../assets/images/ic_gender_male_on.png")} style={[MyStyles.ic_gender_male]} />
                                  <MyAppText style={{ fontSize: 12, marginTop: 5, color: Colors.color_primary_pink }}>Male</MyAppText>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_off}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "M"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }>
                                  <Image source={require("../../assets/images/ic_gender_male.png")} style={[MyStyles.ic_gender_male]} />
                                  <MyAppText style={{ fontSize: 12, marginTop: 5, color: Colors.color_e3e5e4 }}>Male</MyAppText>
                                </TouchableOpacity>
                              }


                              <View style={{ flex: 1 }} />

                              {this.state.questionnaire_detail.gender == "U" ?
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_on}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "U"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }>
                                  <Image source={require("../../assets/images/ic_gender_unspecified_on.png")} style={[MyStyles.ic_gender_unspecified, { marginTop: 31 / 6 }]} />

                                  <MyAppText style={{ fontSize: 12, marginTop: 5 + 31 / 6, color: Colors.color_primary_pink }}>Unspecitied</MyAppText>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.8} style={MyStyles.question_gender_off}
                                  onPress={() => {
                                    this.state.questionnaire_detail.gender = "U"
                                    this.setState(this.state.questionnaire_detail)
                                  }
                                  }>
                                  <Image source={require("../../assets/images/ic_gender_unspecified.png")} style={[MyStyles.ic_gender_unspecified, { marginTop: 31 / 6 }]} />
                                  <MyAppText style={{ fontSize: 12, marginTop: 5 + 31 / 6, color: Colors.color_e3e5e4 }}>Unspecitied</MyAppText>
                                </TouchableOpacity>
                              }
                            </View>
                          </View>

                          {/* Area */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Area</MyAppText>
                            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ countrySelectModalVisible: true }) }}>
                              <TextInput value={this.state.questionnaire_detail.location} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="Seoul, Kor" />
                              <Image source={require("../../assets/images/ic_search_medium.png")} style={[MyStyles.ic_search_medium]} />
                            </TouchableOpacity>
                          </View>

                          {/* Marriage status */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Marriage status</MyAppText>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.marital_status = "Y",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.marital_status == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Yes</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.marital_status = "N",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.marital_status == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>No</MyAppText>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Descendant */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Descendant</MyAppText>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.is_kids = "Y",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.is_kids == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Yes</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.is_kids = "N",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.is_kids == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>No</MyAppText>
                              </TouchableOpacity>
                            </View>
                          </View>


                        </View>
                        : null
                    }
                  </View>

                  {/* Step 02 : My Skin Type */}
                  <View style={[{ borderLeftColor: Colors.primary_purple, }, MyStyles.ingredient_section, { marginTop: 5, }]}>
                    <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_basic_info: false })
                      this.setState({ section_skin_type: true })
                      this.setState({ section_product_reference: false })
                      this.setState({ section_skin_routine: false })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_skin_type ?
                          <MyAppText style={[MyStyles.question_section_opened]}>Step 02</MyAppText>
                          : <MyAppText style={[MyStyles.question_section_closed]}>Step 02</MyAppText>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <MyAppText style={[MyStyles.ingredient_section_header_text1]}>My Skin Type</MyAppText>

                          { // 섹션2 완성상태 체크
                            this.state.questionnaire_detail.skin_type != null &&
                              this.state.questionnaire_detail.skin_type.length > 0 &&
                              this.state.questionnaire_detail.concern != null &&
                              this.state.questionnaire_detail.concern.length > 0 &&
                              this.state.questionnaire_detail.needs != null &&
                              this.state.questionnaire_detail.needs.length > 0 ?
                              <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} /> : null
                          }
                        </View>
                      </View>
                      { // 섹션2 완성상태 체크
                        this.state.questionnaire_detail.skin_type != null &&
                          this.state.questionnaire_detail.skin_type.length > 0 &&
                          this.state.questionnaire_detail.concern != null &&
                          this.state.questionnaire_detail.concern.length > 0 &&
                          this.state.questionnaire_detail.needs != null &&
                          this.state.questionnaire_detail.needs.length > 0 ?
                          <Image source={require("../../assets/images/ic_hidden_chk_mark.png")} style={[MyStyles.ic_hidden_chk_mark, { position: "absolute", right: -65 / 3 }]} />
                          : null
                      }
                    </TouchableOpacity>
                    {
                      this.state.section_skin_type ?
                        <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                        : null}

                    {
                      this.state.section_skin_type ?
                        <View style={[MyStyles.padding_main, { minHeight: 300 / 3 }]}>
                          {/* My skin is */}
                          {this.state.questionnaire_detail.skin_type != null && this.state.questionnaire_detail.skin_type.length > 0 ?
                            <View>
                              <MyAppText style={[MyStyles.question_sub_text1]}>My skin is</MyAppText>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.skin_type.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}
                                  renderItem={({ item, index }) => {
                                    // this.state.skin_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.skin_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <MyAppText style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</MyAppText>
                                      </View>
                                    )
                                  }}
                                />
                              </View>
                            </View>
                            :
                            null
                          }

                          {/* I'm unhappy about my */}
                          {this.state.questionnaire_detail.concern != null && this.state.questionnaire_detail.concern.length > 0 ?
                            <View>
                              <MyAppText style={[MyStyles.question_sub_text1]}>I'm unhappy about my</MyAppText>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.concern.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}
                                  renderItem={({ item, index }) => {
                                    // this.state.concern_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.concern_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <MyAppText style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</MyAppText>
                                      </View>
                                    )
                                  }}
                                />
                              </View>
                            </View>
                            :
                            null
                          }

                          {/* I'm interested in */}
                          {this.state.questionnaire_detail.needs != null && this.state.questionnaire_detail.needs.length > 0 ?
                            <View>
                              <MyAppText style={[MyStyles.question_sub_text1]}>I'm interested in</MyAppText>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.needs.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}
                                  renderItem={({ item, index }) => {
                                    // this.state.need_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.need_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.need_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <MyAppText style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</MyAppText>
                                      </View>
                                    )
                                  }}
                                />
                              </View>
                            </View>
                            :
                            null
                          }


                          <View style={{ position: "absolute", overflow: "hidden", top: 0, bottom: 0, right: 0, justifyContent: "center" }}>
                            <TouchableOpacity activeOpacity={0.8} style={{ marginRight: -190 / 6, width: 190 / 3, height: 190 / 3, justifyContent: "center", backgroundColor: Colors.primary_purple, borderRadius: 190 }}
                              onPress={() => {
                                this.props.navigation.navigate("WeCanSearchIt", {
                                  [MyConstants.NAVIGATION_PARAMS.questionnaire_skin_type]: this.state.questionnaire_detail.skin_type,
                                  [MyConstants.NAVIGATION_PARAMS.questionnaire_concern]: this.state.questionnaire_detail.concern,
                                  [MyConstants.NAVIGATION_PARAMS.questionnaire_needs]: this.state.questionnaire_detail.needs,
                                  [MyConstants.NAVIGATION_PARAMS.onWeCanSearchItCallback]: this.onWeCanSearchItCallback, // 스킨타입 입력하고 돌아오는 콜백
                                })
                              }}
                            >
                              <Image source={require("../../assets/images/ic_arrow_right_white.png")} style={[MyStyles.ic_arrow_right_white, { marginLeft: 40 / 3 }]} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        : null
                    }
                  </View>

                  {/* Step 03 : My Skin Type */}
                  <View style={[{ borderLeftColor: Colors.primary_purple, }, MyStyles.ingredient_section, { marginTop: 5, }]}>
                    <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_basic_info: false })
                      this.setState({ section_skin_type: false })
                      this.setState({ section_product_reference: true })
                      this.setState({ section_skin_routine: false })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_product_reference ?
                          <MyAppText style={[MyStyles.question_section_opened]}>Step 03</MyAppText>
                          : <MyAppText style={[MyStyles.question_section_closed]}>Step 03</MyAppText>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <MyAppText style={[MyStyles.ingredient_section_header_text1]}>Product Preference</MyAppText>
                          { // 섹션3 완성상태 체크
                            this.state.questionnaire_detail.brand_favourite_list != null &&
                              this.state.questionnaire_detail.brand_favourite_list.length > 0 &&
                              this.state.questionnaire_detail.brand_mostly_list != null &&
                              this.state.questionnaire_detail.brand_mostly_list.length > 0 &&
                              this.state.questionnaire_detail.buy_products_from != null &&
                              this.state.questionnaire_detail.buy_products_from > 0 &&
                              this.state.questionnaire_detail.product_count_in_day != null &&
                              this.state.questionnaire_detail.product_count_in_day > 0 &&
                              this.state.questionnaire_detail.time_for_care != null &&
                              this.state.questionnaire_detail.time_for_care > 0 ?
                              <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} /> : null
                          }
                        </View>
                      </View>
                      { // 섹션3 완성상태 체크
                        this.state.questionnaire_detail.brand_favourite_list != null &&
                          this.state.questionnaire_detail.brand_favourite_list.length > 0 &&
                          this.state.questionnaire_detail.brand_mostly_list != null &&
                          this.state.questionnaire_detail.brand_mostly_list.length > 0 &&
                          this.state.questionnaire_detail.buy_products_from != null &&
                          this.state.questionnaire_detail.buy_products_from > 0 &&
                          this.state.questionnaire_detail.product_count_in_day != null &&
                          this.state.questionnaire_detail.product_count_in_day > 0 &&
                          this.state.questionnaire_detail.time_for_care != null &&
                          this.state.questionnaire_detail.time_for_care > 0 ?
                          <Image source={require("../../assets/images/ic_hidden_chk_mark.png")} style={[MyStyles.ic_hidden_chk_mark, { position: "absolute", right: -65 / 3 }]} />
                          : null
                      }
                    </TouchableOpacity>
                    {
                      this.state.section_product_reference ?
                        <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                        :
                        null}

                    {
                      this.state.section_product_reference ?
                        <View style={[MyStyles.padding_main]}>
                          {/* Favorite Brands */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Favorite Brands</MyAppText>
                            <ScrollView
                              horizontal
                              style={[{ flex: 1, }]}
                              showsHorizontalScrollIndicator={false}>

                              <View style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_v_5]}>
                                {this.state.questionnaire_detail.brand_favourite_list.map((item) =>
                                  (
                                    <TouchableOpacity key={item.id} style={[{ marginRight: 15 }]} onPress={() => { this.props.navigation.navigate("SearchBrandDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                                      <ImageLoad style={{ width: 30, height: 30, borderWidth: 0.5, borderLeftColor: Colors.color_e3e5e4, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image) }} />
                                      <TouchableOpacity activeOpacity={0.8} style={{ position: "absolute", top: 0, right: 0, padding: 5, borderRadius: 10, overflow: "hidden", backgroundColor: Colors.primary_purple }}
                                        onPress={() => {
                                          const brand_favourite_list = this.state.questionnaire_detail.brand_favourite_list
                                          const index = brand_favourite_list.findIndex(item1 => item1.id === item.id)
                                          // 목록을 없애주고
                                          brand_favourite_list.splice(index, 1)
                                          // brand_favorite 에서 해당 아이디를 삭제해준다.
                                          const brand_favorite_ids = this.state.questionnaire_detail.brand_favourite.split(",")
                                          const index1 = brand_favorite_ids.findIndex(item2 => item2 === item.id)
                                          brand_favorite_ids.splice(index1, 1)

                                          update_brand_favorite = ""
                                          brand_favorite_ids.map((item, index) => {
                                            if (update_brand_favorite != "") {
                                              update_brand_favorite += ","
                                            }
                                            update_brand_favorite += item
                                          })

                                          this.state.questionnaire_detail.brand_favourite = update_brand_favorite
                                          this.state.questionnaire_detail.brand_favourite_list = brand_favourite_list
                                          this.setState(this.state.questionnaire_detail)
                                        }}>
                                        <Image source={require("../../assets/images/ic_close2.png")} style={{ width: 10 / 3, height: 10 / 3, }} />
                                      </TouchableOpacity>
                                    </TouchableOpacity>
                                  )
                                )}

                                <View style={{ width: 30, height: 30, justifyContent: "center" }}>
                                  {/* 목록 다 돌린 후에는  추가버튼 추가*/}
                                  <TouchableOpacity activeOpacity={0.8} style={{ width: 25, height: 25, borderRadius: 25 / 2, backgroundColor: Colors.primary_purple, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => {
                                      this.setState({ searchBrandForFavorite: true })
                                      this.setState({ searchBrandModalVisible: true })
                                    }}
                                  >
                                    <MyAppText style={{ fontSize: 46 / 3, color: "white" }}>+</MyAppText>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </ScrollView>
                          </View>

                          {/* Brands I use mostly */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Brands I use mostly</MyAppText>
                            <ScrollView
                              horizontal
                              style={[{ flex: 1, }]}
                              showsHorizontalScrollIndicator={false}>

                              <View style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_v_5]}>
                                {this.state.questionnaire_detail.brand_mostly_list.map((item) =>
                                  (
                                    <TouchableOpacity key={item.id} style={[{ marginRight: 15 }]} onPress={() => { this.props.navigation.navigate("SearchBrandDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                                      <ImageLoad style={{ width: 30, height: 30, borderWidth: 0.5, borderLeftColor: Colors.color_e3e5e4, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image) }} />
                                      <TouchableOpacity activeOpacity={0.8} style={{ position: "absolute", top: 0, right: 0, padding: 5, borderRadius: 10, overflow: "hidden", backgroundColor: Colors.primary_purple }}
                                        onPress={() => {
                                          const brand_mostly_list = this.state.questionnaire_detail.brand_mostly_list
                                          const index = brand_mostly_list.findIndex(item1 => item1.id === item.id)
                                          // 목록을 없애주고
                                          brand_mostly_list.splice(index, 1)
                                          // brand_mostly 에서 해당 아이디를 삭제해준다.
                                          const brand_mostly_ids = this.state.questionnaire_detail.brand_mostly.split(",")
                                          const index1 = brand_mostly_ids.findIndex(item2 => item2 === item.id)
                                          brand_mostly_ids.splice(index1, 1)

                                          update_brand_mostly = ""
                                          brand_mostly_ids.map((item, index) => {
                                            if (update_brand_mostly != "") {
                                              update_brand_mostly += ","
                                            }
                                            update_brand_mostly += item
                                          })

                                          this.state.questionnaire_detail.brand_mostly = update_brand_mostly
                                          this.state.questionnaire_detail.brand_mostly_list = brand_mostly_list
                                          this.setState(this.state.questionnaire_detail)
                                        }}>
                                        <Image source={require("../../assets/images/ic_close2.png")} style={{ width: 10 / 3, height: 10 / 3, }} />
                                      </TouchableOpacity>
                                    </TouchableOpacity>
                                  )
                                )}

                                {/* 목록 다 돌린 후에는  추가버튼 추가*/}
                                <View style={{ width: 30, height: 30, justifyContent: "center" }}>
                                  <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 15, width: 25, height: 25, borderRadius: 25 / 2, backgroundColor: Colors.primary_purple, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => {
                                      this.setState({ searchBrandForFavorite: false })
                                      this.setState({ searchBrandModalVisible: true })
                                    }}>
                                    <MyAppText style={{ fontSize: 46 / 3, color: "white" }}>+</MyAppText>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </ScrollView>
                          </View>

                          {/* I buy products from */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>I buy products from</MyAppText>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.buy_products_from = 1,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == 1 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Shopping mall</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.buy_products_from = 2,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == 2 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Internet</MyAppText>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.buy_products_from = 3,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == 3 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Permanent shop</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.buy_products_from = 4,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == 4 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Medical shop</MyAppText>
                              </TouchableOpacity>
                            </View>
                          </View>


                          {/* I use           skincare products in one day */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>I use ___ skincare products in one day</MyAppText>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.product_count_in_day = 1,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.product_count_in_day == 1 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>None</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.product_count_in_day = 2,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.product_count_in_day == 2 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>1~2</MyAppText>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.product_count_in_day = 3,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.product_count_in_day == 3 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>3~4</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.product_count_in_day = 4,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.product_count_in_day == 4 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>More than 5</MyAppText>
                              </TouchableOpacity>
                            </View>
                          </View>


                          {/* Time I spend in caring for my skin */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <MyAppText style={[MyStyles.question_sub_text1]}>Time I spend in caring for my skin</MyAppText>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.time_for_care = 1,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.time_for_care == 1 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Less than 1 hour</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.time_for_care = 2,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.time_for_care == 2 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Between 1~3 hour</MyAppText>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.time_for_care = 3,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.time_for_care == 3 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Between 3~5 hour</MyAppText>
                              </TouchableOpacity>
                              <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.time_for_care = 4,
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.time_for_care == 4 ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <MyAppText style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>More than 5 hour</MyAppText>
                              </TouchableOpacity>
                            </View>
                          </View>

                        </View>
                        : null
                    }
                  </View>

                  {/* Step 04 : My daily skincare routine */}
                  <View style={[{ borderLeftColor: Colors.primary_purple, }, MyStyles.ingredient_section, { marginTop: 5, }]}>
                    <TouchableOpacity activeOpacity={0.8} style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_basic_info: false })
                      this.setState({ section_skin_type: false })
                      this.setState({ section_product_reference: false })
                      this.setState({ section_skin_routine: true })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_skin_routine ?
                          <MyAppText style={[MyStyles.question_section_opened]}>Step 04</MyAppText>
                          : <MyAppText style={[MyStyles.question_section_closed]}>Step 04</MyAppText>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <MyAppText style={[MyStyles.ingredient_section_header_text1]}>My daily skincare routine</MyAppText>
                          { // 섹션4 완성상태 체크
                            this.state.morning_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
                              this.state.morning_care_types.findIndex(item => item.is_selected == true) >= 0 &&
                              this.state.night_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
                              this.state.night_care_types.findIndex(item => item.is_selected == true) >= 0 ?
                              <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} /> : null
                          }
                        </View>
                      </View>
                      { // 섹션4 완성상태 체크
                        this.state.morning_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
                          this.state.morning_care_types.findIndex(item => item.is_selected == true) >= 0 &&
                          this.state.night_cleansing_types.findIndex(item => item.is_selected == true) >= 0 &&
                          this.state.night_care_types.findIndex(item => item.is_selected == true) >= 0 ?
                          <Image source={require("../../assets/images/ic_hidden_chk_mark.png")} style={[MyStyles.ic_hidden_chk_mark, { position: "absolute", right: -65 / 3 }]} />
                          : null
                      }
                    </TouchableOpacity>
                    {
                      this.state.section_skin_routine ?
                        <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                        : null}


                    {
                      this.state.section_skin_routine ?
                        <View style={[]}>
                          {/* My daily skincare routine */}
                          <View style={[{ marginBottom: 20 / 3, marginTop: 50 / 3 }, MyStyles.padding_h_main]}>
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.question_routine_Type, this.state.morningRoutineSelected ? null : { borderColor: Colors.color_e3e5e4 }]} onPress={() => {
                                this.setState({ morningRoutineSelected: true })
                              }}>
                                {this.state.morningRoutineSelected ?
                                  <Image source={require("../../assets/images/ic_sun_on.png")} style={[MyStyles.ic_sun]} />
                                  :
                                  <Image source={require("../../assets/images/ic_sun.png")} style={[MyStyles.ic_sun]} />
                                }
                              </TouchableOpacity>
                              <View style={{ width: 10 }} />
                              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.question_routine_Type, , this.state.morningRoutineSelected ? { borderColor: Colors.color_e3e5e4 } : null]} onPress={() => {
                                this.setState({ morningRoutineSelected: false })
                              }}>
                                {this.state.morningRoutineSelected ?
                                  <Image source={require("../../assets/images/ic_night.png")} style={[MyStyles.ic_night]} />
                                  :
                                  <Image source={require("../../assets/images/ic_night_on.png")} style={[MyStyles.ic_night]} />
                                }

                              </TouchableOpacity>
                            </View>
                          </View>

                          {this.state.morningRoutineSelected ?
                            <View>
                              {/* Morning cleansing */}
                              <View style={[{ marginBottom: 65 / 3, marginTop: 20 },]}>
                                <MyAppText style={[MyStyles.question_sub_text1, MyStyles.padding_h_main]}>Morning cleansing</MyAppText>
                                <View style={{ flexDirection: "row", marginTop: 5, paddingLeft: 5 }}>
                                  <View>
                                    <ScrollView
                                      horizontal
                                      style={{ flex: 1, marginTop: 10, marginLeft: 10 }}
                                      showsHorizontalScrollIndicator={false}>

                                      {this.state.morning_cleansing_types.map(item => (
                                        <TouchableOpacity activeOpacity={0.8} key={item.typeName} onPress={() => {
                                          const w_index = this.state.morning_cleansing_types.findIndex(p_item => p_item.typeName == item.typeName)
                                          this.state.morning_cleansing_types[w_index].is_selected = !this.state.morning_cleansing_types[w_index].is_selected
                                          this.setState(this.state.morning_cleansing_types)
                                        }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                          <View style={{ height: 100 / 3, paddingLeft: 10, paddingRight: 10, justifyContent: "center", alignItems: "center" }}>
                                            {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                              {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
                                              {item.is_selected ? <MyAppText style={[MyStyles.category_text22, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.typeName}</MyAppText> :
                                                <MyAppText style={[MyStyles.category_text11, { marginLeft: 5 }]} numberOfLines={1}>{item.typeName}</MyAppText>}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                </View>
                              </View>

                              {/* Morning care */}
                              <View style={[{ marginBottom: 65 / 3 },]}>
                                <MyAppText style={[MyStyles.question_sub_text1, MyStyles.padding_h_main]}>Morning care</MyAppText>
                                <View style={{ flexDirection: "row", marginTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                  <View>
                                    <FlatGrid
                                      itemDimension={this.ScreenWidth / 3 - 45}
                                      items={this.state.morning_care_types}
                                      spacing={5}
                                      style={[MyStyles.gridView,]}
                                      renderItem={({ item, index }) => (
                                        <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => {
                                          const w_index = this.state.morning_care_types.findIndex(p_item => p_item.typeName == item.typeName)
                                          this.state.morning_care_types[w_index].is_selected = !this.state.morning_care_types[w_index].is_selected
                                          this.setState(this.state.morning_care_types)
                                        }} style={{ borderColor: Colors.color_e3e5e4, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                          <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                            {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                              {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
                                              {item.is_selected ? <MyAppText style={[MyStyles.category_text22, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.typeName}</MyAppText> :
                                                <MyAppText style={[MyStyles.category_text11, { marginLeft: 5 }]} numberOfLines={1}>{item.typeName}</MyAppText>}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      )}
                                    />
                                  </View>
                                </View>
                              </View>
                            </View>
                            : <View>
                              {/* Night cleansing */}
                              <View style={[{ marginBottom: 65 / 3, marginTop: 20 },]}>
                                <MyAppText style={[MyStyles.question_sub_text1, MyStyles.padding_h_main]}>Night cleansing</MyAppText>
                                <View style={{ flexDirection: "row", marginTop: 5, paddingLeft: 5 }}>
                                  <View>
                                    <ScrollView
                                      horizontal
                                      style={{ flex: 1, marginTop: 10, marginLeft: 10 }}
                                      showsHorizontalScrollIndicator={false}>

                                      {this.state.night_cleansing_types.map(item => (
                                        <TouchableOpacity activeOpacity={0.8} key={item.typeName} onPress={() => {
                                          const w_index = this.state.night_cleansing_types.findIndex(p_item => p_item.typeName == item.typeName)
                                          this.state.night_cleansing_types[w_index].is_selected = !this.state.night_cleansing_types[w_index].is_selected
                                          this.setState(this.state.night_cleansing_types)
                                        }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                          <View style={{ height: 100 / 3, paddingLeft: 10, paddingRight: 10, justifyContent: "center", alignItems: "center" }}>
                                            {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                              {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
                                              {item.is_selected ? <MyAppText style={[MyStyles.category_text22, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.typeName}</MyAppText> :
                                                <MyAppText style={[MyStyles.category_text11, { marginLeft: 5 }]} numberOfLines={1}>{item.typeName}</MyAppText>}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                </View>
                              </View>

                              {/* Night care */}
                              <View style={[{ marginBottom: 65 / 3 },]}>
                                <MyAppText style={[MyStyles.question_sub_text1, MyStyles.padding_h_main]}>Night care</MyAppText>
                                <View style={{ flexDirection: "row", marginTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                                  <View>
                                    <FlatGrid
                                      itemDimension={this.ScreenWidth / 3 - 45}
                                      items={this.state.night_care_types}
                                      spacing={5}
                                      style={[MyStyles.gridView,]}
                                      renderItem={({ item, index }) => (
                                        <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => {
                                          const w_index = this.state.night_care_types.findIndex(p_item => p_item.typeName == item.typeName)
                                          this.state.night_care_types[w_index].is_selected = !this.state.night_care_types[w_index].is_selected
                                          this.setState(this.state.night_care_types)
                                        }} style={{ borderColor: Colors.color_e3e5e4, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                          <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                            {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                              {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
                                              {item.is_selected ? <MyAppText style={[MyStyles.category_text22, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.typeName}</MyAppText> :
                                                <MyAppText style={[MyStyles.category_text11, { marginLeft: 5 }]} numberOfLines={1}>{item.typeName}</MyAppText>}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      )}
                                    />
                                  </View>
                                </View>
                              </View>
                            </View>
                          }
                        </View>
                        : null
                    }
                  </View>

                  {this.state.section_basic_info || this.state.section_skin_type || this.state.section_product_reference || this.state.section_skin_routine ?
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { this.checkCompleteStatus() }} style={[{ backgroundColor: Colors.primary_purple, height: 135 / 3, borderRadius: 2, justifyContent: "center", flex: 1, marginTop: 40, marginBottom: 40, marginLeft: 15, marginRight: 15 }]}>
                      <MyAppText style={{ textAlign: "center", color: "white", fontSize: 13 }}>Save</MyAppText>
                    </TouchableOpacity>
                    : null}
                </View>
                : null}

            </View>
          </ScrollView>

          {this.state.section_basic_info || this.state.section_skin_type || this.state.section_product_reference || this.state.section_skin_routine ?
            null
            :
            <TouchableOpacity activeOpacity={0.8} onPress={() => { this.checkCompleteStatus() }} style={[{ backgroundColor: Colors.primary_purple, height: 135 / 3, borderRadius: 2, justifyContent: "center", flex: 1, position: "absolute", bottom: 0, left: 15, right: 15, marginBottom: 40 }]}>
              <MyAppText style={{ textAlign: "center", color: "white", fontSize: 13 }}>Save</MyAppText>
            </TouchableOpacity>}

          {/* 설문 편집/추가 모달 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.addBabyModalVisible}
            onRequestClose={() => {
            }}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
              <View style={{ flex: 1 }}>
                <Toast ref='modal_toast' />
                <View style={MyStyles.modal_bg}>
                  <View style={MyStyles.modalContainer}>
                    {/* modal header */}
                    <View style={MyStyles.modal_header}>
                      {this.state.edit_baby_id > 0 ?
                        <MyAppText style={MyStyles.modal_title}>Edit User</MyAppText>
                        :
                        <MyAppText style={MyStyles.modal_title}>Add User</MyAppText>
                      }
                      <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ addBabyModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                      </TouchableOpacity>
                    </View>
                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                    <View style={[MyStyles.container, { paddingTop: 20, paddingBottom: 120 / 3 }]}>
                      <MyAppText style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Name</MyAppText>
                      <TextInput
                        onSubmitEditing={() => {
                          if (this.state.edit_baby_id > 0) {
                            this.state.questionnaire_detail.id = this.state.questionnaire_list[this.state.beforeBabyIdx].id
                            this.state.questionnaire_detail.title = this.state.request_list_name
                            this.setState(this.state.questionnaire_detail)
                            this.updateQuestionnaireItem()
                            this.setState({ addBabyModalVisible: false });
                          } else {
                            this.addQuestionnaire()
                          }
                        }}
                        value={this.state.request_list_name}
                        onChangeText={(text) => { this.setState({ request_list_name: text }) }}
                        style={MyStyles.text_input_with_border}>
                      </TextInput>
                    </View>


                    {this.state.edit_baby_id > 0 ?
                      <View style={{ flexDirection: "row" }}>
                        <TouchableHighlight
                          style={[MyStyles.dlg_btn_primary_cover]} onPress={() => {
                            this.state.questionnaire_detail.id = this.state.questionnaire_list[this.state.beforeBabyIdx].id
                            this.state.questionnaire_detail.title = this.state.request_list_name
                            this.setState(this.state.questionnaire_detail)
                            this.updateQuestionnaireItem()
                            this.setState({ addBabyModalVisible: false });
                          }}>
                          <MyAppText style={MyStyles.btn_primary}>Change</MyAppText>
                        </TouchableHighlight>
                        <TouchableHighlight
                          style={[MyStyles.dlg_btn_primary_white_cover]} onPress={() => {
                            this.requestDeleteQuestionnaireItem(this.state.questionnaire_list[this.state.beforeBabyIdx].id)
                            this.setState({ addBabyModalVisible: false });
                          }}>
                          <MyAppText style={MyStyles.btn_primary_white}>Delete</MyAppText>
                        </TouchableHighlight>
                      </View>
                      :
                      <View style={{ flexDirection: "row" }}>
                        <TouchableHighlight
                          style={[MyStyles.dlg_btn_primary_cover]} onPress={() => {
                            this.addQuestionnaire()
                          }}>
                          <MyAppText style={MyStyles.btn_primary}>Create</MyAppText>
                        </TouchableHighlight>
                      </View>
                    }

                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {/* 지역선택 모달 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.countrySelectModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                    this.setState({ countrySelectModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>

                  <View style={{ width: 200, height: 150, marginBottom: 40, justifyContent: "center", alignSelf: "center" }}>
                    <Dropdown
                      // dropdownPosition={0}
                      labelFontSize={11}
                      textColor={Colors.color_656565}
                      itemColor={Colors.color_656565}
                      selectedItemColor={Colors.color_656565}
                      baseColor={Colors.primary_dark}
                      value={this.state.questionnaire_detail.location == null ? "" : this.state.questionnaire_detail.location}
                      label='Please select your state'
                      onChangeText={(value, index, data) => {
                        this.state.questionnaire_detail.location = value
                        this.setState(this.state.questionnaire_detail)
                      }}
                      data={this.state.country_list}
                    />
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight onPress={() => {
                      this.setState({ countrySelectModalVisible: false });
                    }}
                      style={[MyStyles.dlg_btn_primary_cover]}>
                      <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                    </TouchableHighlight>
                  </View>
                </View>

              </View>
            </View>
          </Modal>

          {/* 브랜드 검색 팝업 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.searchBrandModalVisible}
            onRequestClose={() => {
            }}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
              <View style={{ flex: 1 }}>
                <Toast ref='toast_modal2' />
                <View style={MyStyles.modal_bg1}>
                  <View style={MyStyles.modalContainer}>
                    {/* modal header */}
                    <View style={MyStyles.modal_header}>
                      <MyAppText style={MyStyles.modal_title}>Brand</MyAppText>
                      <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ searchBrandModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                      </TouchableOpacity>
                    </View>
                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                    {/* body */}
                    <View style={[MyStyles.padding_h_main, { paddingTop: 70 / 3, paddingBottom: 75 / 3 }]}>
                      <MyAppText style={[MyStyles.text_13_primary_dark, { fontWeight: "500" }]}>Brand Name</MyAppText>
                      <TextInput
                        onChangeText={(text) => { this.setState({ searchKeyword: text }) }}
                        value={this.state.searchKeyword}
                        returnKeyType="search"
                        onSubmitEditing={() => {
                          this.setState({ loading_end: false })
                          if (this.state.searchKeyword == null) {
                            this.refs.toast_modal2.showBottom("Please input search keyword");
                            return;
                          }
                          this.requestSearchBrand(this.state.searchKeyword)
                        }}
                        style={[{ borderWidth: 0.5, marginTop: 10, borderColor: Colors.color_e5e6e5, color: Colors.color_656565, fontSize: 13, padding: 10 }]}>
                      </TextInput>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 25 }}>
                      <TouchableOpacity activeOpacity={0.8} style={[MyStyles.btn_primary_cover1, { borderRadius: 3, width: 444 / 3, height: 30 }]}
                        onPress={() => {
                          this.setState({ loading_end: false })
                          if (this.state.searchKeyword == null) {
                            this.refs.toast_modal2.showBottom("Please input search keyword");
                            return;
                          }
                          this.requestSearchBrand(this.state.searchKeyword)
                        }
                        }>
                        <MyAppText style={MyStyles.btn_primary}>Search</MyAppText>
                      </TouchableOpacity>
                    </View>


                    {this.state.search_brand_list.length > 0 ?

                      <View style={{ height: 670 / 3 }}>
                        <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />
                        <View style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingLeft: 15,
                          paddingRight: 15,
                          paddingTop: 75 / 3,
                          paddingBottom: 110 / 3,
                        }}>
                          {
                            this.renderBrandsScroll()
                          }
                        </View>
                        <View style={{ flexDirection: "row" }}>

                          <TouchableHighlight style={[MyStyles.dlg_btn_primary_cover]} onPress={() => {
                            if (this.state.searchBrandForFavorite) { // brand_favorite_list 에 추가할때
                              // 이미 추가된 브랜드인가 체크
                              const check_index = this.state.questionnaire_detail.brand_favourite_list.findIndex(w_item => w_item.id == this.state.selected_brand_item.id)
                              if (check_index >= 0) {
                                this.refs.toast_modal2.showBottom("Already added brand item. Please choose another");
                                return
                              }
                              const brand_favourite_list = this.state.questionnaire_detail.brand_favourite_list
                              added_favorite_list = [...brand_favourite_list, this.state.selected_brand_item]
                              this.state.questionnaire_detail.brand_favourite_list = added_favorite_list
                              this.setState(this.state.questionnaire_detail)

                            } else { // brand_mostly_list 에 추가할때
                              // 이미 추가된 브랜드인가 체크
                              const check_index = this.state.questionnaire_detail.brand_mostly_list.findIndex(w_item => w_item.id == this.state.selected_brand_item.id)
                              if (check_index >= 0) {
                                this.refs.toast_modal2.showBottom("Already added brand item. Please choose another");
                                return
                              }
                              const brand_mostly_list = this.state.questionnaire_detail.brand_mostly_list
                              added_mostly_list = [...brand_mostly_list, this.state.selected_brand_item]
                              this.state.questionnaire_detail.brand_mostly_list = added_mostly_list
                              this.setState(this.state.questionnaire_detail)
                            }

                            this.setState({ searchBrandModalVisible: false })

                          }}>
                            <MyAppText style={MyStyles.btn_primary}>Add</MyAppText>
                          </TouchableHighlight>
                        </View>
                      </View>
                      :
                      null}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* 전체 입력이 안되었을 경우 저장시 alert */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.noCompletedQuestionnaireModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                    this.setState({ noCompletedQuestionnaireModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>

                  <Image style={{ width: 85 / 3, height: 96 / 3, alignSelf: "center" }} source={require("../../assets/images/ic_pin.png")} />
                  <MyAppText style={{ fontSize: 16, color: "black", textAlign: "center", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                    If you do not complete the Questionnaire, it may be difficult to get the correct consultation.
                    </MyAppText>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight onPress={() => {
                      this.setState({ noCompletedQuestionnaireModalVisible: false });
                      this.updateQuestionnaireItem()
                    }}
                      style={[MyStyles.dlg_btn_primary_cover]}>
                      <MyAppText style={MyStyles.btn_primary}>OK</MyAppText>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={[MyStyles.dlg_btn_primary_white_cover]}
                      onPress={() => {
                        this.setState({ noCompletedQuestionnaireModalVisible: false });
                      }}>
                      <MyAppText style={MyStyles.btn_primary_white}>Cancel</MyAppText>
                    </TouchableHighlight>
                  </View>
                </View>

              </View>
            </View>
          </Modal>


        </KeyboardAvoidingView>

      </View >
    );
  }


  requestQuestionnaireList() {
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
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.questionnaire_list = responseJson.result_data.questionnaire_list

        // 전반적으로 선택된 인원 같이 변경해야 하므로
        w_selectedQueIdx = this.state.questionnaire_list.findIndex((item) => item.id == global.login_info.questionnaire_id)

        if (this.state.questionnaire_list.length > 0) {
          this.state.questionnaire_list.forEach(element => {
            element.is_selected = false
          })
          if (this.state.edit_baby_id == 0) { // questionnaire 화면에 들어와서 선택한 questionnaire 가 없을때는 앱내에 기본 설정된 questionnaire 를 선택해준다
            this.state.beforeBabyIdx = w_selectedQueIdx
            this.state.questionnaire_list[w_selectedQueIdx].is_selected = true
            this.requestQuestionnaireDetail(this.state.questionnaire_list[w_selectedQueIdx].id);
          } else {
            const index = this.state.questionnaire_list.findIndex(item => item.id == this.state.edit_baby_id)
            this.state.beforeBabyIdx = index
            this.state.questionnaire_list[index].is_selected = true
            this.requestQuestionnaireDetail(this.state.questionnaire_list[index].id);
          }
        }

        this.setState({ questionnaire_list: this.state.questionnaire_list })
      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestAddQuestionnaireItem(p_title) {
    return fetch(Net.user.addQuestionnaireItem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        title: p_title
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.setState({ edit_baby_id: responseJson.result_data.questionnaire_detail.id })
        this.requestQuestionnaireList();

      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteQuestionnaireItem(p_questionnaire_id) {
    return fetch(Net.user.deleteQuestionnaireItem, {
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

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.setState({ edit_baby_id: 0 })
        this.requestQuestionnaireList();

      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestCountryList() {
    return fetch(Net.user.countryList, {
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
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        const data = [];

        responseJson.result_data.country_list.forEach(element => {
          data.push({ value: element.title, id: element.id })
        });

        this.setState({ country_list: data })
      })
      .catch((error) => {
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
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.setState({ questionnaire_detail: responseJson.result_data.questionnaire_detail })

        this.state.morning_cleansing_types = Common.getCleansingTypes()
        this.state.morning_care_types = Common.getCareTypes()
        this.state.night_cleansing_types = Common.getCleansingTypes()
        this.state.night_care_types = Common.getCareTypes()

        const morning_cleansing = this.state.questionnaire_detail.morning_cleansing;
        // 위 값들은 선택된 상태로 만들어줌
        if (morning_cleansing != null && morning_cleansing.length > 0) {
          morning_cleansing.split(",").forEach((element) => {
            const index = this.state.morning_cleansing_types.findIndex(item => item.typeName == element)
            this.state.morning_cleansing_types[index].is_selected = true
          })
        }
        this.setState(this.state.morning_cleansing_types)

        const morning_care = this.state.questionnaire_detail.morning_care;
        // 위 값들은 선택된 상태로 만들어줌
        if (morning_care != null && morning_care.length > 0) {
          morning_care.split(",").forEach((element) => {
            const index = this.state.morning_care_types.findIndex(item => item.typeName == element)
            this.state.morning_care_types[index].is_selected = true
          })
        }
        this.setState(this.state.morning_care_types)

        const night_cleansing = this.state.questionnaire_detail.night_cleansing;
        // 위 값들은 선택된 상태로 만들어줌
        if (night_cleansing != null && night_cleansing.length > 0) {
          night_cleansing.split(",").forEach((element) => {
            const index = this.state.night_cleansing_types.findIndex(item => item.typeName == element)
            this.state.night_cleansing_types[index].is_selected = true
          })
        }
        this.setState(this.state.night_cleansing_types)

        const night_care = this.state.questionnaire_detail.night_care;
        // 위 값들은 선택된 상태로 만들어줌
        if (night_care != null && night_care.length > 0) {
          night_care.split(",").forEach((element) => {
            const index = this.state.night_care_types.findIndex(item => item.typeName == element)
            this.state.night_care_types[index].is_selected = true
          })
        }
        this.setState(this.state.night_care_types)
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestUpdateQuestionnaireItem() {
    return fetch(Net.user.updateQuestionnaireItem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: this.state.questionnaire_detail.id,
        title: this.state.questionnaire_detail.title,
        birth: this.state.questionnaire_detail.birth,
        gender: this.state.questionnaire_detail.gender,
        location: this.state.questionnaire_detail.location,
        marital_status: this.state.questionnaire_detail.marital_status,
        is_kids: this.state.questionnaire_detail.is_kids,
        skin_type: this.state.questionnaire_detail.skin_type,
        needs: this.state.questionnaire_detail.needs,
        concern: this.state.questionnaire_detail.concern,
        brand_favourite: this.state.questionnaire_detail.brand_favourite,
        brand_mostly: this.state.questionnaire_detail.brand_mostly,
        buy_products_from: this.state.questionnaire_detail.buy_products_from == null ? null : this.state.questionnaire_detail.buy_products_from.toString(),
        product_count_in_day: this.state.questionnaire_detail.product_count_in_day == null ? null : this.state.questionnaire_detail.product_count_in_day.toString(),
        time_for_care: this.state.questionnaire_detail.time_for_care == null ? null : this.state.questionnaire_detail.time_for_care.toString(),
        morning_cleansing: this.state.questionnaire_detail.morning_cleansing,
        morning_care: this.state.questionnaire_detail.morning_care,
        night_cleansing: this.state.questionnaire_detail.night_cleansing,
        night_care: this.state.questionnaire_detail.night_care,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        global.login_info.questionnaire_id = this.state.questionnaire_detail.id
        if(this.state.questionnaire_detail.title == "Me") {
          global.login_info.concern = this.state.questionnaire_detail.concern
          global.login_info.needs = this.state.questionnaire_detail.needs
          global.refreshStatus.main = true
        }

        if (is_from_sign_up) {
          // 로그인 되었으면 상태변경
          GlobalState.loginStatus = 1
        } else {
          this.state.questionnaire_list[this.state.beforeBabyIdx].title = this.state.questionnaire_detail.title
          this.setState(this.state.questionnaire_list)
          Alert.alert(
            '',
            this.qnaCompleted ? "The Questionnaire is completed" : "The Questionnaire has been saved",
            [
              {
                text: 'OK', onPress: () => {
                  // this.props.navigation.goBack();
                }
              },
            ],
            { cancelable: false },
          );
        }

      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  // brand_favorite_list, brand_mostly_list 에 brand를 추가할때 이용하는 검색 api
  requestSearchBrand(p_keyword) {
    return fetch(Net.home.searchBrand, {
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

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.setState({
          search_brand_list: responseJson.result_data.brand_list,
        });
      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
  }
}