// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../../constants/MyStyles'
import MyConstants from '../../../constants/MyConstants'
import Common from '../../../assets/Common';
import Net from '../../../Net/Net';
import Colors from '../../../constants/Colors';

import Carousel from 'react-native-banner-carousel';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Image,
  Dimensions,
  WebBrowser,
  Modal,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import { ProductBestItem } from '../../../components/Products/ProductBestItem';
import Autocomplete from 'react-native-autocomplete-input';

export default class SearchBrandDetailScreen extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.state = {
      brand_id: 0,
      detailModalVisible: false,
      searchBoxFocused: false,
      recentSearchWords: [],
      query: '',
      categoryItems: Common.getCategoryItems(),
      product_list_result_data: {
        product_count: 0,
        product_list: []
      },
      brand_detail_result_data: {
        detail: {
          "id": 0,
          "title": "",
          "information": "",
          "image": "",
          "is_liked": 0
        }
      },
      beforeCatIdx: 0,
      loading_end: false,
    };
  }
  componentDidMount() {
    w_item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    this.setState({ brand_id: w_item_id });
    this.requestProductList(w_item_id, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
    this.requestBrandDetail(w_item_id);
  }

  addRecentSearchWords(p_keyword) {
    if (p_keyword == "" || this.state.recentSearchWords.indexOf(p_keyword) > 0) {
      return;
    }
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.recent_search_words, (err, result) => {
      const settingvalue = result + (result != null ? Common.SEARCH_KEYWORD_SPLITTER : "") + p_keyword
      AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.recent_search_words, settingvalue);

      // 설정후 새 값을 얻어야 함.
      this.getRecentSearchWords()
    });
  }

  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.state.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.state.beforeCatIdx = index
    this.setState({ categoryItems })

    this.setState({ loading_end: false })
    if (this.state.categoryItems[index].sub_category.length > 0) {
      this.selectedSubCatName = this.state.categoryItems[index].sub_category[0].name;
    } else {
      this.selectedSubCatName = "";
    }
    this.requestProductList(this.state.brand_id, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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
                {item.is_selected ? <Image source={require("../../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
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
        <View style={{ backgroundColor: "white" }}>
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
                    this.requestProductList(this.state.brand_id, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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

  findKeyword(query) {
    if (this.state.searchBoxFocused == false) {
      return []
    }

    return this.state.recentSearchWords.filter(item => item.toLowerCase().indexOf(query == null ? "" : query.toLowerCase()) >= 0);
  }

  render() {

    const { query } = this.state;
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={{ flex: 1, backgroundColor: Colors.color_f2f2f2 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />


        {/* Search bar */}
        <View style={[MyStyles.searchBoxCommon, { paddingRight: 15, }, MyStyles.bg_white]}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.searchBoxFocused) {
                this.setState({ searchBoxFocused: false })
                this.refs.searchBox.blur()
                return
              }
              this.props.navigation.pop(2)
            }}
            activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
            <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
              source={require("../../../assets/images/ic_back_black.png")}
            />
          </TouchableOpacity>

          <View style={[MyStyles.searchBoxCover, { paddingLeft: 0 }]}>
            {/* <Image source={require('../../../assets/images/Home/ic_search.png')} style={{ width: 13, height: 11, alignSelf: "center" }} /> */}
            <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingLeft: 5, paddingRight: 5 }} value={this.state.brand_detail_result_data.detail.title} placeholder="Search keyword"></TextInput>
            <TouchableOpacity style={{ padding: 8, alignSelf: "center" }} onPress={() => { this.props.navigation.navigate("SearchCamera") }}>
              <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>

        {/* 브랜디 아이템 */}
        <View style={[MyStyles.padding_h_main, MyStyles.padding_v_25, { alignItems: "center" }]}>
          <Image source={require("../../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} />
          <TouchableOpacity style={{ position: "absolute", top: 10, left: 0, padding: 15 }}
            onPress={() => {
              this.props.navigation.goBack()
            }} >
            <Image source={require("../../../assets/images/ic_back2.png")} style={[MyStyles.ic_back2,]} />
          </TouchableOpacity>
          <View>
            <View style={{ height: 110, width: "100%", alignItems: "center" }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ detailModalVisible: true }) }}>
                <View>
                  { // 이미지가 없을 경우 브랜드 명을 가운데 현시해주자
                    this.state.brand_detail_result_data.detail.image == null || this.state.brand_detail_result_data.detail.image.length <= 0
                      ?
                      <View style={[MyStyles.brandTitleCover]}>
                        <Text style={MyStyles.brandTitle1}>{this.state.brand_detail_result_data.detail.title}</Text>
                      </View>
                      :
                      null
                  }
                  <Image style={[{ width: 85, height: 85 }, MyStyles.brandImage]} source={{ uri: Common.getImageUrl(this.state.brand_detail_result_data.detail.image) }} />
                </View>

              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: "white", bottom: -5, textAlign: "center", position: "absolute", width: "100%", textAlign: "center" }} numberOfLines={1}>{this.state.brand_detail_result_data.detail.title} ></Text>
              {
                this.state.brand_detail_result_data.detail.is_liked > 0
                  ?
                  <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { this.requestBrandUnlike(this.state.brand_detail_result_data.detail.id) }}>
                    <Image source={require('../../../assets/images/ic_heart2_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { this.requestBrandLike(this.state.brand_detail_result_data.detail.id) }}>
                    <Image source={require('../../../assets/images/ic_heart2_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }
            </View>
          </View>
        </View>

        {/* 브랜드 설명 */}
        <Text style={[{ fontSize: 13, color: Colors.color_656565, backgroundColor: "white", minHeight: 215 / 3 }, MyStyles.container, MyStyles.padding_v_main]} numberOfLines={3}>
          {this.state.brand_detail_result_data.detail.information}
        </Text>

        <View style={{ flex: 1 }}>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

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
          <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: "white" }} keyboardDismissMode="on-drag"
            onScroll={({ nativeEvent }) => {
              if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
                this.requestProductList(this.state.brand_id, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
              }
            }}>
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Products({this.state.product_list_result_data.product_list.length})</Text>
              <FlatGrid
                itemDimension={this.ScreenWidth / 2 - 30}
                items={this.state.product_list_result_data.product_list}
                style={MyStyles.gridView}
                spacing={10}
                renderItem={({ item, index }) => (
                  <ProductBestItem item={item} index={index} this={this}></ProductBestItem>
                )}
              />
            </View>
          </ScrollView>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.detailModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  {/* 배경 및 브랜디 이미지 */}
                  <View style={{ height: 275 / 3, alignItems: "center" }}>
                    <Image style={[MyStyles.background_image]} source={require("../../../assets/images/ic_gradient_bg.png")} />

                    <View style={{ position: "absolute", bottom: -85 / 2 }}>
                      <View style={{ width: 85, height: 85 }}>
                        <TouchableOpacity style={[{ flex: 1, borderRadius: 50, }]}>
                          <View style={[MyStyles.shadow_5, { borderRadius: 50 }]}>
                            { // 이미지가 없을 경우 브랜드 명을 가운데 현시해주자
                              this.state.brand_detail_result_data.detail.image == null || this.state.brand_detail_result_data.detail.image.length <= 0
                                ?
                                <View style={[MyStyles.brandTitleCover]}>
                                  <Text style={MyStyles.brandTitle1}>{this.state.brand_detail_result_data.detail.title}</Text>
                                </View>
                                :
                                null
                            }
                            <ImageLoad style={{ width: 85, height: 85, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(this.state.brand_detail_result_data.detail.image) }} />
                          </View>
                        </TouchableOpacity>
                        {
                          this.state.brand_detail_result_data.detail.is_liked > 0
                            ?
                            <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0, zIndex: 100 }, MyStyles.heart2]} onPress={() => { this.requestBrandUnlike(this.state.brand_detail_result_data.detail.id) }}>
                              <Image source={require('../../../assets/images/ic_heart2_on.png')} style={[MyStyles.background_image]} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { this.requestBrandLike(this.state.brand_detail_result_data.detail.id) }}>
                              <Image source={require('../../../assets/images/ic_heart2_off.png')} style={[MyStyles.background_image]} />
                            </TouchableOpacity>
                        }
                      </View>
                    </View>
                  </View>

                  {/* close 버튼 */}
                  <TouchableOpacity style={[MyStyles.modal_close_btn, { position: "absolute", top: 0, right: 0 }]} onPress={() => {
                    this.setState({ detailModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../../assets/images/ic_close2.png")} />
                  </TouchableOpacity>

                  <View style={{ marginTop: 200 / 3, }}>
                    <View style={[{ flexDirection: "row", flex: 1, justifyContent: "center" }, MyStyles.container]}>
                      <Text style={[MyStyles.text_14, { flex: 1, alignSelf: "center" }]}>{this.state.brand_detail_result_data.detail.title}</Text>
                      <Text style={{ fontSize: 12, color: "#949393", alignSelf: "center", paddingTop: 10, paddingBottom: 10 }} onPress={() =>
                        this.props.navigation.navigate("ProductContainer", { [MyConstants.NAVIGATION_PARAMS.product_container_initial_page]: 2 })}>Products({this.state.product_list_result_data.product_list.length})</Text>
                    </View>
                    <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15, marginTop: 20 }]}></View>

                    <ScrollView style={{ maxHeight: 650 / 3 }}>
                      <Text style={[MyStyles.container, { paddingTop: 20, paddingBottom: 40, overflow: "scroll" }, MyStyles.text_13_656565]}>
                        {this.state.brand_detail_result_data.detail.information}
                      </Text>
                    </ScrollView>
                  </View>

                </View>

              </View>
            </View>
          </Modal>
        </View>
      </View >
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.product_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { product_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.product_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { product_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  requestBrandDetail(p_brand_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.brand.detail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(error);
          return;
        }
        this.setState({
          brand_detail_result_data: responseJson.result_data
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

  requestProductList(p_brand_id, p_category, p_sub_category, p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.brand.productList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id,
        category: p_category == "" ? "All" : p_category,
        sub_category: p_sub_category,
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
        this.offset += responseJson.result_data.product_list.length
        if (responseJson.result_data.product_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const product_list = this.state.product_list_result_data.product_list
        result = { product_list: [...product_list, ...responseJson.result_data.product_list] };
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

  requestBrandLike(p_brand_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.brand.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id.toString()
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
        this.requestBrandDetail(this.state.brand_id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestBrandUnlike(p_brand_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.brand.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id.toString()
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
        this.requestBrandDetail(this.state.brand_id);
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