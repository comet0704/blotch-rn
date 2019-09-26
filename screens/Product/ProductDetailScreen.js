// common
import React from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalDropdown from 'react-native-modal-dropdown';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import Messages from '../../constants/Messages';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';
import { FragmentProductDetailIngredients } from './FragmentProductDetailIngredients';
import { FragmentProductDetailReviews } from './FragmentProductDetailReviews';


export default class ProductDetailScreen extends React.Component {

  item_id = "";

  constructor(props) {
    super(props)
    item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    this.item_info = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_info)
    this.state = {
      product_detail_result_data: {
        detail: {
          "id": 1,
          "title": this.item_info ? this.item_info.title : "",
          "image_list": this.item_info ? this.item_info.image_list : "", // 반점으로 구분하여 배열로 사용
          "visit_count": this.item_info ? this.item_info.visit_count : "",
          "like_count": this.item_info ? this.item_info.like_count : "",
          "comment_count": this.item_info ? this.item_info.comment_count : "",
          "grade": this.item_info ? this.item_info.grade : "",
          "brand_id": 0,
          "is_liked": null,
          "brand_title": this.item_info ? this.item_info.brand_title : ""
        },
        product_category: [

        ]
      },
      matched: false,
      blotched: false,
      starCount: 3.5,
      modalVisible: false,
      curImageIdx: 1,
      tabbar: {
        Ingredients: true,
        Reviews: false,
      },
      album_list: [

      ],
      visible_bottom_bar: true,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.requestProductDetail(item_id)
    if (global.login_info.token.length > 0) {
      this.requestMyList()
    }
  }

