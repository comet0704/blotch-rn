// common
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyStyles from '../../constants/MyStyles'
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../constants/MyConstants'
import Common from '../../assets/Common';
import Net from '../../Net/Net';
import Colors from '../../constants/Colors';

import {
  Image,
  PanResponder,
  ScrollView,
  Keyboard,
  ListView,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  TouchableHighlight,
  Easing,
} from 'react-native';

import { NavigationEvents } from 'react-navigation';
import { LinearGradient } from 'expo';
import SortableList from 'react-native-sortable-list';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import 'prop-types';

class Row extends React.Component {

  constructor(props) {
    super(props);
    this._active = new Animated.Value(0);
    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const { data } = this.props;

    return (
      <Animated.View style={[{ paddingTop: 10 }, this._style]}>
        <View style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.mylist_section]}>
          <View style={MyStyles.ingredient_section_header}>
            <Image source={require("../../assets/images/ic_dice.png")} style={[MyStyles.ic_dice, { position: "absolute", left: -11 }]} />
            <Image source={data.image} style={[data.img_style]} />
            <TouchableOpacity style={[MyStyles.padding_h_main, { flex: 1 }]} onPress={() => { alert("A") }}>
              <Text style={[MyStyles.ingredient_section_header_text1]}>{data.desc}</Text>
              <Text style={[MyStyles.ingredient_section_header_text2]}>+{data.count}</Text>
            </TouchableOpacity>
            <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
          </View>
        </View>
      </Animated.View>
    );
  }
}


