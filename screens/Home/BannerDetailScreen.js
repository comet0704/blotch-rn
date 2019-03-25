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

import { Image, Share, TouchableHighlight, Modal, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import { LinearGradient } from 'expo';

export default class BannerDetailScreen extends React.Component {

  item_id = "";
  back_page = "";
  offset = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading_end: false,
      modalVisible: false,
      banner_detail_result_data: {
        detail: {
          "id": 1,
          "title": "배너1",
          "image": "uploads/product/ana-francisconi-1382802-unsplash.jpg",
          "url": null,
          "like_count": 1,
          "visit_count": 1,
          "comment_count": 7,
          "content" : "배너 내용입니다."
        }
      },
      banner_comment_list_result_data: {
        comment_list: [],
      },
    };
  }

  componentDidMount() {
    item_id = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.item_id)
    back_page = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.back_page)
    this.requestBannerDetail(item_id);
    this.setState({loading_end : false})
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
    const result = {comment_list : comment_list};
    this.beforeCommentIdx = index;
    this.setState({ banner_comment_list_result_data : result})
  }
  onCommentPosted = (p_comment, parent) => {
    const comment_list = this.state.banner_comment_list_result_data.comment_list
    this.setState({ post_comment: "" })
    if(parent == 0) { //부모댓글인 경우 마지막에 추가만 해주면 됨.
      const result = {comment_list : [p_comment, ...comment_list]};
      const banner_detail_result_data = this.state.banner_detail_result_data;
      banner_detail_result_data.detail.comment_count += 1;
      this.setState({ banner_comment_list_result_data : result, banner_detail_result_data : banner_detail_result_data})
    } else { // 자식댓글의 경우 보무댓글의 밑에 추가. 현재는 구현이 말째서 api 다시 호출해주겠음.
      this.setState({loading_end : false})
      this.requestBannerCommentList(item_id, 0);
      return
    }
  }
  renderComment(item, index) {
    return (
      <View key={index}>
        <View style={MyStyles.comment_item}>
          {item.parent == 0 ? null : <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]}/> }
          <Image source={item.profile_image ? {uri : Common.getImageUrl(item.profile_image)} : require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
          <View style={{ flex: 1, marginLeft: 10 }}>          
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>{item.user_id}</Text>
                      {item.user_id == global.login_info.user_id ? <Text style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 50 / 3 }]}>Me</Text> : null}
            </View>
            <Text style={{ fontSize: 13, color: Colors.color_515151 }}>{item.comment}</Text>
            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              <Text style={MyStyles.text_date}>{item.create_date}</Text>
              {item.parent == 0 ? 
                <TouchableOpacity style={{ padding: 5 }} onPress={() => {this.onAddCommentSelected(index)}}>
                {/* <TouchableOpacity style={{ padding: 5 }}> */}
                  <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                </TouchableOpacity>
              : null}
              {item.id == item_id ? 
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
            <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 5, marginTop:5, marginRight: 5 }]}></Image>
            <TextInput  
                    returnKeyType="go"
                    multiline={true}
                    onChangeText={(text) => { this.setState({ post_comment: text }) }}
                    placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            </TextInput>
            <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress = {() => {this.requestPostBannerComment(item_id, this.state.post_comment, item.id)}}>
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
        <TopbarWithBlackBack rightBtn="true" title="Banner" onPress={() => { back_page ? this.props.navigation.goBack(null) : this.props.navigation.goBack() }} onRightBtnPress={() => { this.onShare() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({nativeEvent}) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestBannerCommentList(item_id, this.offset);
            }
          }}>

          <View style={[{ flex: 1 }]}>
            {/* Title and Image */}
            <View style={[MyStyles.padding_main]}>
              <Text style={{ color: Colors.primary_dark, fontSize: 21 }}>{this.state.banner_detail_result_data.detail.title}</Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.banner_detail_result_data.detail.like_count}</Text>
                <Image source={require("../../assets/images/ic_eye.png")} style={[MyStyles.ic_eye, { marginLeft: 10 }]} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{this.state.banner_detail_result_data.detail.visit_count}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={{ height: 780 / 3, flex: 1, marginTop: 5 }}>
              <Image style={MyStyles.background_image} source={{ uri: Common.getImageUrl(this.state.banner_detail_result_data.detail.image) }} />
              <TouchableOpacity style={{ position: "absolute", top: 15, right: 15 }} onPress={() => { alert("onHeartClick") }}>
                <Image source={require("../../assets/images/ic_heart_button.png")} style={[MyStyles.ic_heart_button, { marginLeft: 10 }]} />
              </TouchableOpacity>
            </View>

            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                <Text style={{ color: Colors.color_949191, paddingLeft: 5, paddingRight: 5, borderWidth: 0.5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }}>Link</Text>
                <Text onPress={() => { Linking.openURL([this.state.banner_detail_result_data.detail.url]) }} style={[MyStyles.link, { marginLeft: 5 }]}>{this.state.banner_detail_result_data.detail.url}</Text>
              </View>
              <Text style={{ fontSize: 13, color: Colors.primary_dark, marginTop: 10, marginBottom: 5 }}>{this.state.banner_detail_result_data.detail.content}</Text>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Comments */}
            <View style={[MyStyles.bg_f8f8f8, { marginTop: 5 }]}>
              {/* Comments Header */}
              <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 5 }]}>
                <Text style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <Text style={{ fontSize: 13, color: Colors.color_949292 }}>{this.state.banner_detail_result_data.detail.comment_count}</Text></Text>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]}></Image>
                  <TextInput placeholder="Add a Comment"
                    returnKeyType="go"
                    value={this.state.post_comment}
                    onChangeText={(text) => { this.setState({ post_comment: text }) }}
                    multiline={true}
                    style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]} onPress = {() => {this.requestPostBannerComment(item_id, this.state.post_comment, 0)}}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>
                <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>
              </View>

              {this.state.banner_comment_list_result_data.comment_list.map((item, index) => this.renderComment(item, index))}
              {/* <View>
                <View style={MyStyles.comment_item}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                        <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                
                <View style={[{ margin: 15, flexDirection: "row", padding: 5, alignItems: "center" }, MyStyles.bg_white]}>
                  <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 5, marginRight: 5 }]}></Image>
                  <TextInput placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>

                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View>

              <View>
                <View style={MyStyles.comment_item}>
                  <Image source={{ uri: "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg" }} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View>

              <View>
                <View style={MyStyles.comment_item}>
                  <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]}></Image>
                  <Image source={{ uri: "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg" }} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                      <Text style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 50 / 3 }]}>Me</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View> */}


            </View>
          </View>
        </ScrollView>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ modalVisible: false });
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                </TouchableOpacity>

                <Image style={[{ alignSelf: "center" }, MyStyles.ic_report_big]} source={require("../../assets/images/ic_report_big.png")}></Image>
                <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Would you like to report it?</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <Text style={MyStyles.btn_primary}>Yes</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ modalVisible: false });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
          banner_detail_result_data: responseJson.result_data
        });
        if(responseJson.result_code < 0) {          
          this.refs.toast.showBottom(error);
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
        
        if(responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
        }        
        this.offset += responseJson.result_data.comment_list.length        
        if(responseJson.result_data.comment_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({loading_end : true})
        }
        
        if(p_offset == 0) {          
          this.setState({
            banner_comment_list_result_data: responseJson.result_data
          });
          return;
        }
        const comment_list = this.state.banner_comment_list_result_data.comment_list
        result = {comment_list : [ ...comment_list, ...responseJson.result_data.comment_list]};
        this.setState({ banner_comment_list_result_data : result})
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
        if(responseJson.result_code < 0) {          
          this.refs.toast.showBottom(responseJson.result_msg);
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
}