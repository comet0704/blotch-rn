import React from 'react';
import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
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
import MyStyles from '../../constants/MyStyles';
import { FlatGrid } from 'react-native-super-grid';
import MyConstants from '../../constants/MyConstants';
import Common from '../../assets/Common';

export class FragmentRecommendProduct extends React.Component {
  state = {
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

    productList: [
      { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
      { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
      { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
      { name: 'NEPHRITIS', code: '#27ae60' }, { name: 'BELIZE HOLE', code: '#2980b9' },
      { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
      { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
      { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
      { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
      { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
      { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },
    ],
    mainCategoryItems: Common.getCategoryItems().splice(1, Common.categoryItems.length - 1),
  };

  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  renderBanner(image, index) {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => { this.props.navigation.navigate("BannerDetail") }}>
          <View>
            <Image style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: image }} />
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
              <Text style={{ fontSize: 13, color: "white" }}>ESTEE LAUDER</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 24 }}>Advanced Night Repair</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  beforeCatIdx = 0;
  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.mainCategoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.beforeCatIdx = index
    this.setState({ categoryItems })
  }


  renderMyInfo() {
    return (
      <View
      >
        <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
          <Text style={{ fontSize: 14, color: Colors.primary_dark, fontWeight: "bold" }}>My Skin Info</Text>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity style={[{ height:20 }, MyStyles.purple_round_btn]}>
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
        {/* {this.state.categoryItems.map(item => (
            <View key={item.categoryName} style={{ marginRight: 10 }}>
              <TouchableOpacity onPress={() => { this.onCategorySelect(item.categoryName) }} style={[MyStyles.category_image_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
              </TouchableOpacity>
              <Text style={MyStyles.category_text} numberOfLines={1}>{item.categoryName}</Text>
            </View>
          ))} */}
      </View>
    );
  }

  render() {
    const items = [
      { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
      { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
      { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
      { name: 'NEPHRITIS', code: '#27ae60' }, { name: 'BELIZE HOLE', code: '#2980b9' },
      { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
      { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
      { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
      { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
      { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
      { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },
    ];

    let { productList } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.state.no_search_result == false ?
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

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
                  items={productList}
                  style={MyStyles.gridView}
                  spacing={10}
                  // staticDimension={300}
                  // fixed
                  // spacing={20}
                  renderItem={({ item, index }) => (
                    <View>
                      <View style={[MyStyles.productItemContainer, { backgroundColor: item.code }]}>
                        <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} />
                        <TouchableHighlight style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]}>
                          <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                        </TouchableHighlight>
                        <View style={[{ position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" }, MyStyles.ic_best_ranking]}>
                          <Image source={require('../../assets/images/ic_best_ranking.png')} style={[MyStyles.background_image]} />
                          <Text style={{ position: "absolute", fontSize: 15, fontWeight: "500", textAlign: "center", color: "white" }}>{index}</Text>
                        </View>
                      </View>
                      <Text style={[MyStyles.productBrand]}>{item.name}</Text>
                      <Text style={[MyStyles.productName]}>{item.code}</Text>
                    </View>
                  )}
                />
              </View>

            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.filterModalVisible}
              style={{ height: 500 }}
              onRequestClose={() => {
              }}>
              <View style={{ flex: 1 }}>
                <View style={MyStyles.modal_bg1}>
                  <View style={MyStyles.modalContainer}>
                    {/* modal header */}
                    <View style={MyStyles.modal_header}>
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", width: 70 }]} onPress={() => {
                        this.setState({ filterModalVisible: false });
                      }}>
                        <Text style={{ color: Colors.color_dfdfdf, fontSize: 13, fontWeight: "500", }}>reset</Text>
                      </TouchableOpacity>
                      <Text style={MyStyles.modal_title}>Filter</Text>
                      <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                        this.setState({ filterModalVisible: false });
                      }}>
                        <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                      </TouchableOpacity>
                    </View>

                    <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
                    <View style={{}}>
                      {/* Main Category */}
                      <View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={[{ color: Colors.primary_dark, fontSize: 13, fontWeight: "500" }, MyStyles.modal_close_btn]}>Main Category</Text>
                          <Text style={{ flex: 1, textAlign: "center" }}></Text>
                          <TouchableOpacity style={[MyStyles.modal_close_btn, { alignItems: "center", justifyContent: "center", flexDirection: "row" }]} onPress={() => {
                            alert("All");
                          }}>
                            <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_check_small_off.png")}></Image>
                            <Text style={{ marginLeft: 5 }}>All</Text>
                          </TouchableOpacity>

                        </View>

                        <View style={{ height: 200 }}>
                          <FlatGrid
                            itemDimension={this.ScreenWidth / 3 - 40}
                            items={this.state.mainCategoryItems}
                            style={MyStyles.gridView}
                            spacing={10}
                            // staticDimension={300}
                            // fixed
                            // spacing={20}
                            renderItem={({ item, index }) => (
                              <TouchableOpacity onPress={() => { this.onCategorySelect(item.categoryName) }} style={{ borderColor: Colors.color_e3e5e4, marginRight: 5, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }}>
                                <View style={{ height: 100 / 3, justifyContent: "center", alignItems: "center" }}>
                                  {item.is_selected ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
                                  <View style={{ flexDirection: "row", alignItems:"center", justifyContent:"center" }}>
                                    {item.is_selected ? <Image style={item.image_style_small} source={item.image_on} /> : <Image style={item.image_style_small} source={item.image_off} />}
                                    {item.is_selected ? <Text style={[MyStyles.category_text1, { marginLeft: 5, color: "white" }]} numberOfLines={1}>{item.categoryName}</Text> : <Text style={[MyStyles.category_text1, { marginLeft: 5 }]} numberOfLines={1}>{item.categoryName}</Text>}
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )}
                          />

                        </View>
                      </View>
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
};