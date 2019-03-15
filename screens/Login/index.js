import { Navigation } from 'react-native-navigation'
import SignupScreen from './SignupScreen';

export function registerScreens() {
    Navigation.registerComponent("youdomack.SignupScreen", () => SignupScreen);
}