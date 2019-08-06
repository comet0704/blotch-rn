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
                    BackHandler.exitApp()
                    global.isExited =  true
                    _this.props.navigation.navigate("Splash");
                    return true
                }
            },
        ],
        { cancelable: false },
    );
};
export { exitAlert };