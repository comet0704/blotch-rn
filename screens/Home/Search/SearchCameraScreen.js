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
    });
  };

  _handleBarCodeRead = result => {
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
              <Camera
                // onBarCodeScanned={this._handleBarCodeRead}
                style={[StyleSheet.absoluteFill, styles.container]}
                flashMode={this.state.isTorchOn ? 'torch' : 'off'}
              >
                <View style={styles.layerTop} />
                <View style={styles.layerTopbarSpace} />
                <View style={styles.layerCenter}>
                  <View style={[styles.layerLeft, { zIndex: 1000 }]}>
                  </View>
                  <View style={styles.focused}>

                  </View>
                  <View style={styles.layerRight} />
                </View>
                <View style={styles.layerBottom} />
                <View style={styles.layerDesc}>
                  <View style={{ flex: 1, backgroundColor: "white", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flex: 1 }} />
                    <Image source={require('../../../assets/images/ic_camera_button.png')} style={[MyStyles.ic_camera_button]} />
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      <TouchableOpacity onPress={() => {
                        this.props.navigation.pop(1);
                        this.props.navigation.navigate("SearchBarcode")
                      }}>
                        <Image source={require('../../../assets/images/ic_barcode_button.png')} style={[MyStyles.ic_barcode_button]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Camera>
          }
          <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <TopbarWithBlackBack rightBtn="true" isTorch={true} title="Camera" onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this._handleTorchPress() }}></TopbarWithBlackBack>
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
    height: 990 / 3,
    flexDirection: 'row'
  },
  layerLeft: {
    width: 15,
    backgroundColor: opacity
  },
  focused: {
    flex: 1,
    borderWidth: 4,
    borderColor: Colors.color_primary_pink,
    justifyContent: "center",
  },
  layerRight: {
    width: 15,
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