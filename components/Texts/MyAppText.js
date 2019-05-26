import React from 'react';
import { Text } from 'react-native';

export class MyAppText extends React.Component {
  render() {
    console.log(this.props.style);
    this.isMedium = false
    this.style = null // this.props.style 에 MyStyles.text_20 이라든가 MyStyles.* 이 들어오면 element를 지울수 없어서 this.style로 변환하여 조작
    if (this.props.hasOwnProperty("style")) {
      if (Array.isArray(this.props.style)) {
        this.style = []
        this.props.style.forEach(element => {
          var obj = {}
          for (var key in element) {
            value = element[key]
            if (key == "fontWeight") {
              if (value == "500" || value == "600" || value == "bold") {
                this.isMedium = true
                console.log("true")
              }
            } else {
              obj[key] = value
            }
          }
          this.style.push(obj)
        })
      } else {
        this.style = {}
        for (var key in this.props.style) {
          value = this.props.style[key]
          if (key == "fontWeight") {
            if (value == "500" || value == "600" || value == "bold") {
              this.isMedium = true
              console.log("true")
            }
          } else {
            this.style[key] = value
          }
        }
      }
    }

    console.log(this.style)


    if (this.isMedium) {
      return <Text {...this.props} style={[this.style, { fontFamily: 'rubik-medium' }]} />;
    } else {
      return <Text {...this.props} style={[this.style, { fontFamily: 'rubik-regular' }]} />;
    }
  }
}
