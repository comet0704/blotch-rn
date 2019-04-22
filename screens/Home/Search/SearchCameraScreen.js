// common
import { LinearGradient } from 'expo';
import React from 'react';
import { Platform, Image, Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithBlackBack } from '../../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../../constants/MyConstants';
import MyStyles from '../../../constants/MyStyles';
import { BarCodeScanner, Permissions } from 'expo';
import Net from '../../../Net/Net';
import Torch from 'react-native-torch';

export default class SearchCameraScreen extends React.Component {

  item_id = "";
  offset = 0;
  constructor(props) {
    super(props);
    this.state = {
      isTorchOn: false,
      loading_end: false,
    };
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };


  _handleBarCodeRead = result => {
    if(this.state.isLoading)
      return
    console.log("111111" + result);
    this.requestSearchCamera(result.data);
  };

  _handleTorchPress() {
    if (Platform.OS === 'ios') {
      const { isTorchOn } = this.state;
      Torch.switchState(!isTorchOn);
      this.setState({ isTorchOn: !isTorchOn });
    } else {
      // const cameraAllowed = await Torch.requestCameraPermission(
      //   'Camera Permissions', // dialog title
      //   'We require camera permissions to use the torch on the back of your phone.' // dialog body
      // );
      // if (cameraAllowed) {
        const { isTorchOn } = this.state;
        Torch.switchState(!isTorchOn);
        this.setState({ isTorchOn: !isTorchOn });
      // }
    }
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
        <TopbarWithBlackBack rightBtn="true" isTorch={true} title="Camera" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this._handleTorchPress() }}></TopbarWithBlackBack>
        <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {this.state.hasCameraPermission === null ?
            <Text>Requesting for camera permission</Text>
            :
            this.state.hasCameraPermission === false ?
              <Text style={{}}>
                Camera permission is not granted
              </Text>
              :
              <View style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                // height: Dimensions.get('window').height - 100,
                // width: "100%",
              }}>
                <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    // height: Dimensions.get('window').height - 100,
                    // width: "100%",
                  }}
                />

                <View style={{
                  position: "absolute",
                  backgroundColor: 'transparent',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}>
                  <Image style={[MyStyles.seperate_line_e5e5e5, { marginTop: Dimensions.get('window').height / 3 }]} />
                  <Image style={[MyStyles.seperate_line_e5e5e5, { marginTop: Dimensions.get('window').height / 3 }]} />
                </View>
                <View style={{
                  position: "absolute",
                  backgroundColor: 'transparent',
                  width: "100%",
                  flex: 1,
                  flexDirection: "row",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}>
                  <Image style={[MyStyles.seperate_v_line_e5e5e5, { marginLeft: Dimensions.get('window').width / 3 }]} />
                  <Image style={[MyStyles.seperate_v_line_e5e5e5, { marginLeft: Dimensions.get('window').width / 3 }]} />
                </View>
              </View>
          }
        </View>
      </KeyboardAvoidingView >
    );
  }

  requestSearchCamera(p_barcode) {
    console.log(p_barcode);
    this.setState({
      isLoading: true,
    });
    return fetch(Net.camera.searchBarcode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token

      },
      body: JSON.stringify({
        barcode: p_barcode.toString()
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
        this.setState({
          result_data: responseJson.result_data
        });

        this.props.navigation.navigate("ProductDetail", { [MyConstants.NAVIGATION_PARAMS.item_id]: responseJson.result_data.camera_product.id });
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