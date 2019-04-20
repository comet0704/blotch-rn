import React, { Component } from 'react';
import ImageLoad from 'react-native-image-placeholder';
import {
  Image,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles'
import Net from '../../Net/Net';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyConstants from '../../constants/MyConstants';
import { LinearGradient } from 'expo';
import Colors from '../../constants/Colors';
import Common from '../../assets/Common';

import { FlatGrid } from 'react-native-super-grid';
import { Dropdown } from 'react-native-material-dropdown';

export default class QuestionnareScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countrySelectModalVisible: false,
      country_list: [],
      addBabyModalVisible: false,
      edit_baby_id: 0, // 0  이면 add_baby, > 0 이면 edit_baby
      request_list_name: "",
      section_basic_info: false,
      section_skin_type: false,
      section_product_reference: false,
      section_skin_routine: true,
      beforeBabyIdx: 0,
      questionnaire_detail: {
        "id": 1,
        "uid": 3,
        "title": "Me",
        "birth": "2019-04-08",
        "gender": "M",
        "location": "Tokyo",
        "marital_status": "N",
        "is_kids": "N",
        "skin_type": "Dry,Complex",
        "needs": "Whitening",
        "concern": "Acne",
        "brand_favourite": "1,3,5",
        "brand_mostly": "2,3,8",
        "buy_products_from": 0,
        "product_count_in_day": 0,
        "time_for_care": 0,
        "skincare_routine_morning": null,
        "skincare_routine_night": null,
        "create_date": "0000-00-00 00:00:00",
        "update_date": null,
        "brand_favourite_list": [
          {
            "id": 1,
            "title": "LUSH",
            "information": "",
            "image": "uploads/brand/logo_01.jpg",
            "like_count": 1,
            "is_liked": 9
          }
        ],
        "brand_mostly_list": [
          {
            "id": 2,
            "title": "BEAUTY",
            "information": "",
            "image": "uploads/brand/logo_02.jpg",
            "like_count": 0,
            "is_liked": 1
          }
        ]
      },
      questionnaire_list: [

      ],

      skin_types: Common.getSkinTypes(),
      concern_types: Common.getConcernTypes(),
      need_types: Common.getNeedTypes(),
      mainCategoryItems: Common.categoryItems_recom,
    };
  }

  componentDidMount() {
    this.requestQuestionnaireList()
    this.requestCountryList()
  }

  ScreenWidth = Dimensions.get('window').width;
  onBabySelected = (p_babyName) => {
    const questionnaire_list = [...this.state.questionnaire_list]
    const index = questionnaire_list.findIndex(item => item.title === p_babyName)
    console.log(p_babyName)
    console.log(index);
    if (index == this.state.beforeBabyIdx) {// 선택했떤것을 또 선택했을때는 Questionnaire 편집으로 진행
      this.setState({ edit_baby_id: questionnaire_list[index].id, request_list_name: questionnaire_list[index].title, addBabyModalVisible: true })
      return
    }
    questionnaire_list[this.state.beforeBabyIdx].is_selected = false
    questionnaire_list[index].is_selected = true
    this.state.beforeBabyIdx = index
    this.setState({ questionnaire_list: questionnaire_list, edit_baby_id: questionnaire_list[index].id })
    this.setState({ loading_end: false })
  }

  renderMyBabies() {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView
          horizontal
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}>

          {this.state.questionnaire_list.map(item => (
            <View key={item.id} style={{ marginRight: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => { this.onBabySelected(item.title) }} style={[item.is_selected ? MyStyles.baby_container_selected1 : MyStyles.baby_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Text style={MyStyles.baby_text_selected} numberOfLines={1}>{item.title}</Text> : <Text style={MyStyles.baby_text} numberOfLines={1}>{item.title}</Text>}
              </TouchableOpacity>
            </View>
          ))}

          {/* 목록 다 돌린 후에는  추가버튼 추가*/}
          <View style={{ marginRight: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => {
              this.setState({ edit_baby_id: 0, request_list_name: "", addBabyModalVisible: true })
            }
            } style={[MyStyles.baby_container]}>
              <Text style={[MyStyles.baby_text, { fontSize: 25 }]} numberOfLines={1}>+</Text>
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
    if (this.state.edit_baby_id > 0) { // 편집이면      
      this.requestEditQuestionnaire(this.state.edit_baby_id, this.state.request_list_name)
    } else {
      this.requestAddQuestionnaireItem(this.state.request_list_name)
    }
  }

  onDaySelect = (selectedDay) => {
    this.state.questionnaire_detail.birth = selectedDay.dateString
    this.setState(this.state.questionnaire_detail)
  }

  onWeCanSearchItCallback = (p_skin_type, p_concern, p_needs) => {
    console.log("000000000000" + ":" + p_skin_type + ":" + p_concern+ ":" + p_needs)
    this.state.questionnaire_detail.skin_type = p_skin_type
    this.state.questionnaire_detail.concern = p_concern
    this.state.questionnaire_detail.needs = p_needs
    this.setState(this.state.questionnaire_detail)
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

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack title="Questionnaire" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

            <View style={{ backgroundColor: Colors.color_f8f8f8 }}>
              {/* 카테고리 나열 부분 */}
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
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
                    <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_basic_info: !this.state.section_basic_info })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_basic_info ?
                          <Text style={[MyStyles.question_section_opened]}>Step 01</Text>
                          : <Text style={[MyStyles.question_section_closed]}>Step 01</Text>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[MyStyles.ingredient_section_header_text1]}>Basic Info</Text>
                          { // 섹션1 완성상태 체크
                            this.state.questionnaire_detail.birth &&
                              this.state.questionnaire_detail.gender &&
                              this.state.questionnaire_detail.location &&
                              this.state.questionnaire_detail.marital_status &&
                              this.state.questionnaire_detail.is_kids ?
                              <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} /> : null
                          }
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                    {
                      this.state.section_basic_info ?
                        <View style={[MyStyles.padding_main]}>
                          {/* Day of Birth */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Date of Birth</Text>
                            <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                              <TextInput value={this.state.questionnaire_detail.birth} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="YYYY - MM - DD" />
                              <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
                            </TouchableOpacity>
                          </View>
                          {/* Gender */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Gender</Text>
                            <View style={{ marginTop: 10, flexDirection: "row" }}>
                              <TouchableOpacity style={this.state.questionnaire_detail.gender == "F" ? MyStyles.question_gender_on : MyStyles.question_gender_off}
                                onPress={() => {
                                  this.state.questionnaire_detail.gender = "F"
                                  this.setState(this.state.questionnaire_detail)
                                }
                                }
                              >
                                <Image source={require("../../assets/images/ic_gender_female.png")} style={[MyStyles.ic_gender_female]} />
                                <Text style={{ fontSize: 12, marginTop: 5, color: Colors.color_primary_pink }}>Female</Text>
                              </TouchableOpacity>
                              <View style={{ flex: 1 }} />

                              <TouchableOpacity style={this.state.questionnaire_detail.gender == "M" ? MyStyles.question_gender_on : MyStyles.question_gender_off}
                                onPress={() => {
                                  this.state.questionnaire_detail.gender = "M"
                                  this.setState(this.state.questionnaire_detail)
                                }
                                }>
                                <Image source={require("../../assets/images/ic_gender_male.png")} style={[MyStyles.ic_gender_male]} />
                                <Text style={{ fontSize: 12, marginTop: 5, color: Colors.color_e3e5e4 }}>Male</Text>
                              </TouchableOpacity>
                              <View style={{ flex: 1 }} />
                              <TouchableOpacity style={this.state.questionnaire_detail.gender == "U" ? MyStyles.question_gender_on : MyStyles.question_gender_off}
                                onPress={() => {
                                  this.state.questionnaire_detail.gender = "U"
                                  this.setState(this.state.questionnaire_detail)
                                }
                                }>
                                <Image source={require("../../assets/images/ic_gender_unspecified.png")} style={[MyStyles.ic_gender_unspecified, { marginTop: 31 / 6 }]} />
                                <Text style={{ fontSize: 12, marginTop: 5 + 31 / 6, color: Colors.color_e3e5e4 }}>Unspecitied</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Area */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Area</Text>
                            <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ countrySelectModalVisible: true }) }}>
                              <TextInput value={this.state.questionnaire_detail.location} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="Seoul, Kor" />
                              <Image source={require("../../assets/images/ic_search_medium.png")} style={[MyStyles.ic_search_medium]} />
                            </TouchableOpacity>
                          </View>

                          {/* Marriage status */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Marriage status</Text>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.marital_status = "Y",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.marital_status == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Yes</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.marital_status = "N",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.marital_status == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Descendant */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Descendant</Text>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.is_kids = "Y",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.is_kids == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={{ marginLeft: 5 }}>Yes</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                this.state.questionnaire_detail.is_kids = "N",
                                  this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.is_kids == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={{ marginLeft: 5 }}>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>


                        </View>
                        : null
                    }
                  </View>

                  {/* Step 02 : My Skin Type */}
                  <View style={[{ borderLeftColor: Colors.primary_purple, }, MyStyles.ingredient_section, { marginTop: 5, }]}>
                    <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_skin_type: !this.state.section_skin_type })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_skin_type ?
                          <Text style={[MyStyles.question_section_opened]}>Step 02</Text>
                          : <Text style={[MyStyles.question_section_closed]}>Step 02</Text>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[MyStyles.ingredient_section_header_text1]}>My Skin Type</Text>

                        </View>
                      </View>
                    </TouchableOpacity>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                    {
                      this.state.section_skin_type ?
                        <View style={[MyStyles.padding_main, { minHeight: 300 / 3 }]}>
                          {/* My skin is */}
                          {this.state.questionnaire_detail.skin_type != null && this.state.questionnaire_detail.skin_type.length > 0 ?
                            <View>
                              <Text style={[MyStyles.question_sub_text1]}>My skin is</Text>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.skin_type.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}

                                  // staticDimension={300}
                                  // fixed
                                  renderItem={({ item, index }) => {
                                    // this.state.skin_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.skin_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.skin_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</Text>
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
                              <Text style={[MyStyles.question_sub_text1]}>I'm unhappy about my</Text>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.concern.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}

                                  // staticDimension={300}
                                  // fixed
                                  renderItem={({ item, index }) => {
                                    // this.state.concern_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.concern_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.concern_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</Text>
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
                              <Text style={[MyStyles.question_sub_text1]}>I'm interested in</Text>
                              <View style={{ flexDirection: "row" }}>
                                {/* questionnaire_detail을 위주로 flatgrid 를 순회. 안에서 skin_type 매칭 */}
                                <FlatGrid
                                  itemDimension={this.ScreenWidth / 3 - 40}
                                  items={this.state.questionnaire_detail.needs.split(",")}
                                  style={[MyStyles.gridView, { marginLeft: -10 }]}
                                  spacing={10}

                                  // staticDimension={300}
                                  // fixed
                                  renderItem={({ item, index }) => {
                                    // this.state.need_types 를 조회하여 매칭되는 아이템 현시
                                    const w_index = this.state.need_types.findIndex(item1 => item1.typeName == item)
                                    const w_item = this.state.need_types[w_index]

                                    return (
                                      <View style={{ alignItems: "center", flexDirection: "row" }} >
                                        <Image source={w_item.image_on} style={[MyStyles.ic_skin_types_small]} />
                                        <Text style={{ textAlign: "center", color: Colors.color_949292, fontSize: 12, marginLeft: 5 }}>{w_item.typeName}</Text>
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
                            <TouchableOpacity style={{ marginRight: -190 / 6, width: 190 / 3, height: 190 / 3, justifyContent: "center", backgroundColor: Colors.primary_purple, borderRadius: 190 }}
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
                    <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_product_reference: !this.state.section_product_reference })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_product_reference ?
                          <Text style={[MyStyles.question_section_opened]}>Step 03</Text>
                          : <Text style={[MyStyles.question_section_closed]}>Step 03</Text>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[MyStyles.ingredient_section_header_text1]}>Product Preference</Text>
                          <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                    {
                      this.state.section_product_reference ?
                        <View style={[MyStyles.padding_main]}>
                          {/* Favorite Brands */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Favorite Brands</Text>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                              <View style={{ marginRight: 15 }}>
                                <ImageLoad style={{ width: 30, height: 30, borderWidth: 0.5, borderLeftColor: Colors.color_e3e5e4, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(null) }} />
                                <View style={{ position: "absolute", top: -5, right: 0, padding: 5, borderRadius: 10, overflow: "hidden", backgroundColor: Colors.primary_purple }}>
                                  <Image source={require("../../assets/images/ic_close2.png")} style={{ width: 10 / 3, height: 10 / 3, }} />
                                </View>
                              </View>

                              <TouchableOpacity style={{ marginRight: 15, width: 25, height: 25, borderRadius: 100, backgroundColor: Colors.primary_purple, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 46 / 3, color: "white" }}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Brands I use mostly */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Brands I use mostly</Text>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                              <View style={{ marginRight: 15 }}>
                                <ImageLoad style={{ width: 30, height: 30, borderWidth: 0.5, borderLeftColor: Colors.color_e3e5e4, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(null) }} />
                                <View style={{ position: "absolute", top: -5, right: 0, padding: 5, borderRadius: 10, overflow: "hidden", backgroundColor: Colors.primary_purple }}>
                                  <Image source={require("../../assets/images/ic_close2.png")} style={{ width: 10 / 3, height: 10 / 3, }} />
                                </View>
                              </View>

                              <TouchableOpacity style={{ marginRight: 15, width: 25, height: 25, borderRadius: 100, backgroundColor: Colors.primary_purple, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 46 / 3, color: "white" }}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* I buy products from */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>I buy products from</Text>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Shopping mall</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Internet</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Permanent shop</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Medical shop</Text>
                              </TouchableOpacity>
                            </View>
                          </View>


                          {/* I use           skincare products in one day */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>I use ___ skincare products in one day</Text>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>None</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>1~2</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>3~4</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>More than 5</Text>
                              </TouchableOpacity>
                            </View>
                          </View>


                          {/* Time I spend in caring for my skin */}
                          <View style={{ marginBottom: 65 / 3 }}>
                            <Text style={[MyStyles.question_sub_text1]}>Time I spend in caring for my skin</Text>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 10 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Less than 1 hour</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Between 1~3 hour</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 3 }]}>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "Y",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "Y" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>Between 3~5 hour</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[{ flex: 1, alignItems: "center", flexDirection: "row" }]} onPress={() => {
                                // this.state.questionnaire_detail.marital_status = "N",
                                //   this.setState(this.state.questionnaire_detail)
                              }}>
                                <Image style={{ width: 14, height: 14 }} source={this.state.questionnaire_detail.buy_products_from == "N" ? require("../../assets/images/ic_check_small_on.png") : require("../../assets/images/ic_check_small_off.png")} />
                                <Text style={[{ marginLeft: 5 }, MyStyles.text_12_949292]}>More than 5 hour</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                        </View>
                        : null
                    }
                  </View>

                  {/* Step 04 : My daily skincare routine */}
                  <View style={[{ borderLeftColor: Colors.primary_purple, }, MyStyles.ingredient_section, { marginTop: 5, }]}>
                    <TouchableOpacity style={MyStyles.ingredient_section_header} onPress={() => {
                      this.setState({ section_skin_routine: !this.state.section_skin_routine })
                    }}>
                      <View style={[{ flex: 1 }]}>
                        {this.state.section_skin_routine ?
                          <Text style={[MyStyles.question_section_opened]}>Step 04</Text>
                          : <Text style={[MyStyles.question_section_closed]}>Step 04</Text>
                        }
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[MyStyles.ingredient_section_header_text1]}>My daily skincare routine</Text>
                          <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                    {
                      this.state.section_skin_routine ?
                        <View style={[]}>
                          {/* My daily skincare routine */}
                          <View style={[{ marginBottom: 65 / 3 }, MyStyles.padding_h_main]}>
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity style={MyStyles.question_routine_Type}>
                                <Image source={require("../../assets/images/ic_sun.png")} style={[MyStyles.ic_sun]} />
                              </TouchableOpacity>
                              <View style={{ width: 10 }} />
                              <TouchableOpacity style={MyStyles.question_routine_Type}>
                                <Image source={require("../../assets/images/ic_night.png")} style={[MyStyles.ic_night]} />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Morning cleansing */}
                          <View style={[{ marginBottom: 65 / 3, marginTop: 20 },]}>
                            <Text style={[MyStyles.question_sub_text1, MyStyles.padding_h_main]}>Morning cleansing</Text>
                            <View style={{ flexDirection: "row", marginTop: 10, paddingLeft: 5 }}>
                              <View>
                                {this.state.mainCategoryItems.map((item, index) => (
                                  item.sub_category.length > 0 ?
                                    <FlatGrid
                                      View key={index}
                                      itemDimension={this.ScreenWidth / item.sub_category.length - 40}
                                      items={item.sub_category}
                                      style={[MyStyles.gridView, { marginTop: -20, }]}
                                      spacing={10}

                                      // staticDimension={300}
                                      // fixed
                                      // spacing={20}
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
                                    : null))}

                              </View>
                            </View>
                          </View>


                        </View>
                        : null
                    }
                  </View>

                </View>
                : null}
            </View>
          </ScrollView>
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
                        <Text style={MyStyles.modal_title}>Edit User</Text>
                        :
                        <Text style={MyStyles.modal_title}>Add User</Text>
                      }
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ addBabyModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                      </TouchableOpacity>
                    </View>
                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                    <View style={[MyStyles.container, { paddingTop: 20, paddingBottom: 120 / 3 }]}>
                      <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>Name</Text>
                      <TextInput
                        onSubmitEditing={() => {
                          this.addQuestionnaire()
                        }}
                        value={this.state.request_list_name}
                        onChangeText={(text) => { this.setState({ request_list_name: text }) }}
                        style={MyStyles.text_input_with_border}>
                      </TextInput>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight
                        style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {
                          this.addQuestionnaire()
                        }}>
                        {this.state.edit_baby_id > 0 ?
                          <Text style={MyStyles.btn_primary}>Change</Text>
                          :
                          <Text style={MyStyles.btn_primary}>Create</Text>
                        }
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.countrySelectModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
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
                      value={this.state.questionnaire_detail.location}
                      label='Please select your country'
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
                      this.setState
                    }}
                      style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                      <Text style={MyStyles.btn_primary}>Yes</Text>
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

        this.state.questionnaire_list = responseJson.result_data.questionnaire_list

        if (this.state.questionnaire_list.length > 0) {
          this.state.questionnaire_list.forEach(element => {
            element.is_selected = false
          })
          if (this.state.edit_baby_id == 0) {
            this.state.questionnaire_list[0].is_selected = true
          } else {
            const index = this.state.questionnaire_list.findIndex(item => item.id == this.state.edit_baby_id)
            this.state.questionnaire_list[index].is_selected = true
          }
        }

        this.setState({ questionnaire_list: this.state.questionnaire_list })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestAddQuestionnaireItem(p_title) {
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
        title: p_title
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

        this.setState({ edit_baby_id: responseJson.result_data.questionnaire_detail.id })
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

  // 현재위치로부터 날씨 api를 호출해서 지역정보를 얻는다.
  requestGetMyPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //현재 위치 가져옴 position = 현재위치, JSON 형태
        console.log(position)
        this._getWeather(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        //가져오기 실패 했을 경우.
        // this.refs.toast.showBottom("Please allow location permissions in Settings.")
      }, {
        //Accuracy가 높아야하는지, 위치를 가져오는데 max 시간, 가져온 위치의 마지막 시간과 현재의 차이
        enableHighAccuracy: false, timeout: 20000, maximumAge: 1000
      });
  }

  _getWeather = (latitude, longitude) => {
    console.log("0000000=" + latitude + ":" + longitude)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      .then(response => response.json()) // 응답값을 json으로 변환
      .then(json => {
        console.log(json);
      });
  }

  requestCountryList() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.contactUsCategory, {
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
        console.log(responseJson)
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        const data = [];

        responseJson.result_data.contact_us_category.forEach(element => {
          data.push({ value: element.title })
        });

        // data.push({ value: "Other" }) // 나중에 직접입력 항목 추가해주어야 함

        this.setState({ country_list: data })
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