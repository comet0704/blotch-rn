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


export class ProductItem3 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isStarPressed: false,
    }
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const _this = this.props.this;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <View style={[MyStyles.productItemContainer1, { width: 302 / 3, height: 260 / 3 }]}>
            <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
          </View>
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={[MyStyles.productBrand, { textAlign: "left", marginTop: 0 }]}>{item.brand_title}</Text>
          <Text style={[MyStyles.productName, { textAlign: "left", height: 40 / 3 }]} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", height: 69 / 3 }}
            onPress={() => {
              this.state.isStarPressed = !this.state.isStarPressed
              this.setState({ isStarPressed: this.state.isStarPressed })
            }}>
            <StarRating
              disabled={false}
              maxStars={5}
              containerStyle={{ width: 200 / 3 }}
              starSize={40 / 3}
              emptyStarColor={Colors.color_star_empty}
              rating={item.grade}
              selectedStar={(rating) => {
                this.state.isStarPressed = !this.state.isStarPressed
                this.setState({ isStarPressed: this.state.isStarPressed })
              }}
              fullStarColor={Colors.color_star_full}
            />

            {this.state.isStarPressed ?
              <View style={[{ justifyContent: "center", alignItems: "center", marginLeft: 5 }, MyStyles.ic_star_rate_bg]}>
                <Image source={require("../../assets/images/ic_star_rate_bg.png")} style={[MyStyles.background_image]} />
                <Text style={{ color: Colors.color_star_full, alignSelf: "center", marginTop: -2, fontSize: 12 }}>{parseFloat(item.grade).toFixed(1)}</Text>
              </View>
              : null}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Image source={require("../../assets/images/ic_comment.png")} style={MyStyles.ic_comment} />
            <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.comment_count}</Text>
            {this.props.is_match_list ?
              <Image source={require("../../assets/images/ic_match_small.png")} style={[MyStyles.ic_match_small, { marginLeft: 10 }]} />
              :
              this.props.is_blotch_list ?
                <Image source={require("../../assets/images/ic_blotch_small.png")} style={[MyStyles.ic_blotch_small, { marginLeft: 10 }]} />
                :
                this.props.is_heart_list ?
                  <Image source={require("../../assets/images/ic_heart_gray.png")} style={[MyStyles.ic_heart_gray, { marginLeft: 10 }]} />
                  :
                  <Image source={require("../../assets/images/ic_heart_gray.png")} style={[MyStyles.ic_heart_gray, { marginLeft: 10 }]} />
            }
            <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>{item.like_count}</Text>
          </View>
        </View>

        {this.props.is_match_list ?
          <TouchableOpacity onPress={() => { _this.deleteFromList(item.id) }}>
            <Image source={require("../../assets/images/ic_match_on1.png")} style={[MyStyles.ic_match_on1, { marginLeft: 10 }]} />
          </TouchableOpacity>
          : null}
        {this.props.is_blotch_list ?
          <TouchableOpacity onPress={() => { _this.deleteFromList(item.id) }}>
            <Image source={require("../../assets/images/ic_blotch_on1.png")} style={[MyStyles.ic_blotch_on1, { marginLeft: 10 }]} />
          </TouchableOpacity>
          : null}
        {this.props.is_heart_list ?
          <TouchableOpacity onPress={() => { _this.deleteFromList(item.id) }}>
            <Image source={require("../../assets/images/ic_heart_big.png")} style={[MyStyles.ic_heart_big, { marginLeft: 10 }]} />
          </TouchableOpacity>
          : null}
        {this.props.is_own_list ?
          <TouchableOpacity onPress={() => { _this.deleteFromList(item.id) }}>
            <Image source={require("../../assets/images/ic_delete1.png")} style={[MyStyles.ic_heart_big, { marginLeft: 10 }]} />
          </TouchableOpacity>
          : null}
      </View>
    )
  }
}