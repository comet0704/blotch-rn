// common
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import uuid from 'uuid';
import { MyAppText } from '../../../components/Texts/MyAppText';
import { TopbarWithBlackBack } from '../../../components/Topbars/TopbarWithBlackBack';
import Environment from '../../../config/environment';
import Colors from '../../../constants/Colors';
import MyConstants from '../../../constants/MyConstants';
import MyStyles from '../../../constants/MyStyles';
/**
 * OCR
 */
import firebase from '../../../utils/firebase';

export default class SearchCameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      imgUri: undefined,
      ocrResult: '',
      query: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const ocr = navigation.getParam('ocr');
    this.handleImagePicked(ocr);
    this.setState({ imgUri: ocr.uri });
    // const tmp =
    //   'https://firebasestorage.googleapis.com/v0/b/sonic-terrain-245007.appspot.com/o/077c8ba1-7d0d-476d-9b1c-12dc15c3162d?alt=media&token=b45a2e3a-41df-4267-b41f-d5b9585f4275';
    // this.setState({ imgUri: tmp, isLoading: false });
  }

  handleImagePicked = async pickerResult => {
    try {
      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        await this.submitToGoogle(uploadUrl);
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  submitToGoogle = async uploadUrl => {
    try {
      this.setState({ isLoading: true });
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'LANDMARK_DETECTION', maxResults: 5 },
              { type: 'FACE_DETECTION', maxResults: 5 },
              { type: 'LOGO_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
              { type: 'IMAGE_PROPERTIES', maxResults: 5 },
              { type: 'CROP_HINTS', maxResults: 5 },
              { type: 'WEB_DETECTION', maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: uploadUrl
              }
            }
          }
        ]
      });
      let visionApi =
        'https://vision.googleapis.com/v1/images:annotate?key=' +
        Environment['GOOGLE_CLOUD_VISION_API_KEY'];
      let response = await fetch(visionApi, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: body
      });
      let responseJson = await response.json();
      let ocrResult = responseJson.responses[0].fullTextAnnotation.text;
      ocrResult = ocrResult.replace(/[\n\r]/g, ' ');
      this.setState({
        ocrResult,
        isLoading: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  goSearchMain = () => {
    this.props.navigation.navigate('SearchMain', {
      keyword: this.state.ocrResult
    });
  };

  goSearchResultScreen = () => {
    if (!this.state.ocrResult) {
      this.refs.toast.showBottom('Please input search keyword.');
      return;
    }
    this.props.navigation.navigate('SearchResult', {
      [MyConstants.NAVIGATION_PARAMS.search_word]: this.state.ocrResult,
      [MyConstants.NAVIGATION_PARAMS.backCallbackfromSearchResult]: () => {
        console.log('callback');
      }
    });
  };

  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled
      >
        <Spinner
          visible={this.state.isLoading}
          textContent={MyConstants.Loading_text}
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <TopbarWithBlackBack
            title='Camera'
            onPress={() => {
              this.props.navigation.pop(1);
              // this.props.navigation.navigate("SearchCamera")
            }}
          />
          <LinearGradient
            colors={['#eeeeee', '#f7f7f7']}
            style={{ height: 6 }}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={styles.layerTopbarSpace} />
          <TextInput
            style={{
              height: 40,
              fontSize: 13,
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 4,
              borderColor: Colors.color_f8f8f8,
              width: '90%'
            }}
            value={this.state.ocrResult}
            placeholder='Type here'
            onChangeText={text => this.setState({ ocrResult: text })}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              {
                marginTop: 27,
                borderRadius: 5,
                height: 135 / 3,
                justifyContent: 'center',
                width: '80%'
              },
              this.state.ocrResult
                ? { backgroundColor: Colors.primary_purple }
                : { backgroundColor: '#eff0f1' }
            ]}
            disabled={!this.state.ocrResult}
            onPress={() => this.goSearchMain()}
          >
            <MyAppText
              style={{
                color: 'white',
                fontSize: 15,
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              SEARCH
            </MyAppText>
          </TouchableOpacity>
          <Image
            source={{ uri: this.state.imgUri }}
            style={{ width: '100%', height: 400 }}
          />
        </View>
      </View>
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
    justifyContent: 'center'
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
  }
});

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.error(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);
  blob.close();
  return await snapshot.ref.getDownloadURL();
}
