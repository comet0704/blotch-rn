// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import { Dropdown } from 'react-native-material-dropdown';
import StarRating from 'react-native-star-rating';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { BeautyBoxItem } from '../../components/MyPage/BeautyBoxItem';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export default class MyBeautyBoxScreen extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.isLoading = false
    this.state = {
      showDeleteModal: false,
      post_comment: "",
      post_grade: 3,
      selectedProductId: 0,
      myRatingModalVisible: false,
      categoryItems: Common.getCategoryItems(),
      type: 0,
      beauty_box_result_data: {
        beautybox_list: [
        ]
      },
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
      beforeCatIdx: 0,
      loading_end: false,
    };

  }

  componentDidMount() {
    this.requestBeautyBoxList(this.state.type, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
  }

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
    this.requestBeautyBoxList(this.state.type, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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
                    this.requestBeautyBoxList(this.state.type, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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

  onStarPressed(p_product_id) {
    console.log("00000000000" + p_product_id);
    // ?????? ????????????????????? ??????????????? ???????????? dialog??? ?????????????????? ????????? 
    this.setState({ selectedProductId: p_product_id })
    this.requestProductDetail(p_product_id)
  }
  deleteFromList(p_item_id) {
    this.setState({ delete_item_id: p_item_id, showDeleteModal: true })
  }

  render() {
    let data = [{
      value: 'My Rating',
    }, {
      value: 'First Usage',
    }, {
      value: 'Last Usage',
    }, {
      value: 'Product Rating',
    }];

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
        <TopbarWithBlackBack title="My Beauty Box" onPress={() => {
          this.props.navigation.goBack(null)
        }}></TopbarWithBlackBack>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestBeautyBoxList(this.state.type, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
            }
          }}>

          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

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
              <View style={{ marginLeft: 10, width: 350 / 3, border: 0 }}>
                <Dropdown
                  dropdownPosition={0}
                  containerStyle={{ marginTop: -30, }}
                  value={data[0].value}
                  textColor={Colors.color_656565}
                  itemColor={Colors.color_656565}
                  fontSize={14}
                  selectedItemColor={Colors.color_656565}
                  baseColor={Colors.primary_dark}
                  onChangeText={(value, index, data) => {
                    this.setState({ type: index });
                    this.requestBeautyBoxList(this.state.type, this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
                  }}
                  data={data}
                />
              </View>
              <FlatGrid
                itemDimension={this.ScreenWidth}
                items={this.state.beauty_box_result_data.beautybox_list}
                style={[MyStyles.gridView,]}
                spacing={10}
                renderItem={({ item, index }) => (
                  <BeautyBoxItem is_blotch_list={true} item={item} index={index} this={this}></BeautyBoxItem>
                )}
              />
            </View>

          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.myRatingModalVisible}
          onRequestClose={() => {
          }}>
          <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <Toast ref='modal_toast' />
              <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View style={{ flex: 1 }}>
                  <View style={MyStyles.modal_bg1}>
                    <View style={MyStyles.modalContainer}>
                      {/* modal header */}
                      <View style={MyStyles.modal_header}>
                        <MyAppText style={MyStyles.modal_title}>My Rating</MyAppText>
                        <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                          this.setState({ myRatingModalVisible: false });
                        }}>
                          <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                        </TouchableOpacity>
                      </View>
                      <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                      <View style={[MyStyles.padding_v_25, MyStyles.container]}>
                        {/* ?????????, description ?????? */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 75 / 3 }}>
                          <View style={[MyStyles.productItemContainer1, { width: 295 / 3, height: 270 / 3 }]}>
                            <ImageLoad source={{ uri: Common.getImageUrl(this.state.product_detail_result_data.detail.image_list) }} style={[MyStyles.background_image]} />
                          </View>
                          <View style={{ marginLeft: 10, flex: 1 }}>
                            <MyAppText style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]}>{this.state.product_detail_result_data.detail.brand_title}</MyAppText>
                            <MyAppText style={[MyStyles.productName, { textAlign: "left", height: 50 }]} numberOfLines={2}>{this.state.product_detail_result_data.detail.title}</MyAppText>
                          </View>
                        </View>

                        <View style={[MyStyles.border_bottom_e5e5e5, { marginBottom: 75 / 3, marginRight: -15, }]} />

                        {/* Are you satisfied with the product? ?????? */}
                        <View style={{ justifyContent: "center", marginBottom: 75 / 3, alignItems: "center" }}>
                          <MyAppText style={[{ textAlign: "center", fontWeight: "bold", marginBottom: 5, }, MyStyles.text_13_primary_dark]}>
                            Are you satisfied with the product?
                      </MyAppText>
                          <View style={[{ width: "100%", height: 38, borderWidth: 0.5, borderColor: Colors.color_e3e5e4, justifyContent: "center", alignItems: "center" }]}>
                            <StarRating
                              disabled={false}
                              maxStars={5}
                              containerStyle={[{ width: 200 / 3, },]}
                              starSize={40 / 3}
                              emptyStarColor={Colors.color_star_empty}
                              rating={this.state.post_grade}
                              selectedStar={(rating) => {
                                this.state.post_grade = rating
                                this.setState({ post_grade: this.state.post_grade })
                              }}
                              fullStarColor={Colors.primary_purple}
                            />
                            <Image style={[MyStyles.ic_arrow_down_gray_small, { position: "absolute", right: 15, top: 15 }]} source={require("../../assets/images/ic_arrow_down_gray_small.png")} />
                          </View>
                        </View>

                        <View>
                          <MyAppText style={[{ textAlign: "center", fontWeight: "bold", marginBottom: 5, }, MyStyles.text_13_primary_dark]}>
                            How about this product?
                      </MyAppText>
                          <TextInput
                            textAlignVertical="top"
                            multiline={true}
                            value={this.state.post_comment}
                            returnKeyType="go"
                            onChangeText={(text) => { this.setState({ post_comment: text }) }}
                            style={[MyStyles.text_input_with_border, { height: 100 }]}>
                          </TextInput>
                        </View>

                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={[MyStyles.dlg_btn_primary_cover]} onPress={() => {
                            if (this.state.post_grade == null || this.state.post_grade == 0) {
                              this.refs.modal_toast.showBottom("Please select star");
                              return
                            }
                            if (this.state.post_comment.length <= 0) {
                              this.refs.modal_toast.showBottom("Please input comment");
                              return
                            }
                            this.requestPostProductComment(this.state.selectedProductId, this.state.post_comment, 0, this.state.post_grade, null)
                          }}>
                          <MyAppText style={MyStyles.btn_primary}>Save</MyAppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showDeleteModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showDeleteModal: false });
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", textAlign: "center", marginLeft: 10, marginRight: 10, fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Are you sure you want to delete this product from the list?</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showDeleteModal: false });
                    this.requestDeleteBeautyBox(this.state.delete_item_id);
                  }}
                    style={[MyStyles.dlg_btn_primary_cover]}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_white_cover]}
                    onPress={() => {
                      this.setState({ showDeleteModal: false });
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>No</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }


  requestBeautyBoxList(p_type, p_category, p_sub_category, p_offset) {
    console.log("category= " + p_category);
    console.log("p_sub_category = " + p_sub_category)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.beautyBoxList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        type: p_type.toString(),
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
        this.offset += responseJson.result_data.beautybox_list.length
        if (responseJson.result_data.beautybox_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            beauty_box_result_data: responseJson.result_data
          });
          return;
        }
        const beautybox_list = this.state.beauty_box_result_data.beautybox_list
        result = { beautybox_list: [...beautybox_list, ...responseJson.result_data.beautybox_list] };
        this.setState({ beauty_box_result_data: result }, () => {
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


  requestDeleteBeautyBox(p_beautybox_id) {
    return fetch(Net.user.deleteBeautyBox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        beautybox_id: p_beautybox_id.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }

        const beautybox_list = this.state.beauty_box_result_data.beautybox_list
        const index = beautybox_list.findIndex(item => item.beautybox_id === p_beautybox_id)
        beautybox_list.splice(index, 1)
        const result = { beautybox_list: beautybox_list };
        this.setState({ beauty_box_result_data: result })
        global.refreshStatus.mypage = true;
      })
      .catch((error) => {
        this.refs.toast.showBottom(error);
      })
      .done();
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
        console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.setState({
          product_detail_result_data: responseJson.result_data
        });

        if (this.state.product_detail_result_data.comment != null) {
          this.state.post_grade = this.state.product_detail_result_data.comment.grade
          this.state.post_comment = this.state.product_detail_result_data.comment.comment
        } else {
          this.state.post_grade = 3
          this.state.post_comment = ""
        }
        // ???????????? ??????????????? ????????? ????????????
        this.setState({ myRatingModalVisible: true })

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

  }

  onCommentPosted = (p_product_id, grade, p_my_grade) => {
    const beautybox_list = this.state.beauty_box_result_data.beautybox_list
    const index = beautybox_list.findIndex(item => item.id === p_product_id)
    beautybox_list[index].grade = grade
    beautybox_list[index].my_grade = p_my_grade
    const result = { beautybox_list: beautybox_list };
    this.setState({ beauty_box_result_data: result })
  }

  requestPostProductComment(p_product_id, p_comment, p_parent, p_grade, p_image_url) {
    console.log(p_product_id + ": " + p_comment + ":" + p_parent + ":" + p_grade + ": " + p_image_url)
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.postComment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
        comment: p_comment,
        parent: p_parent.toString(),
        grade: p_grade.toString(),
        image_url: p_image_url,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("7");
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });
        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return;
        }
        // ?????? ???????????????.
        this.onCommentPosted(p_product_id, responseJson.result_data.grade, p_grade)
        this.setState({ myRatingModalVisible: false, post_comment: "" })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }
};