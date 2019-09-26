// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Modal, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { MyAppText } from '../../../components/Texts/MyAppText';
import Colors from '../../../constants/Colors';
import MyConstants from '../../../constants/MyConstants';
import MyStyles from '../../../constants/MyStyles';
import Net from '../../../Net/Net';


export default class SearchResultIngredientMoreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: "",
      saveToModalVisible: false,
      result_data: {
        ingredient_count: 30,
        ingredient_list: [
        ],
      },
      selected_questionnaire: {
        id: "",
        value: "Me",
      },
    };
  }

  componentDidMount() {
    w_searchWord = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.search_word)
    this.setState({ searchWord: w_searchWord })
    this.requestQuestionnaireList();
    this.requestSearchIngredient(w_searchWord);
  }

  static navigationOptions = {
    header: null,
  };

  ScreenWidth = Dimensions.get('window').width;

  renderGoodNormalBadIngredientList(item, index) {
    style_container = {};
    style_container_selected = {};
    style_text = {};
    style_text_selected = {};
    style_content_text = {};
    if (item.type == 0) { // Normal 인경우
      style_container = MyStyles.ingredient_normal_container
      style_container_selected = MyStyles.ingredient_normal_container_selected
      style_text = MyStyles.ingredient_normal_text;
      style_text_selected = MyStyles.ingredient_normal_text_selected;
      style_content_text = MyStyles.ingredient_normal_content_text;
    } else if (item.type == 1) { // Good 인 경우        
      style_container = MyStyles.ingredient_good_container
      style_container_selected = MyStyles.ingredient_good_container_selected
      style_text = MyStyles.ingredient_good_text;
      style_text_selected = MyStyles.ingredient_good_text_selected;
      style_content_text = MyStyles.ingredient_good_content_text;
    } else { // Bad 인 경우
      style_container = MyStyles.ingredient_bad_container
      style_container_selected = MyStyles.ingredient_bad_container_selected
      style_text = MyStyles.ingredient_bad_text;
      style_text_selected = MyStyles.ingredient_bad_text_selected;
      style_content_text = MyStyles.ingredient_bad_content_text;
    }

    return (
      <View key={item.id} style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={0.8} style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</MyAppText>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => {
            this.setState({ saveToModalVisible: true, selectedIngredient_id: item.id })
          }}>
            <MyAppText style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</MyAppText>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <MyAppText style={style_content_text}>{item.content}</MyAppText>
        </View> : null}
      </View>
    )
  }

  render() {
    const { weatherType, weatherInfo } = this.state;

    return (
      <View style={{ flex: 1 , marginTop: MyConstants.STATUSBAR_HEIGHT}}>
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
              <View style={[MyStyles.searchBoxCommon, { paddingRight: 15, }, MyStyles.bg_white, { marginTop: 0 }]}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.pop(2)
                  }} activeOpacity={0.5} style={{ alignSelf: "center", alignItems: "center", padding: 15 }} >
                  <Image style={[MyStyles.backButton, { marginTop: 0, alignSelf: "center" }]}
                    source={require("../../../assets/images/ic_back_black.png")}
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate("SearchMain") }}>
                  <View style={[MyStyles.searchBoxCover, { paddingLeft: 0 }]}>
                    <TextInput editable={false} style={{ fontSize: 13, flex: 1, paddingRight: 5 }} value={this.state.searchWord}></TextInput>
                    <TouchableOpacity activeOpacity={0.8} style={{ padding: 8, alignSelf: "center" }} onPress={() => { this.props.navigation.navigate("SearchCamera") }}>
                      <Image source={require('../../../assets/images/Home/ic_camera_black.png')} style={{ width: 19, height: 18, alignSelf: "center" }} />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 10 }} ></LinearGradient>


              {/* Ingredients 검색결과 나열 */}
              <View style={[{ flex: 1, backgroundColor: "white" }]}>
                <View style={[{ flexDirection: "row", flex: 1, marginTop: 25, justifyContent: "center" }, MyStyles.container]}>
                  <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10, alignSelf: "center", }} onPress={() => { this.props.navigation.goBack() }}>
                    <Image source={require("../../../assets/images/ic_back3.png")} style={[MyStyles.ic_back3,]} />
                  </TouchableOpacity>
                  <MyAppText style={[MyStyles.text_14, { flex: 1, textAlignVertical: "center", marginTop: -8 }]}>Ingredient({this.state.result_data.ingredient_count})</MyAppText>
                </View>
                <View style={[MyStyles.container]}>
                  {this.state.result_data.ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
                </View>
              </View>
              <View style={[MyStyles.seperate_line_e5e5e5, { marginLeft: 15 }]}></View>

            </View>
          </ScrollView>
          {/* Save to modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.saveToModalVisible}
            onRequestClose={() => {
            }}>
            <View style={{ flex: 1 }}>
              <View style={MyStyles.modal_bg}>
                <View style={MyStyles.modalContainer}>
                  {/* modal header */}
                  <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50 }}>
                    <View style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute" }]}>
                      <MyAppText style={{ color: Colors.primary_dark, fontSize: 16, fontWeight: "500", }}>Save to</MyAppText>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                      this.setState({ saveToModalVisible: false })
                    }}>
                      <Image style={{ width: 14, height: 14 }} source={require("../../../assets/images/ic_close.png")} />
                    </TouchableOpacity>
                  </View>

                  <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                  <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                    {/* Allergic Ingredients(Dislike) */}
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 0, this.state.selected_questionnaire.id)
                      }}>
                      <Image style={MyStyles.ic_allergic_ingredient} source={require("../../../assets/images/ic_allergic_ingredient.png")} />
                      <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Allergic Ingredients(Dislike)</MyAppText>
                      <Image style={{ flex: 1 }} />
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")} />
                    </TouchableOpacity>
                    {/* Potential Allergens */}
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 1, this.state.selected_questionnaire.id)
                      }}>
                      <Image style={MyStyles.ic_potential_allergins} source={require("../../../assets/images/ic_potential_allergins.png")} />
                      <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Potential Allergens</MyAppText>
                      <Image style={{ flex: 1 }} />
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")} />
                    </TouchableOpacity>
                    {/* Preferred Ingredients */}
                    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                      onPress={() => {
                        this.requestAddUserIngredient(this.state.selectedIngredient_id, 2, this.state.selected_questionnaire.id)
                      }}>
                      <Image style={MyStyles.ic_preferred_ingredient} source={require("../../../assets/images/ic_preferred_ingredient.png")} />
                      <MyAppText style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Preferred Ingredients</MyAppText>
                      <Image style={{ flex: 1 }} />
                      <Image style={MyStyles.ic_arrow_right_gray} source={require("../../../assets/images/ic_arrow_right_gray.png")} />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View >
    );
  }

  requestSearchIngredient(p_keyword) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.home.searchIngredient, {
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

  requestQuestionnaireList() {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.user.questionnaireList, {
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
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return
        }

        this.state.questionnaire_list = responseJson.result_data.questionnaire_list

        if (this.state.questionnaire_list.length > 0) {
          this.state.selected_questionnaire = this.state.questionnaire_list[0]
          this.setState({ selected_questionnaire: this.state.selected_questionnaire })

          this.state.questionnaire_list.forEach(element => {
            element.is_selected = false
          })
          this.state.questionnaire_list[0].is_selected = true
          this.setState({ questionnaire_list: this.state.questionnaire_list })

          this.requestMyList(this.state.selected_questionnaire.id)
        } else {
          // TO DO 설문이 없으면 설문작성페지로 유도.
        }

      })
      .catch((error) => {
        // this.setState({
        //   isLoading: false,
        // });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestAddUserIngredient(p_ingredient_id, p_type, p_questionnaire_id, p_force) {
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
        questionnaire_id: p_questionnaire_id,
        force: p_force,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          saveToModalVisible: false,
        });

        if (responseJson.result_code < 0) {
          if (responseJson.result_code == -10) {
            Alert.alert(
              '',
              responseJson.result_msg,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OK', onPress: () => this.requestAddUserIngredient(p_ingredient_id, p_type, p_questionnaire_id, 1) },
              ],
              { cancelable: false },
            );
            return
          } else {
            this.refs.toast.showBottom(responseJson.result_msg);
            return
          }
        }


        this.requestSearchIngredient(this.state.searchWord);
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