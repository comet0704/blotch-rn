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
  IMAGE_SPLITTER:"###",
  categoryItems: [
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