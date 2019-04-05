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
  padding_h_main: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  margin_h_main: {
    marginLeft: 15,
    marginRight: 15,
  },
  padding_v_main: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  padding_v_25: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  padding_v_5: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  padding_h_5: {
    paddingLeft: 5,
    paddingRight: 5,
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
    shadowColor: '#3a3a3a',
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
    shadowColor: '#3a3a3a',
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
  text_normal: {
    color: "#949191", fontSize: 13
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
  ic_eye_big: {
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

  modal_bg1: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#0000009d",
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },
  modal_header: {
    flexDirection: "row", alignItems: "center", width: "100%", height: 50
  },
  modal_title: {
    flex: 1, textAlign: "center", fontWeight: "bold", position: "absolute", width: "100%",
    fontSize: 16,
  },
  modal_close_btn: {
    alignSelf: "flex-end", padding: 15
  },

  modalContainer: {
    backgroundColor: "white", borderRadius: 20, justifyContent: "center", overflow: "hidden",
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
  gridView: {
    flex: 1,
  },
  productItemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    aspectRatio: 1,
  },
  productName: {
    fontSize: 13,
    color: Colors.primary_dark,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: "center",
  },
  productBrand: {
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
    color: '#c2c1c1',
  },
  ic_skin_care: {
    width: 68 / 3,
    height: 84 / 3,
  },
  ic_skin_care_small: {
    width: 43 / 3,
    height: 52 / 3,
  },
  ic_mask: {
    width: 78 / 3,
    height: 84 / 3,
  },
  ic_mask_small: {
    width: 48 / 3,
    height: 52 / 3,
  },
  ic_sun_care: {
    width: 43 / 3,
    height: 84 / 3,
  },
  ic_sun_care_small: {
    width: 27 / 3,
    height: 52 / 3,
  },
  ic_make_up: {
    width: 66 / 3,
    height: 85 / 3,
  },
  ic_make_up_small: {
    width: 40 / 3,
    height: 52 / 3,
  },
  ic_cleansing: {
    width: 61 / 3,
    height: 84 / 3,
  },
  ic_cleansing_small: {
    width: 39 / 3,
    height: 52 / 3,
  },
  ic_body: {
    width: 99 / 3,
    height: 84 / 3,
  },
  ic_body_small: {
    width: 60 / 3,
    height: 52 / 3,
  },
  ic_hair: {
    width: 51 / 3,
    height: 84 / 3,
  },
  ic_hair_small: {
    width: 61 / 3,
    height: 52 / 3,
  },
  ic_nail: {
    width: 61 / 3,
    height: 84 / 3,
  },
  ic_nail_small: {
    width: 31 / 3,
    height: 52 / 3,
  },
  ic_perfume: {
    width: 69 / 3,
    height: 84 / 3,
  },
  ic_perfume_small: {
    width: 38 / 3,
    height: 52 / 3,
  },
  ic_oral: {
    width: 69 / 3,
    height: 84 / 3,
  },
  ic_oral_small: {
    width: 41 / 3,
    height: 52 / 3,
  },
  ic_baby: {
    width: 69 / 3,
    height: 84 / 3,
  },
  ic_baby_small: {
    width: 24 / 3,
    height: 52 / 3,
  },
  ic_men: {
    width: 69 / 3,
    height: 84 / 3,
  },
  ic_men_small: {
    width: 44 / 3,
    height: 52 / 3,
  },
  ic_all: {
    width: 40 / 3,
    height: 28 / 3,
  },
  baby_container: {
    backgroundColor: "white",
    borderColor: "#e3e5e4",
    borderWidth: 1,
    borderRadius: 180 / 6,
    width: 180 / 3,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  baby_container_selected: {
    backgroundColor: "white",
    borderColor: "#e3e5e4",
    borderWidth: 1,
    borderRadius: 240 / 6,
    width: 240 / 3,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  baby_text: {
    fontSize: 13,
    color: Colors.color_949191,
    textAlign: "center",
  },

  baby_text_selected: {
    fontSize: 15,
    color: Colors.color_white,
    textAlign: "center",
  },

  category_image_container: {
    backgroundColor: "white",
    borderColor: "#e3e5e4",
    borderWidth: 1,
    borderRadius: 169 / 6,
    width: 169 / 3,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  category_text: {
    fontSize: 13,
    color: Colors.color_949191,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
  },
  category_text1: {
    fontSize: 13,
    color: Colors.color_d8d7d7,
    fontWeight: "400",
    textAlign: "center",
  },
  category_text2: {
    fontSize: 13,
    color: Colors.primary_purple,
    fontWeight: "400",
    textAlign: "center",
  },
  ic_best_ranking: {
    width: 70 / 3,
    height: 102 / 3,
  },
  ic_arrow_down_white_small: {
    width: 16 / 3,
    height: 11 / 3,
  },
  ic_arrow_down_gray_small: {
    width: 27 / 3,
    height: 18 / 3,
  },
  skin_info_container: {
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    aspectRatio: 1,
    flex: 1,
    alignItems: "center"
  },
  ic_filter: {
    width: 51 / 3,
    height: 45 / 3,
  },
  ic_check_small: {
    width: 38 / 3,
    height: 33 / 3,
  },
  ic_search_big: {
    width: 235 / 3,
    height: 258 / 3,
  },
  ic_arrow_right_gray: {
    width: 14 / 3,
    height: 22 / 3,
  },
  tabbar_button_container: {
    height: 145 / 3,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  tabbar_button: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center", borderBottomColor: Colors.primary_purple,
  },
  tabbar_button_selected: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center", borderBottomColor: Colors.primary_purple, borderBottomWidth: 3
  },
  tabbar_text_selected: {
    fontSize: 14,
    color: Colors.primary_dark,
  },
  tabbar_text: {
    fontSize: 14,
    color: Colors.color_dcdedd,
  },
  tabbar_button_container1: {
    height: 115 / 3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  tabbar_button1: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center",
  },
  ingredient_good_button_selected: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.ingredient_good_dark, borderRadius: 5
  },
  ingredient_normal_button_selected: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.ingredient_normal_dark, borderRadius: 5
  },
  ingredient_bad_button_selected: {
    flex: 1, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: Colors.ingredient_bad_dark, borderRadius: 5
  },
  tabbar_text_selected1: {
    fontSize: 13,
    color: Colors.color_white,
  },
  tabbar_text1: {
    fontSize: 14,
    color: Colors.color_dcdedd,
  },
  ingredient_good_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_good_light,
  },
  ingredient_good_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_good_dark,
  },
  ingredient_good_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_good_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_good_dark,
  },
  ingredient_good_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_good_light,
  },

  ingredient_normal_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_normal_light,
  },
  ingredient_normal_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_normal_dark,
  },
  ingredient_normal_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_normal_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_normal_dark,
  },
  ingredient_normal_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_bad_light,
  },

  ingredient_bad_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_bad_light,
  },
  ingredient_bad_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_bad_dark,
  },
  ingredient_bad_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_bad_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_bad_dark,
  },
  ingredient_bad_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_bad_light,
  },


  ingredient_allergic_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_allergic_light,
  },
  ingredient_allergic_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_allergic_dark,
  },
  ingredient_allergic_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_allergic_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_allergic_dark,
  },
  ingredient_allergic_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_allergic_light,
  },

  ingredient_potential_allergen_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_potential_allergen_light,
  },
  ingredient_potential_allergen_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_potential_allergen_dark,
  },
  ingredient_potential_allergen_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_potential_allergen_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_potential_allergen_dark,
  },
  ingredient_potential_allergen_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_potential_allergen_light,
  },

  ingredient_preferred_container: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_preferred_light,
  },
  ingredient_preferred_text: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_preferred_dark,
  },
  ingredient_preferred_content_text: {
    color: Colors.color_949191, fontSize: 13,
    padding: 15,
  },
  ingredient_preferred_container_selected: {
    height: 120 / 3,
    flex: 1,
    marginBottom: 1,
    backgroundColor: Colors.ingredient_preferred_dark,
  },
  ingredient_preferred_text_selected: {
    padding: 10,
    fontSize: 13,
    color: Colors.ingredient_preferred_light,
  },

  purple_round_btn: {
    flexDirection: "row", borderRadius: 20, paddingLeft: 10, paddingRight: 10, backgroundColor: Colors.primary_purple, justifyContent: "center", alignItems: "center"
  },

  ic_match: {
    width: 78 / 3,
    height: 78 / 3,
  },
  ic_blotch: {
    width: 78 / 3,
    height: 78 / 3,
  },
  ic_allergic_ingredient: {
    width: 31 / 3,
    height: 31 / 3,
  },
  ic_potential_allergins: {
    width: 31 / 3,
    height: 31 / 3,
  },
  ic_preferred_ingredient: {
    width: 31 / 3,
    height: 31 / 3,
  },
  ic_blotch_prog: {
    width: 72 / 3,
    height: 72 / 3,
  },
  ic_watch_prog: {
    width: 72 / 3,
    height: 72 / 3,
  },
  ic_match_prog: {
    width: 72 / 3,
    height: 72 / 3,
  },
  ic_save_prog: {
    width: 72 / 3,
    height: 72 / 3,
  },
  ic_gallery: {
    width: 55 / 3,
    height: 52 / 3,
  },
  text_13_primary_dark: {
    fontSize: 13,
    color: Colors.primary_dark,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  ic_allergic_face: {
    width: 89 / 3,
    height: 126 / 3,
  },
  ic_preferred_face: {
    width: 89 / 3,
    height: 126 / 3,
  },
  ic_potential_face: {
    width: 89 / 3,
    height: 89 / 3,
  },
  ic_polygon_down: {
    width: 21 / 3,
    height: 14 / 3,
  },
  ic_polygon_up: {
    width: 21 / 3,
    height: 14 / 3,
  },
  ic_plus_button_purple_round: {
    width: 90 / 3,
    height: 93 / 3,
  },
  ingredient_section: {
    margin: 15, borderLeftWidth: 3,
    borderRadius: 3,
    backgroundColor: Colors.color_white,
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
  ingredient_section_plus_btn: {
    position: "absolute", top: -30, right: 0,
    padding: 15,
  },
  ingredient_section_header: {
    padding: 15,
    flex: 1, flexDirection: "row", alignItems: "center"
  },
  ingredient_section_header_text1: {
    color: Colors.primary_dark, fontSize: 14, fontWeight: "bold"
  },
  ingredient_section_header_text2: {
    color: Colors.color_b28ffe, fontSize: 12, fontWeight: "400"
  },
  ic_white_polygon: {
    width: 68 / 3,
    height: 36 / 3,
  },
  ic_camera_big: {
    width: 160 / 3,
    height: 164 / 3,
  },
  ic_gallery_big: {
    width: 162 / 3,
    height: 165 / 3,
  },
  review_photo: {
    flex: 1, backgroundColor: "transparent", borderWidth: 1, aspectRatio: 1.2, margin: 5,
  },
  ic_toner: {
    width:19/3,
    height:52/3,
  },
  ic_lotion: {
    width:39/3,
    height:52/3,
  },
  ic_cream: {
    width:51/3,
    height:52/3,
  },
  ic_sun_block: {
    width:49/3,
    height:52/3,
  },
  ic_after_care: {
    width:20/3,
    height:52/3,
  },
  ic_base: {
    width:38/3,
    height:52/3,
  },
  ic_eye: {
    width:28/3,
    height:52/3,
  },
  ic_lip: {
    width:33/3,
    height:52/3,
  },
  ic_remover: {
    width:52/3,
    height:52/3,
  },
  ic_cleanser: {
    width:39/3,
    height:52/3,
  },
  ic_peeling: {
    width:30/3,
    height:52/3,
  },
  ic_body_cleanser: {
    width:34/3,
    height:52/3,
  },
  ic_shampoo: {
    width:34/3,
    height:52/3,
  },
  ic_treatment: {
    width:46/3,
    height:52/3,
  },
  ic_essense: {
    width:16/3,
    height:52/3,
  },
  ic_colors: {
    width:16/3,
    height:52/3,
  },
  ic_nail_care: {
    width:45/3,
    height:52/3,
  },
  ic_toothpaste: {
    width:39/3,
    height:52/3,
  },
  backButton: {
    width: 11,
    height: 18,
    marginTop: 20,
  },
  shareBtn: {
    width: 46 / 3,
    height: 53 / 3,
    marginTop: 20,
  },
  searchBoxCover : {
    flex: 1, borderRadius: 20, flexDirection: "row", width: "100%", paddingLeft: 13, paddingRight: 5 
  },
});