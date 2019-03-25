import MyConstants from "../constants/MyConstants";

export default {
    getImageUrl(image_list) {
        return MyConstants.UPLOAD_SERVER_URL + image_list.split("###")[0]
    },
    scrollIsCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    },      
}