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
import { MyAppText } from '../../components/Texts/MyAppText';

import {
  Image,
  PanResponder,
  ScrollView,
  Keyboard,
  Alert,
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
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../components/androidBackButton/handleAndroidBackButton';
import { exitAlert } from '../../components/androidBackButton/exitAlert';

import 'prop-types';
import Messages from '../../constants/Messages';

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
    const { data, _this } = this.props;

    return (
      <Animated.View style={[{ paddingTop: 10 }, this._style]}>
        <TouchableOpacity activeOpacity={0.9} style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.mylist_section]} onLongPress={this.props.toggleRowActive}
          onPress={() => {
            _this.props.navigation.navigate(data.screen);
          }}>
          <View style={MyStyles.ingredient_section_header}>
            <Image source={require("../../assets/images/ic_dice.png")} style={[MyStyles.ic_dice, { position: "absolute", left: -11 }]} />
            <Image source={data.image} style={[data.img_style]} />
            <View activeOpacity={0.8} style={[MyStyles.padding_h_main, { flex: 1 }]} >
              <MyAppText style={[MyStyles.ingredient_section_header_text1]}>{data.desc}</MyAppText>
              <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{data.count}</MyAppText>
            </View>
            <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}


class MyListRow extends React.Component {
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
    const { data, _this } = this.props;

