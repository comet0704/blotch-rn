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
import StarRating from 'react-native-star-rating';

export default class MyReviewScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props);
    this.state = {
      loading_end: false,
      isLoading: false,
      result_data: {
        "comment_list": [
        ]
      }
    };
  }

  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestMyCommentList(this.offset);
  }

  renderComment(item, index) {
    return (
      <View key={item.id} style={[{ marginLeft: 15, height: 140, flexDirection: "row", alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
        <TouchableOpacity style={{ width: 258 / 3 }} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.product_id }) }}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[{ width: 258 / 3, height: 222 / 3 }]} />
          <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 3 }]} numberOfLines={1}>{item.brand_title}</Text>
          <Text style={[MyStyles.productName, { textAlign: "left", marginBottom: 0 }]} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
        <View style={[{ flex: 1 }, MyStyles.padding_h_main]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <StarRating
              disabled={false}
              maxStars={5}
              containerStyle={{ width: 200 / 3 }}
              starSize={40 / 3}
              emptyStarColor={Colors.color_star_empty}
              rating={item.grade}
              onPress={() => {
                _this.onStarPressed(item)
              }}
              selectedStar={(rating) => { }}
              fullStarColor={Colors.color_star_full}
            />

          </View>
          <Text style={[MyStyles.productName, { textAlign: "left", marginTop: 5, height: 135 / 3 }]} numberOfLines={3}>{item.comment}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <Text style={{ flex: 1, color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.create_date.substring(0, 10)}</Text>
            <Image source={require("../../assets/images/ic_comment.png")} style={MyStyles.ic_comment} />
            <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.comment_count}</Text>
            {item.user_match == "M" ?
              <Image source={require("../../assets/images/ic_match_small.png")} style={[MyStyles.ic_match_small, { marginLeft: 10 }]} />
              : null}
            {item.user_match == "B" ?
              <Image source={require("../../assets/images/ic_blotch_small.png")} style={[MyStyles.ic_blotch_small, { marginLeft: 10 }]} />
              : null}
            {item.is_liked > 0
              ?
              <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.heart, { marginLeft: 10 }]} />
              :
              null
            }
          </View>
        </View>
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

        <TopbarWithBlackBack rightBtn="false" title="My Review" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestMyCommentList(this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>
            {this.state.result_data.comment_list.map((item, index) => this.renderComment(item, index))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  requestMyCommentList(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.commentList, {
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
        this.offset += responseJson.result_data.comment_list.length
        if (responseJson.result_data.comment_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        const comment_list = this.state.result_data.comment_list
        result = { comment_list: [...comment_list, ...responseJson.result_data.comment_list] };
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

        this.requestMyCommentList(this.offset);

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

        this.requestMyCommentList(this.offset);
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