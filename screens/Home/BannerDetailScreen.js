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
import { MyAppText } from '../../components/Texts/MyAppText';

import { Image, Alert, Share, TouchableHighlight, Modal, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import { LinearGradient } from 'expo';
import Messages from '../../constants/Messages';

export default class BannerDetailScreen extends React.Component {

  item_id = "";
  offset = 0;
  constructor(props) {
    super(props);
    this.item_info = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_info)
    this.state = {
      loading_end: false,
      reportModalVisible: false,
      banner_detail_result_data: {
        detail: {
          "id": 0,
          "title": this.item_info ? this.item_info.title : "",
          "image": this.item_info ? this.item_info.image : "",
          "url": this.item_info ? this.item_info.url : "",
          "content": this.item_info ? this.item_info.content : "",
          "is_liked": this.item_info ? this.item_info.is_liked : null,
          "like_count": this.item_info ? this.item_info.like_count : 0,
          "visit_count": this.item_info ? this.item_info.visit_count : 0,
          "comment_count": this.item_info ? this.item_info.comment_count : 0
        }
      },
      banner_comment_list_result_data: {
        comment_list: [],
      },
    };
  }

  componentDidMount() {
    item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    this.requestBannerDetail(item_id);
    this.setState({ loading_end: false })
    this.requestBannerCommentList(item_id, 0);
  }

  beforeCommentIdx = -1;
  onAddCommentSelected = (index) => {
    const comment_list = this.state.banner_comment_list_result_data.comment_list
    try {
      comment_list[this.beforeCommentIdx].want_comment = false
    } catch (error) {

    }
    comment_list[index].want_comment = true
    const result = { comment_list: comment_list };
    this.beforeCommentIdx = index;
    this.setState({ banner_comment_list_result_data: result })
  }
  onCommentPosted = (p_comment, parent) => {
    const comment_list = this.state.banner_comment_list_result_data.comment_list
    this.setState({ post_comment: "" })
    this.setState({ post_sub_comment: "" })
    if (parent == 0) { //부모댓글인 경우 마지막에 추가만 해주면 됨.
      const result = { comment_list: [p_comment, ...comment_list] };
      const banner_detail_result_data = this.state.banner_detail_result_data;
      banner_detail_result_data.detail.comment_count += 1;
      this.setState({ banner_comment_list_result_data: result, banner_detail_result_data: banner_detail_result_data })
    } else { // 자식댓글의 경우 보무댓글의 밑에 추가. 현재는 구현이 말째서 api 다시 호출해주겠음.
      this.setState({ loading_end: false })
      this.requestBannerCommentList(item_id, 0);
      return
    }
  }
  renderComment(item, index) {
    return (
      <View key={index}>
        <View style={MyStyles.comment_item}>
          {item.parent == 0 ? null : <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]} />}
          <Image source={item.profile_image ? { uri: Common.getImageUrl(item.profile_image) } : require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <MyAppText style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>{item.user_id}</MyAppText>
              {item.user_id == global.login_info.user_id ? <MyAppText style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 42 / 3, lineHeight: 44 / 3 }]}>Me</MyAppText> : null}
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
            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              <MyAppText style={MyStyles.text_date}>{item.create_date}</MyAppText>
              {item.parent == 0 ?
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 5 }} onPress={() => { this.onAddCommentSelected(index) }}>
                  {/* <TouchableOpacity activeOpacity={0.8} style={{ padding: 5 }}> */}
                  <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]} />
                </TouchableOpacity>
                : null}
              {item.user_id == global.login_info.user_id ?
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 5 }} onPress={() => {
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
                  <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete, { marginLeft: 5 }]} />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.8} style={{ padding: 5 }} onPress={() => { this.setState({ reportModalVisible: true, selected_comment_id: item.id }) }}>
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
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostBannerComment(item_id, this.state.post_sub_comment, item.id) }}>
              <MyAppText multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</MyAppText>
            </TouchableOpacity>
          </View> : null
        }

        <View style={MyStyles.seperate_line_e5e5e5}></View>
      </View>

    );
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
        <TopbarWithBlackBack rightBtn="true" title="Banner" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this.onShare() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestBannerCommentList(item_id, this.offset);
            }
          }}>

          <View style={[{ flex: 1 }]}>
            {/* Title and Image */}
            <View style={[MyStyles.padding_main]}>
              <MyAppText style={{ color: Colors.primary_dark, fontSize: 21 }}>{Common.removeHtmlTagsFromText(this.state.banner_detail_result_data.detail.title)}</MyAppText>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <MyAppText style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.banner_detail_result_data.detail.like_count}</MyAppText>
                <Image source={require("../../assets/images/ic_eye.png")} style={[MyStyles.ic_eye_big, { marginLeft: 10 }]} />
                <MyAppText style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.banner_detail_result_data.detail.visit_count}</MyAppText>
              </View>
            </View>

            {/* Description */}
            <View style={{ height: 780 / 3, flex: 1, marginTop: 5 }}>
              <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(this.state.banner_detail_result_data.detail.image) }} />
              {
                this.state.banner_detail_result_data.detail.is_liked > 0
                  ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestBannerUnlike(this.state.banner_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestBannerLike(this.state.banner_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }
            </View>

            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              {this.state.banner_detail_result_data.detail.url != null && this.state.banner_detail_result_data.detail.url.length > 0 ?
                <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                  <MyAppText style={{ color: Colors.color_949191, paddingLeft: 5, paddingRight: 5, borderWidth: 0.5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }}>Link</MyAppText>
                  <MyAppText onPress={() => { Linking.openURL(Common.getLinkUrl(this.state.banner_detail_result_data.detail.url)) }} style={[MyStyles.link, { marginLeft: 5 }]}>{this.state.banner_detail_result_data.detail.url}</MyAppText>
                </View>
                :
                null
              }
              <MyAppText style={{ fontSize: 13, color: Colors.primary_dark, marginTop: 10, marginBottom: 5 }}>{Common.removeHtmlTagsFromText(this.state.banner_detail_result_data.detail.content)}</MyAppText>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Comments */}
            <View style={[MyStyles.bg_f8f8f8, { marginTop: 5 }]}>
              {/* Comments Header */}
              <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 5 }]}>
                <MyAppText style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <MyAppText style={{ fontSize: 13, color: Colors.color_949292 }}>{this.state.banner_detail_result_data.detail.comment_count}</MyAppText></MyAppText>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]} />
                  <TextInput placeholder="Add a Comment"
                    returnKeyType="go"
                    value={this.state.post_comment}
                    onChangeText={(text) => { this.setState({ post_comment: text }) }}
                    multiline={true}
                    style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostBannerComment(item_id, this.state.post_comment, 0) }}>
                    <MyAppText multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</MyAppText>
                  </TouchableOpacity>
                </View>
                <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>
              </View>

              {this.state.banner_comment_list_result_data.comment_list.map((item, index) => this.renderComment(item, index))}
            </View>
          </View>
        </ScrollView>


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
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => { this.requestReportComment(this.state.selected_comment_id) }}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
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
      </KeyboardAvoidingView >
    );
  }

  requestBannerDetail(p_banner_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.detail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        banner_id: p_banner_id
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
          banner_detail_result_data: responseJson.result_data
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

  requestBannerCommentList(p_banner_id, p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.commentList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        banner_id: p_banner_id,
        offset: p_offset.toString(),
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
        if (p_offset == 0) {
          this.offset = 0;
        }
        this.offset += responseJson.result_data.comment_list.length
        if (responseJson.result_data.comment_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        if (p_offset == 0) {
          this.setState({
            banner_comment_list_result_data: responseJson.result_data
          });
          return;
        }
        const comment_list = this.state.banner_comment_list_result_data.comment_list
        result = { comment_list: [...comment_list, ...responseJson.result_data.comment_list] };
        this.setState({ banner_comment_list_result_data: result })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestPostBannerComment(p_banner_id, p_comment, p_parent) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.postComment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        banner_id: p_banner_id.toString(),
        comment: p_comment,
        parent: p_parent.toString(),
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
        // 댓글 추가해주자.
        this.onCommentPosted(responseJson.result_data.comment, p_parent)
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }


  requestBannerLike(p_banner_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        banner_id: p_banner_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.banner_detail_result_data.detail.is_liked = 100
        this.state.banner_detail_result_data.detail.like_count++
        this.setState(banner_detail_result_data)

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestBannerUnlike(p_banner_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        banner_id: p_banner_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.state.banner_detail_result_data.detail.is_liked = -1
        this.state.banner_detail_result_data.detail.like_count--
        this.setState(banner_detail_result_data)
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestReportComment(p_comment_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.banner.reportComment, {
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
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.refs.toast.showBottom("The report has been received.");
        this.setState({ reportModalVisible: false });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteComment(p_comment_id, p_index) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.banner.deleteComment, {
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.banner_comment_list_result_data.comment_list.splice(p_index, 1);
        this.setState({ banner_comment_list_result_data: this.state.banner_comment_list_result_data });
      })
      .catch((error) => {
        // this.setState({
        //   isLoading: false,
        // });
        this.refs.toast.showBottom(error);
      })
      .done();
  }
}