import { observer } from 'mobx-react';
import * as Icon from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import MyConstants from './constants/MyConstants';
import AppNavigator from './navigation/AppNavigator';
import AppNavigator1 from './navigation/AppNavigator1';
import Net from './Net/Net';
import GlobalState from './store/GlobalState';

// 사용하는 대역변수 나열
global.login_info = null
global.setting = null;
global.user_pwd = null;

// 이 값으로 모든 root 페지들이 refresh 가 필요한가를 판정함
// 현재는 mylist 만 판정, 다른 페지들은 필요할때 추가.
global.refreshStatus = {
  main: true,
  product_recommend: true,
  ingredient: true,
  mylist: true,
  mypage: true,
}

class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };



  componentWillMount() {
    // 저장해둔 async 값들 받아오기
    this.getAsyncData()

    // 여기서 로그인을 진행해보고 로그인 성공/실패 여부를 따져보아야 함.
    this.tryLogin()
  }

  async getAsyncData() {

  }

  async tryLogin() {
    result1 = await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.login_info)
    global.login_info = JSON.parse(result1);
    if (global.login_info == null) { // 로그인 정보가 없는경우는 아예 시도 안함.
      GlobalState.loginStatus = -1
      // 토큰 항상 쓰는 값이므로 빈값으로 초기화라도 해주자
      global.login_info = {
        token: ""
      }
    } else { // 로그인 정보가 있을때는 로그인 해보자
      if (global.login_info.reg_type == "GOOGLE") { // 구글로그인인 경우 
        this.requestLoginGoogle(global.login_info.email, global.login_info.user_id)
      } else {
        result2 = await AsyncStorage.getItem(MyConstants.ASYNC_PARAMS.user_pwd)
        this.requestLogin(global.login_info.email, result2)
      }
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
      if (GlobalState.loginStatus == 0) {
        return (
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        );
      } else if (GlobalState.loginStatus == -1) {
        return (
          <View style={styles.container}>
            {/* <StatusBar
              backgroundColor="white"
              barStyle="dark-content"
            /> */}
            <AppNavigator />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <AppNavigator1 />
            {/* <StatusBar
              backgroundColor="white"
              barStyle="dark-content"
            /> */}
          </View>
        );
      }
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      await Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'rubik-regular': require('./assets/fonts/Rubik-Regular.ttf'),
        'rubik-light': require('./assets/fonts/Rubik-Light.ttf'),
        'rubik-medium': require('./assets/fonts/Rubik-Medium.ttf'),
        'rubik-bold': require('./assets/fonts/Rubik-Bold.ttf'),
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
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          // 로그인 실패했으면 토큰값 초기화
          global.login_info = {
            token: ""
          }
          GlobalState.loginStatus = -1
          return;
        } else {
          global.login_info = responseJson.result_data.login_user;
          global.setting = responseJson.result_data.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.user_pwd, p_pwd);
          global.user_pwd = p_pwd
          GlobalState.loginStatus = 1
        }

      })
      .catch((error) => {
        GlobalState.loginStatus = -1
        this.setState({
          isLoading: false,
        });
        // this.refs.toast.showBottom(error);
      })
      .done();

  }

  requestLoginGoogle(p_email, p_id, p_profile_image) {
    this.setState({
      isLoading: true,
    });
    return fetch(Net.auth.loginGoogle, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: p_email,
        id: p_id,
        profile_image: p_profile_image,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false
        });
        if (responseJson.result_code < 0) {
          // 로그인 실패했으면 토큰값 초기화
          global.login_info = {
            token: ""
          }
          GlobalState.loginStatus = -1
          return;
        } else {
          global.login_info = responseJson.result_data.login_user;
          global.setting = responseJson.result_data.setting;
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.login_info, JSON.stringify(responseJson.result_data.login_user));
          AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.setting, JSON.stringify(responseJson.result_data.setting));

          GlobalState.loginStatus = 1
        }

      })
      .catch((error) => {
        GlobalState.loginStatus = -1
        this.setState({
          isLoading: false,
        });
      })
      .done();
  }

}
export default (observer(App))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    backgroundColor: "red",
    height: Constants.statusBarHeight
  }
});
