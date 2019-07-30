// common
import { LinearGradient } from 'expo';
import React from 'react';
import { Platform, Image, Alert, Linking, Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TopbarWithBlackBack } from '../../../components/Topbars/TopbarWithBlackBack';
import MyConstants from '../../../constants/MyConstants';
import MyStyles from '../../../constants/MyStyles';
import { Camera, BarCodeScanner, Permissions } from 'expo';
import Net from '../../../Net/Net';
import Colors from '../../../constants/Colors';
import { MyAppText } from '../../../components/Texts/MyAppText';
import { NavigationEvents } from 'react-navigation';

export default class SearchBarcodeScreen extends React.Component {

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
      is_screen_hidden: false, // 다른 페이지로 이동하였을때 카메라 초첨이 여전히 남아있으면 바코드인식이 계속 진행되는 현상을 없애기 위함.
    });
  };

  _handleBarCodeRead = result => {
    this.setState({ is_screen_hidden: true })
    this.props.navigation.navigate("SearchResult", { [MyConstants.NAVIGATION_PARAMS.is_from_camera_search]: true, [MyConstants.NAVIGATION_PARAMS.scanned_barcode]: result.data });
    return
  };

  _handleTorchPress() {
    this.state.isTorchOn = !this.state.isTorchOn
    this.setState({ isTorchOn: this.state.isTorchOn })
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>
        <NavigationEvents
          onWillFocus={payload => {
            this.setState({ is_screen_hidden: false })
          }}
        />
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {this.state.hasCameraPermission === null ?
            <MyAppText>Requesting for camera permission</MyAppText>
            :
            this.state.hasCameraPermission === false ?
              <MyAppText style={{}}>
                Camera permission is not granted
              </MyAppText>
              :
              this.state.is_screen_hidden == false ?
                <Camera
                  onBarCodeScanned={this._handleBarCodeRead}
                  style={[StyleSheet.absoluteFill, styles.container]}
                  // onBarCodeScanned={(scan) => { alert(scan.data) }}
                  flashMode={this.state.isTorchOn ? 'torch' : 'off'}
                >
                  <View style={styles.layerTop} />
                  <View style={styles.layerTopbarSpace} />
                  <View style={styles.layerCenter}>
                    <View style={[styles.layerLeft, { zIndex: 1000 }]}>
                    </View>
                    <View style={styles.focused}>
                      <Image source={require('../../../assets/images/ic_purple_border1.png')} style={[MyStyles.ic_purple_border, { zIndex: 1000, position: "absolute", top: -3, left: -3 }]} />
                      <Image source={require('../../../assets/images/ic_purple_border2.png')} style={[MyStyles.ic_purple_border, { zIndex: 1000, position: "absolute", top: -3, right: -3 }]} />
                      <Image source={require('../../../assets/images/ic_purple_border3.png')} style={[MyStyles.ic_purple_border, { zIndex: 1000, position: "absolute", bottom: -3, left: -3 }]} />
                      <Image source={require('../../../assets/images/ic_purple_border4.png')} style={[MyStyles.ic_purple_border, { zIndex: 1000, position: "absolute", bottom: -3, right: -3 }]} />

                      <View style={{ height: 2, width: "100%", backgroundColor: "#da3c2680" }} />
                    </View>
                    <View style={styles.layerRight} />
                  </View>
                  <View style={styles.layerBottom} />
                  <View style={styles.layerDesc}>
                    <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                      <Image source={require('../../../assets/images/ic_bar_code.png')} style={[MyStyles.ic_bar_code]} />
                      <MyAppText style={{ color: Colors.primary_dark, fontSize: 15, fontWeight: "500", marginTop: 10, textAlign: "center" }}>Point the camera on the other side of your{"\n"}phone at a Barcode</MyAppText>
                    </View>
                  </View>
                </Camera>
                :
                null
          }
          <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <TopbarWithBlackBack rightBtn="true" isTorch={true} title="Barcode" onPress={() => {
              this.props.navigation.pop(1);
              // this.props.navigation.navigate("SearchCamera")
            }} onRightBtnPress={() => { this._handleTorchPress() }}></TopbarWithBlackBack>
            <LinearGradient colors={['#eeeeee', '#f7f7f7']} style={{ height: 6 }} ></LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView >
    );
  }

}
const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerTopbarSpace: {
    height: 220 / 3,
    backgroundColor: opacity
  },
  layerCenter: {
    height: 515 / 3,
    flexDirection: 'row'
  },
  layerLeft: {
    width: 130 / 3,
    backgroundColor: opacity
  },
  focused: {
    flex: 1,
    borderWidth: 4,
    borderColor: opacity,
    justifyContent: "center",
  },
  layerRight: {
    width: 130 / 3,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  },
  layerDesc: {
    height: 470 / 3,
    backgroundColor: opacity
  },
});