    return (
      <SwipeRow
        rowKey={3}
        style={{ marginBottom: 10 }}
        disableRightSwipe={true}
        onRowOpen={(rowId) => {

        }}
        onRowClose={(rowId) => {

        }}
        rightOpenValue={-180 / 3}
      >
        <View style={{
          alignItems: 'center',
          backgroundColor: 'white',
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
              backgroundColor: "#c3c3c3",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              top: 0,
              width: 180 / 3,
              right: 0,
            }}
            onPress={_ => _this.deleteMyListRow(data.id)}>
            <MyAppText style={{ color: "white" }}>Delete</MyAppText>
          </TouchableOpacity>

        </View>

        <Animated.View style={[this._style]}>
          <TouchableOpacity activeOpacity={0.9} onLongPress={this.props.toggleRowActive}
            style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.my_own_list_section, data.rowOpened ? { marginLeft: 60 } : null]}
            onPress={() => {
              if (data.count == 0) {
                Alert.alert(
                  '',
                  'Do you want to search for products?',
                  [
                    {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'Yes', onPress: () => _this.props.navigation.navigate("SearchMain") },
                  ],
                  { cancelable: false },
                );
              } else {
                _this.props.navigation.navigate("MyOwnList", {
                  [MyConstants.NAVIGATION_PARAMS.album_id]: data.id,
                  [MyConstants.NAVIGATION_PARAMS.album_title]: data.title,
                  [MyConstants.NAVIGATION_PARAMS.deleteFromMyListCallback]: _this.deleteFromMyListCallback
                }
                )
              }
            }}>
            <View style={MyStyles.ingredient_section_header}>
              <Image source={require("../../assets/images/ic_dice.png")} style={[MyStyles.ic_dice, { position: "absolute", left: -11 }]} />
              <View activeOpacity={0.8} style={[{ flex: 1 }]} >
                <View style={{ flexDirection: "row" }}>
                  <MyAppText style={[MyStyles.ingredient_section_header_text1, { alignSelf: "center" }]}>{data.title}</MyAppText>
                  {data.rowOpened ?
                    <TouchableOpacity activeOpacity={0.8} style={{ paddingLeft: 5, paddingRight: 5, alignSelf: "center" }} onPress={() => {
                      _this.setState({ edit_album_id: data.id, request_list_name: data.title, addAlbumModalVisible: true })
                    }}>
                      <Image source={require("../../assets/images/ic_pencil.png")} style={[MyStyles.ic_pencil]} />
                    </TouchableOpacity>
                    : null}
                </View>
                <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{data.count}</MyAppText>
              </View>
              <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
            </View>
          </TouchableOpacity>
        </Animated.View>

      </SwipeRow>
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
      showLoginModal: false,
      addAlbumModalVisible: false,
      edit_album_id: 0, // 0  이면 add_album, > 0 이면 edit_album
      request_list_name: "",
      //  서버에서 내려오는 자료구조는 
      // "result_data": {
      //   "like_list": [
      //       {
      //           "article_like_count": 3,
      //           "product_match_count": 4,
      //           "product_blotch_count": 3,
      //           "product_like_count": 3
      //       }
      //   ],
      //   "album_list": [
      //       {
      //           "id": 1,
      //           "title": "My List1",
      //           "content": "My List1",
      //           "count": 0
      //       },
      //       {
      //           "id": 2,
      //           "title": "내 목록",
      //           "content": "My List2",
      //           "count": 2
      //       }
      //   ]
      // }
      // 이런 형식이나 UI적인 구현요구가 sortablelist, SwipeListView 를 쓸것을 요구하는것으로 해서 결과값을
      // like_list_data 와 album_list로 나누어 관리함.
      like_list_data: {
        match: {
          screen: "MatchdList",
          image: require("../../assets/images/ic_like_matchd.png"),
          img_style: MyStyles.ic_like_matchd,
          desc: "Match'd List",
          count: 0,
        },
        blotch: {
          screen: "BlotchdList",
          image: require("../../assets/images/ic_like_blotchd.png"),
          img_style: MyStyles.ic_like_blotchd,
          desc: "Blotch'd List",
          count: 0,
        },
        heart: {
          screen: "HeartList",
          image: require("../../assets/images/ic_like_heart.png"),
          img_style: MyStyles.ic_like_heart,
          desc: "Heart List",
          count: 0,
        },
        favorite: {
          screen: "FavoriteArticles",
          image: require("../../assets/images/ic_like_favorite.png"),
          img_style: MyStyles.ic_like_matchd,
          desc: "Favorite Article",
          count: 0,
        },
      },

      album_list: [
      ],

      like_list_order: ["match", "blotch", "heart", "favorite"],
      my_list_order: null,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.like_list_order, (err, result) => {
      console.log(result);
      if (result == null) {
        this.setState({ like_list_order: ["match", "blotch", "heart", "favorite"] })
      } else {
        this.setState({ like_list_order: result.split(",") })
      }
    })
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.my_list_order, (err, result) => {
      console.log(result);
      // AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.my_list_order, 'null')
      this.setState({ my_list_order: null })
      if (result == 'null' || result == null) {
        this.setState({ my_list_order: null })
      } else {
        this.setState({ my_list_order: result.split(",") })
      }
    })
    handleAndroidBackButton(this, exitAlert);
  }

  componentWillMount() {
    removeAndroidBackButtonHandler()
  }

  deleteMyListRow(album_id) {
    // const w_Index = this.state.album_list.findIndex(item => item.id == album_id)
    // const newData = [...this.state.album_list];
    // newData.splice(w_Index, 1);
    // this.setState({ album_list: newData });
    this.requestDeleteAlbum(album_id)
  }

  addMyList() {
    if (this.state.request_list_name == "") {
      this.refs.modal_toast.showTop("Please input List name");
      return;
    }
    this.setState({ addAlbumModalVisible: false });
    if (this.state.edit_album_id > 0) { // 편집이면      
      this.requestEditAlbum(this.state.edit_album_id, this.state.request_list_name)
    } else {
      this.requestAddAlbum(this.state.request_list_name)
    }
  }

  deleteFromMyListCallback = () => {
    this.requestMyList()
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: Colors.color_f8f8f8 }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            if (global.login_info.token == null || global.login_info.token.length < 1) {
              this.setState({ showLoginModal: true });
              return;
            }
            if (global.refreshStatus.mylist == true) {
              global.refreshStatus.mylist = false
              this.requestMyList();
            }
          }}
        />
        <TopbarWithBlackBack isRootDepth={true} title="My List" onPress={() => { this.props.navigation.goBack(null) }}></TopbarWithBlackBack>
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
                return <Row data={data} _this={this} active={active} />
              }
              }
              renderFooter={() => {

              }}
              manuallyActivateRows
            />

            {this.state.album_list.length > 0 ?
              <SortableList
                onActivateRow={() => { this.setState({ scroll_enabled: false }) }}
                onReleaseRow={() => { this.setState({ scroll_enabled: true }) }}
                onChangeOrder={async (nextOrder) => {
                  await AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.my_list_order, nextOrder.toString())
                  await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.my_list_order, (err, result) => {
                    console.log(result);
                    if (result == "") {
                      this.setState({ my_list_order: null })
                    } else {
                      this.setState({ my_list_order: result.split(",") })
                    }
                  })
                }}
                style={{ flex: 1, marginTop: -20 }}
                contentContainerStyle={{ padding: 15 }}
                order={this.state.my_list_order}
                data={this.state.album_list}
                renderRow={({ key, data, active }) => {
                  return <MyListRow data={data} _this={this} active={active} />
                }}
                manuallyActivateRows
              />

              // <SwipeListView
              //   contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
              //   dataSource={this.ds.cloneWithRows(this.state.album_list)}
              //   onRowOpen={(rowId) => {
              //     // rowId 가 s10, s11, s12 ... s199 형식으로 들어오므로 실제 순서는 앞 두글자 없애서 계싼함
              //     const order = rowId.substring(2);
              //     this.state.album_list[order].rowOpened = true
              //     this.setState(this.state.album_list)
              //   }}
              //   onRowClose={(rowId) => {
              //     // rowId 가 s10, s11, s12 ... s199 형식으로 들어오므로 실제 순서는 앞 두글자 없애서 계싼함
              //     const order = rowId.substring(2);
              //     this.state.album_list[order].rowOpened = false
              //     this.setState(this.state.album_list)
              //   }}
              //   renderRow={(data, secId, rowId, rowMap) => (
              //     <SwipeRow
              //       rowKey={3}
              //       style={{ marginBottom: 15 }}
              //       disableRightSwipe={true}
              //       rightOpenValue={-180 / 3}>
              //       <View style={{
              //         alignItems: 'center',
              //         backgroundColor: '#DDD',
              //         flex: 1,
              //         flexDirection: 'row',
              //         justifyContent: 'space-between',
              //         color: "white",
              //         borderRadius: 5
              //       }}>
              //         <TouchableOpacity
              //           style={{
              //             alignItems: 'center',
              //             bottom: 0,
              //             justifyContent: 'center',
              //             position: 'absolute',
              //             top: 0,
              //             width: 180 / 3,
              //             right: 0,
              //           }}
              //           onPress={_ => this.deleteMyListRow(secId, rowId, rowMap, data.id)}>
              //           <MyAppText style={{ color: "white" }}>Delete</MyAppText>
              //         </TouchableOpacity>
              //       </View>
              //       <View style={[{ borderLeftColor: Colors.ingredient_allergic_dark }, MyStyles.my_own_list_section, data.rowOpened ? { marginLeft: 60 } : null]}>
              //         <View style={MyStyles.ingredient_section_header}>
              //           <TouchableOpacity activeOpacity={0.8} style={[{ flex: 1 }]} onPress={() => {
              //             this.props.navigation.navigate("MyOwnList", {
              //               [MyConstants.NAVIGATION_PARAMS.album_id]: data.id,
              //               [MyConstants.NAVIGATION_PARAMS.album_title]: data.title,
              //               [MyConstants.NAVIGATION_PARAMS.deleteFromMyListCallback]: this.deleteFromMyListCallback
              //             }
              //             )
              //           }}>
              //             <View style={{ flexDirection: "row" }}>
              //               <MyAppText style={[MyStyles.ingredient_section_header_text1, { alignSelf: "center" }]}>{data.title}</MyAppText>
              //               {data.rowOpened ?
              //                 <TouchableOpacity activeOpacity={0.8} style={{ paddingLeft: 5, paddingRight: 5, alignSelf: "center" }} onPress={() => {
              //                   this.setState({ edit_album_id: data.id, request_list_name: data.title, addAlbumModalVisible: true })
              //                 }}>
              //                   <Image source={require("../../assets/images/ic_pencil.png")} style={[MyStyles.ic_pencil]} />
              //                 </TouchableOpacity>
              //                 : null}
              //             </View>
              //             <MyAppText style={[MyStyles.ingredient_section_header_text2]}>+{data.count}</MyAppText>
              //           </TouchableOpacity>
              //           <Image source={require("../../assets/images/ic_polygon_right.png")} style={[MyStyles.ic_polygon_right]} />
              //         </View>
              //       </View>
              //     </SwipeRow>
              //   )}
              // />
              : null}

            <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row", width: 100, alignSelf: "center", justifyContent: "center", marginTop: 15, marginBottom: 30 }}
              onPress={() => { this.setState({ edit_album_id: 0, request_list_name: "", addAlbumModalVisible: true }) }}>
              <Image style={[MyStyles.ic_plus_btn_big, { alignSelf: "center" }]} source={require("../../assets/images/ic_plus_btn_big.png")} />
              <MyAppText style={{ marginLeft: 10, marginTop: 4, fontSize: 13, color: Colors.color_949292 }}>Add My List</MyAppText>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showLoginModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ showLoginModal: false });
                  this.props.navigation.navigate('Home')
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>{Messages.you_need_to_login}</MyAppText>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => {
                    this.setState({ showLoginModal: false });
                    this.props.navigation.navigate('Login')
                  }}
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ showLoginModal: false });
                      this.props.navigation.navigate('Home')
                    }}>
                    <MyAppText style={MyStyles.btn_primary_white}>Not now</MyAppText>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>

        {/* 앨범 편집/추가 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addAlbumModalVisible}
          onRequestClose={() => {
          }}>
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={{ flex: 1 }}>
              <Toast ref='modal_toast' />
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  {/* modal header */}
                  <View style={MyStyles.modal_header}>
                    {this.state.edit_album_id > 0 ?
                      <MyAppText style={MyStyles.modal_title}>Change My List</MyAppText>
                      :
                      <MyAppText style={MyStyles.modal_title}>Add My List</MyAppText>
                    }
                    <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                      this.setState({ addAlbumModalVisible: false });
                    }}>
                      <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                    </TouchableOpacity>
                  </View>
                  <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                  <View style={[MyStyles.container, { paddingTop: 20, paddingBottom: 120 / 3 }]}>
                    <MyAppText style={{ fontSize: 13, fontWeight: "500", color: Colors.color_212122, marginBottom: 10 }}>List Name</MyAppText>
                    <TextInput
                      onSubmitEditing={() => {
                        this.addMyList()
                      }}
                      value={this.state.request_list_name}
                      onChangeText={(text) => { this.setState({ request_list_name: text }) }}
                      style={MyStyles.text_input_with_border}>
                    </TextInput>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight
                      style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]} onPress={() => {
                        this.addMyList()
                      }}>
                      {this.state.edit_album_id > 0 ?
                        <MyAppText style={MyStyles.btn_primary}>Change</MyAppText>
                        :
                        <MyAppText style={MyStyles.btn_primary}>Create</MyAppText>
                      }
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
    });
    return fetch(Net.user.myList, {
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
        // console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.like_list_data.match.count = responseJson.result_data.like_list[0].product_match_count
        this.state.like_list_data.blotch.count = responseJson.result_data.like_list[0].product_blotch_count
        this.state.like_list_data.favorite.count = responseJson.result_data.like_list[0].article_like_count
        this.state.like_list_data.heart.count = responseJson.result_data.like_list[0].product_like_count
        this.setState(this.state.like_list_data)

        this.state.album_list = responseJson.result_data.album_list
        this.setState(this.state.album_list)

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }


  requestAddAlbum(p_title) {
    // 성공시 requestMyList를 다시 호출해주므로 현재 progress는 막는게 땅수
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.addAlbum, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        title: p_title,
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

        // add 했으면 order 초기화 해준다.
        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.my_list_order, 'null')
        this.setState({ my_list_order: null })
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

  requestEditAlbum(p_album_id, p_title) {
    // 성공시 requestMyList를 다시 호출해주므로 현재 progress는 막는게 땅수
    // this.setState({
    //   isLoading: true,
    // });)
    return fetch(Net.user.editAlbum, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        album_id: p_album_id,
        title: p_title,
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

  requestDeleteAlbum(p_album_id) {
    // 성공시 requestMyList를 다시 호출해주므로 현재 progress는 막는게 땅수
    // this.setState({
    //   isLoading: true,
    // });)
    return fetch(Net.user.deleteAlbum, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        album_id: p_album_id,
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

        // delete 했으면 order 초기화 해준다.
        AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.my_list_order, 'null')
        this.setState({ my_list_order: null })
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