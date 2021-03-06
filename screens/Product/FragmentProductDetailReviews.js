// common
import * as Permissions from 'expo-permissions';

import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Keyboard, Alert, Dimensions, Image, Modal, Platform, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import StarRating from 'react-native-star-rating';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import Colors from '../../constants/Colors';
import Messages from '../../constants/Messages';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export class FragmentProductDetailReviews extends React.Component {
  item_id = 0;
  offset = 0;
  uploadedImagePaths = "";
  constructor(props) {
    super(props);
    this.item_id = this.props.item_id
    this.selected_img_idx = 0 // 이미지 삭제를 위해 선택한 이미지 index

    this.state = {
      review_photos: [

      ],
      reportModalVisible: false,
      showImageRemoveModal: false,
      zoomViewerModalVisible: false,
      user_review_photo_list: [],
      zoomViewerImages: [],
      isLoading: false,
      photoModalVisible: false,
      commentEditing: false,
      comment_count: this.props.comment_count,
      starCount: 3,
      product_comment_list_result_data: {
        comment_list: [],
        product_user_sta: [
          {
            "match_count": 0,
            "blotch_count": 0,
            "like_count": 0,
            "album_product_count": 0
          }
        ],
        user_comment: {
        }
      },
      comment_text: null,
      selected_star: 0,
    };
  }

  componentDidMount() {
    this.requestProductCommentList(this.item_id, 0)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide = () => {
    this.refs.commentBox.blur();
  }

  beforeCommentIdx = -1;
  onAddCommentSelected = (index) => {
    const comment_list = this.state.product_comment_list_result_data.comment_list
    if (this.beforeCommentIdx == index) {
      comment_list[index].want_comment = comment_list[index].want_comment == true ? false : true
    } else {
      try {
        comment_list[this.beforeCommentIdx].want_comment = false
      } catch (error) {

      }
      comment_list[index].want_comment = true
    }
    const result = { user_comment: this.state.product_comment_list_result_data.user_comment, comment_list: comment_list, product_user_sta: this.state.product_comment_list_result_data.product_user_sta };
    this.beforeCommentIdx = index;
    this.setState({ product_comment_list_result_data: result })
  }
  onCommentPosted = (p_comment, parent) => {
    const comment_list = this.state.product_comment_list_result_data.comment_list

    this.setState({ post_comment: "" })
    this.setState({ post_sub_comment: "" })
    if (parent == 0) { //부모댓글인 경우 마지막에 추가만 해주면 됨. 제품에 올리는 댓글인 경우 하나만 올려야 하므로 원래 댓글 이 있으면 replace 해주어야 하는데 시끄러워서 api 다시 호출하겠음.
      this.setState({ loading_end: false })
      this.requestProductCommentList(item_id, 0);
    } else { // 자식댓글의 경우 보무댓글의 밑에 추가. 현재는 구현이 말째서 api 다시 호출해주겠음.
      this.setState({ loading_end: false })
      this.requestProductCommentList(item_id, 0);
      return
    }
  }

  onPostSend = async () => {
    this.uploadedImagePaths = ""
    // if (this.state.product_comment_list_result_data.user_comment.comment == "") {
    if (this.state.comment_text == null || this.state.comment_text.length < 1) {
      this.props.toast.showBottom("Please input your comment");
      return;
    }

    // if (this.state.product_comment_list_result_data.user_comment.grade == 0) {
    if (this.state.selected_star == 0) {
      this.props.toast.showBottom("Please select star");
      return;
    }

    // 먼저 이미지 업로드.
    for (i = 0; i < this.state.review_photos.length; i++) {
      await this.requestUploadProductImage(this.state.review_photos[i])
    }

    // 위까지 호출되면 this.uploadedImagePaths에 이미지 목록이 현시됨.
    this.requestPostProductComment(item_id, this.state.comment_text, 0, this.state.selected_star, this.uploadedImagePaths)
  }

  showImageZoomViewer(imageList, index) {
    const images = []
    imageList.forEach(element => {
      images.push({ url: Common.getImageUrl(element) })
    });
    this.setState({
      zoomViewerIndex: index,
      zoomViewerModalVisible: true,
      zoomViewerImages: images,
    })
  }

  renderComment(item, index) {
    const item_review_photos = item.image_list == null ? "" : item.image_list.split(Common.IMAGE_SPLITTER);

    return (
      <View key={index}>
        <View style={MyStyles.comment_item}>
          {item.parent == 0 ? null : <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]} />}
          <View>
            <Image source={item.profile_image ? { uri: Common.getImageUrl(item.profile_image) } : require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]} />
            {item.user_score > 1000 ?
              <MyAppText style={{ fontSize: 10, color: Colors.primary_purple, textAlign: "center", fontWeight: "500", marginTop: 20 / 3 }}>Best</MyAppText>
              : null}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <MyAppText style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>{item.user_id}</MyAppText>
              {item.user_id == global.login_info.user_id ? <MyAppText style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 42 / 3, lineHeight: 44 / 3 }]}>Me</MyAppText> : null}
              {item.parent == 0 ?
                <StarRating
                  disabled={false}
                  maxStars={5}
                  containerStyle={{ width: 180 / 3, marginLeft: 10 }}
                  starSize={30 / 3}
                  emptyStarColor={Colors.color_star_empty}
                  rating={item.grade}
                  fullStarColor={Colors.color_star_full}
                />
                : null
              }
            </View>
            {
              item.user_status == 1 ? // user_status=1 이면 "This user was suspended."
                (<MyAppText style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_user_was_suspended}</MyAppText>)
                :
                (
                  item.status == 0 ? // (approved): 정상노출
                    <MyAppText style={{ fontSize: 13, color: Colors.color_515151 }}>{item.comment}</MyAppText>
                    : item.status == 1 ? // (pending): 앱에서 'This comment requires the administrator' 로 텍스트 표시
                      <MyAppText style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_comment_requires_the_administrator}</MyAppText>
                      : item.status == 2 ? // (reported): 앱에서 'This comment was reported.' 로 표시
                        <MyAppText style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_comment_was_reported}</MyAppText>
                        : null
                )
            }

            {/* 포토 부분 */}
            {item_review_photos.length > 0 && item_review_photos[0] != "" ?
              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(item_review_photos, 0) }}>
                  {
                    item_review_photos.length > 0 ?
                      <Image source={{ uri: Common.getImageUrl(item_review_photos[0]) }} style={[MyStyles.review_photo, { marginLeft: 0 }]} />
                      :
                      <Image style={[MyStyles.review_photo]} />
                  }
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(item_review_photos, 1) }}>
                  {
                    item_review_photos.length > 1 ?
                      <Image source={{ uri: Common.getImageUrl(item_review_photos[1]) }} style={[MyStyles.review_photo]} />
                      :
                      <Image style={[MyStyles.review_photo]} />
                  }
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(item_review_photos, 2) }}>
                  {
                    item_review_photos.length > 2 ?
                      <Image source={{ uri: Common.getImageUrl(item_review_photos[2]) }} style={[MyStyles.review_photo]} />
                      :
                      <Image style={[MyStyles.review_photo]} />
                  }
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(item_review_photos, 3) }}>
                  {
                    item_review_photos.length > 3 ?
                      <Image source={{ uri: Common.getImageUrl(item_review_photos[3]) }} style={[MyStyles.review_photo]} />
                      :
                      <Image style={[MyStyles.review_photo]} />
                  }
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(item_review_photos, 4) }}>
                  {
                    item_review_photos.length > 4 ?
                      <Image source={{ uri: Common.getImageUrl(item_review_photos[4]) }} style={[MyStyles.review_photo, { marginRight: 0 }]} />
                      :
                      <Image style={[MyStyles.review_photo]} />
                  }
                </TouchableWithoutFeedback>
              </View>
              : null}

            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              <MyAppText style={[MyStyles.text_date, { marginRight: 5, }]}>{item.create_date}</MyAppText>
              {item.parent == 0 ?
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 4 }} onPress={() => { this.onAddCommentSelected(index) }}>
                  {/* <TouchableOpacity activeOpacity={0.8} style={{ padding: 5 }}> */}
                  <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment]} />
                </TouchableOpacity>
                : null}
              {item.user_id == global.login_info.user_id ?
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 4 }} onPress={() => {
                  Alert.alert(
                    '',
                    Messages.would_you_like_to_delete_it,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK', onPress: () => {
                          this.requestDeleteComment(item.id, index)
                        }
                      },
                    ],
                    { cancelable: false },
                  );
                }}>
                  <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete]} />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 4 }} onPress={() => { this.setState({ reportModalVisible: true, selected_comment_id: item.id }) }}>
                  <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]} />
                </TouchableOpacity>
              }
            </View>

          </View>
        </View>

        {/* 대댓글 부분 */}
        {item.want_comment ?
          <View style={[{ margin: 15, flexDirection: "row", padding: 5, }, MyStyles.bg_white]}>
            <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 5, marginTop: 5, marginRight: 5 }]} />
            <TextInput
              returnKeyType="go"
              multiline={true}
              onChangeText={(text) => { this.setState({ post_sub_comment: text }) }}
              placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            </TextInput>
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostProductComment(item_id, this.state.post_sub_comment, item.id, 0, null) }}>
              <MyAppText multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</MyAppText>
            </TouchableOpacity>
          </View> : null
        }

        <View style={MyStyles.seperate_line_e5e5e5}></View>
      </View>

    );
  }

  getProgress() {
    product_user_sta = this.state.product_comment_list_result_data.product_user_sta[0];
    totalCount = product_user_sta.blotch_count
      + product_user_sta.match_count
      + product_user_sta.like_count
      + product_user_sta.album_product_count

    if (totalCount == 0) {
      totalCount = 1
    }

    return {
      blotch_count: product_user_sta.blotch_count * 100 / totalCount,
      match_count: product_user_sta.match_count * 100 / totalCount,
      like_count: product_user_sta.like_count * 100 / totalCount,
      album_product_count: product_user_sta.album_product_count * 100 / totalCount,
    }
  }

  _pickImageFromGallery = async () => {
    this.setState({ photoModalVisible: false })
    if (this.state.review_photos.length > 4) {
      this.props.toast.showBottom("Only up to 5 photos can be registered")
      return;
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      console.log(result);

      if (!result.cancelled) {
        this.state.review_photos.push(result);
        this.setState({ review_photos: this.state.review_photos });
      }
    } else {
      throw new Error('Location permission not granted');
    }
  };

  _pickImageFromCamera = async () => {
    this.setState({ photoModalVisible: false })
    if (this.state.review_photos.length > 4) {
      this.props.toast.showBottom("Only up to 5 photos can be registered")
      return;
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      console.log(result);

      if (!result.cancelled) {
        this.state.review_photos.push(result);
        this.setState({ review_photos: this.state.review_photos });
      }
    } else {
      throw new Error('Location permission not granted');
    }
  };

  render() {
    const _this = this.props.this;
    const progressBlotchStyle = {
      backgroundColor: Colors.ingredient_allergic_dark,
      height: 6,
    };
    const progressHeartStyle = {
      backgroundColor: Colors.color_c2c1c1,
      height: 6,
    };
    const progressMatchStyle = {
      backgroundColor: Colors.color_6bd5be,
      height: 6,
    };
    const progressSaveStyle = {
      backgroundColor: Colors.color_f3f3f3,
      height: 6,
    };

    const barWidth = Dimensions.get('screen').width - 30;

    return (
      <View>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

        {/* Progress Bars */}
        <View style={[MyStyles.margin_h_main, MyStyles.padding_v_25, MyStyles.border_bottom_e5e5e5]}>

          {/* Match'd */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_match_prog.png")} style={[MyStyles.ic_match_prog]} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Match'd</MyAppText>
              <Image style={{ flex: 1 }} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().match_count.toFixed(0)}%</MyAppText>
            </View>
            <View style={{ backgroundColor: "#e6e5e5", borderRadius: 100 }}>
              <ProgressBarAnimated
                borderWidth={0}
                {...progressMatchStyle}
                width={barWidth}
                value={this.getProgress().match_count}
              />
            </View>
          </View>

          {/* Blotch'd */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_blotch_prog.png")} style={[MyStyles.ic_blotch_prog]} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Blotch'd</MyAppText>
              <Image style={{ flex: 1 }} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().blotch_count.toFixed(0)}%</MyAppText>
            </View>
            <View style={{ backgroundColor: "#e6e5e5", borderRadius: 100 }}>
              <ProgressBarAnimated
                borderWidth={0}
                {...progressBlotchStyle}
                width={barWidth}
                value={this.getProgress().blotch_count}
              />
            </View>
          </View>

          {/* Heart List */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_watch_prog.png")} style={[MyStyles.ic_watch_prog]} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Heart List</MyAppText>
              <Image style={{ flex: 1 }} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().like_count.toFixed(0)}%</MyAppText>
            </View>
            <View style={{ backgroundColor: "#e6e5e5", borderRadius: 100 }}>
              <ProgressBarAnimated
                borderWidth={0}
                {...progressHeartStyle}
                width={barWidth}
                value={this.getProgress().like_count}
              />
            </View>
          </View>

          {/* Save as Others */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_save_prog.png")} style={[MyStyles.ic_save_prog]} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Save as Others</MyAppText>
              <Image style={{ flex: 1 }} />
              <MyAppText style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().album_product_count.toFixed(0)}%</MyAppText>
            </View>
            <View style={{ backgroundColor: "#e6e5e5", borderRadius: 100 }}>
              <ProgressBarAnimated
                borderWidth={0}
                {...progressSaveStyle}
                width={barWidth}
                value={this.getProgress().album_product_count}
              />
            </View>
          </View>
        </View>


        {/* Comments */}
        <View style={[{ marginTop: 5 }]}>
          {/* Comments Header */}
          <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 10 }]}>
            <MyAppText style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <MyAppText style={{ fontSize: 13, color: Colors.color_949292 }}>{this.state.comment_count}</MyAppText></MyAppText>
            <View style={{ marginTop: 10, flexDirection: "row" }}>
              <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]} />
              <TextInput placeholder="Add a Comment"
                ref='commentBox'
                returnKeyType="go"
                // value={this.state.product_comment_list_result_data.user_comment == null ? "" : this.state.product_comment_list_result_data.user_comment.comment}
                onFocus={() => {
                  this.setState({ commentEditing: true })
                  this.interval = setInterval(() => {
                    _this.wScrollView.scrollToEnd({ animated: true })
                    clearInterval(this.interval)
                  }, 100)
                }}
                onChangeText={(text) => {
                  this.state.product_comment_list_result_data.user_comment.comment = text
                  this.state.comment_text = text
                  this.setState({ product_comment_list_result_data: this.state.product_comment_list_result_data, comment_text: this.state.comment_text })
                  _this.wScrollView.scrollToEnd({ animated: true })
                }}
                onEndEditing={() => {
                  this.setState({ commentEditing: false })
                }}
                multiline={true}
                style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
              <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10, marginTop: 5 }} onPress={async () => {
                await this.setState({ photoModalVisible: true })
                _this.setState({ visible_bottom_bar: false })
                // 스크롤 맨 아래로 내려야 함.
                this.interval = setInterval(() => {
                  _this.wScrollView.scrollToEnd({ animated: true })
                  clearInterval(this.interval)
                }, 100)
              }}>
                <Image source={require("../../assets/images/ic_gallery.png")} style={[MyStyles.ic_gallery]} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.onPostSend() }}>
                <MyAppText multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</MyAppText>
              </TouchableOpacity>
            </View>
            <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>

            {this.state.photoModalVisible ?
              <View style={[{ height: 800 / 3, borderTopWidth: 0.5, borderTopColor: Colors.color_e5e6e5, width: Dimensions.get('screen').width, marginTop: -1, marginLeft: -15, marginRight: -15, marginBottom: -15, justifyContent: "center", alignItems: "center", backgroundColor: Colors.color_f8f8f8 }]}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: "center" }} onPress={() => {
                    _this.setState({ visible_bottom_bar: true })
                    this._pickImageFromCamera()
                  }}>
                    <Image source={require("../../assets/images/ic_camera_big.png")} style={MyStyles.ic_camera_big} />
                    <MyAppText style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Camera</MyAppText>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: 50, justifyContent: "center" }} onPress={() => {
                    _this.setState({ visible_bottom_bar: true })
                    this._pickImageFromGallery()
                  }}>
                    <Image source={require("../../assets/images/ic_gallery_big.png")} style={MyStyles.ic_gallery_big} />
                    <MyAppText style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Album</MyAppText>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_main, { position: "absolute", top: 0, right: 0 }]} onPress={() => {
                  this.setState({ photoModalVisible: false });
                  _this.setState({ visible_bottom_bar: true })
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>
              </View>
              :
              null}

            {
              this.state.photoModalVisible ? null :
                <View style={{ borderWidth: 0.5, borderColor: Colors.color_dcdedd, borderTopWidth: 0, height: 115 / 3, justifyContent: "center", alignItems: "center" }}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    containerStyle={{ width: 273 / 3 }}
                    starSize={50 / 3}
                    emptyStarColor={Colors.color_star_empty}
                    // rating={this.state.product_comment_list_result_data.user_comment.grade} // 리뷰작성후 다시 페지 진입시 원래 작성내용 보여주는 기능 막음
                    rating={this.state.selected_star}
                    selectedStar={(rating) => {
                      this.state.product_comment_list_result_data.user_comment.grade = rating
                      this.state.selected_star = rating
                      this.setState({ product_comment_list_result_data: this.state.product_comment_list_result_data, selectedStar: this.state.selected_star });
                    }}
                    fullStarColor={Colors.color_star_full}
                  />
                </View>
            }



            {/* // 리뷰작성후 다시 페지 진입시 원래 작성내용 보여주는 기능 막음
            회원이 올린 리뷰사진은 새로 올리는 사진이 없는 경우에만 현시 */}
            {/* {(this.state.review_photos.length < 1 && this.state.user_review_photo_list.length > 0 && this.state.user_review_photo_list[0] != "") ?
              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(this.state.user_review_photo_list, 0) }}>
                  <Image source={{ uri: this.state.user_review_photo_list.length > 0 ? Common.getImageUrl(this.state.user_review_photo_list[0]) : null }} style={[MyStyles.review_photo]} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(this.state.user_review_photo_list, 1) }}>
                  <Image source={{ uri: this.state.user_review_photo_list.length > 1 ? Common.getImageUrl(this.state.user_review_photo_list[1]) : null }} style={[MyStyles.review_photo]} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(this.state.user_review_photo_list, 2) }}>
                  <Image source={{ uri: this.state.user_review_photo_list.length > 2 ? Common.getImageUrl(this.state.user_review_photo_list[2]) : null }} style={[MyStyles.review_photo]} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(this.state.user_review_photo_list, 3) }}>
                  <Image source={{ uri: this.state.user_review_photo_list.length > 3 ? Common.getImageUrl(this.state.user_review_photo_list[3]) : null }} style={[MyStyles.review_photo]} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { this.showImageZoomViewer(this.state.user_review_photo_list, 4) }}>
                  <Image source={{ uri: this.state.user_review_photo_list.length > 4 ? Common.getImageUrl(this.state.user_review_photo_list[4]) : null }} style={[MyStyles.review_photo]} />
                </TouchableWithoutFeedback>
              </View>
              : null} */}

            {
              this.state.photoModalVisible ? null :
                this.state.review_photos.length > 0 && this.state.review_photos[0] != "" ?
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <TouchableHighlight style={[MyStyles.review_photo]} onPress={() => {
                      if (this.state.review_photos.length > 0) {
                        this.selected_img_idx = 0
                        this.setState({ showImageRemoveModal: true })
                      }
                    }}>
                      <Image source={{ uri: this.state.review_photos.length > 0 ? this.state.review_photos[0].uri : null }} style={[MyStyles.review_photo_img]} />
                    </TouchableHighlight>
                    <TouchableHighlight style={[MyStyles.review_photo]} onPress={() => {
                      if (this.state.review_photos.length > 1) {
                        this.selected_img_idx = 1
                        this.setState({ showImageRemoveModal: true })
                      }
                    }}>
                      <Image source={{ uri: this.state.review_photos.length > 1 ? this.state.review_photos[1].uri : null }} style={[MyStyles.review_photo_img]} />
                    </TouchableHighlight>
                    <TouchableHighlight style={[MyStyles.review_photo]} onPress={() => {
                      if (this.state.review_photos.length > 2) {
                        this.selected_img_idx = 2
                        this.setState({ showImageRemoveModal: true })
                      }
                    }}>
                      <Image source={{ uri: this.state.review_photos.length > 2 ? this.state.review_photos[2].uri : null }} style={[MyStyles.review_photo_img]} />
                    </TouchableHighlight>
                    <TouchableHighlight style={[MyStyles.review_photo]} onPress={() => {
                      if (this.state.review_photos.length > 3) {
                        this.selected_img_idx = 3
                        this.setState({ showImageRemoveModal: true })
                      }
                    }}>
                      <Image source={{ uri: this.state.review_photos.length > 3 ? this.state.review_photos[3].uri : null }} style={[MyStyles.review_photo_img]} />
                    </TouchableHighlight>
                    <TouchableHighlight style={[MyStyles.review_photo]} onPress={() => {
                      if (this.state.review_photos.length > 4) {
                        this.selected_img_idx = 4
                        this.setState({ showImageRemoveModal: true })
                      }
                    }}>
                      <Image source={{ uri: this.state.review_photos.length > 4 ? this.state.review_photos[4].uri : null }} style={[MyStyles.review_photo_img]} />
                    </TouchableHighlight>
                  </View>
                  : null}
          </View>

          {
            this.state.photoModalVisible || this.state.commentEditing ? null :
              this.state.product_comment_list_result_data.comment_list.map((item, index) => this.renderComment(item, index))
          }

        </View>

        {/* 이미지 삭제 확인팝업 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showImageRemoveModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showImageRemoveModal: false });
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", textAlign: "center", marginLeft: 10, marginRight: 10, fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Are you sure you want to delete it?</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showImageRemoveModal: false });
                    this.state.review_photos.splice(this.selected_img_idx, 1)
                    this.setState({ review_photos: this.state.review_photos })
                  }}
                    style={[MyStyles.dlg_btn_primary_cover]}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_white_cover]}
                    onPress={() => {
                      this.setState({ showImageRemoveModal: false });
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>No</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>



        {/* 신고팝업 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.reportModalVisible}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ reportModalVisible: false });
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={[{ alignSelf: "center" }, MyStyles.ic_report_big]} source={require("../../assets/images/ic_report_big.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Would you like to report it?</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_cover]} onPress={() => { this.requestReportComment(this.state.selected_comment_id) }}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.dlg_btn_primary_white_cover]}
                    onPress={() => {
                      this.setState({ reportModalVisible: false });
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>Not now</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        {/* 갤러리 picker  팝업 */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.photoModalVisible}
          onRequestClose={() => {
          }}>
          <TouchableWithoutFeedback onPress={() => { this.setState({ photoModalVisible: false }) }}>
            <View style={[{ flex: 1, backgroundColor: "#0000009d", }]}>
              <Image style={{ flex: 1 }} />
              <View style={[{ height: 800 / 3, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.color_f8f8f8 }, MyStyles.shadow_2]}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity activeOpacity={0.8} style={{ justifyContent: "center" }} onPress={() => { this._pickImageFromCamera() }}>
                    <Image source={require("../../assets/images/ic_camera_big.png")} style={MyStyles.ic_camera_big} />
                    <MyAppText style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Camera</MyAppText>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} style={{ marginLeft: 50, justifyContent: "center" }} onPress={() => { this._pickImageFromGallery() }}>
                    <Image source={require("../../assets/images/ic_gallery_big.png")} style={MyStyles.ic_gallery_big} />
                    <MyAppText style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Album</MyAppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}

        {/* image zoom viewer */}
        <Modal visible={this.state.zoomViewerModalVisible} transparent={true}
          onRequestClose={() => {
          }}>
          <ImageViewer imageUrls={this.state.zoomViewerImages} index={this.state.zoomViewerIndex} />
          <TouchableOpacity activeOpacity={0.8} style={{ position: "absolute", top: 0, left: 0, padding: 15, marginTop: 30 }} onPress={() => {
            this.setState({ zoomViewerModalVisible: false });
          }}>
            <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_back.png")} />
          </TouchableOpacity>
        </Modal>

      </View>
    );
  }

  requestProductCommentList(p_product_id, p_offset) {
    console.log("0000000" + global.login_info.user_id);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.commentList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id,
        offset: p_offset.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.offset += responseJson.result_data.comment_list.length
        if (responseJson.result_data.comment_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          const result = responseJson.result_data
          if (result.user_comment == null) {
            result.user_comment = { comment: "", image_list: "", grade: 0 }
          }
          if (result.product_user_sta == null) {
            result.product_user_sta = [
              {
                "match_count": 0,
                "blotch_count": 0,
                "like_count": 0,
                "album_product_count": 0
              }
            ]
          }
          this.setState({
            product_comment_list_result_data: result,
            comment_count: result.comment_list.length
          });

          try {
            this.setState({ user_review_photo_list: responseJson.result_data.user_comment.image_list.split(Common.IMAGE_SPLITTER) })
          } catch (error) {
          }

          return;
        }
        const comment_list = this.state.product_comment_list_result_data.comment_list
        result = { comment_list: [...comment_list, ...responseJson.result_data.comment_list] };
        this.setState({
          product_comment_list_result_data: result,
          comment_count: result.comment_list.length
        })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
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
        // 댓글 추가해주자.
        this.onCommentPosted(responseJson.result_data.comment, p_parent)
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }

  async requestUploadProductImage(image) {
    this.setState({
      isLoading: true,
    });
    imgUri = image.uri.replace("file://", "")
    let fileType = imgUri.substring(imgUri.lastIndexOf(".") + 1);
    console.log(fileType)

    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: `image/${fileType}`,
      name: image.uri.substring(image.uri.lastIndexOf("/") + 1)
    })

    try {
      response = await fetch(Net.upload.image.product, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: data
      })

      responseJson = await response.json()
      result_code = responseJson.result_code;
      this.setState({
        isLoading: false,
      });
      if (result_code < 0) {
        this.props.toast.showBottom(responseJson.result_msg);
        return;
      }

      if (this.uploadedImagePaths == "") {
        this.uploadedImagePaths = responseJson.result_data.upload_path;
      } else {
        this.uploadedImagePaths = this.uploadedImagePaths + Common.IMAGE_SPLITTER + responseJson.result_data.upload_path
      }

    } catch (error) {
      this.setState({
        isLoading: false,
      });
      this.props.toast.showBottom(error);
    }
  }

  requestReportComment(p_comment_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.reportComment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        comment_id: p_comment_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return
        }
        this.props.toast.showBottom("The report has been received.");
        this.setState({ reportModalVisible: false });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteComment(p_comment_id, p_index) {
    console.log(p_comment_id);
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.deleteComment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        comment_id: p_comment_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.product_comment_list_result_data.comment_list.splice(p_index, 1);
        this.setState({ product_comment_list_result_data: this.state.product_comment_list_result_data });

        this.requestProductCommentList(this.item_id, 0)
      })
      .catch((error) => {
        // this.setState({
        //   isLoading: false,
        // });
        this.props.toast.showBottom(error);
      })
      .done();
  }
}