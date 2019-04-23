import MyConstants from "../constants/MyConstants";
import MyStyles from "../constants/MyStyles";

export default {
  getImageUrl(image_list) {
    if (image_list == null) {
      return null;
    }
    return MyConstants.UPLOAD_SERVER_URL + "/" + image_list.split(this.IMAGE_SPLITTER)[0]
  },

  getLinkUrl(p_linkUrl) {
    if (p_linkUrl.indexOf("http://") > -1 || p_linkUrl.indexOf("https://") > -1) {
      return p_linkUrl
    }
    return "http://" + p_linkUrl
  },

  // 남은 사용기간 구하기 : 현재 날짜에서 opend_date를 덜고 그 값을 p_useful_period에서 던 값을 리턴
  // p_opened_date : 2019-03-01
  // p_useful_period : 180
  // 일수가 아니라 달수로 돌려줌.
  getRestUsePeriod(p_opened_date, p_use_period) {
    // opened_date 가 오늘부터 며칠전일가 계싼
    diffDate = this.dateDiff(p_opened_date, new Date())
    returnValue = 0
    if (diffDate > 0) {
      returnValue = p_use_period - diffDate
    } else { // 아직 사용하지 않았으면 유효기간 그대로 돌려줌
      returnValue = p_use_period
    }

    if (returnValue < 0) { // 유효기간이 지났으면 0 돌림.
      returnValue = 0;
    }

    return (returnValue > 30 ? (returnValue / 30).toFixed(1) + "M" : returnValue + "days")
  },

  dateDiff(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth() + 1, diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth() + 1, diffDate_2.getDate());

    var diff = diffDate_2.getTime() - diffDate_1.getTime();
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
  },

  // 생년월일로부터 연령대 계산 예:) 1990-07-04 -> 20's
  getAgeFromBirth(p_birthday) {
    var birthDate = p_birthday instanceof Date ? p_birthday : new Date(p_birthday);
    curDate = new Date()
    var age = Math.abs(curDate.getFullYear() - birthDate.getFullYear())
    age = parseInt(age / 10) * 10
    return age + "'s"
  },

  scrollIsCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  },

  isNeedToAddQuestionnaire() {
    return global.login_info.concern == null || global.login_info.concern.length <= 0 || global.login_info.needs == null || global.login_info.needs.length <= 0;
  },

  // 아이디 카테고리 컬러 돌려줌
  getCategoryColor(index) {
    var ColorCode = 'rgb('
      + Math.min(255, (index * (index + 16) % 256 + (index * 30 % 209))) + ','
      + Math.min(255, (index * (index + 66) % 256 + (index * 30 % 177))) + ','
      + Math.min(255, (index * (index + 98) % 256 + (index * 30 % 98))) + ')';
    console.log(ColorCode);
    return ColorCode
  },

  // 입력 : p_time ( 2019-03-15 10:59:25 )
  // 출력 : Today, Yesterday, 2019-03-15
  getFormattedTime(p_time) {
    curTime = new Date();
    p_year = p_time.substring(0, 4)
    p_month = p_time.substring(5, 7)
    p_day = p_time.substring(8, 10)

    curYear = curTime.getYear() + 1900
    curMonth = curTime.getMonth() + 1
    curDay = curTime.getDate()

    if (curYear == p_year && curMonth == p_month) {
      if (curDay == p_day) {
        return "Today"
      }
      if (curDay == (parseInt(p_day) + 1)) {
        return "Yesterday"
      }
    }

    return p_time.substring(0, 10)
  },
  getCategoryItems() {
    return [
      {
        categoryName: MyConstants.CategoryName.all,
        image_off: require("../assets/images/Categories/ic_all.png"),
        image_on: require("../assets/images/Categories/ic_all_on.png"),
        image_style: MyStyles.ic_all,
        image_style_small: MyStyles.ic_all,
        is_selected: true,
        sub_category: [
        ]
      },
      {
        categoryName: MyConstants.CategoryName.skin_care,
        image_off: require("../assets/images/Categories/ic_skin_care.png"),
        image_on: require("../assets/images/Categories/ic_skin_care_on.png"),
        image_style: MyStyles.ic_skin_care,
        image_style_small: MyStyles.ic_skin_care_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.toner,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.lotion,
            is_selected: false,
          },
          {
            name: MyConstants.SubCategoryname.cream,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.mask,
        image_off: require("../assets/images/Categories/ic_mask.png"),
        image_on: require("../assets/images/Categories/ic_mask_on.png"),
        image_style: MyStyles.ic_mask,
        image_style_small: MyStyles.ic_mask_small,
        is_selected: false,
        sub_category: [
        ]
      },
      {
        categoryName: MyConstants.CategoryName.sun_care,
        image_off: require("../assets/images/Categories/ic_sun_care.png"),
        image_on: require("../assets/images/Categories/ic_sun_care_on.png"),
        image_style: MyStyles.ic_sun_care,
        image_style_small: MyStyles.ic_sun_care_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.sun_block,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.after_care,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.make_up,
        image_off: require("../assets/images/Categories/ic_make_up.png"),
        image_on: require("../assets/images/Categories/ic_make_up_on.png"),
        image_style: MyStyles.ic_make_up,
        image_style_small: MyStyles.ic_make_up_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.base,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.eye,
            is_selected: false,
          },
          {
            name: MyConstants.SubCategoryname.lip,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.cleansing,
        image_off: require("../assets/images/Categories/ic_cleansing.png"),
        image_on: require("../assets/images/Categories/ic_cleansing_on.png"),
        image_style: MyStyles.ic_cleansing,
        image_style_small: MyStyles.ic_cleansing_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.remover,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.cleanser,
            is_selected: false,
          },
          {
            name: MyConstants.SubCategoryname.peeling,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.body,
        image_off: require("../assets/images/Categories/ic_body.png"),
        image_on: require("../assets/images/Categories/ic_body_on.png"),
        image_style: MyStyles.ic_body,
        image_style_small: MyStyles.ic_body_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.cleanser,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.lotion,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.hair,
        image_off: require("../assets/images/Categories/ic_hair.png"),
        image_on: require("../assets/images/Categories/ic_hair_on.png"),
        image_style: MyStyles.ic_hair,
        image_style_small: MyStyles.ic_hair_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.shampoo,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.treatment,
            is_selected: false,
          },
          {
            name: MyConstants.SubCategoryname.essense,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.nail,
        image_off: require("../assets/images/Categories/ic_nail.png"),
        image_on: require("../assets/images/Categories/ic_nail_on.png"),
        image_style: MyStyles.ic_nail,
        image_style_small: MyStyles.ic_nail_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.colors,
            is_selected: true,
          },
          {
            name: MyConstants.SubCategoryname.nail_care,
            is_selected: false,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.perfume,
        image_off: require("../assets/images/Categories/ic_perfume.png"),
        image_on: require("../assets/images/Categories/ic_perfume_on.png"),
        image_style: MyStyles.ic_perfume,
        image_style_small: MyStyles.ic_perfume_small,
        is_selected: false,
        sub_category: [
        ]
      },
      {
        categoryName: MyConstants.CategoryName.oral,
        image_off: require("../assets/images/Categories/ic_oral.png"),
        image_on: require("../assets/images/Categories/ic_oral_on.png"),
        image_style: MyStyles.ic_oral,
        image_style_small: MyStyles.ic_oral_small,
        is_selected: false,
        sub_category: [
          {
            name: MyConstants.SubCategoryname.toothpaste,
            is_selected: true,
          },
        ]
      },
      {
        categoryName: MyConstants.CategoryName.baby,
        image_off: require("../assets/images/Categories/ic_baby.png"),
        image_on: require("../assets/images/Categories/ic_baby_on.png"),
        image_style: MyStyles.ic_baby,
        image_style_small: MyStyles.ic_baby_small,
        is_selected: false,
        sub_category: [
        ]
      },
      {
        categoryName: MyConstants.CategoryName.men,
        image_off: require("../assets/images/Categories/ic_men.png"),
        image_on: require("../assets/images/Categories/ic_men_on.png"),
        image_style: MyStyles.ic_men,
        image_style_small: MyStyles.ic_men_small,
        is_selected: false,
        sub_category: [
        ]
      },
    ];
  },
  IMAGE_SPLITTER: "###",
  SEARCH_KEYWORD_SPLITTER: "###",

  // 메인카테고리의 is_selected 마당)  0 : 선택안함, 1 : 최초 선택시 서브카테고리 선택안됨., 2 : 서브카테고리 1개이상 선택됨.
  categoryItems_recom: [
    {
      categoryName: MyConstants.CategoryName.skin_care,
      image_off: require("../assets/images/Categories/ic_skin_care.png"),
      image_on: require("../assets/images/Categories/ic_skin_care_on.png"),
      image_half: require("../assets/images/Categories/ic_skin_care_half.png"),
      image_style: MyStyles.ic_skin_care,
      image_style_small: MyStyles.ic_skin_care_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.toner,
          image_off: require("../assets/images/Categories/ic_toner.png"),
          image_on: require("../assets/images/Categories/ic_toner_on.png"),
          image_style: MyStyles.ic_toner,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.lotion,
          image_off: require("../assets/images/Categories/ic_lotion.png"),
          image_on: require("../assets/images/Categories/ic_lotion_on.png"),
          image_style: MyStyles.ic_lotion,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.cream,
          image_off: require("../assets/images/Categories/ic_cream.png"),
          image_on: require("../assets/images/Categories/ic_cream_on.png"),
          image_style: MyStyles.ic_cream,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.mask,
      image_off: require("../assets/images/Categories/ic_mask.png"),
      image_on: require("../assets/images/Categories/ic_mask_on.png"),
      image_half: require("../assets/images/Categories/ic_skin_care_half.png"),
      image_style: MyStyles.ic_mask,
      image_style_small: MyStyles.ic_mask_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
      ]
    },
    {
      categoryName: MyConstants.CategoryName.sun_care,
      image_off: require("../assets/images/Categories/ic_sun_care.png"),
      image_on: require("../assets/images/Categories/ic_sun_care_on.png"),
      image_half: require("../assets/images/Categories/ic_sun_care_half.png"),
      image_style: MyStyles.ic_sun_care,
      image_style_small: MyStyles.ic_sun_care_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.sun_block,
          image_off: require("../assets/images/Categories/ic_sun_block.png"),
          image_on: require("../assets/images/Categories/ic_sun_block_on.png"),
          image_style: MyStyles.ic_sun_block,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.after_care,
          image_off: require("../assets/images/Categories/ic_after_care.png"),
          image_on: require("../assets/images/Categories/ic_after_care_on.png"),
          image_style: MyStyles.ic_after_care,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.make_up,
      image_off: require("../assets/images/Categories/ic_make_up.png"),
      image_on: require("../assets/images/Categories/ic_make_up_on.png"),
      image_half: require("../assets/images/Categories/ic_make_up_half.png"),
      image_style: MyStyles.ic_make_up,
      image_style_small: MyStyles.ic_make_up_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.base,
          image_off: require("../assets/images/Categories/ic_base.png"),
          image_on: require("../assets/images/Categories/ic_base_on.png"),
          image_style: MyStyles.ic_base,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.eye,
          image_off: require("../assets/images/Categories/ic_eye.png"),
          image_on: require("../assets/images/Categories/ic_eye_on.png"),
          image_style: MyStyles.ic_eye,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.lip,
          image_off: require("../assets/images/Categories/ic_lip.png"),
          image_on: require("../assets/images/Categories/ic_lip_on.png"),
          image_style: MyStyles.ic_lip,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.cleansing,
      image_off: require("../assets/images/Categories/ic_cleansing.png"),
      image_on: require("../assets/images/Categories/ic_cleansing_on.png"),
      image_half: require("../assets/images/Categories/ic_cleansing_half.png"),
      image_style: MyStyles.ic_cleansing,
      image_style_small: MyStyles.ic_cleansing_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.remover,
          image_off: require("../assets/images/Categories/ic_remover.png"),
          image_on: require("../assets/images/Categories/ic_remover_on.png"),
          image_style: MyStyles.ic_remover,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.cleanser,
          image_off: require("../assets/images/Categories/ic_cleanser.png"),
          image_on: require("../assets/images/Categories/ic_cleanser_on.png"),
          image_style: MyStyles.ic_cleanser,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.peeling,
          image_off: require("../assets/images/Categories/ic_peeling.png"),
          image_on: require("../assets/images/Categories/ic_peeling_on.png"),
          image_style: MyStyles.ic_peeling,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.body,
      image_off: require("../assets/images/Categories/ic_body.png"),
      image_on: require("../assets/images/Categories/ic_body_on.png"),
      image_half: require("../assets/images/Categories/ic_body_half.png"),
      image_style: MyStyles.ic_body,
      image_style_small: MyStyles.ic_body_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.cleanser,
          image_off: require("../assets/images/Categories/ic_body_cleanser.png"),
          image_on: require("../assets/images/Categories/ic_body_cleanser_on.png"),
          image_style: MyStyles.ic_body_cleanser,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.lotion,
          image_off: require("../assets/images/Categories/ic_lotion.png"),
          image_on: require("../assets/images/Categories/ic_lotion_on.png"),
          image_style: MyStyles.ic_lotion,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.hair,
      image_off: require("../assets/images/Categories/ic_hair.png"),
      image_on: require("../assets/images/Categories/ic_hair_on.png"),
      image_half: require("../assets/images/Categories/ic_hair_half.png"),
      image_style: MyStyles.ic_hair,
      image_style_small: MyStyles.ic_hair_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.shampoo,
          image_off: require("../assets/images/Categories/ic_shampoo.png"),
          image_on: require("../assets/images/Categories/ic_shampoo_on.png"),
          image_style: MyStyles.ic_shampoo,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.treatment,
          image_off: require("../assets/images/Categories/ic_treatment.png"),
          image_on: require("../assets/images/Categories/ic_treatment_on.png"),
          image_style: MyStyles.ic_treatment,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.essense,
          image_off: require("../assets/images/Categories/ic_essense.png"),
          image_on: require("../assets/images/Categories/ic_essense_on.png"),
          image_style: MyStyles.ic_essense,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.nail,
      image_off: require("../assets/images/Categories/ic_nail.png"),
      image_on: require("../assets/images/Categories/ic_nail_on.png"),
      image_half: require("../assets/images/Categories/ic_nail_half.png"),
      image_style: MyStyles.ic_nail,
      image_style_small: MyStyles.ic_nail_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.colors,
          image_off: require("../assets/images/Categories/ic_colors.png"),
          image_on: require("../assets/images/Categories/ic_colors_on.png"),
          image_style: MyStyles.ic_colors,
          is_selected: false,
        },
        {
          name: MyConstants.SubCategoryname.nail_care,
          image_off: require("../assets/images/Categories/ic_nail_care.png"),
          image_on: require("../assets/images/Categories/ic_nail_care_on.png"),
          image_style: MyStyles.ic_nail_care,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.perfume,
      image_off: require("../assets/images/Categories/ic_perfume.png"),
      image_on: require("../assets/images/Categories/ic_perfume_on.png"),
      image_half: require("../assets/images/Categories/ic_perfume_half.png"),
      image_style: MyStyles.ic_perfume,
      image_style_small: MyStyles.ic_perfume_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
      ]
    },
    {
      categoryName: MyConstants.CategoryName.oral,
      image_off: require("../assets/images/Categories/ic_oral.png"),
      image_on: require("../assets/images/Categories/ic_oral_on.png"),
      image_half: require("../assets/images/Categories/ic_oral_half.png"),
      image_style: MyStyles.ic_oral,
      image_style_small: MyStyles.ic_oral_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
        {
          name: MyConstants.SubCategoryname.toothpaste,
          image_off: require("../assets/images/Categories/ic_toothpaste.png"),
          image_on: require("../assets/images/Categories/ic_toothpaste_on.png"),
          image_style: MyStyles.ic_toothpaste,
          is_selected: false,
        },
      ]
    },
    {
      categoryName: MyConstants.CategoryName.baby,
      image_off: require("../assets/images/Categories/ic_baby.png"),
      image_on: require("../assets/images/Categories/ic_baby_on.png"),
      image_half: require("../assets/images/Categories/ic_baby_half.png"),
      image_style: MyStyles.ic_baby,
      image_style_small: MyStyles.ic_baby_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
      ]
    },
    {
      categoryName: MyConstants.CategoryName.men,
      image_off: require("../assets/images/Categories/ic_men.png"),
      image_on: require("../assets/images/Categories/ic_men_on.png"),
      image_half: require("../assets/images/Categories/ic_men_half.png"),
      image_style: MyStyles.ic_men,
      image_style_small: MyStyles.ic_men_small,
      is_selected: 0,
      sub_all_selected: false,
      sub_category: [
      ]
    },
  ],

  // We can search it , questionnaire에서 이용
  getSkinTypes() {
    return [
      {
        typeName: MyConstants.SkinTypeName.dry,
        image_off: require("../assets/images/SkinTypes/ic_skin_type_dry_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_skin_type_dry_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.SkinTypeName.oily,
        image_off: require("../assets/images/SkinTypes/ic_skin_type_oily_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_skin_type_oily_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.SkinTypeName.complex,
        image_off: require("../assets/images/SkinTypes/ic_skin_type_complex_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_skin_type_complex_on.png"),
        is_selected: false,
      },
    ]
  },

  // We can search it , questionnaire에서 이용
  getConcernTypes() {
    return [
      {
        typeName: MyConstants.ConcernName.acne,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_acne_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_acne_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.ConcernName.wrinkle,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_wrinkle_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_wrinkle_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.ConcernName.pores,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_pores_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_pores_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.ConcernName.complex,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_complex_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_complex_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.ConcernName.redness,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_redness_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_redness_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.ConcernName.rashes,
        image_off: require("../assets/images/SkinTypes/ic_concern_type_rashes_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_concern_type_rashes_on.png"),
        is_selected: false,
      },
    ]
  },

  // We can search it , questionnaire에서 이용
  getNeedTypes() {
    return [
      {
        typeName: MyConstants.NeedsName.whitening,
        image_off: require("../assets/images/SkinTypes/ic_need_type_whitening_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_need_type_whitening_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.NeedsName.anti_Aging,
        image_off: require("../assets/images/SkinTypes/ic_need_type_anti_aging_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_need_type_anti_aging_on.png"),
        is_selected: false,
      },
      {
        typeName: MyConstants.NeedsName.moisturizing,
        image_off: require("../assets/images/SkinTypes/ic_need_type_anti_moisturizing_off.png"),
        image_on: require("../assets/images/SkinTypes/ic_need_type_anti_moisturizing_on.png"),
        is_selected: false,
      },
    ]
  },

  // questionnaire에서 이용
  getCleansingTypes() {
    return [
      {
        typeName: MyConstants.CleansingName.Soap,
        image_off: require("../assets/images/CleansingTypes/ic_soap.png"),
        image_on: require("../assets/images/CleansingTypes/ic_soap_on.png"),
        image_style: MyStyles.ic_soap,
        is_selected: false,
      },
      {
        typeName: MyConstants.CleansingName.Facial_Cleanser,
        image_off: require("../assets/images/CleansingTypes/ic_facial_cleanser.png"),
        image_on: require("../assets/images/CleansingTypes/ic_facial_cleanser_on.png"),
        image_style: MyStyles.ic_facial_cleanser,
        is_selected: false,
      },
      {
        typeName: MyConstants.CleansingName.Just_Water,
        image_off: require("../assets/images/CleansingTypes/ic_just_water.png"),
        image_on: require("../assets/images/CleansingTypes/ic_just_water_on.png"),
        image_style: MyStyles.ic_just_water,
        is_selected: false,
      },
    ]
  },

  // questionnaire에서 이용
  getCareTypes() {
    return [
      {
        typeName: MyConstants.CareName.Moisturizer,
        image_off: require("../assets/images/CareTypes/ic_moisturizer.png"),
        image_on: require("../assets/images/CareTypes/ic_moisturizer_on.png"),
        image_style: MyStyles.ic_moisturizer,
        is_selected: false,
      },
      {
        typeName: MyConstants.CareName.Toner,
        image_off: require("../assets/images/CareTypes/ic_toner.png"),
        image_on: require("../assets/images/CareTypes/ic_toner_on.png"),
        image_style: MyStyles.ic_toner,
        is_selected: false,
      },
      {
        typeName: MyConstants.CareName.Sunblock,
        image_off: require("../assets/images/CareTypes/ic_sunblock.png"),
        image_on: require("../assets/images/CareTypes/ic_sunblock_on.png"),
        image_style: MyStyles.ic_moisturizer,
        is_selected: false,
      },
      {
        typeName: MyConstants.CareName.Cream,
        image_off: require("../assets/images/CareTypes/ic_cream.png"),
        image_on: require("../assets/images/CareTypes/ic_cream_on.png"),
        image_style: MyStyles.ic_cream,
        is_selected: false,
      },
      {
        typeName: MyConstants.CareName.Eye_Cream,
        image_off: require("../assets/images/CareTypes/ic_eye_cream.png"),
        image_on: require("../assets/images/CareTypes/ic_eye_cream_on.png"),
        image_style: MyStyles.ic_eye_cream,
        is_selected: false,
      },
      {
        typeName: MyConstants.CareName.Lotion,
        image_off: require("../assets/images/CareTypes/ic_lotion.png"),
        image_on: require("../assets/images/CareTypes/ic_lotion_on.png"),
        image_style: MyStyles.ic_moisturizer,
        is_selected: false,
      },
    ]
  },
}

