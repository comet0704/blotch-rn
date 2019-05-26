import React, { Component } from 'react';
import Common from '../../assets/Common';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { ImagePicker } from 'expo';
import { TopbarWithBlackBack } from '../../components/Topbars/TopbarWithBlackBack';
import MyStyles from '../../constants/MyStyles'
import Net from '../../Net/Net';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-whc-toast';
import MyConstants from '../../constants/MyConstants';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Colors from '../../constants/Colors';
import { MyAppText } from '../../components/Texts/MyAppText';
import ModalDropdown from 'react-native-modal-dropdown'

export default class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      originalMarkedDates: {
        // '2019-04-14': { selected: true, marked: true, selectedColor: 'red' }
      },
      selectedDate: ""
    };

    this.yearList = []
    this.monthList = [
      { num: "01", txt: "January" },
      { num: "02", txt: "February" },
      { num: "03", txt: "March" },
      { num: "04", txt: "April" },
      { num: "05", txt: "May" },
      { num: "06", txt: "June" },
      { num: "07", txt: "July" },
      { num: "08", txt: "August" },
      { num: "09", txt: "September" },
      { num: "10", txt: "October" },
      { num: "11", txt: "November" },
      { num: "12", txt: "December" },
    ]
    //yearList 초기화 
    for (i = 1970; i <= 2050; i++) {
      this.yearList.push({ num: i, txt: i })
    }
    this.state.selectedDate = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.selectedDate)
    if (this.state.selectedDate == null || this.state.selectedDate.length < 1) {
      this.state.selectedDate = Common.convertDate(new Date())
    } else { // 본래 선택되었던 날짜가 있으면 마크해준다.
      this.state.originalMarkedDates = {
        [this.state.selectedDate.substring(0, 10)]:
          { selected: true, selectedTextColor: 'red' }
      }
    }
    console.log("1111111:" + this.state.selectedDate);
    this.defaultMonth = this.monthList[this.monthList.findIndex(item => item.num == this.state.selectedDate.substring(5, 7))].txt
    this.defaultYear = this.yearList[this.yearList.findIndex(item => item.num == this.state.selectedDate.substring(0, 4))].txt
    this.isFromQuestionnaire = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.isFromQuestionnaire)
  }

  onDaySelect = null;
  componentDidMount() {
    this.onDaySelect = this.props.navigation.getParam(MyConstants.NAVIGATION_PARAMS.onDaySelect)
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.isLoading}
          //Text with the Spinner 
          textContent={MyConstants.Loading_text}
          //Text style of the Spinner Text
          textStyle={MyStyles.spinnerTextStyle}
        />
        <Toast ref='toast' />

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled   /*keyboardVerticalOffset={100}*/>

          <TopbarWithBlackBack onPress={() => { this.props.navigation.goBack() }}></TopbarWithBlackBack>
          {/* <ScrollView style={{ flex: 1, flexDirection: 'column' }} keyboardDismissMode="on-drag" > */}

          {this.isFromQuestionnaire ? null :
            <View style={[MyStyles.container]}>
              <MyAppText style={MyStyles.text_header1}>Product Usage{"\n"}Date Registration</MyAppText>
              <MyAppText style={MyStyles.text_desc}>Check the validity period by registering the date of use.</MyAppText>
            </View>
          }
          <View style={[{ marginTop: 20 }]} />

          <View style={[{ flexDirection: "row", marginTop: 0, width: "100%" }, MyStyles.container]}>
            <View style={[MyStyles.border_bottom_e5e5e5, { flex: 1, marginRight: 30 / 6, }]}>
              <MyAppText style={{ fontSize: 13, color: "#e4e6e5", fontWeight: "400" }}>Month</MyAppText>
              <View style={{ width: "100%", justifyContent: "center" }}>
                <ModalDropdown
                  style={[MyStyles.dropdown_date]}
                  defaultIndex={11}
                  defaultValue={this.defaultMonth}
                  textStyle={MyStyles.dropdown_date_text}
                  dropdownStyle={MyStyles.dropdown_date_dropdown}
                  options={this.monthList}
                  renderButtonText={(rowData) => rowData.txt}
                  renderRow={Common._dropdown_date_renderRow.bind(this)}
                  onSelect={(idx, rowData) => {
                    const nowDate = this.state.selectedDate.replace(this.state.selectedDate.substring(4, 8), "-" + rowData.num + "-")
                    this.setState({ selectedDate: nowDate })
                  }}
                  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => Common._dropdown_date_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />
                <MyAppText style={{ position: "absolute", right: 20 / 3, fontSize: 15, fontWeight: "500", color: Colors.color_949191 }}>▾</MyAppText>
              </View>
            </View>
            <View style={[MyStyles.border_bottom_e5e5e5, { flex: 1, marginLeft: 30 / 6, }]}>
              <MyAppText style={{ fontSize: 13, color: "#e4e6e5", fontWeight: "400" }}>Year</MyAppText>
              <View style={{ width: "100%", justifyContent: "center" }}>
                <ModalDropdown
                  style={[MyStyles.dropdown_date]}
                  defaultIndex={11}
                  defaultValue={this.defaultYear}
                  textStyle={MyStyles.dropdown_date_text}
                  dropdownStyle={MyStyles.dropdown_date_dropdown}
                  options={this.yearList}
                  renderButtonText={(rowData) => rowData.txt}
                  renderRow={Common._dropdown_date_renderRow.bind(this)}
                  onSelect={(idx, rowData) => {
                    const nowDate = this.state.selectedDate.replace(this.state.selectedDate.substring(0, 4), rowData.num)
                    this.setState({ selectedDate: nowDate })
                  }}
                  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => Common._dropdown_date_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />
                <MyAppText style={{ position: "absolute", right: 20 / 3, fontSize: 15, fontWeight: "500", color: Colors.color_949191 }}>▾</MyAppText>
              </View>
            </View>
          </View>

          <View style={[MyStyles.seperate_line_e5e5e5, { height: 1, marginLeft: 15, marginTop: 72 / 3, marginBottom: 80 / 3 }]} />

          {/* sunday 색상 변경 : 모듈수정
            https://github.com/wix/react-native-calendars/issues/73
           */}
          <CalendarList
            current={this.state.selectedDate}
            onVisibleMonthsChange={(months) => {
              console.log('now these months are visible', months);
            }}
            onDayPress={(day) => {
              console.log(day);
              this.props.navigation.goBack();
              this.onDaySelect(day);
            }}
            markedDates={this.state.originalMarkedDates}
            pastScrollRange={1500}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={1500}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}
          />
        </KeyboardAvoidingView>

      </View >
    );
  }
}