// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export default class MyReviewScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.isLoading = false
    this.state = {
      loading_end: false,
      isLoading: false,
      result_data: {
        "comment_list": [
        ]
      }
    };
    this.offset = 0;
  }

  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestMyCommentList(this.offset);
  }

  renderComment(item, index) {
    return (
      <View key={item.id} style={[{ marginLeft: 15, height: 140, flexDirection: "row", alignItems: "center" }, MyStyles.border_bottom_e5e5e5]}>
        <TouchableOpacity activeOpacity={0.8} style={{ width: 258 / 3 }} onPress={() => { this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.product_id }) }}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[{ width: 258 / 3, height: 222 / 3, borderRadius: 5, overflow: "hidden" }]} />
          <MyAppText style={[MyStyles.productBrand, { textAlign: "left", marginTop: 3 }]} numberOfLines={1}>{item.brand_title}</MyAppText>
          <MyAppText style={[MyStyles.productName, { textAlign: "left", marginBottom: 0 }]} numberOfLines={1}>{item.title}</MyAppText>
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
                this.onStarPressed(item)
              }}
              selectedStar={(rating) => { }}
              fullStarColor={Colors.color_star_full}
            />

          </View>
          <MyAppText style={[MyStyles.productName, { textAlign: "left", marginTop: 5, height: 135 / 3 }]} numberOfLines={3}>{item.comment}</MyAppText>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <MyAppText style={{ flex: 1, color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.create_date.substring(0, 10)}</MyAppText>
            <Image source={require("../../assets/images/ic_comment.png")} style={MyStyles.ic_comment} />
            <MyAppText style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.comment_count}</MyAppText>
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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
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
}