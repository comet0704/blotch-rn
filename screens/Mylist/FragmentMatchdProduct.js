// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Modal, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { ProductItem3 } from '../../components/Products/ProductItem3';
import { MyAppText } from '../../components/Texts/MyAppText';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export class FragmentMatchdProduct extends React.Component {
  offset = 0;
  selectedSubCatName = "";
  constructor(props) {
    super(props);
    this.isLoading = false
  }
  componentDidMount() {
  }
  state = {
    categoryItems: Common.getCategoryItems(),
    showDeleteModal: false,
    delete_item_id: 0,
    product_list_result_data: {
      match_list: []
    },

    beforeCatIdx: 0,
    loading_end: false,
  };

  onNavigationEvent = () => {
    this.requestMatchList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
  }

  ScreenWidth = Dimensions.get('window').width;

  onCategorySelect = (p_catName) => {
    const categoryItems = [...this.state.categoryItems]
    const index = categoryItems.findIndex(item => item.categoryName === p_catName)
    categoryItems[this.state.beforeCatIdx].is_selected = false
    categoryItems[index].is_selected = true
    this.state.beforeCatIdx = index
    this.setState({ categoryItems })

    this.setState({ loading_end: false })
    if (this.state.categoryItems[index].sub_category.length > 0) {
      this.selectedSubCatName = this.state.categoryItems[index].sub_category[0].name;
    } else {
      this.selectedSubCatName = "";
    }
    this.requestMatchList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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
                    this.setState({ loading_end: false })
                    this.requestMatchList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, 0)
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

  deleteFromList(p_item_id) {
    this.setState({ delete_item_id: p_item_id, showDeleteModal: true })
  }

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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestMatchList(this.state.categoryItems[this.state.beforeCatIdx].categoryName, this.selectedSubCatName, this.offset)
            }
          }}>

          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

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
              this.renderSubCategory(this.state.beforeCatIdx)
            }

            {/* product ?????? */}
            <View style={[MyStyles.padding_h_5, MyStyles.padding_v_main, { flex: 1 }]}>
              <MyAppText style={{ color: Colors.primary_dark, fontSize: 14, marginLeft: 10, fontWeight: "500" }}>Product({this.state.product_list_result_data.match_list.length})</MyAppText>
              <FlatGrid
                itemDimension={this.ScreenWidth}
                items={this.state.product_list_result_data.match_list}
                style={MyStyles.gridView}
                spacing={10}
                renderItem={({ item, index }) => (
                  <ProductItem3 is_match_list={true} item={item} index={index} this={this} />
                )}
              />
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.showDeleteModal}
              onRequestClose={() => {
              }}>
              <View style={{ flex: 1 }}>
                <View style={MyStyles.modal_bg}>
                  <View style={MyStyles.modalContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                      this.setState({ showDeleteModal: false });
                    }}>
                      <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                    </TouchableOpacity>

                    <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                    <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", textAlign: "center", marginLeft: 10, marginRight: 10, fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Are you sure you want to delete this product from the list?</MyAppText>

                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight onPress={() => {
                        this.setState({ showDeleteModal: false });
                        this.requestDeleteMatch(this.state.delete_item_id);
                      }}
                        style={[MyStyles.dlg_btn_primary_cover]}>
                        <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={[MyStyles.dlg_btn_primary_white_cover]}
                        onPress={() => {
                          this.setState({ showDeleteModal: false });
                        }}>
                        <MyAppText style={MyStyles.btn_primary_white}>No</MyAppText>
                      </TouchableHighlight>
                    </View>
                  </View>

                </View>
              </View>
            </Modal>


          </View>
        </ScrollView>
      </View>
    );
  }

  requestMatchList(p_category, p_sub_category, p_offset) {
    console.log("000000000" + global.login_info.token);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.matchList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        category: p_category == "" ? "All" : p_category,
        sub_category: p_sub_category,
        offset: p_offset.toString(),
        type: "0", // 0 ?????? match ??????, 1 ?????? blotch ??????
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
        this.offset += responseJson.result_data.match_list.length
        if (responseJson.result_data.match_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }
        if (p_offset == 0) {
          this.setState({
            product_list_result_data: responseJson.result_data
          });
          return;
        }
        const match_list = this.state.product_list_result_data.match_list
        result = { match_list: [...match_list, ...responseJson.result_data.match_list] };
        this.setState({ product_list_result_data: result }, () => {
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


  requestDeleteMatch(p_product_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.product.deleteMatch, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id.toString(),
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
          return;
        }
        const match_list = this.state.product_list_result_data.match_list
        const index = match_list.findIndex(item => item.id === p_product_id)
        match_list.splice(index, 1)
        const result = { match_list: match_list };
        this.setState({ product_list_result_data: result })
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