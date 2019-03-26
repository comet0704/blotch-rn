import React, { Component } from 'react';
import { View, AppState, Text } from 'react-native';
import { NavigationEvents } from 'react-navigation';

export default class AppStateExample extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <View>
         <NavigationEvents
          onWillFocus={payload => {
            console.log("will focus", payload);
          }}
        />
        <Text>Current state is: {this.state.appState}</Text>
      </View>);
  }
}