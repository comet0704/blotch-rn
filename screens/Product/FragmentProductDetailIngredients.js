import React from 'react';
import Carousel from 'react-native-banner-carousel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
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
} from 'react-native';
import { LinearGradient } from 'expo';
import MyStyles from '../../constants/MyStyles';
import { FlatGrid } from 'react-native-super-grid';
import MyConstants from '../../constants/MyConstants';

export class FragmentProductDetailIngredients extends React.Component {
  state = {
    tabbar: {
      Good: true,
      Normal: false,
      Bad: false,
    },
    curSelectedIngredient: -1,
    selectedIngredientType: 0, // Good, Normal, Bad 분류하기 위함.
  };

  product_ingredient_list = [
    {
      "id": 1,
      "title": "ingredient-1",
      "content": "ingredient-1",
      "type": 0
    },
    {
      "id": 2,
      "title": "ingredient-2",
      "content": "ingredient-2",
      "type": 0
    },
    {
      "id": 3,
      "title": "ingredient-3",
      "content": "ingredient-3",
      "type": 1
    },
    {
      "id": 4,
      "title": "ingredient-4",
      "content": "ingredient-4",
      "type": 2
    }
  ]

  renderGoodNormalBadIngredientList(item, index) {
    if (item.type == this.state.selectedIngredientType) {
      style_container = {};
      style_container_selected = {};
      style_text = {};
      style_text_selected = {};
      style_content_text = {};
      if (this.state.selectedIngredientType == 0) { // Good 인경우
        style_container = MyStyles.ingredient_good_container
        style_container_selected = MyStyles.ingredient_good_container_selected
        style_text = MyStyles.ingredient_good_text;
        style_text_selected = MyStyles.ingredient_good_text_selected;
        style_content_text = MyStyles.ingredient_good_content_text;
      } else if (this.state.selectedIngredientType == 1) { // Normal 인 경우
        style_container = MyStyles.ingredient_normal_container
        style_container_selected = MyStyles.ingredient_normal_container_selected
        style_text = MyStyles.ingredient_normal_text;
        style_text_selected = MyStyles.ingredient_normal_text_selected;
        style_content_text = MyStyles.ingredient_normal_content_text;
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
              <Text style={[this.state.curSelectedIngredient == item.id ? style_text_selected : style_text]}>-</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          {this.state.curSelectedIngredient == item.id ? <View style={{ justifyContent: "center" }}>
            <Text style={style_content_text}>{item.content}</Text>
          </View> : null}
        </View>
      )
  }

  render() {
    return (
      <View>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <View style={[MyStyles.padding_h_main, MyStyles.padding_v_25]}>
          <View style={MyStyles.tabbar_button_container1}>
            <TouchableOpacity style={this.state.tabbar.Good ? MyStyles.ingredient_good_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({
                tabbar: { Good: true, Normal: false, Bad: false, }, selectedIngredientType: 0
              })
            }}>
              <Text style={this.state.tabbar.Good ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >Good(11)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.tabbar.Normal ? MyStyles.ingredient_normal_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({ tabbar: { Good: false, Normal: true, Bad: false, }, selectedIngredientType: 1 })
            }}>
              <Text style={this.state.tabbar.Normal ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >Normal(6)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.tabbar.Bad ? MyStyles.ingredient_bad_button_selected : MyStyles.tabbar_button1} onPress={() => {
              this.setState({ tabbar: { Good: false, Normal: false, Bad: true, }, selectedIngredientType: 2 })
            }}>
              <Text style={this.state.tabbar.Bad ? MyStyles.tabbar_text_selected1 : MyStyles.tabbar_text1} >Bad(2)</Text>
            </TouchableOpacity>
          </View>

          {/* Good, Normal, Bad  */}
          <View style={{ flex: 1, marginTop: 95 / 3 }}>
            {this.product_ingredient_list.map((item, index) => this.renderGoodNormalBadIngredientList(item, index))}
          </View>
        </View>

            {/* Allergic and Potential Ingredients  */}
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <View style={MyStyles.padding_main}>
          <TouchableOpacity style={[{ height:30, width:250/3, alignSelf:"flex-end" }, MyStyles.purple_round_btn]}>
            <Text style={{ fontSize: 13, color: "white" }}>Me</Text>
            <Image source={require("../../assets/images/ic_arrow_down_white_small.png")} style={[MyStyles.ic_arrow_down_white_small, { position:"absolute", right:10 }]} />
          </TouchableOpacity>
          <Text style={{color:Colors.primary_dark, fontSize:14, fontWeight:"500"}}>Allergic Ingredients</Text>
          <View style={{ flex: 1, marginTop: 10 }}>
            {this.product_ingredient_list.map((item, index) => this.renderAllergicIngredients(item, index))}
          </View>
          <Text style={{color:Colors.primary_dark, fontSize:14, fontWeight:"500", marginTop:15}}>Potential Allergens</Text>
          <View style={{ flex: 1, marginTop: 10 }}>
            {this.product_ingredient_list.map((item, index) => this.renderPotentialAllergenIngredients(item, index))}
          </View>
        </View>
      </View>
    );
  }
};