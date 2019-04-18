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

export default class SignupScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      savePressed: false,
      photoModalVisible: false,
      selectedImage: null,
      selectedFile: null,
      uploadedImagePath: null,
      email: null,
      id: null,
      password: null,
      password_confirm: null,
      askInputQueModal: false,
    };
  }

  Necessarry = (
    <Text style={{ color: "#efb5cc", fontSize: 13 }}>
      *
    </Text>
  );

  showAskInputQueModal = (visible) => {
    this.setState({ askInputQueModal: visible });
  }


  checkValidation = (value, check_type) => {
    if (value == null || value.length == 0) {
      return false
    }

    if (check_type == "id") {
      if (value.length < 4) {
        return false
      }
    }

    if (check_type == "password") {
      if (value.length < 8) {
        return false
      }
    }

    if (check_type == "password_confirm") {
      if (value != this.state.password) {
        return false
      }
    }

    return true
  }

  onSavePressed = () => {
    // 유효한 값들이 입력되었는지 검사
    if (this.state.email && this.state.id && this.state.password && this.state.password_confirm &&
      this.state.email.length > 0 && this.state.id.length >= 4 && this.state.password.length >= 8 &&
        this.state.password == this.state.password_confirm) {
      if (this.state.selectedFile != null) { // 프로필이미지가 있을때는 업로드
        this.requestUploadUserImage(this.state.selectedFile)
      } else { // 업을때는 즉시 등록
        this.requestRegister(this.state.email, this.state.id, this.state.password, this.state.password_confirm, this.state.uploadedImagePath)
      }
    } else {
      this.setState({ savePressed: true });
    }

  }

  render() {
    let { savePressed, selectedImage, email, id, password, password_confirm } = this.state;
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
        <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>

        <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" >

          <View style={MyStyles.container}>
            <Text style={MyStyles.text_header1}>Welcome!</Text>
            <Text style={MyStyles.text_desc}>Tell us about you !</Text>

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
                returnKeyType="next"
                ref={(input) => { this.idTextInput = input; }}
                onSubmitEditing={() => { this.pwdTextInput.focus(); }}
                onChangeText={(text) => { this.setState({ id: text }) }}
                keyboardType="email-address"
              />
            </View>
            {
              ((this.checkValidation(id, "id") == false) && savePressed == true) ?
                <Text style={MyStyles.warningText}>Please Enter a ID at least four characters</Text> : null
            }

            <View style={[MyStyles.inputBox, (this.checkValidation(password, "password") == false && savePressed == true) ? { borderColor: "#f33f5b" } : {}]}>
              {this.checkValidation(password, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Password {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="next"
                ref={(input) => { this.pwdTextInput = input; }}
                onSubmitEditing={() => { this.pwdConfirmTextInput.focus(); }}
                onChangeText={(text) => { this.setState({ password: text }) }}
                secureTextEntry={true}
              />
            </View>
            {
              ((this.checkValidation(password, "password") == false) && savePressed == true) ?
                <Text style={MyStyles.warningText}>Please Enter a Password at least eight characters</Text> : null
            }

            <View style={[MyStyles.inputBox, (this.checkValidation(password_confirm, "password_confirm") == false && savePressed == true) ? { borderColor: "#f33f5b" } : {}]}>
              {this.checkValidation(password_confirm, "empty") == false ? <Text style={{ color: "#e4e6e5", position: "absolute", top: 10 }}>Confirm Password {this.Necessarry}</Text> : null}
              <TextInput
                returnKeyType="done"
                ref={(input) => { this.pwdConfirmTextInput = input; }}
                onChangeText={(text) => { this.setState({ password_confirm: text }) }}
                secureTextEntry={true}
              />
            </View>
            {
              ((this.checkValidation(password_confirm, "password_confirm") == false) && savePressed == true) ?
                <Text style={MyStyles.warningText}>Please Confirm a Password</Text> : null
            }

            <TouchableOpacity style={[MyStyles.btn_primary_cover, { marginTop: 35, marginBottom: 45 }]} onPress={() => this.onSavePressed()}>
              <Text style={MyStyles.btn_primary}>Save</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.askInputQueModal}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.modal_bg}>
              <View style={MyStyles.modalContainer}>
                <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                  this.setState({ askInputQueModal: false });
                  this.props.navigation.navigate('Home')
                }}>
                  <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                </TouchableOpacity>

                <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>Tell us little more about you so {"\n"} we can find recommendation!</Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableHighlight onPress={() => { this.refs.toast.showBottom("2차개발 준비중") }}
                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                    <Text style={MyStyles.btn_primary}>Yes</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                    onPress={() => {
                      this.setState({ askInputQueModal: false });
                      this.props.navigation.navigate('Home')
                    }}>
                    <Text style={MyStyles.btn_primary_white}>Not now</Text>
                  </TouchableHighlight>
                </View>
              </View>

            </View>
          </View>
        </Modal>

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
          this.requestRegister(this.state.email, this.state.id, this.state.password, this.state.password_confirm, this.state.uploadedImagePath)
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

  requestRegister(p_email, p_user_id, p_pwd, p_pwd2, p_profile_image) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        user_id: p_user_id,
        password: p_pwd,
        password2: p_pwd2,
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
          global.login_info = responseJson.result_data.login_user;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          this.showAskInputQueModal();
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