/*Example of Recat Native Loading Spinner Overlay*/
import * as React from 'react';
import { Text,AsyncStorage, View, StyleSheet, Button } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
 
export default class App extends React.Component {
  state = {
    //default loading false
    loading: false,
  };
  componentDidMount() {
    AsyncStorage.setItem("a", "1");
    //Setting a timer to show the spinner demo in every 3 second
    // setInterval(() => {
    //   this.setState({
    //     //change the state of the laoding in every 3 second
    //     loading: !this.state.loading,
    //   });
    // }, 3000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner 
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={{ textAlign: 'center', fontSize: 20 }}>
          Spinner Overlay Example
        </Text>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
