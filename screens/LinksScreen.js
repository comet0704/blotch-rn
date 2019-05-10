import MovableView from 'react-native-movable-view'
import React, { Component } from 'react';
import Draggable from 'react-native-draggable';

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import { SwipeRow } from 'react-native-swipe-list-view';

const window = Dimensions.get('window');


const data = {
  0: {
    image: 'https://placekitten.com/200/240',
    text: 'Chloe',
  },
  1: {
    image: 'https://placekitten.com/200/201',
    text: 'Jasper',
  },
  2: {
    image: 'https://placekitten.com/200/202',
    text: 'Pepper',
  },
  3: {
    image: 'https://placekitten.com/200/203',
    text: 'Oscar',
  },
  4: {
    image: 'https://placekitten.com/200/204',
    text: 'Dusty',
  },
  5: {
    image: 'https://placekitten.com/200/205',
    text: 'Spooky',
  },
  6: {
    image: 'https://placekitten.com/200/210',
    text: 'Kiki',
  },
  7: {
    image: 'https://placekitten.com/200/215',
    text: 'Smokey',
  },
  8: {
    image: 'https://placekitten.com/200/220',
    text: 'Gizmo',
  },
  9: {
    image: 'https://placekitten.com/220/239',
    text: 'Kitty',
  },
};

export default class Basic extends Component {
  state = {
    disabled: true,
  }
  render() {
    return (
      <View style={styles.container}>
        <MovableView
          style={{ marginTop: 200, marginLeft: 50 }}
          ref={ref => this.move = ref}
          onMove={values => console.warn(values)}
          disabled={this.state.disabled}
          onDragEnd={() => { this.move.changeDisableStatus(); this.setState({ disabled: true }) }}
        >
          <TouchableOpacity
            onLongPress={() => { console.log("onLongpress"); this.move.changeDisableStatus(), this.setState({ disabled: false }) }}
            style={{
              width: 60, height: 60,
              backgroundColor: 'red',
              borderRadius: 30,
              transform: this.state.disabled ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [{ scaleX: 1 }, { scaleY: 1 }]
            }}
          />
        </MovableView>
        <TouchableOpacity onPress={() => { this.setState({ disabled: true }) }}>

          <Text style={styles.title}>React Native Sortable List</Text>
        </TouchableOpacity>

        {/* <SortableList
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          data={data}
          renderRow={this._renderRow}
          manuallyActivateRows
        /> */}
      </View >
    );
  }

  _renderRow = ({ data, active }) => {
    return <Row data={data} active={active} />
  }
}

class Row extends Component {

  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const { data, active } = this.props;

    return (
      <SwipeRow
        rowKey={3}
        style={{ marginBottom: 15 }}
        disableRightSwipe={true}
        onRowOpen={(rowId) => {
          // rowId 가 s10, s11, s12 ... s199 형식으로 들어오므로 실제 순서는 앞 두글자 없애서 계싼함
          // alert(JSON.stringify(data));
        }}
        onRowClose={(rowId) => {
          // rowId 가 s10, s11, s12 ... s199 형식으로 들어오므로 실제 순서는 앞 두글자 없애서 계싼함
          // alert(rowId);
        }}
        rightOpenValue={-180 / 3}>

        <View style={{ flex: 1, width: window.width, height: 86 }} />
        <Animated.View style={[
          styles.row,
          this._style,
        ]}>
          <TouchableOpacity onLongPress={this.props.toggleRowActive}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 16,
              height: 80,
              flex: 1,
              marginTop: 7,
              marginBottom: 12,
              borderRadius: 4,


              ...Platform.select({
                ios: {
                  width: window.width - 40 * 2,
                  shadowColor: 'rgba(0,0,0,0.2)',
                  shadowOpacity: 1,
                  shadowOffset: { height: 2, width: 2 },
                  shadowRadius: 2,
                },

                android: {
                  width: window.width - 40 * 2,
                  elevation: 0,
                  marginHorizontal: 30,
                },
              })
            }}
          >
            <Image source={{ uri: data.image }} style={styles.image} />
            <Text style={styles.text}>{data.text}</Text>
          </TouchableOpacity>
        </Animated.View>

      </SwipeRow>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },

  list: {
    flex: 1,
  },

  contentContainer: {
    width: window.width,

    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },

      android: {
        paddingHorizontal: 0,
      }
    })
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    height: 80,
    flex: 1,
    marginTop: 7,
    marginBottom: 12,
    borderRadius: 4,


    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },

      android: {
        width: window.width - 30 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    })
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 24,
    color: '#222222',
  },
});