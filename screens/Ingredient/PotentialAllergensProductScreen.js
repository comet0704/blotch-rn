// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { ProductItem2 } from '../../components/Products/ProductItem2';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';



export default class PotentialAllergensProductScreen extends React.Component {
  constructor(props) {
    super(props)
    this.isLoading = false
    this.state = {
      categoryItems: Common.getCategoryItems(),
      potentialAllergenProductList_result_data: {
        total_count: 0,
        list: [
        ]
      },
    };

    this.loading_end = false
    this.offset = 0;
    this.beforeCatIdx = 0;
    this.selectedSubCatName = "";
  }

  componentDidMount() {
    this.requestPotentialAllergenProductList(this.state.categoryItems[this.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
  }


  ScreenWidth = Dimensions.get('window').width;

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.beforeCatIdx = index
    this.setState({ categoryItems })

    this.loading_end = false
    if (this.state.categoryItems[index].sub_category.length > 0) {
      this.selectedSubCatName = this.state.categoryItems[index].sub_category[0].name;
    } else {
      this.selectedSubCatName = "";
    }
    this.requestPotentialAllergenProductList(this.state.categoryItems[index].categoryName, this.selectedSubCatName, 0)
  }


  renderCategoryScroll() {
    return (
      <View
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>

          {this.state.categoryItems.map(item => (
            <View key={item.categoryName} style={{ marginRight: 10 }}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => { this.onCategorySelect(item.categoryName) }} style={[MyStyles.category_image_container]}>
                {item.is_selected ? <Image source={require("../../assets/images/ic_gradient_bg.png")} style={[MyStyles.background_image]} /> : null}
                {item.is_selected ? <Image style={item.image_style} source={item.image_on} /> : <Image style={item.image_style} source={item.image_off} />}
              </TouchableOpacity>
              <MyAppText style={MyStyles.category_text} numberOfLines={1}>{item.categoryName}</MyAppText>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  renderSubCategory(p_categoryIndex) {
    return (
      this.state.categoryItems[p_categoryIndex].sub_category.length > 0 ?
        <View style={{}}>
          <View>
            <View style={MyStyles.tabbar_button_container}>
              {
                this.state.categoryItems[p_categoryIndex].sub_category.map((item, index) => (
                  <TouchableOpacity activeOpacity={0.8} key={item.name} style={item.is_selected ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                    this.selectedSubCatName = item.name
                    categoryItems = this.state.categoryItems;
                    categoryItems[p_categoryIndex].sub_category.map((item) => (item.is_selected = false))
                    categoryItems[p_categoryIndex].sub_category[index].is_selected = true
                    this.setState({ categoryItems: categoryItems })
                    this.loading_end = false
                    this.requestPotentialAllergenProductList(this.state.categoryItems[this.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
                  }}>
                    <MyAppText style={item.is_selected ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >{item.name}</MyAppText>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        </View>
        : null
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <TopbarWithBlackBack title="Potential Allergens Product" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestPotentialAllergenProductList(this.state.categoryItems[this.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column', backgroundColor: "white", }} keyboardDismissMode="on-drag">

          <View>

            {/* ???????????? ?????? ?????? */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.color_f8f8f8,
              padding: 15,
              height: 110
            }}>
              {
                this.renderCategoryScroll()
              }
            </View>

            {
              this.renderSubCategory(this.beforeCatIdx)
            }

            {/* product ?????? */}
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1, backgroundColor: "white" }]}>
              <MyAppText style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product({this.state.potentialAllergenProductList_result_data.total_count})</MyAppText>
              <FlatGrid
                itemDimension={this.ScreenWidth}
                items={this.state.potentialAllergenProductList_result_data.list}
                style={MyStyles.gridView}
                spacing={10}
                renderItem={({ item, index }) => (
                  <ProductItem2 item={item} index={index} this={this} />
                )}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  onProductLiked = (p_product_id) => {
    const product_list = this.state.potentialAllergenProductList_result_data.list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = 100
    const result = { list: product_list };
    this.setState({ potentialAllergenProductList_result_data: result })
  }

  onProductUnliked = (p_product_id) => {
    const product_list = this.state.potentialAllergenProductList_result_data.list
    const index = product_list.findIndex(item => item.id === p_product_id)
    product_list[index].is_liked = null
    const result = { list: product_list };
    this.setState({ potentialAllergenProductList_result_data: result })
  }

  requestPotentialAllergenProductList(p_category, p_sub_category, p_offset) {
    console.log("global.login_info.questionnaire_id = " + global.login_info.questionnaire_id);
    console.log("category = " + p_category);
    console.log("p_sub_category = " + p_sub_category)
    console.log("offset = " + p_offset)
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.potentialAllergenProductList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: global.login_info.questionnaire_id,
        category: p_category == "" ? "All" : p_category,
        sub_category: p_sub_category == "" ? "All" : p_sub_category,
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
        if (p_offset == 0) { // ???????????? ??????????????? offset?????? 0???????????? ???????????? ???.
          this.offset = 0;
        }
        this.offset += responseJson.result_data.list.length
        if (responseJson.result_data.list.length < MyConstants.ITEMS_PER_PAGE) {
          this.loading_end = true
        }
        if (p_offset == 0) {
          this.setState({
            potentialAllergenProductList_result_data: responseJson.result_data
          });
          return;
        }
        const list = this.state.potentialAllergenProductList_result_data.list
        result = { list: [...list, ...responseJson.result_data.list] };
        this.setState({ potentialAllergenProductList_result_data: result }, () => {
          this.isLoading = false
        })
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
        this.onProductLiked(p_product_id)
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
        this.onProductUnliked(p_product_id)
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

};