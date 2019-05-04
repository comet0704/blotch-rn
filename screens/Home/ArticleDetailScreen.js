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

import { Image, Alert, Share, TouchableHighlight, Modal, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import { LinearGradient } from 'expo';
import Messages from '../../constants/Messages';

export default class ArticleDetailScreen extends React.Component {

  item_id = "";
  offset = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading_end: false,
      reportModalVisible: false,
      article_detail_result_data: {
        detail: {
          "id": 1,
          "title": "기사1",
          "image": "uploads/product/caleb-simpson-1394514-unsplash.jpg",
          "url": "www.naver.com",
          "content": "기사내용입니다.",
          "is_liked": null,
          "like_count": 14,
          "visit_count": 15,
          "comment_count": 5
        }
      },
      article_comment_list_result_data: {
        comment_list: [],
      },
    };
  }

  componentDidMount() {
    item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    this.requestArticleDetail(item_id);
    this.setState({ loading_end: false })
    this.requestArticleCommentList(item_id, 0);
  }

  beforeCommentIdx = -1;
  onAddCommentSelected = (index) => {
    const comment_list = this.state.article_comment_list_result_data.comment_list
    try {
      comment_list[this.beforeCommentIdx].want_comment = false
    } catch (error) {

    }
    comment_list[index].want_comment = true
    const result = { comment_list: comment_list };
    this.beforeCommentIdx = index;
    this.setState({ article_comment_list_result_data: result })
  }
  onCommentPosted = (p_comment, parent) => {
    const comment_list = this.state.article_comment_list_result_data.comment_list
    this.setState({ post_comment: "" })
    this.setState({ post_sub_comment: "" })
    if (parent == 0) { //부모댓글인 경우 마지막에 추가만 해주면 됨.
      const result = { comment_list: [p_comment, ...comment_list] };
      const article_detail_result_data = this.state.article_detail_result_data;
      article_detail_result_data.detail.comment_count += 1;
      this.setState({ article_comment_list_result_data: result, article_detail_result_data: article_detail_result_data })
    } else { // 자식댓글의 경우 보무댓글의 밑에 추가. 현재는 구현이 말째서 api 다시 호출해주겠음.
      this.setState({ loading_end: false })
      this.requestArticleCommentList(item_id, 0);
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
              <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>{item.user_id}</Text>
              {item.user_id == global.login_info.user_id ? <Text style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 50 / 3 }]}>Me</Text> : null}
            </View>
            {
              item.user_status == 1 ? // user_status=1 이면 "This user was suspended."
                (<Text style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_user_was_suspended}</Text>)
                :
                (
                  item.status == 0 ? // (approved): 정상노출
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>{item.comment}</Text>
                    : item.status == 1 ? // (pending): 앱에서 'This comment requires the administrator' 로 텍스트 표시
                      <Text style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_comment_requires_the_administrator}</Text>
                      : item.status == 2 ? // (reported): 앱에서 'This comment was reported.' 로 표시
                        <Text style={{ fontSize: 13, color: Colors.color_515151 }}>{Messages.this_comment_was_reported}</Text>
                        : null
                )
            }

            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              <Text style={MyStyles.text_date}>{item.create_date}</Text>
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
                }
                }>
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
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostArticleComment(item_id, this.state.post_sub_comment, item.id) }}>
              <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
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
        <TopbarWithBlackBack rightBtn="true" title="Article" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this.onShare() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestArticleCommentList(item_id, this.offset);
            }
          }}>

          <View style={[{ flex: 1 }]}>
            {/* Title and Image */}
            <View style={[MyStyles.padding_main]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 21 }}>{this.state.article_detail_result_data.detail.title}</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.article_detail_result_data.detail.like_count}</Text>
                <Image source={require("../../assets/images/ic_eye.png")} style={[MyStyles.ic_eye_big, { marginLeft: 10 }]} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.article_detail_result_data.detail.visit_count}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={{ height: 780 / 3, flex: 1, marginTop: 5 }}>
              <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(this.state.article_detail_result_data.detail.image) }} />
              {
                this.state.article_detail_result_data.detail.is_liked > 0
                  ?
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleUnlike(this.state.article_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleLike(this.state.article_detail_result_data.detail.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }
            </View>

            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              {this.state.article_detail_result_data.detail.is_direct_link > 0 ?
                <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                  <Text style={{ color: Colors.color_949191, paddingLeft: 5, paddingRight: 5, borderWidth: 0.5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }}>Link</Text>
                  <Text onPress={() => { Linking.openURL(Common.getLinkUrl(this.state.article_detail_result_data.detail.url)) }} style={[MyStyles.link, { marginLeft: 5 }]}>{this.state.article_detail_result_data.detail.url}</Text>
                </View>
                :
                null
              }
              <Text style={{ fontSize: 13, color: Colors.primary_dark, marginTop: 10, marginBottom: 5 }}>{this.state.article_detail_result_data.detail.content}</Text>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Comments */}
            <View style={[MyStyles.bg_f8f8f8, { marginTop: 5 }]}>
              {/* Comments Header */}
              <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 5 }]}>
                <Text style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <Text style={{ fontSize: 13, color: Colors.color_949292 }}>{this.state.article_detail_result_data.detail.comment_count}</Text></Text>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]} />
                  <TextInput placeholder="Add a Comment"
                    returnKeyType="go"
                    value={this.state.post_comment}
                    onChangeText={(text) => { this.setState({ post_comment: text }) }}
                    multiline={true}
                    style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress={() => { this.requestPostArticleComment(item_id, this.state.post_comment, 0) }}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>
                <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>
              </View>

              {this.state.article_comment_list_result_data.comment_list.map((item, index) => this.renderComment(item, index))}

            </View>
          </View>
        </ScrollView>


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
                <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Would you like to report it?</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => { this.requestReportComment(this.state.selected_comment_id) }}>
                    <Text style={MyStyles.btn_primary}>Yes</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ reportModalVisible: false });
                    }}>
                    <Text style={MyStyles.btn_primary_white}>Not now</Text>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView >
    );
  }

  requestArticleDetail(p_article_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.article.detail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          article_detail_result_data: responseJson.result_data
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(error);
          return;
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

  requestArticleCommentList(p_article_id, p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.article.commentList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id,
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
            article_comment_list_result_data: responseJson.result_data
          });
          return;
        }
        const comment_list = this.state.article_comment_list_result_data.comment_list
        result = { comment_list: [...comment_list, ...responseJson.result_data.comment_list] };
        this.setState({ article_comment_list_result_data: result })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestPostArticleComment(p_article_id, p_comment, p_parent) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.article.postComment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id.toString(),
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

  requestArticleLike(p_article_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.article.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("aaaaa")
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.state.article_detail_result_data.detail.is_liked = 100
        this.state.article_detail_result_data.detail.like_count++
        this.setState({ article_detail_result_data: this.state.article_detail_result_data })
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

  requestArticleUnlike(p_article_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.article.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id.toString()
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
        this.state.article_detail_result_data.detail.is_liked = -1
        this.state.article_detail_result_data.detail.like_count--
        this.setState(article_detail_result_data)
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

  requestReportComment(p_comment_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.article.reportComment, {
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
    return fetch(Net.article.deleteComment, {
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

        this.state.article_comment_list_result_data.comment_list.splice(p_index, 1);
        this.setState({ article_comment_list_result_data: this.state.article_comment_list_result_data });
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