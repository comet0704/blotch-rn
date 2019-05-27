export default {
  //
  // important
  //
  FACEBOOK_APP_ID: "377170089537556", // 페북 로그인
  ANDROID_CLIENT_ID: "921753193053-0paacaalh9idjhu84p0ssmjmdkqs11m3.apps.googleusercontent.com", // 구글로그인 (android)
  IOS_CLIENT_ID: "921753193053-edfubitfhjom9qjul66c1k50pceukqr8.apps.googleusercontent.com", // 구글로그인 (ios)
  WEATHER_MAP_API_KET: "06999111912d83ff69309736b1e00c4b", // 날씨 api 키

  //
  // 앱내 상수들  
  //
  ITEMS_PER_PAGE: 30,
  TABBAR_HEIGHT: 100 / 3,
  TABBAR_TOP_BORDER_HEIGHT: 96 / 3,
  TOPBAR_HEIGHT: 155 / 3,
  STATUSBAR_HEIGHT: 25,
  SERVER_URL: "http://api.barocomms.com:8002",
  UPLOAD_SERVER_URL: "http://upload.barocomms.com:8002",
  // SERVER_URL: "http://chemi.rsad.kr",
  // UPLOAD_SERVER_URL: "http://upload.rsad.kr",
  SkinTypeName: {
    dry: "Dry",
    oily: "Oily",
    complex: "Complex",
  },
  ConcernName: {
    acne: "Acne",
    wrinkle: "Wrinkle",
    pores: "Pores",
    complex: "Complex",
    redness: "Redness",
    rashes: "Rashes",
  },
  NeedsName: {
    whitening: "Whitening",
    anti_Aging: "Anti-Aging",
    moisturizing: "Moisturizing",
  },
  CleansingName: {
    Soap: "Soap",
    Facial_Cleanser: "Facial Cleanser",
    Just_Water: "Just Water",
  },
  CareName: {
    Moisturizer: "Moisturizer",
    Toner: "Toner",
    Sunblock: "Sunblock",
    Cream: "Cream",
    Eye_Cream: "Eye Cream",
    Lotion: "Lotion",
  },
  CategoryName: {
    all: "",
    skin_care: "Skin care",
    mask: "Mask",
    sun_care: "Sun care",
    make_up: "Make up",
    cleansing: "Cleansing",
    body: "Body",
    hair: "Hair",
    nail: "Nail",
    perfume: "Perfume",
    oral: "Oral",
    baby: "Baby",
    men: "Men",
  },
  SubCategoryname: {
    toner: "Toner",
    lotion: "Lotion",
    cream: "Cream",
    sun_block: "Sun block",
    after_care: "After care",
    base: "Base",
    eye: "Eye",
    lip: "Lip",
    remover: "Remover",
    cleanser: "Cleanser",
    peeling: "Peeling",
    cleanser: "Cleanser",
    lotion: "Lotion",
    shampoo: "Shampoo",
    treatment: "Treatment",
    essense: "Essense",
    colors: "Colors",
    nail_care: "Nail care",
    toothpaste: "Toothpaste",
  },
  Loading_text: "",
  ASYNC_PARAMS: {
    login_info: "LoginInfo",
    read_msgs: "read_msgs",
    settingButtonOffset: "settingButtonOffset",
    setting: "setting",
    recent_search_words: "recent_search_words",
    is_tutorial_shown: "is_tutorial_shown",
    like_list_order: "like_list_order",
    my_list_order: "my_list_order",
    user_pwd: "user_pwd",
  },
  NAVIGATION_PARAMS: {
    item_id: "item_id",
    item_info: "item_info",
    is_from_camera_search: "is_from_camera_search",
    is_from_sign_up: "is_from_sign_up",
    scanned_barcode: "scanned_barcode",
    album_id: "album_id",
    album_title: "album_title",
    deleteFromMyListCallback: "deleteFromMyListCallback",
    back_page: "back_page",
    product_container_initial_page: "product_container_initial_page",
    search_word: "search_word",
    onDaySelect: "onDaySelect",
    selectedDate: "selectedDate",
    isFromQuestionnaire: "isFromQuestionnaire",
    onProfileEdited: "profileEdited",
    questionnaire_skin_type: "questionnaire_skin_type",
    questionnaire_concern: "questionnaire_concern_type",
    questionnaire_needs: "questionnaire_needs",
    onWeCanSearchItCallback: "onWeCanSearchItCallback",
    backCallbackfromSearchResult: "backCallbackfromSearchResult",
  },
  //. FCM 푸시타입
  FCM_TYPES: {
    FCM_TYPE_NORMAL: 0,  //. 일반푸시
    FCM_TYPE_COMMENT: 1,  //. 댓글알림
    FCM_TYPE_CONTACTUS: 2, //. 문의답변알림
    FCM_TYPE_NOTICE: 3,  //. 공지알림
    FCM_TYPE_POINT: 4, //. 포인트변경알림
  }
};
