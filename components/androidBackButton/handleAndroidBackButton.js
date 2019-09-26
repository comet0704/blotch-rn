// packages
import { BackHandler } from 'react-native';
/**
 * Attaches an event listener that handles the android-only hardware
 * back button
 * @param  {Function} callback The function to call on click
 */
const handleAndroidBackButton = (_this, callback) => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (_this.props.navigation.isFocused()) {
      callback(_this);
      return true;
    }
  });
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => { });
}
export { handleAndroidBackButton, removeAndroidBackButtonHandler };
