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

    this.state = {
      isLoading: false,
      selected_category: "",
      result_data: {
        announce_list: [
          {
            "id": 2,
            "title": "test",
            "content": "test test",
            "create_date": "2019-04-11 12:59:07",
            "announce_type": 0,
          },
          {
            "id": 1,
            "title": "공지사항",
            "content": "공지사항 내용입니다.",
            "create_date": "2019-03-15 10:56:09",
            "announce_type": 1,
          }
        ]
      }
    };
  }

  componentDidMount() {
    this.requestFaqList("브랜드", 0);
  }

  beforeSelectedFaqItem = -1;
  onFaqItemSelected = (index) => {
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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestFaqList(this.state.selectedCatName, this.offset)
            }
          }}>
          {this.state.result_data.announce_list.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]} onPress={() => { this.onFaqItemSelected(index) }}>
                {item.announce_type == 0 ?
                  <Image style={MyStyles.ic_announce_comment} source={require('../../assets/images/ic_announce_comment.png')} />
                  :
                  <Image style={MyStyles.ic_announce_notice} source={require('../../assets/images/ic_announce_notice.png')} />
                }
                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                  <Text style={{ color: Colors.primary_dark, fontSize: 15 }}>{item.title}</Text>
                  <Text style={{ fontSize: 13, color: Colors.color_949292, fontWeight: "400" }}>5 minuts ago</Text>
                </View>
                {item.is_selected ? <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')} /> :
                  <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_down_gray_small.png')} />}
              </TouchableOpacity>

              {item.is_selected ?
                <View style={[MyStyles.padding_main, MyStyles.margin_h_main, { backgroundColor: Colors.color_f8f8f8 }]}>
                  <Text style={{ fontSize: 13, color: Colors.color_949191 }}>{item.content}</Text>
                </View> : null}
            </View>
          ))}
        </ScrollView>

      </KeyboardAvoidingView>
    );
  }

  requestFaqList(p_category, p_offset) {
    console.log("category = " + p_category);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.faqList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        category: p_category,
        offset: p_offset
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
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.announce_list.length
        if (responseJson.result_data.announce_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            announce_list_result_data: responseJson.result_data
          });
          return;
        }
        const announce_list = this.state.product_list_result_data.announce_list
        result = { announce_list: [...announce_list, ...responseJson.result_data.announce_list] };
        this.setState({ announce_list_result_data: result })
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