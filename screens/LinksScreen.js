import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import { MyAppText } from '../components/Texts/MyAppText';
import MyStyles from '../constants/MyStyles';
// import ModalDropdown from './ModalDropdown';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export default class MyCarousel extends Component {

  constructor(props) {
    super(props)

    this.state = {
      entries: [1, 2, 3, 4, 5],
      activeSlide: 3,
    }
  }

  _renderItem({ item, index }) {
    return (
      <TouchableOpacity style={{height:50, backgroundColor:"red"}} onPress={() => alert("OK")}>
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }

  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    return (
      <View>
        <Carousel
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={200}
          itemWidth={200}
          autoplay={true}
          loop={true}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
        {this.pagination}
      </View>
    );
  }
}