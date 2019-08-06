import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SplashScreen from '../screens/Login/SplashScreen';
import MainTabNavigator1 from './MainTabNavigator1';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator1,
  Splash: SplashScreen,
}));