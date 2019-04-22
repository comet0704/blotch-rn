// common
import React from 'react';
import { Image, Modal, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../constants/MyStyles';

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
                            <TouchableOpacity style={MyStyles.modal_close_btn} onPress={() => {
                                _this.setState({ showLoginModal: false });
                                _this.props.navigation.navigate('Home')
                            }}>
                                <Image style={{ width: 14, height: 14 }} source={require("../../assets/images/ic_close.png")} />
                            </TouchableOpacity>

                            <Image style={{ width: 31, height: 32, alignSelf: "center" }} source={require("../../assets/images/ic_check_on.png")} />
                            <Text style={{ fontSize: 16, color: "black", alignSelf: "center", fontWeight: "bold", marginTop: 10, marginBottom: 20 }}>You need to login</Text>

                            <View style={{ flexDirection: "row" }}>
                                <TouchableHighlight onPress={() => {
                                    _this.setState({ showLoginModal: false });
                                    _this.props.navigation.navigate('Login')
                                }}
                                    style={[MyStyles.btn_primary_cover, { borderRadius: 0 }]}>
                                    <Text style={MyStyles.btn_primary}>Yes</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={[MyStyles.btn_primary_white_cover, { borderRadius: 0 }]}
                                    onPress={() => {
                                        _this.setState({ showLoginModal: false });
                                        _this.props.navigation.navigate('Home')
                                    }}>
                                    <Text style={MyStyles.btn_primary_white}>Not now</Text>
                                </TouchableHighlight>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }
}