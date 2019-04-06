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
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import { ProductBestItem } from '../../../components/Products/ProductBestItem';
import Autocomplete from 'react-native-autocomplete-input';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../../components/androidBackButton/handleAndroidBackButton';

const API = 'https://swapi.co/api';
export default class SearchMainScreen extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.currentRouteName = 'SearchMain';
    this.state = {
      searchBoxFocused: false,
      recentSearchWords: [],
      query: '',
      searchWord: '',
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
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    handleAndroidBackButton(this, this.handleBackButtonClick)
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler()
  }

  componentDidMount() {
    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
    this.getRecentSearchWords();
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    if (this.state.searchBoxFocused) {
      this.setState({ searchBoxFocused: false })
      this.refs.searchBox.blur()
      return true
    }
    this.props.navigation.goBack(null)
  }


  getRecentSearchWords() {
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.recent_search_words, (err, result) => {
      if (result != null) {
        searchWords = result.split(Common.SEARCH_KEYWORD_SPLITTER)
        this.setState({ recentSearchWords: searchWords })
      }
    });
  }

  addRecentSearchWords(p_keyword) {
    if (p_keyword == "" || this.state.recentSearchWords.indexOf(p_keyword) > 0) {
      return;
    }
    console.log("addingWord = " + p_keyword);
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.recent_search_words, (err, result) => {
      const settingvalue = (result != null ? result : "") + (result != null ? Common.SEARCH_KEYWORD_SPLITTER : "") + p_keyword
      console.log("settingvalue = " + settingvalue);
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
    if (this.state.searchBoxFocused == false) {
      return []
    }

    return this.state.recentSearchWords.filter(item => item.toLowerCase().indexOf(query == null ? "" : query.toLowerCase()) >= 0);
  }

  goSearchResultScreen() {
    if(this.state.searchWord == "") {
      this.refs.toast.showBottom("Please input search keyword.");
      return;
    }
    console.log("2222222222=" + this.state.searchWord);
    this.props.navigation.navigate("SearchResult", { [MyConstants.NAVIGATION_PARAMS.search_word]: this.state.searchWord })
  }

  render() {

    const { query } = this.state;
    const recentSearchWords = this.findKeyword(query);
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
        <View style={[MyStyles.searchBoxCommon, MyStyles.bg_white]}>
          <TouchableOpacity
            onPress={() => {
              this.handleBackButtonClick()
            }} activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
            <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
              source={require("../../../assets/images/ic_back_black.png")}
            />
          </TouchableOpacity>

          {this.state.searchBoxFocused ?
            <View style={[MyStyles.shadow_2, MyStyles.searchBoxCover, { marginRight: 15 }]}>
              <Image style={{ flex: 1 }}></Image>
              <TouchableOpacity style={{ padding: 8, alignSelf: "center" }} onPress={() => { alert("2차 개발 준비중입니다.") }}>
                <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
              </TouchableOpacity>
            </View>
            :
            <View style={[MyStyles.searchBoxCover]}>
              <Image style={{ flex: 1 }}></Image>
              <TouchableOpacity style={{ padding: 8, alignSelf: "center" }} onPress={() => { alert("2차 개발 준비중입니다.") }}>
                <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
              </TouchableOpacity>
            </View>}
        </View>

        <Autocomplete
          ref='searchBox'
          returnKeyType="search"
          onSubmitEditing={() => { this.addRecentSearchWords(this.state.query); this.setState({ searchBoxFocused: false }); this.goSearchResultScreen() }}
          style={{ height: 36 }}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => this.setState({ searchBoxFocused: true })}
          onBlur={() => this.setState({ searchBoxFocused: false, query: "" })}
          containerStyle={[{ position: "absolute", top: 27, zIndex: 100, right: 80, backgroundColor: "transparent" }, this.state.searchBoxFocused ? { left: 55 } : { left: 40 }]}
          data={recentSearchWords.length === 1 && comp(query, recentSearchWords[0]) ? [] : recentSearchWords}
          defaultValue={query}
          onChangeText={async (text) => {
            await this.setState({ query: "!!!!!!!!!!!!!!!!", searchBoxFocused: true }) //최근 검색어들을 감추기 위한 조작.
            await this.setState({ query: text, searchWord: text, searchBoxFocused: true })
          }
          }
          listContainerStyle={[{ top: 7, }, this.state.searchBoxFocused ? { left: -65, width: this.ScreenWidth + 50 } : { left: -50, width: this.ScreenWidth + 20 }]}
          inputContainerStyle={{ borderColor: "transparent" }}
          placeholder="Enter keywords"
          renderItem={(keyword) => (
            <TouchableOpacity onPress={async () => { await this.setState({ query: keyword, searchWord: keyword, searchBoxFocused: false }); this.goSearchResultScreen() }}>
              <Text style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                {keyword.substring(0, keyword.indexOf(query))}<Text style={{ color: Colors.primary_purple }}>{query}</Text>{keyword.substring(keyword.indexOf(query) + query.length)}
              </Text>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15, marginRight: 15 }]}></View>
            </TouchableOpacity>
          )}
        />

        {
          this.state.searchBoxFocused ? null :
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
        }
      </View >
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