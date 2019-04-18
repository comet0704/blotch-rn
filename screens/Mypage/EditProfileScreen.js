import { ImagePicker, Permissions } from 'expo';
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import { TouchableWithoutFeedback, Image, AsyncStorage, KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles';
import Net from '../../Net/Net';
import MyConstants from '../../constants/MyConstants';
import Models from '../../Net/Models';
import Colors from '../../constants/Colors';
import Common from '../../assets/Common';

export default class EditProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      savePressed: false,
      photoModalVisible: false,
      selectedImage: Common.getImageUrl(global.login_info.profile_image),
      selectedFile: null,
      uploadedImagePath: null,
      email: global.login_info.email,
      id: global.login_info.user_id,
    };
  }

  onProfileEdited = null;
  componentDidMount() {
    this.onProfileEdited = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.onProfileEdited)
  }

  Necessarry = (
    <Text style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </Text>
  );

  checkValidation = (value, check_type) => {
    if (value == null || value.length == 0) {
      return false
    }

    if (check_type == "id") {
      if (value.length < 4) {
        return false
      }
    }

    return true
  }

  onSavePressed = () => {
    // 유효한 값들이 입력되었는지 검사
    if (this.state.email && this.state.id &&
      this.state.email.length > 0 && this.state.id.length >= 4) {
      if (this.state.selectedFile != null) {
        this.requestUploadUserImage(this.state.selectedFile)
      } else {
        this.requestUpdateProfile(this.state.email, this.state.id, null)
      }
    } else {
      this.setState({ savePressed: true });
    }

  }

  render() {
    let { savePressed, selectedImage, email, id } = this.state;
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
        <TopbarWithBlackBack rightBtn="true" isEditProfile={true} onPress={() => { this.props.navigation.goBack() }} onRightBtnPress={() => { this.props.navigation.navigate('ChangePwd') }}></TopbarWithBlackBack>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

          <View style={MyStyles.container}>
            <Text style={MyStyles.text_header1}>Edit Profile</Text>
            <Text style={MyStyles.text_desc}>To set or change your information</Text>

            <View style={[MyStyles.profile_box]}>
              <TouchableOpacity onPress={() => { this.setState({ photoModalVisible: true }) }} style={MyStyles.camera_box}>
                <Image source={(require('../../assets/images/Login/ic_camera.png'))} style={{ width: 12, height: 11, alignSelf: "center" }} />
              </TouchableOpacity>
              <Image source={selectedImage == null ? (require('../../assets/images/Login/ic_avatar.png')) : { uri: selectedImage }} style={selectedImage == null ? { width: 30, height: 43, alignSelf: "center" } : { width: 75, height: 75, borderRadius: 37 }} />
            </View>

            <View style={[MyStyles.inputBox, (this.checkValidation(email, "email") == false && savePressed == true) ? { borderColor: "#f33f5b" } : {}]}>
              {this.checkValidation(email, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Email {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="next"
                onChangeText={(text) => { this.setState({ email: text }) }}
                value={this.state.email}
                onSubmitEditing={() => { this.idTextInput.focus(); }}
                keyboardType="email-address"
              />
            </View>
            {
              ((this.checkValidation(email, "email") == false) && savePressed == true) ?
                <Text style={MyStyles.warningText}>Please Confirm your Email</Text> : null
            }

            <View style={[MyStyles.inputBox, (this.checkValidation(id, "id") == false && savePressed == true) ? { borderColor: "#f33f5b" } : {}]}>
              {this.checkValidation(id, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>ID {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="done"
                value={this.state.id}
                ref={(input) => { this.idTextInput = input; }}
                onChangeText={(text) => { this.setState({ id: text }) }}
                keyboardType="email-address"
              />
            </View>
            {
              ((this.checkValidation(id, "id") == false) && savePressed == true) ?
                <Text style={MyStyles.warningText}>Please Enter a ID at least four characters</Text> : null
            }



            <TouchableOpacity style={[MyStyles.btn_primary_cover, { marginTop: 35, marginBottom: 45 }]} onPress={() => this.onSavePressed()}>
              <Text style={MyStyles.btn_primary}>Save</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        {/* 갤러리 picker  팝업 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.photoModalVisible}
          onRequestClose={() => {
          }}>
          <TouchableWithoutFeedback onPress={() => { this.setState({ photoModalVisible: false }) }}>
            <View style={[{ flex: 1, backgroundColor: "#0000009d", }]}>
              <Image style={{ flex: 1 }} />
              <View style={[{ height: 800 / 3, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.color_f8f8f8 }, MyStyles.shadow_2]}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => { this._pickImageFromCamera() }}>
                    <Image source={require("../../assets/images/ic_camera_big.png")} style={MyStyles.ic_camera_big} />
                    <Text style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 50, justifyContent: "center" }} onPress={() => { this._pickImageFromGallery() }}>
                    <Image source={require("../../assets/images/ic_gallery_big.png")} style={MyStyles.ic_gallery_big} />
                    <Text style={{ color: Colors.color_949292, marginTop: 5, textAlign: "center" }}>Album</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

  _pickImageFromGallery = async () => {
    this.setState({ photoModalVisible: false })
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ selectedImage: result.uri });
      this.setState({ selectedFile: result });
    }
  };

  _pickImageFromCamera = async () => {
    this.setState({ photoModalVisible: false })
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      console.log(result);

      if (!result.cancelled) {
        this.setState({ selectedImage: result.uri });
        this.setState({ selectedFile: result });
      }
    } else {
      throw new Error('Location permission not granted');
    }
  };

  // Net
  requestUploadUserImage(image) {
    this.setState({
      isLoading: true,
    });
    imgUri = image.uri.replace("file://", "")
    let fileType = imgUri.substring(imgUri.lastIndexOf(".") + 1);

    const data = new FormData();
    console.log(imgUri)
    data.append('file', {
      uri: image.uri,
      type: `image/${fileType}`,
      name: image.uri.substring(image.uri.lastIndexOf("/") + 1)
    })

    console.log(data)
    fetch(Net.upload.image.user, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: data
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        result_code = responseJson.result_code;
        if (result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
        } else {
          this.setState({
            isLoading: false,
            uploadedImagePath: responseJson.result_data.upload_path
          });
          this.requestUpdateProfile(this.state.email, this.state.id, this.state.uploadedImagePath)
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
      })
      .done();
  }

  requestUpdateProfile(p_email, p_user_id, p_profile_image) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.user.updateProfile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': global.login_info.token
      },
      body: JSON.stringify({
        email: p_email,
        user_id: p_user_id,
        profile_image: p_profile_image,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          this.refs.toast.showBottom(responseJson.result_msg);
          return;
        } else {
          global.login_info.user_id = p_user_id;
          global.login_info.email = p_email;
          if (p_profile_image != null) {
            global.login_info.profile_image = p_profile_image;
          }
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(global.login_info));
          this.refs.toast.showBottom("Changes have been saved");
          this.props.navigation.goBack()
          this.onProfileEdited()
        }

      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        this.refs.toast.showBottom(error);
        console.log("error----------------\n" + error)
      })
      .done();
  }
}