// common
import React from 'react';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';

import Carousel from 'react-native-banner-carousel';
import {
  KeyboardAvoidingView,
  View,
  Image,
  Modal,
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';

export class FragmentRecommendProduct extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      main_all_selected: false,
      no_search_result: false,
      filterModalVisible: false,
      weatherType: "dry",
      bannerImages: [
        "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg",
        "http://img.mp.itc.cn/upload/20160817/1164b794aeb34c75a3d0182fa2d0ce21_th.jpg",
        "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"
      ],
      bannerLinkes: [
        "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg",
        "http://img.mp.itc.cn/upload/20160817/1164b794aeb34c75a3d0182fa2d0ce21_th.jpg",
        "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"
      ],
      weatherInfo: "Seoul. -6˚C",

      product_list_result_data: {
        recomment_list: [
          {
            "id": 7,
            "title": "Product-7",
            "image_list": "uploads/product/jakub-dziubak-618225-unsplash.jpg",
            "visit_count": 581,
            "like_count": 16,
            "comment_count": 0,
            "grade": 0,
            "is_liked": 34,
            "brand_title": "ROSITA"
          },
          {
            "id": 30,
            "title": "Product-30",
            "image_list": "uploads/product/john-soo-689351-unsplash.jpg###uploads/product/maxim-lozyanko-1203735-unsplash.jpg###uploads/product/neonbrand-398872-unsplash.jpg",
            "visit_count": 581,
            "like_count": 15,
            "comment_count": 1,
            "grade": 5,
            "is_liked": 53,
            "brand_title": "ASTRAEA"
          },
          {
            "id": 8,
            "title": "Product-8",
            "image_list": "uploads/product/jazmin-quaynor-470729-unsplash.jpg",
            "visit_count": 581,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "CM"
          },
          {
            "id": 9,
            "title": "Product-9",
            "image_list": "uploads/product/j-kelly-brito-383355-unsplash.jpg",
            "visit_count": 581,
            "like_count": 14,
            "comment_count": 0,
            "grade": 0,
            "is_liked": null,
            "brand_title": "MIA"
          }
        ]
      },
      mainCategoryItems: Common.categoryItems_recom,
    };
  }

  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  componentDidMount() {
    this.getRecommendList(0);
  }

  getRecommendList = (p_offset) => {
    // 전체선택인 경우 All 올려보냄
    if (this.state.main_all_selected) {
      this.requestRecommendList(JSON.stringify(category_array), p_offset)
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
    this.requestRecommendList(JSON.stringify(category_array), p_offset)
  }

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.mainCategoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    if (categoryItems[index].is_selected > 0) {
      categoryItems[index].is_selected = 0
    } else if (categoryItems[index].sub_category.length > 0) {
      categoryItems[index].is_selected = 1
    } else {
      categoryItems[index].is_selected = 2
    }

    this.setState({ categoryItems })
    this.setState({ main_all_selected: false })
  }


  renderMyInfo() {
    return (
      <View
      >
        <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
          <Text style={{ fontSize: 14, color: Colors.primary_dark, fontWeight: "bold" }}>My Skin Info</Text>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity style={[{ height: 20 }, MyStyles.purple_round_btn]}>
            <Text style={{ fontSize: 13, color: "white" }}>Me</Text>
            <Image source={require("../../assets/images/ic_arrow_down_white_small.png")} style={[MyStyles.ic_arrow_down_white_small, { marginLeft: 5 }]} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
            <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, width: 115 / 3, borderWidth: 0.5, height: 115 / 3, justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>30's</Text>
            </View>
            <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>30's</Text>
          </View>
          <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
            <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, width: 115 / 3, borderWidth: 0.5, height: 115 / 3, justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>30's</Text>
            </View>
            <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>30's</Text>
          </View>
          <View style={[{ marginRight: 10 }, MyStyles.skin_info_container]}>
            <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, width: 115 / 3, borderWidth: 0.5, height: 115 / 3, justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>30's</Text>
            </View>
            <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>30's</Text>
          </View>
          <View style={[MyStyles.skin_info_container]}>
            <View style={[{ borderRadius: 30, borderColor: Colors.color_f8f8f8, width: 115 / 3, borderWidth: 0.5, height: 115 / 3, justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ textAlign: "center", fontWeight: "bold", color: Colors.primary_dark, fontSize: 12 }}>30's</Text>
            </View>
            <Text style={{ textAlign: "center", color: Colors.color_949191, fontSize: 13, marginTop: 5 }}>30's</Text>
          </View>
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
        {this.state.no_search_result == false ?
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
                  <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product(6)</Text>
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
                  // staticDimension={300}
                  // fixed
                  // spacing={20}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                      <View style={[MyStyles.productItemContainer]}>
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
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
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
                                this.setState({ main_all_selected: !this.state.main_all_selected })
                                if (this.state.main_all_selected == true) { // 전체선택인 경우 state 초기값으로 변환
                                  this.resetFilterStatus();
                                }
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
                              // staticDimension={300}
                              // fixed
                              // spacing={20}
                              renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => { this.onCategorySelect(item.categoryName) }} style={{ borderColor: item.is_selected == 1 ? "#d9b1db" : Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                  <View style={[{ height: 100 / 3, justifyContent: "center", alignItems: "center" }]}>
                                    {item.is_selected == 2 ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}

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

                          {/* Sub Categories */}
                          {this.state.main_all_selected ? null :
                            <Text style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500", marginLeft: 15 }]}>Sub Category</Text>
                          }


                          {this.state.mainCategoryItems.map((item, index) => (
                            item.is_selected > 0 && item.sub_category.length > 0 ?
                              <View key={index}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                  <Text style={[{ color: Colors.primary_purple, fontSize: 12, fontWeight: "400", marginLeft: 15 }]}>{item.categoryName}</Text>
                                  <Text style={{ flex: 1, textAlign: "center" }}></Text>
                                  <TouchableOpacity style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {
                                    this.state.mainCategoryItems[index].sub_all_selected = !this.state.mainCategoryItems[index].sub_all_selected
                                    this.state.mainCategoryItems[index].sub_category.forEach(element => {
                                      element.is_selected = !this.state.mainCategoryItems[index].is_selected
                                    })

                                    if (this.state.mainCategoryItems[index].sub_all_selected == false) {
                                      this.state.mainCategoryItems[index].is_selected = 1
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
                                  // staticDimension={300}
                                  // fixed
                                  // spacing={20}
                                  renderItem={({ item: sub_item, index: sub_index }) => (
                                    <TouchableOpacity onPress={() => {
                                      this.state.mainCategoryItems[index].sub_category[sub_index].is_selected = !this.state.mainCategoryItems[index].sub_category[sub_index].is_selected
                                      moreThanOneSelected = false;
                                      for (i = 0; i < this.state.mainCategoryItems[index].sub_category.length; i++) {
                                        if (this.state.mainCategoryItems[index].sub_category[i].is_selected == true) {
                                          moreThanOneSelected = true
                                        }
                                      }
                                      if (moreThanOneSelected) {
                                        this.state.mainCategoryItems[index].is_selected = 2
                                      }

                                      this.setState({ mainCategoryItems: this.state.mainCategoryItems })
                                    }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                      <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                        {sub_item.is_selected ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
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
          </ScrollView>
          :
          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
            <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
              <View style={{ alignItems: "center" }}>
                <Image source={require("../../assets/images/ic_search_big.png")} style={[MyStyles.ic_search_big,]} />
                <Text style={{ fontSize: 69 / 3, color: Colors.primary_dark, textAlign: "center", marginTop: 30, fontWeight: "bold" }}>Sorry, no result found</Text>
                <Text style={[{ fontSize: 39 / 3, color: Colors.color_c2c1c1, textAlign: "center", marginTop: 10 }, MyStyles.padding_h_main]}>Tell us about your skin and we'll show you some products that you might want to check out!</Text>
                <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 460 / 3, height: 130 / 3, marginTop: 100 / 3 }]}>
                  <Text style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Check Out!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </View>
    );
  }

  requestRecommendList(p_category, p_offset) {
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
};