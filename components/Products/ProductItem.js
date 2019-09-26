// common
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';



export class ProductItem extends React.Component {
  render() {
    const item = this.props.item;
    const index = this.props.index;
    const is_new_tab = this.props.is_new_tab;
    const _this = this.props.this;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => { _this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
        <View style={[MyStyles.productItemContainer]}>
          <ImageLoad source={{ uri: Common.getImageUrl(item.image_list) }} style={[MyStyles.background_image]} />
          {item.is_liked > 0
            ?
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { _this.requestProductUnlike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
            :
            <TouchableOpacity activeOpacity={0.8} style={[MyStyles.heart_in_item]} onPress={() => { _this.requestProductLike(item.id) }}>
              <Image source={require('../../assets/images/ic_heart_off.png')} style={[MyStyles.background_image]} />
            </TouchableOpacity>
          }
          {/* {is_new_tab && item.is_new > 0 ?
            <View style={[{ position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" }, MyStyles.ic_best_ranking]}>
              <Image source={require('../../assets/images/ic_best_ranking.png')} style={[MyStyles.background_image]} />
              <MyAppText style={{ position: "absolute", fontSize: 15, fontWeight: "500", textAlign: "center", color: "white" }}>N</MyAppText>
            </View>
            : null} */}
        </View>
        <MyAppText style={[MyStyles.productBrand]} numberOfLines={1}>{item.brand_title}</MyAppText>
        <MyAppText style={[MyStyles.productName]} numberOfLines={1}>{item.title}</MyAppText>
      </TouchableOpacity>
    )
  }
}