import { AsyncStorage } from 'react-native';
import MyConstants from './constants/MyConstants'
import React from 'react';
import ImageLoad from 'react-native-image-placeholder';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import AppNavigator1 from './navigation/AppNavigator1';
import Net from './Net/Net'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    isLogined: false,
  };

  componentWillMount() {
    // 여기서 로그인을 진행해보고 로그인 성공/실패 여부를 따져보아야 함.
    this.tryLogin()
  }

  async tryLogin() {
    result1 = await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.login_info)
    global.login_info = JSON.parse(result1);
    if (global.login_info == null) { // 로그인 정보가 없는경우는 아예 시도 안함.
      this.setState({ isLogined: false })
    } else { // 로그인 정보가 있을때는 로그인 해보자
      result2 = await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.user_pwd)
      this.requestLogin(global.login_info.email, result2)
    }
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

  requestLogin(p_email, p_pwd) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        password: p_pwd,
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
          global.login_user = responseJson.login_user;
          global.setting = responseJson.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.user_pwd, p_pwd);
          global.user_pwd = p_pwd
          this.setState({ isLogined: true })
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
