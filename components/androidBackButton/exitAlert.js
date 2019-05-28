// packages
import { Alert, BackHandler } from 'react-native';
const exitAlert = (_this) => {
    Alert.alert(
        'Confirm exit',
        'Do you want to quit the app',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    _this.props.navigation.pop(-1)
                    BackHandler.exitApp()
                    return true
                }
            },
        ],
        { cancelable: false },
    );
};
export { exitAlert };