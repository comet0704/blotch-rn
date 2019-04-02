import MyConstants from "../constants/MyConstants";
import MyStyles from "../constants/MyStyles";

export default {
  getImageUrl(image_list) {
    return MyConstants.UPLOAD_SERVER_URL + "/" + image_list.split(this.IMAGE_SPLITTER)[0]
  },
  scrollIsCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  },

  getRandomColor() {
    var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    return ColorCode
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
  IMAGE_SPLITTER:"###",
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


  categoryItems2: [
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
  ]
}

