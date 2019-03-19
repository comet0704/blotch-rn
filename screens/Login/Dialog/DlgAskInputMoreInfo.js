import { ImagePicker } from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class DlgAskInputMoreInfo extends React.Component {
  
  render() {
    return (
      <View >
      </View>
    );
  }
  
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

}

const styles = StyleSheet.create({
    dlgBackBg : {
      backgroundColor: "#0000009D",
      position:"absolute",
      width:"100%",
      height:"100%",
      paddingLeft:"35",
      paddingRight:"35",
    }
});