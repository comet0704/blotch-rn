import React, { Component } from 'react';
import ImageLoad from 'react-native-image-placeholder';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
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
import { Dropdown } from 'react-native-material-dropdown';
import Common from '../../assets/Common';

export default class QuestionnareScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      section_basic_info: false,
      section_skin_type: false,
      section_product_reference: false,
      section_skin_routine: true,
      questionnaire_detail: {
        "id": 1,
        "uid": 3,
        "title": "Me",
        "birth": "2019-04-08",
        "gender": "M",
        "location": "Tokyo",
        "marital_status": "N",
        "is_kids": "N",
        "skin_type": "Dry",
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
    };
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
          style={{ flex: 1 }}
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

  onDaySelect = (selectedDay) => {
    this.setState({ birthday: selectedDay.date_string })
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
                height: 400 / 3
              }}>
                {
                  this.renderMyBabies()
                }
              </View>

              {/* Step 01 : Basic Info */}
              <View style={[{ borderLeftColor: Colors.primary_purple }, MyStyles.ingredient_section]}>
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
                      <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} />
                    </View>
                  </View>
                </TouchableOpacity>
                <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                {
                  this.state.section_basic_info ?
                    <View style={[MyStyles.padding_main]}>
                      {/* Day of Birth */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>Area</Text>
                        <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                          <TextInput value={this.state.birthday} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="YYYY - MM - DD" />
                          <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
                        </TouchableOpacity>
                      </View>
                      {/* Gender */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>Gender</Text>
                        <View style={{ marginTop: 10, flexDirection: "row" }}>
                          <TouchableOpacity style={MyStyles.question_gender_on}>
                            <Image source={require("../../assets/images/ic_gender_female.png")} style={[MyStyles.ic_gender_female]} />
                            <Text style={{ fontSize: 12, marginTop: 5, color: Colors.color_primary_pink }}>Female</Text>
                          </TouchableOpacity>
                          <View style={{ flex: 1 }} />
                          <TouchableOpacity style={MyStyles.question_gender_off}>
                            <Image source={require("../../assets/images/ic_gender_male.png")} style={[MyStyles.ic_gender_male]} />
                            <Text style={{ fontSize: 12, marginTop: 5, color: Colors.color_e3e5e4 }}>Male</Text>
                          </TouchableOpacity>
                          <View style={{ flex: 1 }} />
                          <TouchableOpacity style={MyStyles.question_gender_off}>
                            <Image source={require("../../assets/images/ic_gender_unspecified.png")} style={[MyStyles.ic_gender_unspecified, { marginTop: 31 / 6 }]} />
                            <Text style={{ fontSize: 12, marginTop: 5 + 31 / 6, color: Colors.color_e3e5e4 }}>Unspecitied</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Area */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>Seoul, Kor</Text>
                        <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                          <TextInput value={this.state.birthday} editable={false} style={{ fontSize: 12, paddingRight: 10, flex: 1 }} placeholder="Seoul, Kor" />
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
                      <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked, { marginLeft: 5 }]} />
                    </View>
                  </View>
                </TouchableOpacity>
                <Image style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]} />

                {
                  this.state.section_skin_type ?
                    <View style={[MyStyles.padding_main]}>
                      {/* My skin is */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>My skin is</Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked]} />
                          <Text style={MyStyles.text_12_949292}>Oily</Text>
                        </View>
                      </View>

                      {/* I'm unhappy about my */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>I'm unhappy about my</Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked]} />
                          <Text style={MyStyles.text_12_949292}>Oily</Text>
                        </View>
                      </View>


                      {/* I'm interested in */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <Text style={[MyStyles.question_sub_text1]}>I'm interested in</Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <Image source={require("../../assets/images/ic_question_checked.png")} style={[MyStyles.ic_question_checked]} />
                          <Text style={MyStyles.text_12_949292}>Oily</Text>
                        </View>
                      </View>

                      <View style={{ position: "absolute", overflow: "hidden", top: 0, bottom: 0, right: 0, justifyContent: "center" }}>
                        <TouchableOpacity style={{ marginRight: -190 / 6, width: 190 / 3, height: 190 / 3, justifyContent: "center", backgroundColor: Colors.primary_purple, borderRadius: 190 }}>
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
                        <Text style={[MyStyles.question_sub_text1]}>I use ___ skincare products in one day</Text>
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
                    <View style={[MyStyles.padding_main]}>
                      {/* Day or Night */}
                      <View style={{ marginBottom: 65 / 3 }}>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity style={MyStyles.question_gender_on}>
                            <Image source={require("../../assets/images/ic_sun.png")} style={[MyStyles.ic_sun]} />
                          </TouchableOpacity>
                          <View style={{ flex: 1 }} />
                          <TouchableOpacity style={MyStyles.question_gender_off}>
                            <Image source={require("../../assets/images/ic_night.png")} style={[MyStyles.ic_night]} />
                            <Text style={{ fontSize: 12, marginTop: 5, color: Colors.color_e3e5e4 }}>Male</Text>
                          </TouchableOpacity>
                        </View>
                      </View>


                    </View>
                    : null
                }
              </View>


            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
    );
  }
}