import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Provider, Subscribe} from 'unstated';
import PlayListContainer from '../../../containers/playlistContainer';
import AddTest from '../../../components/test1';
import ListTest from '../../../components/test2';

export default class PLaylistScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text> PLayList </Text>
        <Provider>
          <AddTest />
          <ListTest />
        </Provider>
      </View>
    );
  }
}
