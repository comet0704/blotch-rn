// common
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';



export class BrandItem extends React.Component {
  render() {
    const item = this.props.item;
    const index = this.props.index;
    const item_width = this.props.item_width;
    const is_match_list = this.props.is_match_list;
    const is_add_modal = this.props.is_add_modal; // quetionnaire 에서 brand_favorite_list, brand_mostly_list 에 추가할때 현시되는 팝업에서 이용하는 경우
    const _this = this.props.this;
    return (
      <View key={item.id} style={[{ flex: 1, width: item_width }, is_match_list ? null : { marginRight: 20, }]}>
        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }} onPress={() => { is_add_modal ? _this.onBrandSelect(item) : _this.props.navigation.navigate("SearchBrandDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.is_from_camera_search]: true }) }}>
          { // 이미지가 없을 경우 브랜드 명을 가운데 현시해주자
            item.image == null || item.image.length <= 0
              ?
              <View style={[MyStyles.brandTitleCover]}>
                <MyAppText style={MyStyles.brandTitle1}>{item.title}</MyAppText>
              </View>
              :
              null
          }
          <ImageLoad style={[{ width: item_width, height: item_width, borderRadius: item_width / 2 }, MyStyles.brandImage]} source={{ uri: Common.getImageUrl(item.image) }} />
        </TouchableOpacity>

        <MyAppText style={{ fontSize: 12, color: Colors.color_949191, marginTop: 5, textAlign: "center" }} numberOfLines={2}>Products{"\n" + "(" + item.product_count + ")"}</MyAppText>
        {
          is_add_modal != true ?
            item.is_liked > 0
              ?
              <TouchableOpacity activeOpacity={0.8} style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => {
                if (is_match_list) {
                  _this.deleteFromList(item.id)
                } else {
                  _this.requestBrandUnlike(item.id)
                }
              }
              }>
                <Image source={require('../../assets/images/ic_heart2_on.png')} style={[MyStyles.background_image]} />
              </TouchableOpacity>
              :
              <TouchableOpacity activeOpacity={0.8} style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]} onPress={() => { _this.requestBrandLike(item.id) }}>
                <Image source={require('../../assets/images/ic_heart2_off.png')} style={[MyStyles.background_image]} />
              </TouchableOpacity>
            :
            null
        }
        {
          is_add_modal ?
            item.is_selected > 0
              ?
              <View style={[{ position: "absolute", right: 0, top: 0 }, MyStyles.heart2]}>
                <Image source={require('../../assets/images/ic_question_checked.png')} style={[MyStyles.background_image]} />
              </View>
              :
              null
            :
            null
        }

      </View >
    )
  }
}