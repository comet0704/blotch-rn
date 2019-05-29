// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Platform, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../../constants/MyStyles'
import MyConstants from '../../../constants/MyConstants'
import Common from '../../../assets/Common';
import Net from '../../../Net/Net';
import Colors from '../../../constants/Colors';
import { MyAppText } from '../../../components/Texts/MyAppText';
import { Icon } from 'expo';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo';
import { NavigationEvents } from 'react-navigation';
import { FlatGrid } from 'react-native-super-grid';
import { ProductItem2 } from '../../../components/Products/ProductItem2';

export default class SearchResultProductMoreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result_data: {
        product_count: 30,
        product_list: [
        ],
      },
    };
  }

  componentDidMount() {    
    w_searchWord = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.search_word)
    this.setState({ searchWord: w_searchWord })
    this.requestSearchProduct(w_searchWord);
  }

  static navigationOptions = {
    header: null,
  };

  ScreenWidth = Dimensions.get('window').width;

  render() {
    const { weatherType, weatherInfo } = this.state;

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
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
            <View style={{ backgroundColor: "white" }}>
              {/* Search bar */}
              <View style={[MyStyles.searchBoxCommon, { paddingRight: 15, }, MyStyles.bg_white]}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.pop(2)
                  }} 
                  activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
                  <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
                    source={require("../../../assets/images/ic_back_black.png")}
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[MyStyles.searchBoxCover, {paddingLeft:0}]}>
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingRight: 5 }} value={this.state.searchWord}></TextInput>
                    <TouchableOpacity activeOpacity={0.8} style={{ padding: 8, alignSelf: "center" }} onPress={() => { this.props.navigation.navigate("SearchBarcode") }}>
                      <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>


              {/* product 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white" }]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent:"center" }, MyStyles.container]}>
                  <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10, alignSelf:"center",  }} onPress={() => { this.props.navigation.goBack() }}>
                    <Image source={require("../../../assets/images/ic_back3.png")} style={[MyStyles.ic_back3,]} />
                  </TouchableOpacity>
                  <MyAppText style={[MyStyles.text_14, { flex: 1, textAlignVertical:"center", marginTop:-8 }]}>Product({this.state.result_data.product_count})</MyAppText>
                </View>
                <FlatGrid
                  itemDimension={this.ScreenWidth}
                  items={this.state.result_data.product_list}
                  style={[MyStyles.gridView, MyStyles.padding_h_5]}
                  spacing={10}
                  renderItem={({ item, index }) => (
                    <ProductItem2 item={item} index={index} this={this}/>
                  )}
                />
              </View>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View >
    );
  }

  requestSearchProduct(p_keyword) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.searchProduct, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        keyword: p_keyword
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.setState({
          result_data: responseJson.result_data,
        });
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
    // this.setState({
    //   isLoading: true,
    // });
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchProduct(this.state.searchWord);
        global.refreshStatus.mylist = true

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
    // this.setState({
    //   isLoading: true,
    // });
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
        // console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        this.requestSearchProduct(this.state.searchWord);
        global.refreshStatus.mylist = true
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }
}