import { StyleSheet } from 'react-native'
import Colors from './Colors';
import { randomUI04 } from 'uuid-js';

export default StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  padding_main: {
    padding: 15,
  },
  bg_white: {
    backgroundColor: "white"
  },
  h_auto: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  bg_f8f8f8: {
    backgroundColor: "#f8f8f8",
  },
  loginBg: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },

  warningText: {
    color: "#f33f5b",
    fontSize: 12,
    marginTop: 5,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    marginLeft: 5,
  },
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#e3e5e4',
    height: 40,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  shadow_2: {
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    elevation: 2,
    // background color must be set
    backgroundColor: "white" // invisible color,
  },
  shadow_1: {
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    elevation: 1,
    // background color must be set
    backgroundColor: "white" // invisible color,
  },
  background_image: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },
  seperate_line_white: {
    height: 0.5,
    backgroundColor: "white"
  },
  seperate_line_e5e5e5: {
    height: 0.5,
    backgroundColor: "#e5e5e5"
  },
  text_20: {
    color: "black", fontSize: 20, fontWeight: "500"
  },
  heart: {
    width: 17.7,
    height: 15
  },
  banner_control: {
    width: 7.7,
    height: 14,
  },
  ic_heart_gray: {
    width: 52 / 3,
    height: 43 / 3,
  },
  ic_eye: {
    width: 55 / 3,
    height: 43 / 3,
  },
  ic_heart_button: {
    width: 94 / 3,
    height: 94 / 3,
  },
  link: {
    color: "#3879d2",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  ic_avatar1: {
    width: 82 / 3,
    height: 82 / 3,
    borderRadius: 82 / 3 / 2,
  },
  ic_report_big: {
    width: 71 / 3,
    height: 96 / 3,
  },
  purple_btn_r3: {
    justifyContent: "center",
    backgroundColor: "#a695fe",
    alignItems: "center",
    borderRadius: 3,
  },
  purple_bg_text_12: {
    justifyContent: "center",
    backgroundColor: "#a695fe",
    alignItems: "center",
    borderRadius: 2,
    textAlign: "center",
    paddingLeft: 7,
    paddingRight: 7,
    color: "white",
    fontSize: 12,
  },
  text_date: {
    fontSize: 13,
    color: Colors.color_bfbfbf,
  },
  ic_comment: {
    width: 42 / 3,
    height: 38 / 3,
  },
  ic_report_gray: {
    width: 33 / 3,
    height: 36 / 3,
  },
  ic_reply_mark: {
    width: 41 / 3,
    height: 41 / 3,
  },
  ic_delete: {
    width: 30 / 3,
    height: 39 / 3,
  },
  border_bottom_e5e5e5: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  comment_item: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "white"
  },


  btn_primary_cover: {
    flex: 1,
    borderRadius: 5,
    height: 45,
    backgroundColor: "#a695fe",
    justifyContent: "center",
  },

  btn_primary: {
    color: "white",
    fontSize: 13,
    justifyContent: "center",
    textAlign: "center",
  },

  btn_primary_white_cover: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    height: 45,
    borderColor: "#a695fe",
    justifyContent: "center",
  },

  btn_primary_white: {
    color: "#a695fe",
    fontSize: 13,
    justifyContent: "center",
    textAlign: "center",
  },

  modal_bg: {
    paddingLeft: 35,
    paddingRight: 35,
    backgroundColor: "#0000009d",
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },

  text_header1: {
    marginTop: 10,
    fontSize: 30,
    color: "black",
  },

  text_desc: {
    fontSize: 13,
    marginTop: 10,
    color: "#949292",
  },

  profile_box: {
    marginTop: 30,
    alignItems: "center",
    borderColor: "#ededed",
    borderWidth: 2,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignSelf: "center",
    justifyContent: "center",
  },

  camera_box: {
    backgroundColor: "white",
    borderColor: "#ededed",
    borderWidth: 2,
    width: 23,
    height: 23,
    borderRadius: 11.5,
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    zIndex: 1,
  },

  inputBox: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#e3e5e4",
    marginTop: 20,
    justifyContent: "center"
  },
  ic_arrow_up: {
    width: 37 / 3,
    height: 22 / 3,
  },
});