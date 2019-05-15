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
        open_date: this.props.item.open_date == null ? null : this.props.item.open_date.substring(0, 10)
      }
    }
  }

  componentDidMount() {
    this.setState({ item: this.props.item })
  }

  onDaySelect = (selectedDay) => {
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
        <TouchableOpacity activeOpacity={0.8} style={[MyStyles.productItemContainer1, { width: 295 / 3, height: 270 / 3 }]} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]} numberOfLines={1}>{item.brand_title}</Text>
              <Text style={[MyStyles.productName, { textAlign: "left" }]} numberOfLines={1}>{item.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 0 }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  containerStyle={{ width: 200 / 3 }}
                  starSize={40 / 3}
                  emptyStarColor={Colors.color_star_empty}
                  rating={item.grade}
                  selectedStar={(rating) => {
                  }}
                  fullStarColor={Colors.color_star_full}
                />
                <View style={{ height: 15, marginLeft: 10, marginRight: 10, borderWidth: 0.5, borderColor: Colors.color_e3e5e4 }} />
                <TouchableOpacity activeOpacity={0.8} style={[{ padding: 5, borderRadius: 3 }, MyStyles.shadow_2]}
                  onPress={() => {
                    _this.onStarPressed(item.id)
                  }}>
                  {item.my_grade != null ?
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      containerStyle={[{ width: 200 / 3, },]}
                      starSize={40 / 3}
                      emptyStarColor={Colors.color_star_empty}
                      rating={item.my_grade}
                      selectedStar={(rating) => {
                        _this.onStarPressed(item.id)
                      }}
                      fullStarColor={Colors.primary_purple}
                    />
                    :
                    <Text style={{ paddingLeft: 5, paddingRight: 10, width: 200 / 3, height: 40 / 3 }}>-</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => { _this.deleteFromList(item.beautybox_id) }}>
              <Image source={require("../../assets/images/ic_remove_beautybox.png")} style={[MyStyles.ic_remove_beautybox, { marginLeft: 10 }]} />
            </TouchableOpacity>
          </View>

          {this.state.date_changed == false ? // 초기자료이면 item.open_date로 현시, open_date설정하였으면 this.state.item.open_date 현시, 원래 this.state.item.open_date로 했으면 좋겟으나 잘 안되는 문제가 있음.
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              <Text style={{ color: Colors.color_949292, fontSize: 13, }}>Opened: </Text>
              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => _this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                {item.open_date != null ?
                  <Text style={{ paddingLeft: 5, paddingRight: 10 }}>{item.open_date.substring(0, 10)}</Text>
                  :
                  <Text style={{ paddingLeft: 5, paddingRight: 10 }}>-</Text>
                }

                <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
              </TouchableOpacity>
              <View style={{flex:1}}></View>
              {item.open_date != null ?
                <View style={{ justifyContent: "center", marginLeft: 10, paddingHorizontal:10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>{Common.getRestUsePeriod(item.open_date.substring(0, 10), 180)}</Text>
                </View>
                :
                <View style={{ justifyContent: "center", marginLeft: 10, paddingHorizontal:10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>{Common.getRestUsePeriod(0, 180)}</Text>
                </View>
              }

            </View>
            :
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5 }}>
              <Text style={{ color: Colors.color_949292, fontSize: 13, }}>Opened: </Text>
              <TouchableOpacity activeOpacity={0.8} style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => _this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
                <Text style={{ paddingLeft: 5, paddingRight: 10 }}>{this.state.item.open_date}</Text>
                <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: "center", marginLeft: 10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>{Common.getRestUsePeriod(this.state.item.open_date, 180)}</Text>
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