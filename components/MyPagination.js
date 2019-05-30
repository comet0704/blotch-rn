import React from 'react';
import { Pagination } from 'react-native-snap-carousel';
import Colors from '../constants/Colors';

export class MyPagination extends React.Component {
    render() {
        const activeDotIndex = this.props.activeDotIndex // 이 값으로 indicator 값이 변함.
        const is_tutorial = this.props.is_tutorial // 이 값으로 indicator 값이 변함.
        if (is_tutorial) {
            return (
                <Pagination
                    dotsLength={this.props.list.length}
                    activeDotIndex={activeDotIndex}
                    dotContainerStyle={{ height: 280 / 3 }}
                    containerStyle={{ backgroundColor: 'transparent', marginTop: - 300 / 3, paddingVertical: 0 }}
                    dotStyle={{
                        width: 40 / 3,
                        height: 40 / 3,
                        borderRadius: 40 / 6,
                        paddingHorizontal: 0,
                        marginLeft: 20 / 6,
                        backgroundColor: Colors.primary_purple
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                        backgroundColor: '#ffffff38'
                    }}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                />
            )
        } else {
            return (
                <Pagination
                    dotsLength={this.props.list.length}
                    activeDotIndex={activeDotIndex}
                    dotContainerStyle={{ height: 120 / 3 }}
                    containerStyle={{ backgroundColor: 'transparent', marginTop: - 120 / 3, paddingVertical: 0 }}
                    dotStyle={{
                        width: 40 / 3,
                        height: 40 / 3,
                        borderRadius: 40 / 6,
                        paddingHorizontal: 0,
                        marginLeft: 20 / 6,
                        backgroundColor: '#fe76ab80'
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                        backgroundColor: '#ffffff3c'
                    }}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                />
            )
        }
    }
}