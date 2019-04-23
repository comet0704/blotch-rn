// common
import React from 'react';
import { Image, Modal, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../constants/MyStyles';
import { Dropdown } from 'react-native-material-dropdown';
import Colors from '../../constants/Colors';

export class QuestionnaireListModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const _this = this.props.this;
        return (
            // {/* 설문선택 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={_this.state.qlistModalVisible}
                onRequestClose={() => {
                }}>
                <View style={{ flex: 1 }}>
                    <View style={MyStyles.modal_bg}>
                        <View style={MyStyles.modalContainer}>
                            <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                                _this.setState({ qlistModalVisible: false });
                            }}>
                                <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                            </TouchableOpacity>

                            <View style={{ width: 200, height: 150, marginTop: -30, marginBottom: 40, justifyContent: "center", alignSelf: "center" }}>
                                <Dropdown
                                    // dropdownPosition={0}
                                    labelFontSize={11}
                                    textColor={Colors.color_656565}
                                    itemColor={Colors.color_656565}
                                    selectedItemColor={Colors.color_656565}
                                    baseColor={Colors.primary_dark}
                                    value={_this.state.selected_questionnaire.value}
                                    label='Please select your baby item'
                                    onChangeText={(value, index, data) => {
                                        _this.onQuestionnaireSelected(value, index, data)
                                    }}
                                    data={_this.state.questionnaire_list}
                                />
                            </View>

                            {/* <View style={{ flexDirection: "row" }}>
                                <TouchableHighlight onPress={() => {
                                    _this.setState({ qlistModalVisible: false });
                                }}
                                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                                    <Text style={MyStyles.btn_primary}>Yes</Text>
                                </TouchableHighlight>
                            </View> */}
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }
}