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

export default class FaqScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      selected_category: "",
      faq_category_result_data: {
        faq_category: [
        ]
      },
      faq_list_result_data: {
        faq_list: [
        ]
      }
    };
  }

  componentDidMount() {
    this.requestFaqCategory();
  }

  beforeSelectedFaqItem = -1;
  onFaqItemSelected = (index) => {
    faq_item_list = this.state.faq_list_result_data.faq_list;
    try {
      faq_item_list[this.beforeSelectedFaqItem].is_selected = false
    } catch (error) {

    }
    faq_item_list[index].is_selected = true
    const result = {faq_list : faq_item_list};
    this.beforeSelectedFaqItem = index
    this.setState({faq_list_result_data : result})
  }

  renderCategoryTabbars(item, index) {
    return (
      <TouchableOpacity key={item.category} style={item.is_selected ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
        faq_category_list = this.state.faq_category_result_data.faq_category;
        faq_category_list.map((item) => (item.is_selected = false))
        faq_category_list[index].is_selected = true;
        this.setState({
          faq_category_result_data: { faq_category: faq_category_list }
        });
        this.setState({ selectedCatName: item.category })
        this.setState({ loading_end: false })
        this.requestFaqList(item.category, 0)
      }}>
        <Text style={item.is_selected ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >{item.category}</Text>
      </TouchableOpacity>
    );
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

        <TopbarWithBlackBack title="FAQ" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>

        <View style={MyStyles.tabbar_button_container}>
          {this.state.faq_category_result_data.faq_category.map((item, index) => (
            this.renderCategoryTabbars(item, index)
          ))}
        </View>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

        <ScrollView style={{ fex: 1 }}
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestFaqList(this.state.selectedCatName, this.offset)
            }
          }}>
          {this.state.faq_list_result_data.faq_list.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={[{ flexDirection: "row", alignItems: "center" }, MyStyles.padding_main, MyStyles.border_bottom_e5e5e5]} onPress={() => {this.onFaqItemSelected(index)}}>
                <Text style={{ backgroundColor: [Common.getRandomColor()], fontSize: 12, borderRadius: 2, paddingLeft: 5, paddingRight: 5, color: "white" }}>{item.category}</Text>
                <Text style={{ flex: 1, marginLeft: 10, marginRight: 10, color: Colors.primary_dark, fontSize: 15 }}>{item.title}</Text>
                {item.is_selected ? <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_up.png')}/> :
                <Image style={MyStyles.ic_arrow_up} source={require('../../assets/images/ic_arrow_down_gray_small.png')}/>}
              </TouchableOpacity>

              {item.is_selected ?
                <View style={[MyStyles.padding_main, { backgroundColor: Colors.color_f8f8f8 }]}>
                  <Text style={{ fontSize: 13, color: Colors.color_949191 }}>{item.content}</Text>
                </View> : null}
            </View>
          ))}
        </ScrollView>

      </KeyboardAvoidingView>
    );
  }


  requestFaqCategory() {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.faqCategory, {
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        faq_category_list = [{ category: "All" }, ...responseJson.result_data.faq_category];
        faq_category_list[0].is_selected = true;
        this.setState({
          faq_category_result_data: { faq_category: faq_category_list }
        });

        this.requestFaqList(this.state.faq_category_result_data.faq_category[0].category, 0);

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();

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
        this.offset += responseJson.result_data.faq_list.length
        if (responseJson.result_data.faq_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            faq_list_result_data: responseJson.result_data
          });
          return;
        }
        const faq_list = this.state.product_list_result_data.faq_list
        result = { faq_list: [...faq_list, ...responseJson.result_data.faq_list] };
        this.setState({ faq_list_result_data: result })
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