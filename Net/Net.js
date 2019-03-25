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
    },
    home : {
        homeList: MyConstants.SERVER_URL + "/home/homeList",
    },
    article : {
        list: MyConstants.SERVER_URL + "/article/list",
    },
    banner : {
        detail: MyConstants.SERVER_URL + "/banner/detail",
        commentList: MyConstants.SERVER_URL + "/banner/commentList",
        postComment: MyConstants.SERVER_URL + "/banner/postComment",
    },
};
