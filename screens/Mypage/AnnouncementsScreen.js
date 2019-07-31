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

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo';

export default class AnnouncementsScreen extends React.Component {

  constructor(props) {
    super(props)
    this.isLoading = false

    this.state = {
      isLoading: false,
      result_data: {
        announce_list: [

        ]
      }
    };
    this.wReadMsgs = []
  }

  componentDidMount() {
    this.requestAnnounceList(0);
  }

  beforeSelectedFaqItem = -1;
  onAnnounceItemSelected = (index) => {
    if (this.wReadMsgs.findIndex(item => item.id == this.state.result_data.announce_list[index].id && item.type == this.state.result_data.announce_list[index].type) < 0) {
      // 30일 안된 공지에 대해서만 체크, 30일 지난 공지는 무조건 읽음처리
      if (Common.dateDiff(this.state.result_data.announce_list[index].create_date.substring(0, 10), new Date()) < 30) {
        this.wReadMsgs.push({ id: this.state.result_data.announce_list[index].id, type: this.state.result_data.announce_list[index].type }) // id 와 type 2개가 있어야 식별할수 있음. 서버에서 UNION으로 내려보내는 자료인 이유로 인함.
        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.read_msgs, JSON.stringify(this.wReadMsgs));
        this.state.result_data.announce_list[index].isUnread = false
      }
    }

    faq_item_list = this.state.result_data.announce_list;
    try {
      faq_item_list[this.beforeSelectedFaqItem].is_selected = false
    } catch (error) {

    }
    faq_item_list[index].is_selected = true
    const result = { announce_list: faq_item_list };
    this.beforeSelectedFaqItem = index
    this.setState({ announce_list_result_data: result })
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

        <TopbarWithBlackBack title="Announcements" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>

        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

        <ScrollView style={{ fex: 1 }}
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestAnnounceList(this.offset)
            }
          }}>
          {this.state.result_data.announce_list.map((item, index) => (
            <View key={index}>
              {item.type == 0 ? // notice 일때
                <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.onAnnounceItemSelected(index) }}>
                  <View>
                    <Image style={MyStyles.ic_announce_comment} source={require('../../assets/images/ic_announce_notice.png')} />
                    {
                      item.isUnread == false ? null :
                        <View style={MyStyles.unread_mark} />
                    }

                  </View>
                  <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <MyAppText style={{ color: Colors.primary_dark, fontSize: 15 }}>{item.title}</MyAppText>
                    <MyAppText style={{ fontSize: 13, color: Colors.color_949292, fontWeight: "400" }}>{item.create_date.substring(0, 10)}</MyAppText>
                  </View>
                  {item.is_selected ? <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')} /> :
                    <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_down_gray_small.png')} />}
                </TouchableOpacity>

                :
                item.type == 1 ? // comment_alert 일때
                  <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]}
                    onPress={() => {
                      // 30일 안된 공지에 대해서만 체크, 30일 지난 공지는 무조건 읽음처리
                      if (Common.dateDiff(this.state.result_data.announce_list[index].create_date.substring(0, 10), new Date()) < 30) {
                        this.wReadMsgs.push({ id: this.state.result_data.announce_list[index].id, type: this.state.result_data.announce_list[index].type }) // id 와 type 2개가 있어야 식별할수 있음. 서버에서 UNION으로 내려보내는 자료인 이유로 인함.
                        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.read_msgs, JSON.stringify(this.wReadMsgs));
                        this.state.result_data.announce_list[index].isUnread = false
                        this.setState({ result_data: this.state.result_data })
                      }
                      this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id })
                    }}>
                    <View>
                      <Image style={MyStyles.ic_announce_notice} source={require('../../assets/images/ic_announce_comment.png')} />
                      {
                        item.isUnread == false ? null :
                          <View style={MyStyles.unread_mark} />
                      }
                    </View>

                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                      <MyAppText style={{ color: Colors.primary_dark, fontSize: 15 }}>There are {item.title} comments on my answer.</MyAppText>
                      <MyAppText style={{ fontSize: 13, color: Colors.color_949292, fontWeight: "400" }}>{item.create_date.substring(0, 10)}</MyAppText>
                    </View>
                    {item.is_selected ? <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')} /> :
                      <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_down_gray_small.png')} />}
                  </TouchableOpacity>

                  : // contact us 답변내용일때
                  <TouchableOpacity activeOpacity={0.8} style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.onAnnounceItemSelected(index) }}>
                    <View>
                      <Image style={MyStyles.ic_announce_contact_us} source={require('../../assets/images/ic_announce_contact_us.png')} />
                      {
                        item.isUnread == false ? null :
                          <View style={MyStyles.unread_mark} />
                      }
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                      <MyAppText style={{ color: Colors.primary_dark, fontSize: 15 }}>{item.title}</MyAppText>
                      <MyAppText style={{ fontSize: 13, color: Colors.color_949292, fontWeight: "400" }}>{item.create_date.substring(0, 10)}</MyAppText>
                    </View>
                    {item.is_selected ? <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')} /> :
                      <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_down_gray_small.png')} />}
                  </TouchableOpacity>
              }

              {item.is_selected ?
                <View style={[MyStyles.padding_main, { backgroundColor: Colors.color_f8f8f8 }]}>
                  <MyAppText style={{ fontSize: 13, color: Colors.color_949191 }}>{item.content}</MyAppText>
                </View> : null}
            </View>
          ))}
        </ScrollView>

      </KeyboardAvoidingView>
    );
  }

  requestAnnounceList(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.announceList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
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
        this.offset += responseJson.result_data.announce_list.length
        if (responseJson.result_data.announce_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        if (p_offset == 0) {
          AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.read_msgs, (err, result) => {
            if (result == null) {
              this.wReadMsgs = []
            } else {
              this.wReadMsgs = JSON.parse(result);
            }
            console.log(this.wReadMsgs);
            responseJson.result_data.announce_list.forEach((item1, index1) => {
              // 한달 안된 알림중에서 읽지 않은 알림을 추출한다. 알림은 읽기처리 해준다.
              if (Common.dateDiff(item1.create_date.substring(0, 10), new Date()) < 30) {
                this.wReadMsgs.forEach((item, index) => {
                  if ((item.type == item1.type) && (item.id == item1.id)) {
                    responseJson.result_data.announce_list[index1].isUnread = false
                  } else {
                  }
                })
              } else {
                responseJson.result_data.announce_list[index1].isUnread = false
              }
            })
            this.setState({
              result_data: responseJson.result_data
            });
            return;
          })
        } else {
          const announce_list = this.state.result_data.announce_list
          AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.read_msgs, (err, result) => {
            if (result == null) {
              this.wReadMsgs = []
            } else {
              this.wReadMsgs = JSON.parse(result);
            }
            responseJson.result_data.announce_list.forEach((item1, index1) => {
              // 한달 안된 알림중에서 읽지 않은 알림을 추출한다. 알림은 읽기처리 해준다.
              if (Common.dateDiff(item1.create_date.substring(0, 10), new Date()) < 30) {
                this.wReadMsgs.forEach((item, index) => {
                  if ((item.type == item1.type) && (item.id == item1.id)) {
                    responseJson.result_data.announce_list[index1].isUnread = false
                  } else {
                  }
                })
              } else {
                responseJson.result_data.announce_list[index1].isUnread = false
              }
            })
            result = { announce_list: [...announce_list, ...responseJson.result_data.announce_list] };
            this.setState({ result_data: result }, () => {
              this.isLoading = false
            })
            return;
          }
          )
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
};