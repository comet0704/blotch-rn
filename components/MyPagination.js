import React from 'react';
import { Pagination } from 'react-native-snap-carousel';

export class MyPagination extends React.Component {
    render() {
        const activeDotIndex = this.props.activeDotIndex // 이 값으로 indicator 값이 변함.
        return (
            <Pagination
                dotsLength={this.props.list.length}
                activeDotIndex={activeDotIndex}
                dotContainerStyle={{ height: 20 }}
                containerStyle={{ backgroundColor: 'black', marginTop: -30, paddingVertical: 0 }}
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
                inactiveDotScale={1}
            />
        )
    }
}