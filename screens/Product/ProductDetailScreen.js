import React from 'react';
import Carousel from 'react-native-banner-carousel';
import { Image, Dimensions, Share, TouchableHighlight, Modal, TextInput, KeyboardAvoidingView, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';
import { LinearGradient } from 'expo';
import StarRating from 'react-native-star-rating';
import { FragmentProductDetailIngredients } from './FragmentProductDetailIngredients';


export default class ProductDetailScreen extends React.Component {

  state = {
    saveToModalVisible: false,
    matched: false,
    blotched: false,
    starCount: 3.5,
    modalVisible: false,
    bannerImages: [
      "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg",
      "http://img.mp.itc.cn/upload/20160817/1164b794aeb34c75a3d0182fa2d0ce21_th.jpg",
      "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"
    ],
    bannerLinkes: [
      "http://files.techcrunch.cn/2014/10/shutterstock_87153322.jpg",
      "http://img.mp.itc.cn/upload/20160817/1164b794aeb34c75a3d0182fa2d0ce21_th.jpg",
      "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg"
    ],
    tabbar: {
      Ingredients: true,
      Reviews: false,
    }
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'BAM: we\'re helping your business with awesome React Native apps',
        url: 'http://bam.tech',
        title: 'Wow, did you see that?'
      }, {
          // Android only:
          dialogTitle: 'Share It',
          // iOS only:
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  BannerHeight = 760 / 3;
  BannerWidth = Dimensions.get('window').width - 30;
  renderBanner(image, index) {
    return (
      <View key={index}>
        <TouchableHighlight onPressIn={() => { this.props.navigation.navigate("BannerDetail") }}>
          <View>
            <Image style={{ width: this.BannerWidth, height: this.BannerHeight }} source={{ uri: image }} />
            <TouchableHighlight style={[{ position: "absolute", right: 15, top: 15 }, MyStyles.heart]}>
              <Image source={require('../../assets/images/ic_heart_on.png')} style={[MyStyles.background_image]} />
            </TouchableHighlight>
            <View style={{ position: "absolute", bottom: 10, justifyContent: "center", width: "100%", flexDirection: "row", alignItems: "center" }}>
              <Text style={{ backgroundColor: Colors.color_636364, paddingLeft: 10, paddingRight: 10, borderRadius: 10, color: "white", textAlign: "center" }}>{index}/5</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  onMatchProduct = () => {
    this.setState({
      matched: true, blotched: false
    })
  }

  onBlotchProduct = () => {
    this.setState({matched:false, blotched:true});
  }

  onSaveToAllergicIngredients = () => {
    alert("alergicIng");
    this.setState({saveToModalVisible:false})
  }

  onSaveToPotentilAllergens = () => {
    alert("potential allergens");
    this.setState({saveToModalVisible:false})
  }

  onSaveToPreferredIngredients = () => {
    alert("preferred ingredients");
    this.setState({saveToModalVisible:false})
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

        <TopbarWithBlackBack rightBtn="true" title="Product" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this.onShare() }}></TopbarWithBlackBack>
        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>

            {/* 배너 부분 */}
            <View style={{ overflow: "hidden", justifyContent: "center", alignSelf: "center", width: this.BannerWidth, height: this.BannerHeight, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderLeftColor: Colors.color_f9f9f9, borderRightColor: Colors.color_f9f9f9, borderWidth: 1, borderBottomColor: Colors.color_f3f3f3, borderBottomWidth: 2, borderTopWidth: 0 }}>
              <Carousel
                autoplay
                autoplayTimeout={3000}
                loop
                index={0}
                showsPageIndicator={false}
                pageSize={this.BannerWidth}
              >
                {this.state.bannerImages.map((image, index) => this.renderBanner(image, index))}
              </Carousel>
            </View>

            {/* Description */}
            <View style={[{ marginTop: 5 }, MyStyles.padding_main]}>
              <View style={[{ marginTop: 5, flexDirection: "row", flex: 1 }]}>
                <View style={[{ marginTop: 5, flexDirection: "row", alignItems: "center", borderWidth: 0.5, paddingLeft: 5, paddingRight: 5, borderRadius: 2, borderColor: Colors.color_e5e6e5 }]}>
                  <Text style={{ color: Colors.color_949191 }}>CHANEL </Text>
                  <Image source={require("../../assets/images/ic_arrow_right_gray.png")} style={MyStyles.ic_arrow_right_gray} />
                </View>
              </View>
              <Text style={{ fontSize: 63 / 3, color: Colors.primary_dark, marginTop: 5, marginBottom: 25 }}>Hydra Beauty Micro Liquid Essence
                </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                <Image style={{ flex: 1 }} />
                <Image source={require("../../assets/images/ic_heart_gray.png")} style={MyStyles.ic_heart_gray} />
                <Text style={{ color: Colors.color_949292, fontSize: 13, marginLeft: 5 }}>73</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  containerStyle={{ width: 273 / 3, marginLeft: 15 }}
                  starSize={50 / 3}
                  emptyStarColor={Colors.color_star_empty}
                  rating={this.state.starCount}
                  selectedStar={(rating) => {
                    this.setState({
                      starCount: rating
                    });
                  }}
                  fullStarColor={Colors.color_star_full}
                />
              </View>
            </View>
            <View style={MyStyles.seperate_line_e5e5e5}></View>

            {/* Ingredients and Reviews */}
            <View style={{}}>
              <View style={MyStyles.tabbar_button_container}>
                <TouchableOpacity style={this.state.tabbar.Ingredients ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: true, Reviews: false } })
                }}>
                  <Text style={this.state.tabbar.Ingredients ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Ingredients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={this.state.tabbar.Reviews ? MyStyles.tabbar_button_selected : MyStyles.tabbar_button} onPress={() => {
                  this.setState({ tabbar: { Ingredients: false, Reviews: true } })
                }}>
                  <Text style={this.state.tabbar.Reviews ? MyStyles.tabbar_text_selected : MyStyles.tabbar_text} >Reviews</Text>
                </TouchableOpacity>
              </View>

              <View>
                <FragmentProductDetailIngredients></FragmentProductDetailIngredients>
              </View>
            </View>
          </View>
        </ScrollView>

        <LinearGradient colors={['#fefefe', '#f8f8f8']} style={{ height: 3 }} ></LinearGradient>
        <View style={{ height: 215 / 3, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} onPress={this.onMatchProduct}>
              {this.state.matched ? <Image source={require('../../assets/images/ic_match_on.png')} style={[MyStyles.ic_match]} /> : <Image source={require('../../assets/images/ic_match_off.png')} style={[MyStyles.ic_match]} />}
              {this.state.matched ? <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_6bd5be }}>Match'd</Text> : <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Match'd</Text>}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }} onPress={this.onBlotchProduct}>
              {this.state.blotched ? <Image source={require('../../assets/images/ic_blotch_on.png')} style={[MyStyles.ic_blotch]} /> : <Image source={require('../../assets/images/ic_blotch_off.png')} style={[MyStyles.ic_blotch]} />}
              {this.state.blotched ? <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_f691a1 }}>Blotch'd</Text> : <Text style={{ marginTop: 5, fontSize: 13, color: Colors.color_dcdedd }}>Blotch'd</Text>}
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1}}>
            <TouchableOpacity style={[{ height: 30, width: 250 / 3, justifyContent: "center", alignSelf:"center", alignItems: "center" }, MyStyles.purple_round_btn]} onPress={() => {
                this.setState({saveToModalVisible:true})
            }}>
              <Text style={{ fontSize: 13, color: "white" }}>Save as</Text>
              <Image source={require("../../assets/images/ic_arrow_down_white_small.png")} style={[MyStyles.ic_arrow_down_white_small, { position: "absolute", right: 10 }]} />
            </TouchableOpacity>
          </View>
        </View>
        
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
                  <View style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute"}]}>
                    <Text style={{ color: Colors.primary_dark, fontSize: 16, fontWeight: "500", }}>Save to</Text>
                  </View>
                  <TouchableOpacity style={[MyStyles.padding_h_main, MyStyles.padding_v_5, { position: "absolute", right: 0 }]} onPress={() => {
                    this.setState({ saveToModalVisible: false });
                  }}>
                    <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")}></Image>
                  </TouchableOpacity>
                </View>

                <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

                <View style={[MyStyles.padding_h_main, {height:130}]}>
                  {/* Allergic Ingredients(Dislike) */}
                  <TouchableOpacity style={{flex:1, flexDirection:"row", borderBottomColor:Colors.color_dcdedd, borderBottomWidth:0.5, justifyContent:"center", alignItems:"center"}} onPress={this.onSaveToAllergicIngredients}>
                    <Image style={MyStyles.ic_allergic_ingredient} source={require("../../assets/images/ic_allergic_ingredient.png")}></Image>
                    <Text style={{fontSize:13, marginLeft:10, color:Colors.primary_dark}}>Allergic Ingredients(Dislike)</Text>
                    <Image style={{flex:1}}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                  {/* Potential Allergens */}
                  <TouchableOpacity style={{flex:1, flexDirection:"row", borderBottomColor:Colors.color_dcdedd, borderBottomWidth:0.5, justifyContent:"center", alignItems:"center"}} onPress={this.onSaveToPotentilAllergens}>
                    <Image style={MyStyles.ic_potential_allergins} source={require("../../assets/images/ic_potential_allergins.png")}></Image>
                    <Text style={{fontSize:13, marginLeft:10, color:Colors.primary_dark}}>Potential Allergens</Text>
                    <Image style={{flex:1}}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                  {/* Preferred Ingredients */}
                  <TouchableOpacity style={{flex:1, flexDirection:"row", borderBottomColor:Colors.color_dcdedd, borderBottomWidth:0.5, justifyContent:"center", alignItems:"center"}} onPress={this.onSaveToAllergicIngredients}>
                    <Image style={MyStyles.ic_preferred_ingredient} source={require("../../assets/images/ic_preferred_ingredient.png")}></Image>
                    <Text style={{fontSize:13, marginLeft:10, color:Colors.primary_dark}}>Preferred Ingredients</Text>
                    <Image style={{flex:1}}></Image>
                    <Image style={MyStyles.ic_arrow_right_gray} source={require("../../assets/images/ic_arrow_right_gray.png")}></Image>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView >
    );
  }
}