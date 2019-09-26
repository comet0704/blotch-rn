// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, KeyboardAvoidingView, Linking, Modal, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import Common from '../../assets/Common';
import { MyAppText } from '../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';


export default class FavoriteArticlesScreen extends React.Component {
  offset = 0;
  constructor(props) {
    super(props);
    this.isLoading = false
    this.state = {
      loading_end: false,
      isLoading: false,
      showDeleteModal: false,
      result_data: {
        article_list: [],
      },
    };
  }

  componentDidMount() {
    this.setState({ loading_end: false })
    this.requestArticleLikeList(0);
  }

  renderArticle(item, index) {
    return (
      <TouchableOpacity activeOpacity={0.8} key={item.id} style={[MyStyles.container, { flex: 1 }]} onPress={() => { this.props.navigation.navigate("ArticleDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: item.id, [MyConstants.NAVIGATION_PARAMS.item_info]: item }) }}>
        <View style={[{ marginTop: 40 / 3, flex: 1, flexDirection: "row", alignItems: "center" }]}>
          {item.image != "" ?
            <View style={{ width: 316 / 3, height: 230 / 3, borderRadius: 5, overflow: "hidden", marginRight: 10 }}>
              <ImageLoad source={{ uri: Common.getImageUrl(item.image) }} style={MyStyles.background_image} />
            </View>
            : null}

          <View style={{ flex: 1 }}>
            <MyAppText style={{ minHeight: 158 / 3, fontSize: 15, color: Colors.primary_dark }}>
              {item.title} </MyAppText>
            <MyAppText onPress={() => { Linking.openURL(Common.getLinkUrl(item.url)) }} style={{ marginTop: 5, fontSize: 13, color: Colors.color_949292 }} numberOfLines={1}>
              {item.url}
            </MyAppText>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={() => { this.deleteFromList(item.id) }}>
            <Image source={require("../../assets/images/ic_heart_big.png")} style={[MyStyles.ic_heart_big, { marginLeft: 10 }]} />
          </TouchableOpacity>
        </View>

        <View style={[MyStyles.seperate_line_e5e5e5, { marginTop: 40 / 3, marginRight: -15 }]}></View>
      </TouchableOpacity>
    );
  }


  deleteFromList(p_item_id) {
    this.setState({ delete_item_id: p_item_id, showDeleteModal: true })
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <TopbarWithBlackBack rightBtn="false" title="Favorite Article" onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (Common.scrollIsCloseToBottom(nativeEvent) && this.state.loading_end == false && this.isLoading == false) {
              this.isLoading = true
              this.requestArticleLikeList(this.offset)
            }
          }}
          style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >
          <View style={[{ flex: 1 }]}>
            {this.state.result_data.article_list.map((item, index) => this.renderArticle(item, index))}
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
                  <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", textAlign: "center", marginLeft: 10, marginRight: 10, fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Are you sure you want to delete this article from the list?</MyAppText>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight onPress={() => {
                      this.setState({ showDeleteModal: false });
                      this.requestArticleUnlike(this.state.delete_item_id);
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
      </KeyboardAvoidingView>
    );
  }

  requestArticleLikeList(p_offset) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.articleLikeList, {
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
          return
        }
        this.offset += responseJson.result_data.article_list.length
        if (responseJson.result_data.article_list.length < MyConstants.ITEMS_PER_PAGE) {
          this.setState({ loading_end: true })
        }

        const article_list = this.state.result_data.article_list
        result = { article_list: [...article_list, ...responseJson.result_data.article_list] };
        this.setState({ result_data: result }, () => {
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

  requestArticleUnlike(p_article_id) {
    // this.setState({
    //   isLoading: true,
    // });
    return fetch(Net.article.unlike, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        article_id: p_article_id.toString()
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

        const article_list = this.state.result_data.article_list
        const index = article_list.findIndex(item => item.id === p_article_id)
        article_list.splice(index, 1)
        const result = { article_list: article_list };
        this.setState({ result_data: result })

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
}