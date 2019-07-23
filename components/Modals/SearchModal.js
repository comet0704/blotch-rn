import React from 'react';
import { Modal, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient, ImagePicker, Permissions } from 'expo';
import { MyAppText } from '../Texts/MyAppText';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';
import OcrStyle from '../../constants/OcrStyle';


export class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    this.props.navigation.navigate('SearchCamera', { ocr: pickerResult });
  };

  render() {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1 }}>
          <View style={MyStyles.modal_bg}>
            <View style={MyStyles.modalContainer}>
              {/* modal header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50
                }}
              >
                <View
                  style={[
                    MyStyles.padding_h_main,
                    MyStyles.padding_v_5,
                    { position: 'absolute' }
                  ]}
                >
                  <MyAppText
                    style={{
                      color: Colors.primary_dark,
                      fontSize: 16,
                      fontWeight: '500'
                    }}
                  >
                    Search
                  </MyAppText>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    MyStyles.padding_h_main,
                    MyStyles.padding_v_5,
                    { position: 'absolute', right: 0 }
                  ]}
                  onPress={this.props.onClose}
                >
                  <Image
                    style={{ width: 14, height: 14 }}
                    source={require('../../assets/images/ic_close.png')}
                  />
                </TouchableOpacity>
              </View>

              <LinearGradient
                colors={['#eeeeee', '#f7f7f7']}
                style={{ height: 6 }}
              />

              <View style={[MyStyles.padding_h_main, { height: 130 }]}>
                {/* Allergic Ingredients(Dislike) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderBottomColor: Colors.color_dcdedd,
                    borderBottomWidth: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.props.onClose();
                    this.takePhoto();
                    // this.props.navigation.navigate("SearchCamera");
                  }}
                >
                  <Image
                    style={OcrStyle.ic_ocr_search}
                    source={require('../../assets/images/OcrIcon/camera_icon.png')}
                  />
                  <MyAppText
                    style={{
                      fontSize: 13,
                      marginLeft: 10,
                      color: Colors.primary_dark
                    }}
                  >
                    Camera
                  </MyAppText>
                  <Image style={{ flex: 1 }} />
                  <Image
                    style={MyStyles.ic_arrow_right_gray}
                    source={require('../../assets/images/ic_arrow_right_gray.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderBottomColor: Colors.color_dcdedd,
                    borderBottomWidth: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.props.onClose();
                    this.props.navigation.navigate('SearchBarcode');
                  }}
                >
                  <Image
                    style={OcrStyle.ic_ocr_search}
                    source={require('../../assets/images/OcrIcon/barcode_icon.png')}
                  />
                  <MyAppText
                    style={{
                      fontSize: 13,
                      marginLeft: 10,
                      color: Colors.primary_dark
                    }}
                  >
                    Barcode
                  </MyAppText>
                  <Image style={{ flex: 1 }} />
                  <Image
                    style={MyStyles.ic_arrow_right_gray}
                    source={require('../../assets/images/ic_arrow_right_gray.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