export default class MyListScreen extends React.Component {
  offset = 0;

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
    })
    this.state = {
      scroll_enabled: true,
      alreadyLoaded: false,
      showLoginModal: false,
      requestMyListModalVisible: false,
      request_list_name: "",
      mylist_result_data: {
        "my_list": [
        ]
      },

      like_list_data: {
        match: {
          image: require("../../assets/images/ic_like_matchd.png"),
          img_style: MyStyles.ic_like_matchd,
          desc: "Match'd List",
          count: 0,
        },
        blotch: {
          image: require("../../assets/images/ic_like_blotchd.png"),
          img_style: MyStyles.ic_like_blotchd,
          desc: "Blotch'd List",
          count: 0,
        },
        heart: {
          image: require("../../assets/images/ic_like_heart.png"),
          img_style: MyStyles.ic_like_heart,
          desc: "Heart List",
          count: 0,
        },
        favorite: {
          image: require("../../assets/images/ic_like_favorite.png"),
          img_style: MyStyles.ic_like_matchd,
          desc: "Favorite Article",
          count: 0,
        },
      },

      album_list: [
        {
          "id": 1,
          "title": "My List1",
          "content": "My List1",
          "count": 0
        },
        {
          "id": 2,
          "title": "내 목록",
          "content": "My List2",
          "count": 2
        },
        {
          "id": 3,
          "title": "내 목록",
          "content": "My List2",
          "count": 2
        },
        {
          "id": 4,
          "title": "내 목록",
          "content": "My List2",
          "count": 2
        },
        {
          "id": 5,
          "title": "내 목록",
          "content": "My List2",
          "count": 2
        },
        {
          "id": 2,
          "title": "내 목록",
          "content": "My List2",
          "count": 2
        }
      ],

      like_list_order: ["match", "blotch", "heart", "favorite"]

    }
  }

  componentDidMount() {
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.like_list_order, (err, result) => {
      console.log(result);
      if (result == "") {
        this.setState({ like_list_order: ["match", "blotch", "heart", "favorite"] })
      } else {
        this.setState({ like_list_order: result.split(",") })
      }
    })
  }

  deleteMyListRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].closeRow();
    const newData = [...this.state.album_list];
    newData.splice(rowId, 1);
    this.setState({ album_list: newData });
  }

  addMyList() {
    if (this.state.request_list_name == "" || this.state.request_product_name == "") {
      this.refs.toast.showTop("Please input List name");
      return;
    }
    this.setState({ requestMyListModalVisible: false });
    // this.requestProductRequest(this.state.request_brand_name, this.state.product_name)
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        {/* <NavigationEvents
          onWillFocus={payload => {
            if (global.login_info.token == null || global.login_info.token.length < 1) {
              this.setState({ showLoginModal: true });
              return;
            }
            if(this.state.alreadyLoaded == false) {
              this.requestMyList();
            }
          }}
        /> */}
        <TopbarWithBlackBack title="My Ingredients" onPress={() => { this.props.navigation.goBack(null) }}></TopbarWithBlackBack>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <ScrollView ref='_scrollview' scrollEnabled={this.state.scroll_enabled} style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag">

          <View style={{ justifyContent: "center" }}>

            <SortableList
              onActivateRow={() => { this.setState({ scroll_enabled: false }) }}
              onReleaseRow={() => { this.setState({ scroll_enabled: true }) }}
              onChangeOrder={async (nextOrder) => {
                await AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.like_list_order, nextOrder.toString())
                await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.like_list_order, (err, result) => {
                  console.log(result);
                  if (result == "") {
                    this.setState({ like_list_order: ["match", "blotch", "heart", "favorite"] })
                  } else {
                    this.setState({ like_list_order: result.split(",") })
                  }
                })
              }}
              data={this.state.like_list_data}
              contentContainerStyle={{ padding: 15 }}
              order={this.state.like_list_order}
              renderRow={({ key, data, active }) => {
                return <Row data={data} this={this} active={active} />
              }
              }
              renderFooter={() => {

              }}
            />

            <SwipeListView
              contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
              dataSource={this.ds.cloneWithRows(this.state.album_list)}
              onRowOpen={(rowId) => { alert(rowId) }}
              renderRow={(data, secId, rowId, rowMap) => (
                <SwipeRow
                  rowKey={3}
                  style={{ marginBottom: 15 }}
                  disableRightSwipe={true}
                  rightOpenValue={-180 / 3}>
                  <View style={{
                    alignItems: 'center',
                    backgroundColor: '#DDD',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    color: "white",
                    borderRadius: 5
                  }}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        bottom: 0,
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0,
                        width: 180 / 3,
                        right: 0,
                      }}
                      onPress={_ => this.deleteMyListRow(secId, rowId, rowMap)}>
                      <Text style={{ color: "white" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.my_own_list_section]}>
                    <View style={MyStyles.ingredient_section_header}>
                      <TouchableOpacity style={[{ flex: 1 }]} onPress={() => { }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[MyStyles.ingredient_section_header_text1, {alignSelf:"center"}]}>{data.title}</Text>
                          <Image source={require("../../assets/images/ic_pencil.png")} style={[MyStyles.ic_pencil,, {alignSelf:"center"}, { marginLeft: 5 }]} />
                        </View>
                        <Text style={[MyStyles.ingredient_section_header_text2]}>+{data.count}</Text>
                      </TouchableOpacity>
                      <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
                    </View>
                  </View>
                </SwipeRow>
              )}
            />

            <TouchableOpacity style={{ flexDirection: "row", width: 100, alignSelf: "center", justifyContent: "center", marginTop: 15 }}
              onPress={() => { this.setState({ requestMyListModalVisible: true }) }}>
              <Image style={[MyStyles.ic_plus_btn_big, { alignSelf: "center" }]} source={require("../../assets/images/ic_plus_btn_big.png")} />
              <Text style={{ marginLeft: 10, marginTop: 4, fontSize: 13, color: Colors.color_949292 }}>Add My List</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showLoginModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showLoginModal: false });
                  this.props.navigation.navigate('Home')
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>You need to login</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showLoginModal: false });
                    this.props.navigation.navigate('Login')
                  }}
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <Text style={MyStyles.btn_primary}>Yes</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ showLoginModal: false });
                      this.props.navigation.navigate('Home')
                    }}>
                    <Text style={MyStyles.btn_primary_white}>Not now</Text>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.requestMyListModalVisible}
          onRequestClose={() => {
          }}>
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  {/* modal header */}
                  <View style={MyStyles.modal_header}>
                    <Text style={MyStyles.modal_title}>Add My List</Text>
                    <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                      this.setState({ requestMyListModalVisible: false });
                    }}>
                      <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                    </TouchableOpacity>
                  </View>
                  <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                  <View style={[MyStyles.container, { paddingTop: 20, paddingBottom: 120 / 3 }]}>
                    <Text style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>List Name</Text>
                    <TextInput
                      onSubmitEditing={() => {
                        this.addMyList()
                      }}
                      ref={(input) => { this.request_list_name = input; }}
                      onChangeText={(text) => { console.log(text); this.setState({ request_product_name: text }) }}
                      style={MyStyles.text_input_with_border}>
                    </TextInput>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight
                      style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {
                        this.addMyList()
                      }}>
                      <Text style={MyStyles.btn_primary}>Create</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </KeyboardAvoidingView>
    );
  }


  requestMyList() {
    this.setState({
      isLoading: true,
      alreadyLoaded: true,
    });
    return fetch(Net.ingredient.myList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
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

        this.setState({ mylist_result_data: responseJson.result_data })

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteUserIngredient(p_ingredient_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.deleteUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString()
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

        this.requestMyList();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestSearchIngredient(p_ingredient_name, p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.searchIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_name: p_ingredient_name,
        offset: p_offset.toString(),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showTop(responseJson.result_msg);
          return
        }
        if (p_offset == 0) { // 카테고리 선택했을대 offset값을 0에서부터 검색해야 함.
          this.offset = 0;
        }

        this.offset += responseJson.result_data.ingredient_list.length
        if (responseJson.result_data.ingredient_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        if (p_offset == 0) {
          this.setState({
            searchIngredient_result_data: responseJson.result_data
          });
          this.setState({ searchResultModalVisible: true, searchModalVisible: false })
          return;
        }
        const ingredient_list = this.state.searchIngredient_result_data.ingredient_list
        result = { ingredient_list: [...ingredient_list, ...responseJson.result_data.ingredient_list] };
        this.setState({ searchIngredient_result_data: result })
        this.setState({ searchResultModalVisible: true, searchModalVisible: false })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
        showTop.showBottom(error);
      })
      .done();
  }

  requestAddUserIngredient(p_ingredient_id, p_type) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.addUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString(),
        type: p_type.toString(),
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

        this.setState({ searchResultModalVisible: false })
        this.setState({ saveToModalVisible: false });

        this.requestMyList();
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
        this.requestMyList();

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
        this.requestMyList();
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