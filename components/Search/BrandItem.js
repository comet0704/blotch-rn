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


export class BrandItem extends React.Component {
  render() {
    const item = this.props.item;
    const index = this.props.index;
    const item_width = this.props.item_width;
    const is_match_list = this.props.is_match_list;
    const _this = this.props.this;
    return (
      <View key={item.id} style={[{ flex: 1, width: 85 }, is_match_list ? null : { marginRight: 20, }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { _this.props.navigation.navigate("SearchBrandDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id }) }}>
          <ImageLoad style={{ width: item_width, height: item_width, borderColor: Colors.color_e3e5e4, borderWidth: 0.5, borderRadius: 50, overflow: "hidden" }} source={{ uri: Common.getImageUrl(item.image) }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: Colors.color_949191, marginTop: 5, textAlign: "center" }} numberOfLines={2}>Products{"\n" + item.product_count}</Text>
        {is_match_list == false ?
          item.is_liked > 0
            ?
            <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { _this.requestProductUnlike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart2_on.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { _this.requestProductLike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart2_off.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
          :
          null
        }

      </View>
    )
  }
}