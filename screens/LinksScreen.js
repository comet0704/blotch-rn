import React from 'react';
import { Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native'
import { Notifications , Permissions } from 'expo';
import ModalDropdown from 'react-native-modal-dropdown'

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  console.log("token : " + token)
  // // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token,
  //     },
  //     user: {
  //       username: 'Brent',
  //     },
  //   }),
  // });
}

export default class CameraExample extends React.Component {
  state = {
    notification: {},
  };

  _handleNotification = ({origin, data}) => {
    alert("OK");
  }

  componentDidMount() {
    registerForPushNotificationsAsync();
    Notifications.addListener(this._handleNotification);
  }

  render() {
    return (
      <View></View>
    )
  } 
}