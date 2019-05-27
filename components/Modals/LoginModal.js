// common
import React from 'react';
import { Image, Modal, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../constants/MyStyles';
import Messages from '../../constants/Messages';
import { MyAppText } from '../../components/Texts/MyAppText';

export class LoginModal extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const _this = this.props.this;
        const is_transparent = this.props.is_transparent == null || this.props.is_transparent == "undefined" ? false : true;
        return (
            <Modal
                animationType="slide"
                transparent={is_transparent}
                visible={_this.state.showLoginModal}
                onRequestClose={() => {
                }}>
                <View style={{ flex: 1 }}>
                    <View style={MyStyles.modal_bg}>
                        <View style={MyStyles.modalContainer}>
                            <TouchableOpacity activeOpacity={0.8} style={MyStyles.modal_close_btn} onPress={() => {
                                _this.setState({ showLoginModal: false });
                            }}>
                                <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                            </TouchableOpacity>

                            <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                            <MyAppText style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>{Messages.you_need_to_login}</MyAppText>

                            <View style={{ flexDirection: "row" }}>
                                <TouchableHighlight onPress={() => {
                                    _this.setState({ showLoginModal: false });
                                    _this.props.navigation.navigate('Login')
                                }}
                                    style={[MyStyles.dlg_btn_primary_cover]}>
                                    <MyAppText style={MyStyles.btn_primary}>Yes</MyAppText>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={[MyStyles.dlg_btn_primary_white_cover]}
                                    onPress={() => {
                                        _this.setState({ showLoginModal: false });
                                    }}>
                                    <MyAppText style={MyStyles.btn_primary_white}>Not now</MyAppText>
                                </TouchableHighlight>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }
}