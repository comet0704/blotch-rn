import { AsyncStorage } from 'react-native';
import MyConstants from './constants/MyConstants'
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import AppNavigator1 from './navigation/AppNavigator1';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLogined: false,
  };

  componentWillMount() {
    // this.selectTabBar()
  }

  selectTabBar() {
    AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.login_info, (err, result) => {
      global.login_info = JSON.parse(result);
      if (global.login_info == null) {
        this.setState({ isLogined: false })
      } else {
        this.setState({ isLogined: true })
      }
    });
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      if (this.state.isLogined == false) {
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator1 />
          </View>
        );
      }
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
