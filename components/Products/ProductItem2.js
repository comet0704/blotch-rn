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


export class ProductItem2 extends React.Component {
  render() {
    const item = this.props.item;
    const index = this.props.index;
    const _this = this.props.this;
    return (
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
        <View style={[MyStyles.productItemContainer, { width: 418 / 3, aspectRatio: 1.2 }]}>
          <Image source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
          {item.is_liked > 0
            ?
            <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { _this.requestProductUnlike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={[{ position: "absolute", right: 10, top: 10 }, MyStyles.heart]} onPress={() => { _this.requestProductLike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
          }
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]}>{item.brand_title}</Text>
          <Text style={[MyStyles.productName, { textAlign: "left", height: 120 / 3 }]} numberOfLines={2}>{item.title}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            containerStyle={{ width: 273 / 3 }}
            starSize={40 / 3}
            emptyStarColor={Colors.color_star_empty}
            rating={item.grade}
            selectedStar={(rating) => { }}
            fullStarColor={Colors.color_star_full}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <Image source={require("../../assets/images/ic_comment.png")} style={MyStyles.ic_comment} />
            <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.comment_count}</Text>
            <Image source={require("../../assets/images/ic_heart_gray.png")} style={[MyStyles.ic_heart_gray, { marginLeft: 10 }]} />
            <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.like_count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}