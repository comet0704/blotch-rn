// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Linking, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import Carousel from 'react-native-snap-carousel';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyPagination } from '../../components/MyPagination';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export default class ArticlesScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props);
    this.isLoading = false
    this.state = {
      loading_end: false,
      activeDotIndex: 0,
      isLoading: false,
      result_data: {
        list: [],
      },
      today_list: [],
    };
  }

  beforeArticleTime = "";
  ScreenWidth = Dimensions.get('window').width;

  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestArticleList(this.offset);
  }

  renderArticle(item, index) {
    const articleTime = Common.getFormattedTime(item.create_date) // 기사 올린 날짜 : 이전날짜와 비교하여 
    var showTime = false;
    console.log(index + ":" + articleTime + ":" + this.beforeArticleTime);
    if (this.beforeArticleTime != articleTime) {
      showTime = true
    }
    this.beforeArticleTime = articleTime
    if (index == this.state.result_data.list.length - 1) {
      // 렌더가 다 된다음에는 아래 값을 꼭 초기화 해주어야 함.
      // 그래야지 만일 30개(현재 한번에 목록 30개 내려보냄) 이상의 기사들이 같은날에 
      // 오른 것들이라면 다음번 loadmore 시에 beforeArticleTime이 제일 첫 아이템과 같게되는것이로 해서 첨에 현시되어야 할 날짜가 현시되지 않는 현상이 발생
      this.beforeArticleTime = ""
    }
    return (
      <TouchableOpacity activeOpacity={0.8} key={index} style={[MyStyles.container, { flex: 1 }]} onPress={() => {
        if (item.is_direct_link) {
          Linking.openURL(Common.getLinkUrl(item.url))
        } else {
          this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item })
        }
      }
      }>
        {showTime ?
          <View style={[{ position: "absolute", width: 275 / 3, height: 60 / 3, top: -10, right: 15, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }, MyStyles.shadow_2]}>
            <Image source={require('../../assets/images/ic_clock.png')} style={[MyStyles.ic_clock]} />
            <MyAppText style={[MyStyles.text_12_949292, { marginLeft: 3 }]}>{articleTime}</MyAppText>
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
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleUnlike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleLike(item.id) }}>
                    <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                  </TouchableOpacity>
              }

            </View>
            :
            null}

          <View style={{ flex: 1 }}>
            <MyAppText style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>
              {item.title} </MyAppText>

            {item.is_direct_link > 0 ?
              <MyAppText onPress={() => { Linking.openURL(Common.getLinkUrl(item.url)) }} style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
                {item.url}
              </MyAppText>
              : null}
          </View>


        </View>

        <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10 }]}></View>
      </TouchableOpacity>
    );
  }
  renderTodayArticleBanner = ({item, index}) => {
    return (
      <View key={index} style={{ width: "100%", height: 550 / 3, flex: 1 }}>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
          <View style={{ flex: 1, overflow: "hidden" }}>
            <ImageLoad style={MyStyles.background_image} source={{ uri: Common.getImageUrl(item.image) }} />
            {
              item.is_liked > 0
                ?
                <TouchableHighlight style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleUnlike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
                </TouchableHighlight>
                : <TouchableHighlight style={[MyStyles.heart_in_item]} onPress={() => { this.requestArticleLike(item.id) }}>
                  <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
                </TouchableHighlight>
            }
            <View style={[MyStyles.banner_title]}>
              <MyAppText style={{ fontSize: 13, color: "white" }}>{item.title}</MyAppText>
              <MyAppText style={{ fontSize: 24, color: "white", fontWeight: "bold", marginTop: 3, lineHeight: 26 }}>{Common.removeHtmlTagsFromText(item.content)}</MyAppText>
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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              console.log("hehehe")
              this.requestArticleList(this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={{ flexDirection: "row", backgroundColor: "#f9f9f9", flex: 1, justifyContent: "center" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Carousel
                inactiveSlideScale={1}
                data={this.state.today_list}
                sliderWidth={this.ScreenWidth}
                itemWidth={this.ScreenWidth}
                renderItem={this.renderTodayArticleBanner}
                autoplay={true}
                loop={true}
                autoplayInterval={2000}
                onSnapToItem={(index) => this.setState({ activeDotIndex: index })}
                ref={(carousel) => { this.carouselIndicator = carousel }}
              />
              <MyPagination list={this.state.today_list} activeDotIndex={this.state.activeDotIndex} />

              {/* <Carousel
                pageIndicatorStyle={MyStyles.pageIndicatorStyle}
                activePageIndicatorStyle={MyStyles.activePageIndicatorStyle}
                autoplay={true}
                autoplayTimeout={3000}
                loop
                index={0}
                pageSize={this.ScreenWidth}
                style={{ alignSelf: "center", flex: 1 }}
              >
                {this.state.today_list.map((item, index) => this.renderTodayArticleBanner(item, index))}
              </Carousel> */}
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
        this.setState({
          isLoading: false,
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.list.length
        if (responseJson.result_data.list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        const list = this.state.result_data.list
        if (p_offset == 0) {
          this.setState({ today_list: responseJson.result_data.today_list })
          this.setState({ result_data: responseJson.result_data })
          return
        }
        result = { list: [...list, ...responseJson.result_data.list] };
        this.setState({ result_data: result }, () => {
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        const w_index = this.state.result_data.list.findIndex(item1 => item1.id == p_article_id)
        this.state.result_data.list[w_index].is_liked = 100
        this.setState({ result_data: this.state.result_data })
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

        const w_index = this.state.result_data.list.findIndex(item1 => item1.id == p_article_id)
        this.state.result_data.list[w_index].is_liked = null
        this.setState({ result_data: this.state.result_data })
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
}