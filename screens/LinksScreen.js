import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  AppRegistry,
} from 'react-native';
import Carousel from 'react-native-carousel';

// import Carousel from 'react-native-banner-carousel';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 260;

export default class example extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshBanner: true,
      bannerList: [1, 3,]
    }
  }
  componentDidMount() {
    this.setState({ bannerList: [1, 2, 3, 4] })
  }
  renderPage(image, index) {
    return (
      <View key={index} style={{ height: 200 }}>
        <TouchableOpacity onPress={() => { alert(image) }} style={{ backgroundColor: "red" }}>
          <Text style={{ height: 60 }}>{"image"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    // return (
    //   <View style={styles.container}>
    //     <Carousel
    //       autoplay
    //       autoplayTimeout={5000}
    //       loop
    //       index={0}
    //       pageSize={BannerWidth}
    //     >
    //       {this.state.bannerList.map((image, index) => this.renderPage(image, index))}
    //     </Carousel>
    //   </View>
    // );
    return (
      <Carousel width={375}>
        {this.state.bannerList.map((image, index) => this.renderPage(image, index))}
      </Carousel>
    );
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={styles.container}>
          <Button title="alks" onPress={() => {

            this.bannerList = [1, 2, 3, 4]

            this.setState({ refreshBanner: !this.state.refreshBanner })

          }}></Button>
          <View>
            <Text>aaaa</Text>
            <Carousel
              autoplay
              animate={true}
              autoplayTimeout={5000}
              loop
              index={0}
              pageSize={BannerWidth}
            >
              {this.state.bannerList.map((image, index) => this.renderPage(image, index))}
            </Carousel>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 375,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    borderWidth: 2,
    borderColor: '#CCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
