import MyConstants from "../constants/MyConstants";

export default {
    upload : {
        image: {
            user: MyConstants.UPLOAD_SERVER_URL + "/upload/image/user",
        }
    },
    auth : {
        login: MyConstants.SERVER_URL + "/auth/login",
        register: MyConstants.SERVER_URL + "/auth/register",
        forgotPassword: MyConstants.SERVER_URL + "/auth/forgotPassword",
    },
    home : {
        homeList: MyConstants.SERVER_URL + "/home/homeList",
        faqCategory: MyConstants.SERVER_URL + "/home/faqCategory",
        faqList: MyConstants.SERVER_URL + "/home/faqList",
    },
    article : {
        list: MyConstants.SERVER_URL + "/article/list",
        detail: MyConstants.SERVER_URL + "/article/detail",
        commentList: MyConstants.SERVER_URL + "/article/commentList",
        postComment: MyConstants.SERVER_URL + "/article/postComment",
    },
    banner : {
        detail: MyConstants.SERVER_URL + "/banner/detail",
        commentList: MyConstants.SERVER_URL + "/banner/commentList",
        postComment: MyConstants.SERVER_URL + "/banner/postComment",
        list2: MyConstants.SERVER_URL + "/banner/list2",
    },
    product : {
        newList: MyConstants.SERVER_URL + "/product/newList",        
        like: MyConstants.SERVER_URL + "/product/like",        
        unlike: MyConstants.SERVER_URL + "/product/unlike",        
        detail: MyConstants.SERVER_URL + "/product/detail",        
        ingredientList: MyConstants.SERVER_URL + "/product/ingredientList",        
        commentList: MyConstants.SERVER_URL + "/product/commentList",
        postComment: MyConstants.SERVER_URL + "/product/postComment",        
    },
    ingredient : {
        userIngredientList: MyConstants.SERVER_URL + "/ingredient/userIngredientList",               
        myList: MyConstants.SERVER_URL + "/ingredient/myList",               
        deleteUserIngredient: MyConstants.SERVER_URL + "/ingredient/deleteUserIngredient",               
        potentialAllergenProductList: MyConstants.SERVER_URL + "/ingredient/potentialAllergenProductList",               
        searchIngredient: MyConstants.SERVER_URL + "/ingredient/search",               
        addUserIngredient: MyConstants.SERVER_URL + "/ingredient/addUserIngredient",               
    },
};
