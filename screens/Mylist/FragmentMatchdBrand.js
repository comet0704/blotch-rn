// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, Modal, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { BrandItem } from '../../components/Search/BrandItem';
import { MyAppText } from '../../components/Texts/MyAppText';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export class FragmentMatchdBrand extends React.Component {
  offset = 0;

  constructor(props) {
    super(props);
    this.isLoading = false
    this.state = {
      showDeleteModal: false,
      categoryItems: Common.getCategoryItems(),
      brand_list_result_data: {
        "brand_list": [
        ]
      },

      beforeCatIdx: 0,
      loading_end: false,
    };

  }
  componentDidMount() {
    this.requestUserBrandList(0)
  }

  onNavigationEvent = () => {
    this.requestUserBrandList(0)
  }


  deleteFromList(p_item_id) {
    this.setState({ delete_item_id: p_item_id, showDeleteModal: true })
  }

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
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestUserBrandList(this.offset)
            }
          }}>

          <View>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

            {/* brand ?????? */}
            <View style={[MyStyles.padding_v_main, { flex: 1 }]}>
              <FlatGrid
                itemDimension={((this.ScreenWidth - 60) / 3)}
                items={this.state.brand_list_result_data.brand_list}
                style={[MyStyles.gridView, { marginTop: 10 }]}
                spacing={15}
                renderItem={({ item, index }) => (
                  <BrandItem is_match_list={true} item_width={((this.ScreenWidth - 60) / 3)} item={item} index={index} this={this} />
                )}
              />
            </View>

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
                  <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", textAlign: "center", marginLeft: 10, marginRight: 10, fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Are you sure you want to delete this brand from the list?</MyAppText>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight onPress={() => {
                      this.setState({ showDeleteModal: false });
                      this.requestBrandUnlike(this.state.delete_item_id);
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
        if (p_offset == 0) { // ???????????? ??????????????? offset?????? 0???????????? ???????????? ???.
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
        this.setState({ brand_list_result_data: result }, () => {
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

  requestBrandUnlike(p_brand_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.brand.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        brand_id: p_brand_id.toString()
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }
        const w_index = this.state.brand_list_result_data.brand_list.findIndex(item => item.id == p_brand_id)
        this.state.brand_list_result_data.brand_list.splice(w_index, 1)
        this.setState({ brand_list_result_data: this.state.brand_list_result_data })
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