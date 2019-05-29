import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
  Text,
  Image,
  View,
} from 'react-native';
import { StatusBar } from 'react-native';

import { MyAppText } from '../../components/Texts/MyAppText';
import MyStyles from '../../constants/MyStyles';
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import Colors from '../../constants/Colors';
import MyConstants from '../../constants/MyConstants';
// import ModalDropdown from './ModalDropdown';
export default class TutorialScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLastPage: false,
      activeDotIndex : 0,
    };

    this.tutorialList = [
      require('../../assets/images/Tutorial/ic_tutorial1.png'),
      require('../../assets/images/Tutorial/ic_tutorial2.png'),
      require('../../assets/images/Tutorial/ic_tutorial3.png'),
      require('../../assets/images/Tutorial/ic_tutorial4.png'),
      require('../../assets/images/Tutorial/ic_tutorial5.png'),
      require('../../assets/images/Tutorial/ic_tutorial6.png'),
    ]
  }

  componentDidMount() {
    StatusBar.setHidden(true)
    AsyncStorage.setItem(MyConstants.ASYNC_PARAMS.is_tutorial_shown, "true");
  }

  componentWillUnmount() {
    StatusBar.setHidden(false)
  }

  renderTutorialImages = ({item, index}) => {
    return (
      <View key={index} style={{ width: "100%", height: "100%", }}>
        <Image source={item} style={{ width: "100%", height: "100%", resizeMode: "stretch" }} />
      </View>
    );
  }

  ScreenWidth = Dimensions.get('window').width;
  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Carousel
          data={this.tutorialList}
          sliderWidth={this.ScreenWidth}
          itemWidth={this.ScreenWidth}
          renderItem={this.renderTutorialImages}
          autoplay={false}
          loop={false}
          autoplayInterval={2000}
          onSnapToItem={(index) => this.setState({ activeDotIndex: index })}
          ref={(carousel) => { this.carouselIndicator = carousel }}
        />
        <MyPagination list={this.tutorialList} activeDotIndex={this.state.activeDotIndex} />
        {/* <Carousel
          animate={true} // Enable carousel autoplay
          delay={50000} // animate를 false로 줘도 _animateNextPage 가 호출되면 true로 바뀌므로 delay값을 길게 주자. 
          indicatorColor={Colors.primary_purple}
          inactiveIndicatorColor="#ffffff38"
          indicatorOffset={13} // Indicator relative position from top or bottom
          loop={false}
          onPageChange={(index) => {
            if (index == 5) { // 마지막 페이지
              this.setState({ isLastPage: true })
            }
          }}
          ref={(carousel) => { this.carouselIndicator = carousel }}
        >
          {this.tutorialList.map((item, index) => this.renderTutorialImages(item, index))}
        </Carousel> */}

        <View style={{ position: "absolute", flexDirection: "row", bottom: 112 / 3, alignItems: "center" }}>
          <MyAppText style={{ fontSize: 14, color: "white", marginLeft: 15 }} onPress={() => {
            this.props.navigation.goBack();
          }}
          >SKIP</MyAppText>
          <View style={{ flex: 1 }} />

          {this.state.isLastPage ?
            <MyAppText style={{ fontSize: 14, color: "white", marginRight: 15 }} onPress={() => {
              this.props.navigation.goBack();
            }}>FINISH</MyAppText>
            :
            <MyAppText style={{ fontSize: 14, color: "white", marginRight: 15 }} onPress={() => {
              this.carouselIndicator.snapToNext();
            }}>NEXT</MyAppText>
          }
        </View>
      </View>

    );
  }
}
