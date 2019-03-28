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
import { FlatGrid } from 'react-native-super-grid';
import StarRating from 'react-native-star-rating';

export default class PotentialAllergensProductScreen extends React.Component {
  offset = 0;
  beforeCatIdx = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props)
    this.state = {
      categoryItems: Common.categoryItems2,
      potentialAllergenProductList_result_data: {
        total_count: 0,
        list: [
        ]
      },
      loading_end: false,
    };
  }

  componentDidMount() {
    this.requestPotentialAllergenProductList(this.state.categoryItems[this.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
  }


  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.beforeCatIdx = index
    this.setState({ categoryItems })

    this.setState({ loading_end: false })
    if (this.state.categoryItems[index].sub_category.length > 0) {
      this.selectedSubCatName = this.state.categoryItems[index].sub_category[0].name;
    } else {            
      this.selectedSubCatName = "";
    }
    this.requestPotentialAllergenProductList(this.state.categoryItems[index].categoryName, this.selectedSubCatName, 0)
  }


  renderCategoryScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>

          {this.state.categoryItems.map(item => (
            <View key={item.categoryName} style={{ marginRight: 10 }}>
              <TouchableOpacity onPress={() => { this.onCategorySelect(item.categoryName) }} style={[MyStyles.category_image_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
              </TouchableOpacity>
              <Text style={MyStyles.category_text} numberOfLines={1}>{item.categoryName}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  renderSubCategory(p_categoryIndex) {
    return (
      this.state.categoryItems[p_categoryIndex].sub_category.length > 0 ?
        <View style={{}}>
          <View>
            <View style={MyStyles.tabbar_button_container}>
              {
                this.state.categoryItems[p_categoryIndex].sub_category.map((item, index) => (
                  <TouchableOpacity key={item.name} style={item.is_selected ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                    this.selectedSubCatName = item.name
                    categoryItems = this.state.categoryItems;
                    categoryItems[p_categoryIndex].sub_category.map((item) => (item.is_selected = false))
                    categoryItems[p_categoryIndex].sub_category[index].is_selected = true
                    this.setState({ categoryItems: categoryItems })
                    this.setState({ loading_end: false })
                    this.requestPotentialAllergenProductList(this.state.categoryItems[this.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
                  }}>
                    <Text style={item.is_selected ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >{item.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        </View>
        : null
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <TopbarWithBlackBack title="Potential Allergens Product" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: "white", }} keyboardDismissMode="on-drag">

          <View>

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

            {
              this.renderSubCategory(this.beforeCatIdx)
            }

            {/* product 나열 */}
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1, backgroundColor: "white" }]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product({this.state.potentialAllergenProductList_result_data.total_count})</Text>
              <FlatGrid
                itemDimension={this.ScreenWidth}
                items={this.state.potentialAllergenProductList_result_data.list}
                style={MyStyles.gridView}
                spacing={10}
                // staticDimension={300}
                // fixed
                // spacing={20}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
                    <View style={[MyStyles.productItemContainer, { width: 418 / 3, aspectRatio: 1.2 }]}>
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
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]}>{item.brand_title}</Text>
                      <Text style={[MyStyles.productName, { textAlign: "left", height: 120 / 3 }]} numberOfLines={2}>{item.title}</Text>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        containerStyle={{ width: 273 / 3 }}
                        starSize={40 / 3}
                        emptyStarColor={Colors.color_star_empty}
                        rating={item.grade}
                        selectedStar={(rating) => { }}
                        fullStarColor={Colors.color_star_full}
                      />
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                        <Image source={require("../../assets/images/ic_comment.png")} style={MyStyles.ic_comment} />
                        <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.comment_count}</Text>
                        <Image source={require("../../assets/images/ic_heart_gray.png")} style={[MyStyles.ic_heart_gray, { marginLeft: 10 }]} />
                        <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.like_count}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.potentialAllergenProductList_result_data.list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { list: product_list };
    this.setState({ potentialAllergenProductList_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.potentialAllergenProductList_result_data.list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { list: product_list };
    this.setState({ potentialAllergenProductList_result_data: result })
  }

  requestPotentialAllergenProductList(p_category, p_sub_category, p_offset) {
    console.log("category = " + p_category);
    console.log("p_sub_category = " + p_sub_category)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.potentialAllergenProductList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        category: p_category == "" ? "All" : p_category,
        category_sub: p_sub_category == "" ? "All" : p_sub_category,
        offset: p_offset.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
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
        this.offset += responseJson.result_data.list.length
        if (responseJson.result_data.list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            potentialAllergenProductList_result_data: responseJson.result_data
          });
          return;
        }
        const list = this.state.potentialAllergenProductList_result_data.list
        result = { list: [...list, ...responseJson.result_data.list] };
        this.setState({ potentialAllergenProductList_result_data: result })
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