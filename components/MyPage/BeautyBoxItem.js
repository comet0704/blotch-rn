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
      item: {}
    }
  }

  componentDidMount() {
    this.setState({ item: this.props.item })
  }

  onDaySelect = (selectedDay) => {
    console.log("---------------------\n" + selectedDay.dateString);
    this.state.item.open_date = selectedDay.dateString;
    this.setState(this.state.item)
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const _this = this.props.this;
    return (
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
        <View style={[MyStyles.productItemContainer, { width: 295 / 3, height: 270 / 3 }]}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
        </View>
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

            <TouchableOpacity>
              <Image source={require("../../assets/images/ic_remove_beautybox.png")} style={[MyStyles.ic_remove_beautybox, { marginLeft: 10 }]} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <Text style={{ color: Colors.color_949292, fontSize: 13, }}>Opened: </Text>
            <TouchableOpacity style={[MyStyles.border_bottom_e5e5e5, { flexDirection: "row", alignItems: "center" }]} onPress={() => _this.props.navigation.navigate("Calendar", { [MyConstants.NAVIGATION_PARAMS.onDaySelect]: this.onDaySelect })}>
              <Text style={{ paddingLeft: 5, paddingRight: 10 }}>{this.state.item.open_date}</Text>
              <Image source={require("../../assets/images/ic_calendar.png")} style={[MyStyles.ic_calendar]} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center", marginLeft: 10, backgroundColor: Colors.primary_purple, borderRadius: 3, height: 55 / 3 }}>
              <Text style={{ color: "white", fontSize: 12, fontWeight: "500", textAlign: "center" }}>3.5M</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}