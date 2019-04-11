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
    this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
  }
  state = {
    categoryItems: Common.getCategoryItems(),
    brand_list_result_data: {
      "brand_list": [
        {
          "id": 1,
          "title": "LUSH",
          "image": "uploads/brand/logo_01.jpg",
          "is_liked": 9,
          "product_count": 3
        },
        {
          "id": 2,
          "title": "BEAUTY",
          "image": "uploads/brand/logo_02.jpg",
          "is_liked": 1,
          "product_count": 3
        },
        {
          "id": 3,
          "title": "BOBBI BROWN",
          "image": "uploads/brand/logo_03.jpg",
          "is_liked": 4,
          "product_count": 3
        },
        {
          "id": 4,
          "title": "THE BODY SHOP",
          "image": "uploads/brand/logo_05.jpg",
          "is_liked": null,
          "product_count": 3
        },
        {
          "id": 5,
          "title": "GENESIS",
          "image": "uploads/brand/logo_07.jpg",
          "is_liked": null,
          "product_count": 3
        },
        {
          "id": 6,
          "title": "GATHER",
          "image": "uploads/brand/logo_09.jpg",
          "is_liked": null,
          "product_count": 3
        },
        {
          "id": 7,
          "title": "ROSITA",
          "image": "uploads/brand/logo_11.jpg",
          "is_liked": null,
          "product_count": 3
        },
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
              this.requestBestList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
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

  onProductLiked = (p_product_id) => {
    const product_list = this.state.brand_list_result_data.brand_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { brand_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.brand_list_result_data.brand_list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { brand_list: product_list };
    this.setState({ product_list_result_data: result })
  }

  requestBestList(p_category, p_sub_category, p_offset) {
    console.log("category= " + p_category);
    console.log("p_sub_category = " + p_sub_category)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.bestList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        category: p_category == "" ? "All" : p_category,
        sub_category: p_sub_category,
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
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const brand_list = this.state.brand_list_result_data.brand_list
        result = { brand_list: [...brand_list, ...responseJson.result_data.brand_list] };
        this.setState({ product_list_result_data: result })
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }



  requestProductLike(p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.like, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString()
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
        this.onProductLiked(p_product_id)

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestProductUnlike(p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString()
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
        this.onProductUnliked(p_product_id)

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