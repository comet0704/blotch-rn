import React from 'react';
import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import {
  KeyboardAvoidingView,
  View,
  Image,
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

export class FragmentBestProduct extends React.Component {
  
  categoryItems = [
    {
      categoryName: MyConstants.CategoryName.all,
      image_off: require("../../assets/images/Categories/ic_all.png"),
      image_on: require("../../assets/images/Categories/ic_all_on.png"),
      image_style : MyStyles.ic_all,
      is_selected : true,
    },
    {
      categoryName: MyConstants.CategoryName.skin_care,
      image_off: require("../../assets/images/Categories/ic_skin_care.png"),
      image_on: require("../../assets/images/Categories/ic_skin_care_on.png"),
      image_style : MyStyles.ic_skin_care,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.mask,
      image_off: require("../../assets/images/Categories/ic_mask.png"),
      image_on: require("../../assets/images/Categories/ic_mask_on.png"),
      image_style : MyStyles.ic_mask,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.sun_care,
      image_off: require("../../assets/images/Categories/ic_sun_care.png"),
      image_on: require("../../assets/images/Categories/ic_sun_care_on.png"),
      image_style : MyStyles.ic_sun_care,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.make_up,
      image_off: require("../../assets/images/Categories/ic_make_up.png"),
      image_on: require("../../assets/images/Categories/ic_make_up_on.png"),
      image_style : MyStyles.ic_make_up,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.cleansing,
      image_off: require("../../assets/images/Categories/ic_cleansing.png"),
      image_on: require("../../assets/images/Categories/ic_cleansing_on.png"),
      image_style : MyStyles.ic_cleansing,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.hair,
      image_off: require("../../assets/images/Categories/ic_hair.png"),
      image_on: require("../../assets/images/Categories/ic_hair_on.png"),
      image_style : MyStyles.ic_hair,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.nail,
      image_off: require("../../assets/images/Categories/ic_nail.png"),
      image_on: require("../../assets/images/Categories/ic_nail_on.png"),
      image_style : MyStyles.ic_nail,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.perfume,
      image_off: require("../../assets/images/Categories/ic_perfume.png"),
      image_on: require("../../assets/images/Categories/ic_perfume_on.png"),
      image_style : MyStyles.ic_perfume,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.oral,
      image_off: require("../../assets/images/Categories/ic_oral.png"),
      image_on: require("../../assets/images/Categories/ic_oral_on.png"),
      image_style : MyStyles.ic_oral,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.baby,
      image_off: require("../../assets/images/Categories/ic_baby.png"),
      image_on: require("../../assets/images/Categories/ic_baby_on.png"),
      image_style : MyStyles.ic_baby,
      is_selected : false,
    },
    {
      categoryName: MyConstants.CategoryName.men,
      image_off: require("../../assets/images/Categories/ic_men.png"),
      image_on: require("../../assets/images/Categories/ic_men_on.png"),
      image_style : MyStyles.ic_men,
      is_selected : false,
    },
  ];
  state = {
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
    categoryItems : this.categoryItems,
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
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.beforeCatIdx = index
    this.setState({ categoryItems })
  }


  renderCategoryScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.state.categoryItems.map(item => (
            <View key={item.categoryName} style={{ marginRight: 10}}>
              <TouchableOpacity onPress={() => {this.onCategorySelect(item.categoryName)}} style={[MyStyles.category_image_container]}>  
                {item.is_selected ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> :  <Image style={item.image_style} source={item.image_off} />}
              </TouchableOpacity>
              <Text style={MyStyles.category_text} numberOfLines={1}>{item.categoryName}</Text>
            </View>
          ))}
        </ScrollView>
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
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

            <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" automaticallyAdjustContentInsets={true}>
            <View >
        <TopbarWithBlackBack title="Product" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <ScrollableTabView
          style={{ height: 20, borderBottomWidth: 0, marginTop: 10 }}
          initialPage={0}
          tabBarInactiveTextColor={Colors.color_dcdedd}
          tabBarActiveTextColor={Colors.primary_dark}
          tabBarTextStyle={{ fontWeight: "400", fontSize: 14 }}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary_purple }}
          renderTabBar={() => <DefaultTabBar />}
        >

          <View tabLabel="New" style={{ flex: 1 }}>

              <View>
                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                {/* 배너 부분 */}
                <View style={{ overflow: "hidden" }}>
                  <Carousel
                    autoplay
                    autoplayTimeout={3000}
                    loop
                    index={0}
                    pageSize={this.BannerWidth}
                  >
                    {this.state.bannerImages.map((image, index) => this.renderBanner(image, index))}
                  </Carousel>
                </View>

                {/* 카테고리 나열 부분 */}
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.color_f8f8f8,
                  padding: 15,
                  height: 110
                }}>
                  {
                    this.renderCategoryScroll()
                  }
                </View>

                {/* product 나열 */}
                <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
                  <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>New Product</Text>
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
                        </View>
                        <Text style={[MyStyles.productBrand]}>{item.name}</Text>
                        <Text style={[MyStyles.productName]}>{item.code}</Text>
                      </View>
                    )}
                  />
                </View>

              </View>
          </View>
          <View tabLabel="Category"></View>
        </ScrollableTabView>
        </View>
            </ScrollView>

      </KeyboardAvoidingView>
    );
  }
};