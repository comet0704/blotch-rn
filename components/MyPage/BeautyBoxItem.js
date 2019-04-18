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
import StarRating from 'react-native-star-rating';

import {
  KeyboardAvoidingView,
  View,
  Image,
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';


export class BeautyBoxItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      date_changed: false,
      item: {
        open_date: this.props.item.open_date.substring(0, 10)
      }
    }
  }

  componentDidMount() {
    this.setState({ item: this.props.item })
  }

  onDaySelect = (selectedDay) => {
    console.log("---------------------\n" + selectedDay.dateString);
    this.state.item.open_date = selectedDay.dateString;
    this.setState(this.state.item)
    this.setState({ date_changed: true })

    // 오픈일 저장시킴
    this.requestEditBeautyBox(this.props.item.beautybox_id, this.state.item.open_date)
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const _this = this.props.this;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={[MyStyles.productItemContainer1, { width: 295 / 3, height: 270 / 3 }]} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]}>{item.brand_title}</Text>
              <Text style={[MyStyles.productName, { textAlign: "left" }]} numberOfLines={1}>{item.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
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
                <View style={{ height: 15, marginLeft: 10, marginRight: 10, borderWidth: 0.5, borderColor: Colors.color_e3e5e4 }} />
                <TouchableOpacity style={[{ padding: 5, borderRadius: 3 }, MyStyles.shadow_2]}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    containerStyle={[{ width: 200 / 3, },]}
                    starSize={40 / 3}
                    emptyStarColor={Colors.color_star_empty}
                    rating={5}
                    selectedStar={(rating) => { }}
                    fullStarColor={Colors.primary_purple}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => {_this.requestDeleteBeautyBox(item.beautybox_id)}}>
              <Image source={require("../../assets/images/ic_remove_beautybox.png")} style={[MyStyles.ic_remove_beautybox, { marginLeft: 10 }]} />
            </TouchableOpacity>
          </View>

          {this.state.date_changed == false ? // 초기자료이면 item.open_date로 현시, open_date설정하였으면 this.state.item.open_date 현시
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              <Text style={{ color: Colors.color_949292, fontSize: 13, }}>Opened: </Text>
              <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => _this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                {item.open_date != null ?
                  <Text style={{ paddingLeft: 5, paddingRight: 10 }}>{item.open_date.substring(0, 10)}</Text>
                  :
                  <Text style={{ paddingLeft: 5, paddingRight: 10 }}>-</Text>
                }

                <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
              </TouchableOpacity>
              {item.open_date != null ?
                <View style={{ flex: 1, justifyContent: "center", marginLeft: 10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>3.5M</Text>
                </View>
                : null
              }

            </View>
            :
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              <Text style={{ color: Colors.color_949292, fontSize: 13, }}>Opened: </Text>
              <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => _this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                <Text style={{ paddingLeft: 5, paddingRight: 10 }}>{this.state.item.open_date}</Text>
                <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", marginLeft: 10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>3.5M</Text>
              </View>
            </View>
          }
        </View>
      </View>
    )
  }


  requestEditBeautyBox(p_beautybox_id, p_open_date) {

    return fetch(Net.user.editBeautyBox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        beautybox_id: p_beautybox_id.toString(),
        open_date: p_open_date,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        alert("BBBBB:" + p_beautybox_id + ":" + p_open_date);
        console.log(responseJson);

        if (responseJson.result_code < 0) {
          this.props.this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
      })
      .catch((error) => {
        this.props.this.refs.toast.showBottom(error);
      })
      .done();
  }
}