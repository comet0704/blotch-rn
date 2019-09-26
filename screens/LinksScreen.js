import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { MyPagination } from '../components/MyPagination';


export default class MyCarousel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      entries: [1, 2, 3, 4, 5],
      activeSlide: 3,
    }
    this.testData = "this testData displayes 'undefined'"
  }
  onTestPress = () => {
    alert("this is not called");
  }
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ height: 50, backgroundColor: "red", borderRadius: 30, }} onPress={() => this.onTestPress()}>
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={{ width: 300 }}>
        <Carousel
          inactiveSlideScale={1}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={300}
          itemWidth={280}
          autoplay={true}
          loop={true}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
        <MyPagination list={this.state.entries} activeDotIndex={this.state.activeSlide} />
      </View>
    );
  }
  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 1)', marginTop: -30 }}
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
}