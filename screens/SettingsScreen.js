import React from 'react';
import { Button, Image, View , Permissions} from 'react-native';
import { ImagePicker } from 'expo';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  _pickImage = async () => {
    let { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    console.log('status of Camera permission: ', status);
    if (status !== 'granted') {
      console.log('Camera permission not granted!');
      console.log('Asking for permission');
      status = await Permissions.askAsync(Permissions.CAMERA).status;
      if (status !== 'granted') {
        alert(status);
        console.log('Asked for permission, but not granted!');
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true
    });
  };
}