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
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';

export class FragmentNewProduct extends React.Component {
  offset = 0;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.requestNewList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.state.selectedSubCatName, this.offset)
    this.requestBannerList2();
  }
  state = {
    categoryItems: Common.categoryItems,
    product_list_result_data: {
      new_list: []
    },
    banner_list2_result_data: {
      list: []
    },
    beforeCatIdx: 0,
    selectedSubCatName : "",
    loading_end: false,
  };

  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  renderBanner(item, index) {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page]: "ProductContainer" })
        }}>
          <View>
            <Image style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: Common.getImageUrl(item.image) }} />
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
              <Text style={{ fontSize: 13, color: "white" }} numberOfLines={1}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }} numberOfLines={3}>{item.content}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.state.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.state.beforeCatIdx = index
    this.setState({ categoryItems })
    
    this.setState({loading_end : false})
    this.requestNewList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.state.selectedSubCatName, 0)
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
                  this.setState({ selectedSubCatName: item.name })
                  categoryItems = this.state.categoryItems;
                  categoryItems[p_categoryIndex].sub_category.map((item) => (item.is_selected = false))
                  categoryItems[p_categoryIndex].sub_category[index].is_selected = true
                  this.setState({categoryItems : categoryItems})
                  this.setState({loading_end : false})
                  this.requestNewList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.state.selectedSubCatName, 0)
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
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestNewList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.state.selectedSubCatName, this.offset)
            }
          }}>

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
                {this.state.banner_list2_result_data.list.map((item, index) => this.renderBanner(item, index))}
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

            {
              this.renderSubCategory(this.state.beforeCatIdx)
            }

            {/* product 나열 */}
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>New Product</Text>
              <FlatGrid
                itemDimension={this.ScreenWidth / 2 - 30}
                items={this.state.product_list_result_data.new_list}
                style={MyStyles.gridView}
                spacing={10}
                // staticDimension={300}
                // fixed
                // spacing={20}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress = {() => {this.props.navigation.navigate("ProductDetail", {[MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.back_page] : "ProductContainer"}) }}>
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
                      {index < 3 ?
                        <View style={[{ position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" }, MyStyles.ic_best_ranking]}>
                          <Image source={require('../../assets/images/ic_best_ranking.png')} style={[MyStyles.background_image]} />
                          <Text style={{ position: "absolute", fontSize: 15, fontWeight: "500", textAlign: "center", color: "white" }}>{index + 1}</Text>
                        </View>
                        : null}
                    </View>
                    <Text style={[MyStyles.productBrand]}>{item.brand_title}</Text>
                    <Text style={[MyStyles.productName]}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

          </View>
        </ScrollView>
      </View>
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.new_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { new_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.new_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { new_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  requestNewList(p_category, p_sub_category, p_offset) {
    console.log("category= " + p_category);
    console.log("\noffset" + p_offset)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.newList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        category: p_category == "" ? "All" : p_category,
        sub_category: p_sub_category,
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
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.new_list.length
        if(responseJson.result_data.new_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({loading_end : true})
        }
        if (p_offset == 0) {
          this.setState({
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const new_list = this.state.product_list_result_data.new_list
        result = { new_list: [...new_list, ...responseJson.result_data.new_list] };
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


  requestBannerList2() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.list2, {
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
        }

        this.setState({
          banner_list2_result_data: responseJson.result_data
        });

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