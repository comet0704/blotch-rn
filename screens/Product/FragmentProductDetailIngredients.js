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

import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import {
  KeyboardAvoidingView,
  View,
  Modal,
  Image,
  Dimensions,
  WebBrowser,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo';
import { FlatGrid } from 'react-native-super-grid';
import ModalDropdown from 'react-native-modal-dropdown'
import Messages from '../../constants/Messages';

export class FragmentProductDetailIngredients extends React.Component {
  item_id = 0;
  constructor(props) {
    super(props)
    this.item_id = this.props.item_id
    this.state = {
      saveToModalVisible: false,
      isLoading: false,
      tabbar: {
        Good: true,
        Normal: false,
        Bad: false,
      },
      curSelectedIngredient: -1,
      selectedIngredientType: 1, // Good, Normal, Bad 분류하기 위함.
      ingredient_list_result_data: {
        product_ingredient_list: []
      },
      user_ingredient_list_result_data: {
        user_ingredient_list: [

        ]
      },
      questionnaire_list: [

      ],
      selected_questionnaire: {
        id: "",
        value: "Me",
      },
    };
  }

  componentDidMount() {
    this.requestIngredientList(this.item_id)
    if (global.login_info.token.length > 0) { // 로그인 한 회원일때만 회원성분정보 및 설문목록 불러옴.      
      this.requestQuestionnaireList()
    }
  }

  renderGoodNormalBadIngredientList(item, index) {
    if (item.type == this.state.selectedIngredientType) {
      style_container = {};
      style_container_selected = {};
      style_text = {};
      style_text_selected = {};
      style_content_text = {};
      if (this.state.selectedIngredientType == 0) { // Normal 인경우
        style_container = MyStyles.ingredient_normal_container
        style_container_selected = MyStyles.ingredient_normal_container_selected
        style_text = MyStyles.ingredient_normal_text;
        style_text_selected = MyStyles.ingredient_normal_text_selected;
        style_content_text = MyStyles.ingredient_normal_content_text;
      } else if (this.state.selectedIngredientType == 1) { // Good 인 경우        
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
        <View key={item.id}>
          <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
            <Image style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => {
              this.setState({ saveToModalVisible: true, selectedIngredient_id: item.id })
            }}>
              <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
            <Text style={style_content_text}>{item.content}</Text>
          </View> : null}
        </View>
      )
    }
  }

  renderAllergicIngredients(item, index) {
    if (item.type != 0) { // allergic 성분이 아니면 pass 한다
      return;
    }
    style_container = MyStyles.ingredient_allergic_container
    style_container_selected = MyStyles.ingredient_allergic_container_selected
    style_text = MyStyles.ingredient_allergic_text;
    style_text_selected = MyStyles.ingredient_allergic_text_selected;
    style_content_text = MyStyles.ingredient_allergic_content_text;
    return (
      <View key={item.id}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {
            Alert.alert(
              '',
              Messages.would_you_like_to_delete_it,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    this.requestDeleteUserIngredient(item.id, this.state.selected_questionnaire.id)
                  }
                },
              ],
              { cancelable: false },
            );
          }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  renderPotentialAllergenIngredients(item, index) {
    if (item.type != 1) { // potential 성분이 아니면 pass 한다
      return;
    }
    style_container = MyStyles.ingredient_potential_allergen_container
    style_container_selected = MyStyles.ingredient_potential_allergen_container_selected
    style_text = MyStyles.ingredient_potential_allergen_text;
    style_text_selected = MyStyles.ingredient_potential_allergen_text_selected;
    style_content_text = MyStyles.ingredient_potential_allergen_content_text;
    return (
      <View key={item.id}>
        <TouchableOpacity style={[this.state.curSelectedIngredient == item.id ? style_container_selected : style_container, { flexDirection: "row", alignItems: "center" }]} onPress={() => { this.setState({ curSelectedIngredient: item.id }) }}>
          <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>{item.title}</Text>
          <Image style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => {
            Alert.alert(
              '',
              Messages.would_you_like_to_delete_it,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK', onPress: () => {
                    this.requestDeleteUserIngredient(item.id, this.state.selected_questionnaire.id)
                  }
                },
              ],
              { cancelable: false },
            );
          }}>
            <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
          <Text style={style_content_text}>{item.content}</Text>
        </View> : null}
      </View>
    )
  }

  countType(type) {
    const countTypes = this.state.ingredient_list_result_data.product_ingredient_list.filter(item => item.type === type);
    return countTypes.length;
  }

  onQuestionnaireSelected(idx, rowData) {
    this.state.selected_questionnaire = rowData
    this.setState({ selected_questionnaire: this.state.selected_questionnaire })
    this.requestUserIngredientList(this.state.selected_questionnaire.id);
  }
  render() {
    return (
      <View>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <View style={[MyStyles.padding_h_main, MyStyles.padding_v_25]}>
          <View style={MyStyles.tabbar_button_container1}>
            <TouchableOpacity style={this.state.tabbar.Good ? MyStyles.ingredient_good_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({
                tabbar: { Good: true, Normal: false, Bad: false, }, selectedIngredientType: 1
              })
            }}>
              <Text style={this.state.tabbar.Good ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >{"Good(" + this.countType(1) + ")"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.tabbar.Normal ? MyStyles.ingredient_normal_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({ tabbar: { Good: false, Normal: true, Bad: false, }, selectedIngredientType: 0 })
            }}>
              <Text style={this.state.tabbar.Normal ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >{"Normal(" + this.countType(0) + ")"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.tabbar.Bad ? MyStyles.ingredient_bad_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({ tabbar: { Good: false, Normal: false, Bad: true, }, selectedIngredientType: 2 })
            }}>
              <Text style={this.state.tabbar.Bad ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >{"Bad(" + this.countType(2) + ")"}</Text>
            </TouchableOpacity>
          </View>

          {/* Good, Normal, Bad  */}
          <View style={{ flex: 1, marginTop: 95 / 3 }}>
            {this.state.ingredient_list_result_data.product_ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
          </View>
        </View>

        {/* Allergic and Potential Ingredients  */}
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        {global.login_info.token.length > 0 ?
          <View style={MyStyles.padding_main}>
            {this.state.questionnaire_list.length > 0 ?
              <ModalDropdown ref="dropdown_2"
                style={MyStyles.dropdown_2}
                defaultIndex={0}
                defaultValue={this.state.selected_questionnaire.value + " ▾"}
                textStyle={MyStyles.dropdown_2_text}
                dropdownStyle={MyStyles.dropdown_2_dropdown}
                options={this.state.questionnaire_list}
                renderButtonText={(rowData) => Common._dropdown_2_renderButtonText(rowData)}
                renderRow={Common._dropdown_2_renderRow.bind(this)}
                onSelect={(idx, rowData) => {
                  this.onQuestionnaireSelected(idx, rowData)
                }}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => Common._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
              />
              :
              null}

            <Text style={{ color: Colors.primary_dark, fontSize: 14, fontWeight: "500" }}>Allergic Ingredients</Text>
            <View style={{ flex: 1, marginTop: 10 }}>
              {this.state.user_ingredient_list_result_data.user_ingredient_list.map((item, index) => this.renderAllergicIngredients(item, index))}
            </View>
            <Text style={{ color: Colors.primary_dark, fontSize: 14, fontWeight: "500", marginTop: 15 }}>Potential Allergens</Text>
            <View style={{ flex: 1, marginTop: 10 }}>
              {this.state.user_ingredient_list_result_data.user_ingredient_list.map((item, index) => this.renderPotentialAllergenIngredients(item, index))}
            </View>
          </View> : null}

        {/* Save to modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.saveToModalVisible}
          onRequestClose={() => {
          }}>
          <Toast ref='modalToast' />
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                {/* modal header */}
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50 }}>
                  <View style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute" }]}>
                    <Text style={{ color: Colors.primary_dark, fontSize: 16, fontWeight: "500", }}>Save to</Text>
                  </View>
                  <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ saveToModalVisible: false })
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                  </TouchableOpacity>
                </View>

                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                  {/* Allergic Ingredients(Dislike) */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 0, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_allergic_ingredient} source={require("../../assets/images/ic_allergic_ingredient.png")} />
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Allergic Ingredients(Dislike)</Text>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
                  </TouchableOpacity>
                  {/* Potential Allergens */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 1, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_potential_allergins} source={require("../../assets/images/ic_potential_allergins.png")} />
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Potential Allergens</Text>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
                  </TouchableOpacity>
                  {/* Preferred Ingredients */}
                  <TouchableOpacity style={{ flex: 1, flexDirection: "row", borderBottomColor: Colors.color_dcdedd, borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}
                    onPress={() => {
                      this.requestAddUserIngredient(this.state.selectedIngredient_id, 2, this.state.selected_questionnaire.id)
                    }}>
                    <Image style={MyStyles.ic_preferred_ingredient} source={require("../../assets/images/ic_preferred_ingredient.png")} />
                    <Text style={{ fontSize: 13, marginLeft: 10, color: Colors.primary_dark }}>Preferred Ingredients</Text>
                    <Image style={{ flex: 1 }} />
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </Modal>

      </View>
    );
  }

  requestIngredientList(p_product_id) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.product.ingredientList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        product_id: p_product_id
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return;
        }
        this.setState({
          ingredient_list_result_data: responseJson.result_data
        });

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }

  requestUserIngredientList(p_questionnaire_id) {
    console.log(p_questionnaire_id);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.ingredient.userIngredientList, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        questionnaire_id: p_questionnaire_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return;
        }

        this.setState({
          user_ingredient_list_result_data: responseJson.result_data
        });

      })
      .catch((error) => {
        console.log("22222222")
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }

  requestDeleteUserIngredient(p_ingredient_id, p_questionnaire_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.ingredient.deleteUserIngredient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        ingredient_id: p_ingredient_id.toString(),
        questionnaire_id: p_questionnaire_id,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        // this.setState({
        //   isLoading: false,
        // });

        if (responseJson.result_code < 0) {
          this.refs.modalToast.showBottom(responseJson.result_msg);
          return
        }

        this.requestUserIngredientList(this.state.selected_questionnaire.id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.modalToast.showBottom(error);
      })
      .done();
  }

  requestAddUserIngredient(p_ingredient_id, p_type, p_questionnaire_id, p_force) {
    console.log(p_ingredient_id + ":" + p_type + ":" + p_questionnaire_id);
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


        this.requestUserIngredientList(this.state.selected_questionnaire.id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.modalToast.showBottom(error);
      })
      .done();
  }

  requestQuestionnaireList() {
    this.setState({
      isLoading: true,
    });
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
        this.setState({
          isLoading: false,
        });

        if (responseJson.result_code < 0) {
          this.props.toast.showBottom(responseJson.result_msg);
          return
        }

        const data = [];

        responseJson.result_data.questionnaire_list.forEach(element => {
          data.push({ value: element.title, id: element.id })
        });

        if (data.length > 0) {
          this.state.selected_questionnaire = data[0]
          this.setState({ selected_questionnaire: this.state.selected_questionnaire })
          this.requestUserIngredientList(this.state.selected_questionnaire.id);
        }
        this.setState({ questionnaire_list: data })

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.props.toast.showBottom(error);
      })
      .done();
  }

};