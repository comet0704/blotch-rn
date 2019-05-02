import React from 'react';
import { Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native'
import { BarCodeScanner, Camera, Permissions } from 'expo';
import ModalDropdown from 'react-native-modal-dropdown'

const DEMO_OPTIONS_2 = [
  { "name": "Rex", "age": 30 },
  { "name": "Mary", "age": 25 },
  { "name": "John", "age": 41 },
  { "name": "Jim", "age": 22 },
  { "name": "Susan", "age": 52 },
  { "name": "Brent", "age": 33 },
  { "name": "Alex", "age": 16 },
  { "name": "Ian", "age": 20 },
  { "name": "Phil", "age": 24 },
];

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return (
      <ModalDropdown ref="dropdown_2"
        style={styles.dropdown_2}
        defaultIndex={1}
        defaultValue="Me ▾"
        textStyle={styles.dropdown_2_text}
        dropdownStyle={styles.dropdown_2_dropdown}
        options={DEMO_OPTIONS_2}
        renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
        renderRow={this._dropdown_2_renderRow.bind(this)}
        onSelect={(idx, value) => { console.log(value) }}
        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
      />
    )
  }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    // let icon = highlighted ? require('./images/heart.png') : require('./images/flower.png');
    let evenRow = rowID % 2;
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? 'lemonchiffon' : 'white' }]}>
          {/* <Image style={styles.dropdown_2_image}
                 mode='stretch'
                 source={icon}
          /> */}
          <Text style={[styles.dropdown_2_row_text, highlighted && { color: 'mediumaquamarine' }]}>
            {`${rowData.name} (${rowData.age})`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _dropdown_2_renderButtonText(rowData) {
    const { name, age } = rowData;
    return (<Text>ddddddd</Text>);
  }

  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == DEMO_OPTIONS_2.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={styles.dropdown_2_separator}
      key={key}
    />);
  }
}

const styles = StyleSheet.create({

  row: {
    flex: 1,
    flexDirection: 'row',
  },


  dropdown_2: {
    alignSelf: 'flex-end',
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
    borderRadius: 30,
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: 150,
    height: 300,
    marginTop: -20,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },

});