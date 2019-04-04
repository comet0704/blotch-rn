// common
import React from 'react';
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

const API = 'https://swapi.co/api';
export default class SearchMainScreen extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.state = {
      searchBoxFocused:false,
      recentSearchWords: [],
      query: '',
      categoryItems: Common.getCategoryItems(),
      product_list_result_data: {
        best_list: []
      },
      banner_list2_result_data: {
        list: []
      },
      beforeCatIdx: 0,
      loading_end: false,
    };
  }
  componentDidMount() {
    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
    this.requestBannerList3();
    this.getRecentSearchWords();
  }

  getRecentSearchWords() {
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.recent_search_words, (err, result) => {
      if (result != null) {
        console.log("result = " + result);
        searchWords = result.split(Common.SEARCH_KEYWORD_SPLITTER)
        this.setState({ recentSearchWords: searchWords })
        console.log("!!!!!!!!!!!!! = " + this.state.recentSearchWords);
      }
    });
  }

  addRecentSearchWords(p_keyword) {
    if(p_keyword == "" || this.state.recentSearchWords.indexOf(p_keyword) > 0) {
      return;
    }
    console.log("addingWord = " + p_keyword);
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.recent_search_words, (err, result) => {
      const settingvalue = result + (result != null ? Common.SEARCH_KEYWORD_SPLITTER : "") + p_keyword
      console.log("settingvalue = " + settingvalue);
      AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.recent_search_words, settingvalue);

      // 설정후 새 값을 얻어야 함.
      this.getRecentSearchWords()
    });
  }

  BannerHeight = 560 / 3;
  BannerWidth = Dimensions.get('window').width;
  ScreenWidth = Dimensions.get('window').width;

  renderBanner(item, index) {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => {
          this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id })
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

    this.setState({ loading_end: false })
    if (this.state.categoryItems[index].sub_category.length > 0) {
      this.selectedSubCatName = this.state.categoryItems[index].sub_category[0].name;
    } else {
      this.selectedSubCatName = "";
    }
    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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
                {item.is_selected ? <Image source={require("../../../assets/images/Home/ic_advice_bg.png")} style={[MyStyles.background_image]} /> : null}
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
                    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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
    if(this.state.searchBoxFocused == false) {
      return []
    }

    return this.state.recentSearchWords.filter(item => item.toLowerCase().indexOf(query==null ? "" : query.toLowerCase()) >= 0);
  }

  render() {

    const { query } = this.state;
    const recentSearchWords = this.findKeyword(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

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

        {/* Search bar */}
        <View style={[{ marginTop: 27, height: 40, paddingTop: 2, paddingBottom: 2, justifyContent: "center", flexDirection: "row", }, MyStyles.container, MyStyles.bg_white]}>
          <TouchableOpacity
            onPress={() => { this.props.goBack(null) }} activeOpacity={0.5} style={{ alignSelf: "center" }} >
            <Image style={[MyStyles.backButton, { marginTop: 0 }]}
              source={require("../../../assets/images/ic_back_black.png")}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>

          </View>

          <TouchableOpacity style={{ padding: 8 }} onPress={() => { alert("2차 개발 준비중입니다.") }}>
            <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
          </TouchableOpacity>
        </View>

        <Autocomplete
          returnKeyType="search"
          onSubmitEditing={() => { this.addRecentSearchWords(this.state.query); this.setState({searchBoxFocused:false}) }}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => this.setState({searchBoxFocused:true})}
          onBlur={() => this.setState({searchBoxFocused:false, query:""})}
          containerStyle={{ position: "absolute", top: 25, zIndex: 100, left: 40, right: 80, backgroundColor: "transparent" }}
          data={recentSearchWords.length === 1 && comp(query, recentSearchWords[0]) ? [] : recentSearchWords}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text, searchBoxFocused:true })}
          listContainerStyle={{ left: -40, width: this.ScreenWidth, top: 5, }}
          inputContainerStyle={{ borderColor: "transparent" }}
          placeholder="Enter keywords"
          renderItem={(keyword) => (
            <TouchableOpacity onPress={() => this.setState({ query: keyword, searchBoxFocused:false })}>
              <Text style={{ padding: 10 }}>
                {keyword}
              </Text>
              <View style={MyStyles.seperate_line_e5e5e5}></View>
            </TouchableOpacity>
          )}
        />
        
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
          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
            onScroll={({ nativeEvent }) => {
              if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
                this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
              }
            }}>
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Best Product</Text>
              <FlatGrid
                itemDimension={this.ScreenWidth / 2 - 30}
                items={this.state.product_list_result_data.best_list}
                style={MyStyles.gridView}
                spacing={10}
                // staticDimension={300}
                // fixed
                // spacing={20}
                renderItem={({ item, index }) => (
                  <ProductBestItem item={item} index={index} this={this}></ProductBestItem>
                )}
              />
            </View>
          </ScrollView>

        </View>

      </View>
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.best_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { best_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.product_list_result_data.best_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { best_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  requestBestList(p_category, p_sub_category, p_offset) {
    // console.log("category= " + p_category);
    // console.log("p_sub_category = " + p_sub_category)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.bestList, {
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
        this.offset += responseJson.result_data.best_list.length
        if (responseJson.result_data.best_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const best_list = this.state.product_list_result_data.best_list
        result = { best_list: [...best_list, ...responseJson.result_data.best_list] };
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


  requestBannerList3() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.list3, {
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
        // console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
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
        // console.log(responseJson);
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
        // console.log(responseJson);
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