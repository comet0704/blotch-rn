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

import { Image, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, TouchableHighlight, Linking } from 'react-native';
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
        list: []
      }
    };
  }


  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestArticleList(this.offset);
  }

  renderArticle(item, index) {
    return (
      <TouchableOpacity key={item.id} style={[MyStyles.container, { flex: 1 }]} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
        <View style={[{ marginTop: 15, flex: 1, flexDirection: "row" }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>
              {item.title} </Text>
            <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
              {item.url}
            </Text>
          </View>

          <View style={{ width: 316 / 3, height: 230 / 3, borderRadius: 2, overflow: "hidden", marginLeft: 10 }}>
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
        </View>

        <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 10 }]}></View>
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

        <TopbarWithBlackBack rightBtn="false" title="Articles" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestArticleList(this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
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
    this.setState({
      isLoading: true,
    });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.requestArticleList(this.offset);

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
    this.setState({
      isLoading: true,
    });
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
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.requestArticleList(this.offset);
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