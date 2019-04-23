// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';

import Carousel from 'react-native-banner-carousel';
import { Image, Dimensions, Share, TouchableHighlight, Modal, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import { LinearGradient } from 'expo';
import StarRating from 'react-native-star-rating';
import { FragmentProductDetailIngredients } from './FragmentProductDetailIngredients';
import { FragmentProductDetailReviews } from './FragmentProductDetailReviews';
import { Dropdown } from 'react-native-material-dropdown';
import { Alert } from 'react-native';
import Messages from '../../constants/Messages';

export default class ProductDetailScreen extends React.Component {

  item_id = "";

  constructor(props) {
    super(props)
    item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    this.state = {
      saveAsModalVisible: false,
      product_detail_result_data: {
        detail: {
          "id": 1,
          "title": "",
          "image_list": "",
          "visit_count": 0,
          "like_count": 0,
          "comment_count": 0,
          "grade": 0,
          "is_liked": null,
          "brand_title": ""
        }
      },
      matched: false,
      blotched: false,
      starCount: 3.5,
      modalVisible: false,
      tabbar: {
        Ingredients: true,
        Reviews: false,
      },
      album_list: [

      ]
    };
  }

  componentDidMount() {
    this.requestProductDetail(item_id)
    this.requestMyList()
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'BAM: we\'re helping your business with awesome React Native apps',
        url: 'http://bam.tech',
        title: 'Wow, did you see that?'
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
  BannerWidth = Dimensions.get('window').width - 30;
  renderImages(image, index) {
    console.log("1111111" + image)
    return (
      <View key={index}>
        <TouchableHighlight>
          <View>
            <ImageLoad style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: Common.getImageUrl(image) }} />
            <View style={{ position: "absolute", bottom: 10, justifyContent: "center", width: "100%", flexDirection: "row", alignItems: "center" }}>
              <Text style={{ backgroundColor: Colors.color_636364, paddingLeft: 10, paddingRight: 10, borderRadius: 10, color: "white", textAlign: "center" }}>{(index + 1) + "/" + this.state.product_detail_result_data.detail.image_list.split(Common.IMAGE_SPLITTER).length}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
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
        <TopbarWithBlackBack has_beautybox_btn={true} rightBtn="true" title="Product" onPress={() => { this.props.navigation.goBack(null) }} onRightBtnPress={() => { this.onShare() }} onAddBeautyBox={() => { this.onAddBeautyBox() }}></TopbarWithBlackBack>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>

            {/* 이미지 부분 */}
            <View style={{ overflow: "hidden", justifyContent: "center", alignSelf: "center", width: this.BannerWidth, height: this.BannerHeight, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderLeftColor: Colors.color_f9f9f9, borderRightColor: Colors.color_f9f9f9, borderWidth: 1, borderBottomColor: Colors.color_f3f3f3, borderBottomWidth: 2, borderTopWidth: 0 }}>
              {this.state.product_detail_result_data.detail.image_list.length > 0 ?
                <Carousel
                  pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                  activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                  autoplay
                  autoplayTimeout={3000}
                  loop
                  index={0}
                  showsPageIndicator={false}
                  pageSize={this.BannerWidth}
                >
                  {this.state.product_detail_result_data.detail.image_list.split(Common.IMAGE_SPLITTER).map((image, index) => this.renderImages(image, index))}
                </Carousel>
                :
                null
              }
              {
                this.state.product_detail_result_data.detail.is_liked > 0
                  ?
                  <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductUnlike(this.state.product_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[MyStyles.heart_in_item]} onPress={() => { this.requestProductLike(this.state.product_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }

            </View>

            {/* Description */}
            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                <View style={[{ marginTop: 5, flexDirection: "row", alignItems: "center", borderWidth: 0.5, paddingLeft: 5, paddingRight: 5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }]}>
                  <Text style={{ color: Colors.color_949191 }}>{this.state.product_detail_result_data.detail.brand_title} </Text>
                  <Image source={require("../../assets/images/ic_arrow_right_gray.png")} style={MyStyles.ic_arrow_right_gray} />
                </View>
              </View>
              <Text style={{ fontSize: 63 / 3, color: Colors.primary_dark, marginTop: 5, marginBottom: 25 }}>{this.state.product_detail_result_data.detail.title}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.product_detail_result_data.detail.like_count}</Text>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    gradeVisible: true
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
                  <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.product_detail_result_data.detail.grade}</Text>
                  : null}
              </View>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Ingredients and Reviews */}
            <View style={{}}>
              <View style={MyStyles.tabbar_button_container}>
                <TouchableOpacity style={this.state.tabbar.Ingredients ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: true, Reviews: false } })
                }}>
                  <Text style={this.state.tabbar.Ingredients ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Ingredients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.tabbar.Reviews ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: false, Reviews: true } })
                }}>
                  <Text style={this.state.tabbar.Reviews ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Reviews</Text>
                </TouchableOpacity>
              </View>

              <View>
                {this.state.tabbar.Ingredients ?
                  <FragmentProductDetailIngredients toast={this.refs.toast} item_id={item_id}></FragmentProductDetailIngredients>
                  :
                  <FragmentProductDetailReviews toast={this.refs.toast} item_id={item_id} comment_count={this.state.product_detail_result_data.detail.comment_count}></FragmentProductDetailReviews>
                }
              </View>
            </View>
          </View>

          {/* Save as 모달*/}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.saveAsModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                    this.setState({ saveAsModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>

                  <View style={{ width: 200, height: 150, marginTop: -30, marginBottom: 40, justifyContent: "center", alignSelf: "center" }}>
                    <Dropdown
                      // dropdownPosition={0}
                      labelFontSize={11}
                      textColor={Colors.color_656565}
                      itemColor={Colors.color_656565}
                      selectedItemColor={Colors.color_656565}
                      baseColor={Colors.primary_dark}
                      label='Please select your own list'
                      onChangeText={(value, index, data) => {
                        this.requestCheckInMyList(data[index].id, item_id)
                        this.setState({ saveAsModalVisible: false })
                      }}
                      data={this.state.album_list}
                    />
                  </View>

                  {/* <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight onPress={() => {
                      this.setState({ saveAsModalVisible: false });
                    }}
                      style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                      <Text style={MyStyles.btn_primary}>Yes</Text>
                    </TouchableHighlight>
                  </View> */}
                </View>

              </View>
            </View>
          </Modal>


        </ScrollView>

        {/* 하단바 */}
        <LinearGradient colors={['#fefefe', '#f8f8f8']} style={{ height: 3 }} ></LinearGradient>
        <View style={{ height: 215 / 3, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} onPress={() => { this.state.product_detail_result_data.detail.user_match == "M" ? this.requestDeleteMatch(this.state.product_detail_result_data.detail.id) : this.requestAddMatch(this.state.product_detail_result_data.detail.id, 0) }}>
              {this.state.product_detail_result_data.detail.user_match == "M" ? <Image source={require('../../assets/images/ic_match_on.png')} style={[MyStyles.ic_match]} /> : <Image source={require('../../assets/images/ic_match_off.png')} style={[MyStyles.ic_match]} />}
              {this.state.product_detail_result_data.detail.user_match == "M" ? <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_6bd5be }}>Match'd</Text> : <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Match'd</Text>}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} onPress={() => { this.state.product_detail_result_data.detail.user_match == "B" ? this.requestDeleteMatch(this.state.product_detail_result_data.detail.id) : this.requestAddMatch(this.state.product_detail_result_data.detail.id, 1) }}>
              {this.state.product_detail_result_data.detail.user_match == "B" ? <Image source={require('../../assets/images/ic_blotch_on.png')} style={[MyStyles.ic_blotch]} /> : <Image source={require('../../assets/images/ic_blotch_off.png')} style={[MyStyles.ic_blotch]} />}
              {this.state.product_detail_result_data.detail.user_match == "B" ? <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_f691a1 }}>Blotch'd</Text> : <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Blotch'd</Text>}
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity style={[{ height: 30, width: 250 / 3, justifyContent: "center", alignSelf: "center", alignItems: "center" }, MyStyles.purple_round_btn]} onPress={() => {
              this.setState({ saveAsModalVisible: true })
            }}>
              <Text style={{ fontSize: 13, color: "white" }}>Save as</Text>
              <Image source={require("../../assets/images/ic_arrow_down_white_small.png")} style={[MyStyles.ic_arrow_down_white_small, { position: "absolute", right: 10 }]} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView >
    );
  }

  requestProductDetail(p_product_id) {
    this.setState({
      isLoading: true,
    });
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
        console.log("999999999" + responseJson.result_data.detail.image_list);
        this.setState({
          isLoading: false,
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.setState({
          product_detail_result_data: responseJson.result_data
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
        this.setState(product_detail_result_data)
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
        this.setState(product_detail_result_data)
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
        this.setState(product_detail_result_data)

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
        this.setState(product_detail_result_data)
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
    this.setState({
      isLoading: true,
      alreadyLoaded: true,
    });
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
        this.setState({
          isLoading: false,
        });

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
    //   alreadyLoaded: true,
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
      alreadyLoaded: true,
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
      alreadyLoaded: true,
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