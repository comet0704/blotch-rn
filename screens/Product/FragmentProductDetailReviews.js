import React from 'react';
import StarRating from 'react-native-star-rating';
import Carousel from 'react-native-banner-carousel';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import {
  KeyboardAvoidingView,
  View,
  Modal,
  Image,
  TextInput,
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

export class FragmentProductDetailReviews extends React.Component {
  state = {
    starCount:3,
    progress: {
      blotch: 13,
      watch: 19,
      match: 27,
      save: 18,
    },
    curSelectedIngredient: -1,
    selectedIngredientType: 0, // Good, Normal, Bad 분류하기 위함.
  };

  render() {
    const progressBlotchStyle = {
      backgroundColor: Colors.ingredient_allergic_dark, 
      height:6,
    };
    const progressWatchStyle = {
      backgroundColor: Colors.color_c2c1c1, 
      height:6,
    };
    const progressMatchStyle = {
      backgroundColor: Colors.color_6bd5be, 
      height:6,
    };
    const progressSaveStyle = {
      backgroundColor: Colors.color_f3f3f3, 
      height:6,
    };

    const barWidth = Dimensions.get('screen').width - 30;

    return (
      <View>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>

        {/* Progress Bars */}
        <View style={[MyStyles.margin_h_main, MyStyles.padding_v_25, MyStyles.border_bottom_e5e5e5]}>
          {/* Blotch'd */}
          <View>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginBottom:5}}>
                <Image source={require("../../assets/images/ic_blotch_prog.png")} style={[MyStyles.ic_blotch_prog]} />
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>Blotch'd</Text>
                <Image style={{flex:1}}/>
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>{this.state.progress.blotch}%</Text>
              </View>
              <ProgressBarAnimated
                {...progressBlotchStyle}
                width={barWidth}
                value={this.state.progress.blotch}
              />
          </View>

          {/* Watch List */}
          <View style={{marginTop:10}}>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginBottom:5}}>
                <Image source={require("../../assets/images/ic_watch_prog.png")} style={[MyStyles.ic_watch_prog]} />
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>Watch List</Text>
                <Image style={{flex:1}}/>
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>{this.state.progress.watch}%</Text>
              </View>
              <ProgressBarAnimated
                {...progressWatchStyle}
                width={barWidth}
                value={this.state.progress.watch}
              />
          </View>

          {/* Match'd */}
          <View style={{marginTop:10}}>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginBottom:5}}>
                <Image source={require("../../assets/images/ic_match_prog.png")} style={[MyStyles.ic_match_prog]} />
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>Match'd</Text>
                <Image style={{flex:1}}/>
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>{this.state.progress.match}%</Text>
              </View>
              <ProgressBarAnimated
                {...progressMatchStyle}
                width={barWidth}
                value={this.state.progress.match}
              />
          </View>

          {/* Save as Others */}
          <View style={{marginTop:10}}>
              <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginBottom:5}}>
                <Image source={require("../../assets/images/ic_save_prog.png")} style={[MyStyles.ic_save_prog]} />
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>Save as Others</Text>
                <Image style={{flex:1}}/>
                <Text style={[MyStyles.text_13_primary_dark, {marginLeft:5, fontWeight:"500"}]}>{this.state.progress.save}%</Text>
              </View>
              <ProgressBarAnimated
                {...progressSaveStyle}
                width={barWidth}
                value={this.state.progress.save}
              />
          </View>
        </View>

        {/* Comments */}
        
            {/* Comments */}
            <View style={[MyStyles.bg_f8f8f8, { marginTop: 5 }]}>
              {/* Comments Header */}
              <View style={[MyStyles.bg_white, MyStyles.container, { paddingTop: 5 }]}>
                <Text style={{ color: Colors.primary_dark, fontSize: 13, fontWeight: "bold" }}>Comments <Text style={{ fontSize: 13, color: Colors.color_949292 }}>11</Text></Text>
                <View style={{ marginTop: 10, flexDirection: "row" }}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1]}></Image>
                  <TextInput placeholder="Add a Comment"  
                    returnKeyType="go"
                    multiline={true}
                    style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity style={{marginRight:10, marginTop:5}}>
                    <Image source={require("../../assets/images/ic_gallery.png")} style={[MyStyles.ic_gallery]}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>
                <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 5 }]}></View>
                <View style={{borderWidth:0.5, borderColor:Colors.color_dcdedd, borderTopWidth:0, height:115/3, justifyContent:"center", alignItems:"center"}}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    containerStyle={{ width: 273 / 3}}
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
                  <Image source={require("../../assets/images/ic_arrow_down_gray_small.png")} style={[MyStyles.ic_arrow_down_gray_small, {position:"absolute", right:10}]}></Image>
                </View>
              </View>

              <View>
                <View style={MyStyles.comment_item}>
                  <Image source={require("../../assets/images/ic_avatar1.png")} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                        <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* 대댓글 부분 */}
                <View style={[{ margin: 15, flexDirection: "row", padding: 5, alignItems: "center" }, MyStyles.bg_white]}>
                  <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 5, marginRight: 5 }]}></Image>
                  <TextInput placeholder="Add a Comment" style={{ flex: 1, marginLeft: 10, marginRight: 10 }}></TextInput>
                  <TouchableOpacity style={[MyStyles.purple_btn_r3, { width: 140 / 3, height: 84 / 3, }]}>
                    <Text multiline style={[{ textAlign: "center", alignItems: "center", color: "white", fontSize: 13 }]}>Post</Text>
                  </TouchableOpacity>
                </View>

                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View>

              <View>
                <View style={MyStyles.comment_item}>
                  <Image source={{ uri: "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg" }} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_comment.png")} style={[MyStyles.ic_comment, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_report_gray.png")} style={[MyStyles.ic_report_gray,]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View>

              <View>
                <View style={MyStyles.comment_item}>
                  <Image source={require("../../assets/images/ic_reply_mark.png")} style={[MyStyles.ic_reply_mark, { marginLeft: 13, marginTop: 5, marginRight: 10 }]}></Image>
                  <Image source={{ uri: "http://igx.4sqi.net/img/general/600x600/2553055_fsxvDqjLmgupV5JaF-1f2EtnByGYjETgh9YUgftiT3Y.jpg" }} style={[MyStyles.ic_avatar1, { marginTop: 5 }]}></Image>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 15, color: Colors.primary_dark, fontWeight: "bold" }}>Username</Text>
                      <Text style={[MyStyles.purple_bg_text_12, { marginLeft: 5, height: 50 / 3 }]}>Me</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: Colors.color_515151 }}>app-header is container element for app-toolbars a
t the top of the screen that can have scroll effects.
B default, an app-header moves aways from the vie
wport when scrolling down and if using reveals, the
header slides back when scrolling back up. For exam
ple</Text>
                    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                      <Text style={MyStyles.text_date}>19.01.02  22:11:12</Text>
                      <TouchableOpacity style={{ padding: 5 }}>
                        <Image source={require("../../assets/images/ic_delete.png")} style={[MyStyles.ic_delete, { marginLeft: 5 }]}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={MyStyles.seperate_line_e5e5e5}></View>
              </View>


            </View>
         
      </View>
    );
  }
};