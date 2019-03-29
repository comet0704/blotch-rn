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

import StarRating from 'react-native-star-rating';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  Modal,
  Image,
  TextInput,
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { LinearGradient, ImagePicker, Permissions } from 'expo';

export class FragmentProductDetailReviews extends React.Component {
  item_id = 0;
  offset = 0;
  constructor(props) {
    super(props);
    this.item_id = this.props.item_id

    this.state = {
      review_photos: [

      ],
      uploadedImagePath: "",
      isLoading: false,
      photoModalVisible: false,
      comment_count: this.props.comment_count,
      starCount: 3,
      product_comment_list_result_data: {
        comment_list: [],
        product_user_sta: [
          {
            "match_count": 0,
            "blotch_count": 0,
            "like_count": 3,
            "album_product_count": 0
          }
        ]
      },
    };
  }

  componentDidMount() {
    this.requestProductCommentList(this.item_id, 0)
  }

  beforeCommentIdx = -1;
  onAddCommentSelected = (index) => {
    const comment_list = this.state.product_comment_list_result_data.comment_list
    try {
      comment_list[this.beforeCommentIdx].want_comment = false
    } catch (error) {

    }
    comment_list[index].want_comment = true
    const result = { comment_list: comment_list, product_user_sta: this.state.product_comment_list_result_data.product_user_sta };
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
  renderComment(item, index) {
    return (
      <View key={index}>
        <View style={MyStyles.comment_item}>
          {item.parent == 0 ? null : <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]} />}
          <Image source={item.profile_image ? { uri: Common.getImageUrl(item.profile_image) } : require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>{item.user_id}</Text>
              {item.user_id == global.login_info.user_id ? <Text style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 50 / 3 }]}>Me</Text> : null}
            </View>
            <Text style={{ fontSize: 13, color: Colors.color_515151 }}>{item.comment}</Text>
            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              <Text style={MyStyles.text_date}>{item.create_date}</Text>
              {item.parent == 0 ?
                <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.onAddCommentSelected(index) }}>
                  {/* <TouchableOpacity style={{ padding: 5 }}> */}
                  <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                </TouchableOpacity>
                : null}
              {item.user_id == global.login_info.user_id ?
                <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                  <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ padding: 5 }}>
                  <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete, { marginLeft: 5 }]}></Image>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>

        {/* 대댓글 부분 */}
        {item.want_comment ?
          <View style={[{ margin: 15, flexDirection: "row", padding: 5, }, MyStyles.bg_white]}>
            <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 5, marginTop: 5, marginRight: 5 }]}></Image>
            <TextInput
              returnKeyType="go"
              multiline={true}
              onChangeText={(text) => { this.setState({ post_sub_comment: text }) }}
              placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            </TextInput>
            <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostProductComment(item_id, this.state.post_sub_comment, item.id, 0, null) }}>
              <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
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
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.state.review_photos.push(result.uri);
      this.setState({review_photos : this.state.review_photos});
      this.requestUploadImage(result)
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
        this.state.review_photos.push(result.uri);
        this.setState({review_photos: this.state.review_photos});
      }
    } else {
      throw new Error('Location permission not granted');
    }
  };

  render() {
    const progressBlotchStyle = {
      backgroundColor: Colors.ingredient_allergic_dark,
      height: 6,
    };
    const progressWatchStyle = {
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
          {/* Blotch'd */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_blotch_prog.png")} style={[MyStyles.ic_blotch_prog]} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Blotch'd</Text>
              <Image style={{ flex: 1 }} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().blotch_count}%</Text>
            </View>
            <ProgressBarAnimated
              {...progressBlotchStyle}
              width={barWidth}
              value={this.getProgress().blotch_count}
            />
          </View>

          {/* Watch List */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_watch_prog.png")} style={[MyStyles.ic_watch_prog]} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Watch List</Text>
              <Image style={{ flex: 1 }} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().like_count}%</Text>
            </View>
            <ProgressBarAnimated
              {...progressWatchStyle}
              width={barWidth}
              value={this.getProgress().like_count}
            />
          </View>

          {/* Match'd */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_match_prog.png")} style={[MyStyles.ic_match_prog]} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Match'd</Text>
              <Image style={{ flex: 1 }} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().match_count}%</Text>
            </View>
            <ProgressBarAnimated
              {...progressMatchStyle}
              width={barWidth}
              value={this.getProgress().match_count}
            />
          </View>

          {/* Save as Others */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Image source={require("../../assets/images/ic_save_prog.png")} style={[MyStyles.ic_save_prog]} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>Save as Others</Text>
              <Image style={{ flex: 1 }} />
              <Text style={[MyStyles.text_13_primary_dark, { marginLeft: 5, fontWeight: "500" }]}>{this.getProgress().album_product_count}%</Text>
            </View>
            <ProgressBarAnimated
              {...progressSaveStyle}
              width={barWidth}
              value={this.getProgress().album_product_count}
            />
          </View>
        </View>

        {/* Comments */}

        {/* Comments */}
        <View style={[MyStyles.bg_f8f8f8, { marginTop: 5 }]}>
          {/* Comments Header */}
          <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 5 }]}>
            <Text style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <Text style={{ fontSize: 13, color: Colors.color_949292 }}>{this.state.comment_count}</Text></Text>
            <View style={{ marginTop: 10, flexDirection: "row" }}>
              <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]}></Image>
              <TextInput placeholder="Add a Comment"
                returnKeyType="go"
                value={this.state.post_comment}
                onChangeText={(text) => { this.setState({ post_comment: text }) }}
                multiline={true}
                style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
              <TouchableOpacity style={{ marginRight: 10, marginTop: 5 }} onPress={() => { this.setState({ photoModalVisible: true }) }}>
                <Image source={require("../../assets/images/ic_gallery.png")} style={[MyStyles.ic_gallery]}></Image>
              </TouchableOpacity>
              <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostProductComment(item_id, this.state.post_comment, 0, this.state.starCount, null) }}>
                <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
              </TouchableOpacity>
            </View>
            <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>
            <View style={{ borderWidth: 0.5, borderColor: Colors.color_dcdedd, borderTopWidth: 0, height: 115 / 3, justifyContent: "center", alignItems: "center" }}>
              <StarRating
                disabled={false}
                maxStars={5}
                containerStyle={{ width: 273 / 3 }}
                starSize={50 / 3}
                emptyStarColor={Colors.color_star_empty}
                rating={this.state.starCount}
                selectedStar={(rating) => {
                  this.setState({
                    starCount: rating
                  });
                }}
                fullStarColor={Colors.color_star_full}
              />
              <Image source={require("../../assets/images/ic_arrow_down_gray_small.png")} style={[MyStyles.ic_arrow_down_gray_small, { position: "absolute", right: 10 }]}></Image>
            </View>


            {this.state.review_photos.length > 0 ?
              <View style={{ flexDirection: "row", flex: 1 }}>
                <Image source={{ uri: this.state.review_photos.length > 0 ? this.state.review_photos[0]: null}} style={{ flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5 }} /> 
                <Image source={{ uri: this.state.review_photos.length > 1 ? this.state.review_photos[1]: null}} style={{ flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5 }} /> 
                <Image source={{ uri: this.state.review_photos.length > 2 ? this.state.review_photos[2]: null}} style={{ flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5 }} /> 
                <Image source={{ uri: this.state.review_photos.length > 3 ? this.state.review_photos[3]: null}} style={{ flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5 }} /> 
                <Image source={{ uri: this.state.review_photos.length > 4 ? this.state.review_photos[4]: null}} style={{ flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5 }} /> 
              </View>
              : null}

          </View>

          {this.state.product_comment_list_result_data.comment_list.map((item, index) => this.renderComment(item, index))}

        </View>


        {/* 갤러리 picker  팝업 */}
        <Modal
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
                  <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => { this._pickImageFromCamera() }}>
                    <Image source={require("../../assets/images/ic_camera_big.png")} style={MyStyles.ic_camera_big}></Image>
                    <Text style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 50, justifyContent: "center" }} onPress={() => { this._pickImageFromGallery() }}>
                    <Image source={require("../../assets/images/ic_gallery_big.png")} style={MyStyles.ic_gallery_big}></Image>
                    <Text style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Album</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
    );
  }

  requestProductCommentList(p_product_id, p_offset) {
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
          this.setState({
            product_comment_list_result_data: responseJson.result_data
          });
          return;
        }
        const comment_list = this.state.product_comment_list_result_data.comment_list
        result = { comment_list: [...comment_list, ...responseJson.result_data.comment_list] };
        this.setState({ product_comment_list_result_data: result })
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
    this.setState({
      isLoading: true,
    });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
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

  requestUploadImage(image) {
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
    console.log(data)
    console.log("11111111111111")

    fetch(Net.upload.image.user, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: data
    }).then((response) => {
      console.log(response);
      response.json()})
      .then((responseJson) => {
        console.log(responseJson)
        result_code = responseJson.result_code;
        this.setState({
          isLoading: false,
        });
        if (result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return;
        }

        if (this.state.uploadedImagePath == "") {
          this.setState({ uploadedImagePath: responseJson.result_data.upload_path })
        } else {
          this.state.uploadedImagePath = this.state.uploadedImagePath + Common.IMAGE_SPLITTER + responseJson.result_data.upload_path
          this.setState(uploadedImagePath)
        }
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