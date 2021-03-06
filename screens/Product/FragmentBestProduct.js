// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Linking, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import Carousel from 'react-native-snap-carousel';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyPagination } from '../../components/MyPagination';
import { ProductBestItem } from '../../components/Products/ProductBestItem';
import { MyAppText } from '../../components/Texts/MyAppText';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export class FragmentBestProduct extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.isLoading = false
  }
  componentDidMount() {
    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
    this.requestBannerList3();
  }
  state = {
    categoryItems: Common.getCategoryItems(),
    activeDotIndex: 0,
    product_list_result_data: {
      best_list: []
    },
    banner_list2_result_data: {
      list: []
    },
    beforeCatIdx: 0,
    loading_end: false,
  };

  BannerHeight = 560 / 3;
  ScreenWidth = Dimensions.get('window').width;

  renderBanner = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => {
          if (item.is_direct_link > 0) {
            Linking.openURL(Common.getLinkUrl(item.url))
          } else {
            this.props.navigation.navigate("BannerDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item })
          }
        }}>
          <View>
            <ImageLoad style={{ width: this.ScreenWidth, height: this.BannerHeight }} source={{ uri: Common.getOriginalImageUrl(item.image) }} />
            <View style={[MyStyles.banner_title]}>
              <MyAppText style={{ fontSize: 13, color: "white" }} numberOfLines={1}>{Common.removeHtmlTagsFromText(item.title)}</MyAppText>
              <MyAppText style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }} numberOfLines={3}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
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
              <TouchableOpacity activeOpacity={0.8} onPress={() => { this.onCategorySelect(item.categoryName) }} style={[MyStyles.category_image_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
              </TouchableOpacity>
              <MyAppText style={MyStyles.category_text} numberOfLines={1}>{item.categoryName}</MyAppText>
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
                  <TouchableOpacity activeOpacity={0.8} key={item.name} style={item.is_selected ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                    this.selectedSubCatName = item.name
                    categoryItems = this.state.categoryItems;
                    categoryItems[p_categoryIndex].sub_category.map((item) => (item.is_selected = false))
                    categoryItems[p_categoryIndex].sub_category[index].is_selected = true
                    this.setState({ categoryItems: categoryItems })
                    this.setState({ loading_end: false })
                    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
                  }}>
                    <MyAppText style={item.is_selected ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >{item.name}</MyAppText>
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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
            }
          }}>

          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

            {/* ?????? ?????? */}
            <View style={{
              overflow: "hidden",
              height: this.BannerHeight,
            }}>
              {this.state.banner_list2_result_data.list.length > 0 ?
                <View style={{
                  height: this.BannerHeight,
                  width: this.ScreenWidth
                }}>
                  <Carousel
                    inactiveSlideScale={1}
                    data={this.state.banner_list2_result_data.list}
                    sliderWidth={this.ScreenWidth}
                    itemWidth={this.ScreenWidth}
                    renderItem={this.renderBanner}
                    autoplay={true}
                    loop={true}
                    autoplayInterval={2000}
                    onSnapToItem={(index) => this.setState({ activeDotIndex: index })}
                  />
                  <MyPagination list={this.state.banner_list2_result_data.list} activeDotIndex={this.state.activeDotIndex} />
                  {/* <Carousel
                    delay={3000}
                    indicatorColor="#fe76ab80"
                    inactiveIndicatorColor="#ffffff3c"
                    indicatorOffset={-15} // Indicator relative position from top or bottom
                    index={0}
                  >
                    {this.state.banner_list2_result_data.list.map((item, index) => this.renderBanner(item, index))}
                  </Carousel> */}
                </View>
                :
                null}
            </View>

            {/* ???????????? ?????? ?????? */}
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

            {/* product ?????? */}
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
              <MyAppText style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Best Product</MyAppText>
              <FlatGrid
                itemDimension={this.ScreenWidth / 2 - 30}
                items={this.state.product_list_result_data.best_list}
                style={MyStyles.gridView}
                spacing={10}
                renderItem={({ item, index }) => (
                  <ProductBestItem item={item} index={index} this={this}></ProductBestItem>
                )}
              />
            </View>

          </View>
        </ScrollView>
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
    console.log("category= " + p_category);
    console.log("p_sub_category = " + p_sub_category)
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        if (p_offset == 0) { // ???????????? ??????????????? offset?????? 0???????????? ???????????? ???.
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
        this.setState({ product_list_result_data: result }, () => {
          this.isLoading = false
        })
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
        console.log(responseJson);
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
        console.log(responseJson);
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
        // console.log(responseJson);
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
};