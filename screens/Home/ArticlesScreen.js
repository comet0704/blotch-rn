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
import { Image, Dimensions, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, TouchableHighlight, Linking } from 'react-native';
import { LinearGradient } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';

export default class ArticlesScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading_end: false,
      isLoading: false,
      result_data: {
        list: [],
      },
      today_list: [],
    };
  }

  beforeArticleTime = "";
  BannerWidth = Dimensions.get('window').width;

  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestArticleList(this.offset);
  }

  renderArticle(item, index) {
    const articleTime = Common.getFormattedTime(item.create_date) // 기사 올린 날짜 : 이전날짜와 비교하여 
    showTime = false;
    if (this.beforeArticleTime != articleTime) {
      this.beforeArticleTime = articleTime
      showTime = true
    }
    return (
      <TouchableOpacity key={item.id} style={[MyStyles.container, { flex: 1 }]} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
        {showTime ?
          <View style={[{ position: "absolute", width: 275 / 3, height: 60 / 3, top: -10, right: 15, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }, MyStyles.shadow_2]}>
            <Image source={require('../../assets/images/ic_clock.png')} style={[MyStyles.ic_clock]} />
            <Text style={[MyStyles.text_12_949292, { marginLeft: 3 }]}>{articleTime}</Text>
          </View>
          :
          null}

        <View style={[{ marginTop: 15, flex: 1, flexDirection: "row" }]}>
          {item.image != "" ?
            <View style={{ width: 316 / 3, height: 230 / 3, borderRadius: 5, overflow: "hidden", marginRight: 10 }}>
              <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
              {
                item.is_liked > 0
                  ?
                  <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestArticleUnlike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestArticleLike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }

            </View>
            :
            null}

          <View style={{ flex: 1 }}>
            <Text style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>
              {item.title} </Text>
            <Text onPress={() => { Linking.openURL(Common.getLinkUrl(item.url)) }}  style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
              {item.url}
            </Text>
          </View>


        </View>

        <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10 }]}></View>
      </TouchableOpacity>
    );
  }
  renderTodayArticleBanner(item, index) {
    return (
      <View key={index} style={{ width: "100%", height: 550 / 3, flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <View style={{ flex: 1, overflow: "hidden" }}>
            <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
            {
              item.is_liked > 0
                ?
                <TouchableHighlight style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestArticleUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableHighlight>
                : <TouchableHighlight style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { this.requestArticleLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableHighlight>
            }
            <View style={{ position: "absolute", top: 20, left: 15, maxWidth: 150 }}>
              <Text style={{ fontSize: 13, color: "white" }}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }}>{item.content}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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

        <TopbarWithBlackBack rightBtn="false" title="Articles" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestArticleList(this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, justifyContent: "center" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Carousel
                autoplay={true}
                autoplayTimeout={3000}
                loop
                index={0}
                pageSize={this.BannerWidth}
                style={{ alignSelf: "center", flex: 1 }}
              >
                {this.state.today_list.map((item, index) => this.renderTodayArticleBanner(item, index))}
              </Carousel>
            </View>
          </View>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 20 }} ></LinearGradient>
          <View style={[{ flex: 1 }]}>
            {this.state.result_data.list.map((item, index) => this.renderArticle(item, index))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  requestArticleList(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.article.list, {
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.offset += responseJson.result_data.list.length
        if (responseJson.result_data.list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        const list = this.state.result_data.list
        if (p_offset == 0) {
          this.setState({ today_list: responseJson.result_data.today_list })
        }
        result = { list: [...list, ...responseJson.result_data.list] };
        this.setState({ result_data: result })
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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.requestArticleList(0);

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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.requestArticleList(0);
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