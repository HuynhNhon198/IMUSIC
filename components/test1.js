import React, {Component} from 'react';
import {Subscribe} from 'unstated';

import {TouchableOpacity, Text} from 'react-native';
import PlayListContainer from '../containers/playlistContainer';
import {getStorage} from '../services/helper';

export default class AddTest extends Component {
  handleClick = async (setPlayList) => {
    const data = await getStorage('playlistOnline');
    console.log(data.length);
    setPlayList(data);
  };

  render() {
    return (
      <Subscribe to={[PlayListContainer]}>
        {(playlistContainer) => (
          <TouchableOpacity
            onPress={() => this.handleClick(playlistContainer.setPlayList)}>
            <Text>ADD</Text>
          </TouchableOpacity>
        )}
      </Subscribe>
    );
  }
}