  componentWillUnmount() {

    this._isMounted = false;
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Please check the cosmetics.\n' + this.state.product_detail_result_data.detail.brand_title + "/" + this.state.product_detail_result_data.detail.title + "..",
        url: Common.getImageUrl(this.state.product_detail_result_data.detail.image_list.split(Common.IMAGE_SPLITTER)[0]),
        title: "From Blotch'd app"
      }, {
        // Android only:
        dialogTitle: 'Share It',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  BannerHeight = 760 / 3;
  ScreenWidth = Dimensions.get('window').width;
  renderImages = ({ item, index }) => {
    return (
      <View key={index} style={[MyStyles.shadow_2, { width: "100%", height: "100%", borderRadius: 10, overflow: "hidden" }]}>
        <View>
          <ImageLoad style={{ width: "100%", height: this.BannerHeight }} source={{ uri: Common.getImageUrl(item) }} />
          {/* <Image
            style={{ width: this.ScreenWidth, height: this.BannerHeight }} {...{ preview, uri }} /> */}
        </View>
      </View>
    )
  };

  onAddBeautyBox = () => {
    this.requestAddBeautyBox(item_id)
  }
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />
        <TopbarWithBlackBack rightBtn="true" title="Product" onPress={() => { this.props.navigation.goBack(null) }} onRightBtnPress={() => { this.onShare() }}></TopbarWithBlackBack>

        <ScrollView ref={(w_scrollview) => { this.wScrollView = w_scrollview }} style={{ flex: 1, flexDirection: 'column', backgroundColor: "white" }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>

            {/* 이미지 부분 */}
            <View style={[{ overflow: "hidden", marginTop: 5, justifyContent: "center", alignItems: "center", alignSelf: "center", width: this.ScreenWidth, height: this.BannerHeight }]}>
              {this.state.product_detail_result_data.detail.image_list != null && this.state.product_detail_result_data.detail.image_list.length > 0 ?
                <View
                  style={{
                    height: this.BannerHeight,
                  }}
                >
                  <Carousel
                    data={this.state.product_detail_result_data.detail.image_list.split(Common.IMAGE_SPLITTER)}
                    sliderWidth={this.ScreenWidth}
                    itemWidth={this.ScreenWidth - 30}
                    renderItem={this.renderImages}
                    autoplay={true}
                    inactiveSlideScale={0.95}
                    loop={true}
                    autoplayInterval={2000}
                    onSnapToItem={(index) => {
                      this.state.curImageIdx = index + 1;
                      this.setState({ curImageIdx: this.state.curImageIdx })
                    }}
                  />
                  <View style={{ position: "absolute", bottom: 10, justifyContent: "center", width: "100%", flexDirection: "row", alignItems: "center" }}>
                    <MyAppText style={{ backgroundColor: Colors.color_636364, paddingLeft: 10, paddingRight: 10, borderRadius: 10, color: "white", textAlign: "center" }}>{(this.state.curImageIdx) + "/" + this.state.product_detail_result_data.detail.image_list.split(Common.IMAGE_SPLITTER).length}</MyAppText>
                  </View>
                </View>
                :
                null
              }
              {
                this.state.product_detail_result_data.detail.is_liked > 0
                  ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item1]} onPress={() => { this.requestProductUnlike(this.state.product_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item1]} onPress={() => { this.requestProductLike(this.state.product_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }

            </View>

            {/* Description */}
            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                  this.props.navigation.navigate("SearchBrandDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: this.state.product_detail_result_data.detail.brand_id })
                }}
                  style={[{ flexDirection: "row", alignItems: "center", borderWidth: 0.5, paddingLeft: 5, paddingRight: 5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }]}>
                  <MyAppText style={{ color: Colors.color_949191 }}>{this.state.product_detail_result_data.detail.brand_title} </MyAppText>
                  <Image source={require("../../assets/images/ic_arrow_right_gray.png")} style={MyStyles.ic_arrow_right_gray} />
                </TouchableOpacity>

                <ScrollView
                  style={{ marginLeft: 70 / 3, flex: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {this.state.product_detail_result_data.product_category.map(item => {
                    return (
                      <View key={item.id} style={[MyStyles.category_tag]}>
                        <MyAppText style={{ fontSize: 13, color: Colors.color_949292 }}>#{item.main_category.toUpperCase()}{item.sub_category ? " > " + item.sub_category.toUpperCase() : ""}</MyAppText>
                      </View>
                    )
                  })
                  }
                </ScrollView>
              </View>
              <MyAppText style={{ fontSize: 63 / 3, color: Colors.primary_dark, marginTop: 30 / 3, marginBottom: 25 }}>{this.state.product_detail_result_data.detail.title}
              </MyAppText>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 69 / 3, }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <MyAppText style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.product_detail_result_data.detail.like_count}</MyAppText>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                  this.setState({
                    gradeVisible: !this.state.gradeVisible
                  });
                }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    containerStyle={{ width: 273 / 3, marginLeft: 15 }}
                    starSize={50 / 3}
                    emptyStarColor={Colors.color_star_empty}
                    rating={this.state.product_detail_result_data.detail.grade}

                    fullStarColor={Colors.color_star_full}
                  />
                </TouchableOpacity>
                {this.state.gradeVisible ?
                  <View style={[{ position: "absolute", bottom: -30, zIndex: 1000, right: -3, justifyContent: "center", alignItems: "center" }, MyStyles.ic_star_rate_bg1]}>
                    <Image source={require("../../assets/images/ic_star_rate_bg1.png")} style={[MyStyles.background_image]} />
                    <MyAppText style={{ color: Colors.color_star_full, alignSelf: "center", marginTop: 2, fontSize: 12 }}>{parseFloat(this.state.product_detail_result_data.detail.grade).toFixed(1)}</MyAppText>
                  </View>
                  : null}
              </View>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            <View style={[MyStyles.padding_h_main, MyStyles.padding_v_20]}>
              <TouchableOpacity activeOpacity={0.8} style={{ borderRadius: 4, backgroundColor: Colors.primary_purple, flex: 1, height: 115 / 3, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => {
                this.onAddBeautyBox()
              }}>
                <Image source={require("../../assets/images/ic_beauty_box.png")} style={[MyStyles.ic_beauty_box]} />
                <MyAppText style={{ marginLeft: 10, fontSize: 13, color: "white" }}>
                  Add to My Beauty Box
              </MyAppText>
              </TouchableOpacity>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Ingredients and Reviews */}
            <View style={{}}>
              <View style={MyStyles.tabbar_button_container}>
                <TouchableOpacity activeOpacity={0.8} style={this.state.tabbar.Ingredients ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: true, Reviews: false } })
                }}>
                  <MyAppText style={this.state.tabbar.Ingredients ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Ingredients</MyAppText>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={this.state.tabbar.Reviews ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: false, Reviews: true } })
                }}>
                  <MyAppText style={this.state.tabbar.Reviews ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Reviews</MyAppText>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 20 }}>
                {this.state.tabbar.Ingredients ?
                  <FragmentProductDetailIngredients toast={this.refs.toast} item_id={item_id}></FragmentProductDetailIngredients>
                  :
                  <FragmentProductDetailReviews this={this} toast={this.refs.toast} item_id={item_id} comment_count={this.state.product_detail_result_data.detail.comment_count}></FragmentProductDetailReviews>
                }
              </View>
            </View>
          </View>

          {/* 하단바 */}
          {/* <LinearGradient colors={['#fefefe', '#f8f8f8']} style={{ height: 3 }} ></LinearGradient> */}
          {this.state.visible_bottom_bar ?
            <View style={[{ height: 215 / 3, flexDirection: "row", alignItems: "center" }, MyStyles.shadow_2]}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: "center", alignItems: "center" }} onPress={() => { this.state.product_detail_result_data.detail.user_match == "M" ? this.requestDeleteMatch(this.state.product_detail_result_data.detail.id) : this.requestAddMatch(this.state.product_detail_result_data.detail.id, 0) }}>
                  {this.state.product_detail_result_data.detail.user_match == "M" ? <Image source={require('../../assets/images/ic_match_on.png')} style={[MyStyles.ic_match]} /> : <Image source={require('../../assets/images/ic_match_off.png')} style={[MyStyles.ic_match]} />}
                  {this.state.product_detail_result_data.detail.user_match == "M" ? <MyAppText style={{ marginTop: 5, fontSize: 13, color: Colors.color_6bd5be }}>Match'd</MyAppText> : <MyAppText style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Match'd</MyAppText>}
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: "center", alignItems: "center" }} onPress={() => { this.state.product_detail_result_data.detail.user_match == "B" ? this.requestDeleteMatch(this.state.product_detail_result_data.detail.id) : this.requestAddMatch(this.state.product_detail_result_data.detail.id, 1) }}>
                  {this.state.product_detail_result_data.detail.user_match == "B" ? <Image source={require('../../assets/images/ic_blotch_on.png')} style={[MyStyles.ic_blotch]} /> : <Image source={require('../../assets/images/ic_blotch_off.png')} style={[MyStyles.ic_blotch]} />}
                  {this.state.product_detail_result_data.detail.user_match == "B" ? <MyAppText style={{ marginTop: 5, fontSize: 13, color: Colors.color_f691a1 }}>Blotch'd</MyAppText> : <MyAppText style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Blotch'd</MyAppText>}
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                {this.state.album_list.length > 0 ?
                  <ModalDropdown ref="dropdown_2"
                    style={[MyStyles.dropdown_2, { height: 30, width: 280 / 3, marginRight: 15 }]}
                    defaultIndex={0}
                    defaultValue="Save as ▾"
                    textStyle={MyStyles.dropdown_2_text}
                    dropdownStyle={MyStyles.dropdown_2_dropdown}
                    options={this.state.album_list}
                    enableEmptySections={true}
                    renderButtonText={(rowData) => "Save as ▾"}
                    renderRow={Common._dropdown_3_renderRow.bind(this)}
                    onSelect={(idx, rowData) => {
                      // this.requestCheckInMyList(rowData.id, item_id)
                      this.requestAddToMyList(rowData.id, item_id)
                    }}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => Common._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                  />
                  :
                  <TouchableOpacity style={[MyStyles.dropdown_2, { height: 30, width: 280 / 3, marginRight: 15 }]} onPress={() => {
                    Alert.alert(
                      '',
                      "Please add the list from the My list",
                      [
                        {
                          text: 'OK', onPress: () => {
                            this.props.navigation.navigate('MyList');
                          }
                        },
                      ],
                      { cancelable: false },
                    );
                  }}>
                    <Text style={MyStyles.dropdown_2_text}>Save as ▾</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
            :
            null}
        </ScrollView>

      </KeyboardAvoidingView >
    );
  }

  requestProductDetail(p_product_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.detail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({
        //   isLoading: false,
        // });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        if (this._isMounted) {
          this.setState({
            product_detail_result_data: responseJson.result_data
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

  }

  // p_type : 0: Match'd, 1:Blotch'd
  requestAddMatch(p_product_id, p_type) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.addMatch, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
        type: p_type.toString(),
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

        if (p_type == 0) {
          this.state.product_detail_result_data.detail.user_match = "M"
        } else {
          this.state.product_detail_result_data.detail.user_match = "B"
        }
        if (this._isMounted) {
          this.setState({ product_detail_result_data: this.state.product_detail_result_data })
        }
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


  requestDeleteMatch(p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.deleteMatch, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
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

        this.state.product_detail_result_data.detail.user_match = ""
        this.setState({ product_detail_result_data: this.state.product_detail_result_data })
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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.state.product_detail_result_data.detail.is_liked = 100
        this.state.product_detail_result_data.detail.like_count++
        this.setState({ product_detail_result_data: this.state.product_detail_result_data })
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
        this.state.product_detail_result_data.detail.is_liked = -1
        this.state.product_detail_result_data.detail.like_count--
        this.setState({ product_detail_result_data: this.state.product_detail_result_data })
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

  requestMyList() {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.myList, {
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }


        const data = [];

        responseJson.result_data.album_list.forEach(element => {
          data.push({ value: element.title, id: element.id })
        });

        this.setState({ album_list: data })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestCheckInMyList(p_album_id, p_product_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.checkInMyList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
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

        const result_data = responseJson.result_data
        if (result_data == null) { // 어느 앨범에도 등록되지 않은 제품이므로 부담없이 등록
          this.requestAddToMyList(p_album_id, p_product_id)
        } else { // 이미 등록한 alubum 이 있으므로 alert 띄우자
          Alert.alert(
            'Confirm Add',
            'This product is already in your other list. Do you want to move it to a new list?',
            [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes', onPress: () => {
                  this.requestAddToMyList(p_album_id, p_product_id)
                }
              },
            ],
            { cancelable: false },
          );
        }

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestAddToMyList(p_album_id, p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.addToMyList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        album_id: p_album_id.toString(),
        product_id: p_product_id.toString(),
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

  requestAddBeautyBox(p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.addBeautyBox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
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
        this.refs.toast.showBottom(Messages.added_to_beautybox);
        global.refreshStatus.mypage = true
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }
}