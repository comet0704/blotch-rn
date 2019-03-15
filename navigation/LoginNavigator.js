import React from 'react';
import { createStackNavigator, StackNavigator, createAppContainer} from 'react-navigation';
import { LoginScreen, SignupScreen} from "../screens/Login/"

const LoginNavigator = createStackNavigator({
  LoginScreen: { screen: LoginScreen },
  SignupScreen: { screen: SignupScreen }
});

export default createAppContainer(LoginNavigator);