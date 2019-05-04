import React from 'react';
import {
  Text, View, TouchableHighlight, TouchableOpacity, Image,
  PanResponder, // we want to bring in the PanResponder system
  Animated // we wil be using animated value
} from 'react-native';
import { StyleSheet } from 'react-native'
import { Notifications, Permissions } from 'expo';
import ModalDropdown from 'react-native-modal-dropdown'
import Colors from '../constants/Colors';
import Draggable from 'react-native-draggable';
export default class CameraExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    };
  }
  componentDidMount() {
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
        Animated.spring(
          this.state.scale,
          { toValue: 1.1, friction: 3 }
        ).start();
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),

      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        Animated.spring(this.state.scale, { toValue: 1, friction: 3 }).start();
      }
    });
  }

  render() {
    // Destructure the value of pan from the state
    let { scale, pan } = this.state;

    // Calculate the x and y transform from the pan value
    let [translateX, translateY] = [pan.x, pan.y];


    let rotate = '0deg';

    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = { transform: [{ translateX }, { translateY }, { rotate }, { scale }] };

    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "red" }} >
        <Animated.View style={imageStyle} {...this._panResponder.panHandlers} onPress={() => {alert("A");}}>
          <TouchableOpacity style={{ width: 100, height: 100, backgroundColor: Colors.primary_purple }}>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}