import MyConstants from "../constants/MyConstants";

export default {
    upload: {
        image: {
            user: MyConstants.UPLOAD_SERVER_URL + "/upload/image/user",
            product: MyConstants.UPLOAD_SERVER_URL + "/upload/image/product",
        }
    },
    auth: {
        login: MyConstants.SERVER_URL + "/auth/login",
        register: MyConstants.SERVER_URL + "/auth/register",
        forgotPassword: MyConstants.SERVER_URL + "/auth/forgotPassword",
        loginGoogle: MyConstants.SERVER_URL + "/auth/loginGoogle",
        loginFacebook: MyConstants.SERVER_URL + "/auth/loginFacebook",
    },
    home: {
        homeList: MyConstants.SERVER_URL + "/home/homeList",
        faqCategory: MyConstants.SERVER_URL + "/home/faqCategory",
        faqList: MyConstants.SERVER_URL + "/home/faqList",
        searchAll: MyConstants.SERVER_URL + "/home/searchAll",
        searchProduct: MyConstants.SERVER_URL + "/home/searchProduct",
        searchIngredient: MyConstants.SERVER_URL + "/home/searchIngredient",
        searchCamera: MyConstants.SERVER_URL + "/home/searchCamera",
    },
    article: {
        list: MyConstants.SERVER_URL + "/article/list",
        detail: MyConstants.SERVER_URL + "/article/detail",
        commentList: MyConstants.SERVER_URL + "/article/commentList",
        postComment: MyConstants.SERVER_URL + "/article/postComment",
        like: MyConstants.SERVER_URL + "/article/like",
        unlike: MyConstants.SERVER_URL + "/article/unlike",
        reportComment: MyConstants.SERVER_URL + "/article/reportComment",
        deleteComment: MyConstants.SERVER_URL + "/article/deleteComment",
    },
    banner: {
        detail: MyConstants.SERVER_URL + "/banner/detail",
        commentList: MyConstants.SERVER_URL + "/banner/commentList",
        postComment: MyConstants.SERVER_URL + "/banner/postComment",
        list2: MyConstants.SERVER_URL + "/banner/list2",
        list3: MyConstants.SERVER_URL + "/banner/list3",
        like: MyConstants.SERVER_URL + "/banner/like",
        unlike: MyConstants.SERVER_URL + "/banner/unlike",
        reportComment: MyConstants.SERVER_URL + "/banner/reportComment",
        deleteComment: MyConstants.SERVER_URL + "/banner/deleteComment",
    },
    product: {
        newList: MyConstants.SERVER_URL + "/product/newList",
        bestList: MyConstants.SERVER_URL + "/product/bestList",
        recommendList: MyConstants.SERVER_URL + "/product/recommendList",
        like: MyConstants.SERVER_URL + "/product/like",
        unlike: MyConstants.SERVER_URL + "/product/unlike",
        detail: MyConstants.SERVER_URL + "/product/detail",
        ingredientList: MyConstants.SERVER_URL + "/product/ingredientList",
        commentList: MyConstants.SERVER_URL + "/product/commentList",
        postComment: MyConstants.SERVER_URL + "/product/postComment",
        addMatch: MyConstants.SERVER_URL + "/product/addMatch",
        deleteMatch: MyConstants.SERVER_URL + "/product/deleteMatch",
        deleteComment: MyConstants.SERVER_URL + "/product/deleteComment",
        reportComment: MyConstants.SERVER_URL + "/product/reportComment",
        request: MyConstants.SERVER_URL + "/product/request",
    },
    ingredient: {
        userIngredientList: MyConstants.SERVER_URL + "/ingredient/userIngredientList",
        myList: MyConstants.SERVER_URL + "/ingredient/myList",
        deleteUserIngredient: MyConstants.SERVER_URL + "/ingredient/deleteUserIngredient",
        potentialAllergenProductList: MyConstants.SERVER_URL + "/ingredient/potentialAllergenProductList",
        searchIngredient: MyConstants.SERVER_URL + "/ingredient/search",
        addUserIngredient: MyConstants.SERVER_URL + "/ingredient/addUserIngredient",
    },
    user: {
        myList: MyConstants.SERVER_URL + "/user/myList",
        addAlbum: MyConstants.SERVER_URL + "/user/addAlbum",
        editAlbum: MyConstants.SERVER_URL + "/user/editAlbum",
        matchList: MyConstants.SERVER_URL + "/user/matchList",
        deleteAlbum: MyConstants.SERVER_URL + "/user/deleteAlbum",
        likeList: MyConstants.SERVER_URL + "/user/likeList",
    },
    brand: {
        detail: MyConstants.SERVER_URL + "/brand/detail",
        productList: MyConstants.SERVER_URL + "/brand/productList",
    }
};
