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
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import { ProductItem2 } from '../../components/Products/ProductItem2';
import { BrandItem } from '../../components/Search/BrandItem';

export class FragmentMatchdBrand extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.requestUserBrandList(this.offset)
  }
  state = {
    categoryItems: Common.getCategoryItems(),
    brand_list_result_data: {
      "brand_list": [
      ]
    },

    beforeCatIdx: 0,
    loading_end: false,
  };


  ScreenWidth = Dimensions.get('window').width;



  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag"
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false) {
              this.requestUserBrandList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
            }
          }}>

          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

            {/* brand 나열 */}
            <View style={[MyStyles.padding_v_main, { flex: 1 }]}>
              <FlatGrid
                itemDimension={((this.ScreenWidth - 60) / 3)}
                items={this.state.brand_list_result_data.brand_list}
                style={[MyStyles.gridView, {marginTop:10}]}
                spacing={15}
                renderItem={({ item, index }) => (
                  <BrandItem is_match_list={true} item_width={((this.ScreenWidth - 60) / 3)} item={item} index={index} this={this} />
                )}
              />
            </View>

          </View>
        </ScrollView>
      </View>
    );
  }

  requestUserBrandList(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.brandList, {
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
          return;
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.brand_list.length
        if (responseJson.result_data.brand_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            brand_list_result_data: responseJson.result_data
          });
          return;
        }
        const brand_list = this.state.brand_list_result_data.brand_list
        result = { brand_list: [...brand_list, ...responseJson.result_data.brand_list] };
        this.setState({ brand_list_result_data: result })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

};