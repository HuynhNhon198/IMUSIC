import React, {Component} from 'react';
import {Subscribe} from 'unstated';

import {Text} from 'react-native';
import PlayListContainer from '../containers/playlistContainer';

export default class ListTest extends Component {
  render() {
    return (
      <Subscribe to={[PlayListContainer]}>
        {(playlistContainer) =>
          playlistContainer.state.playlist.map((song) => <Text>{song.id}</Text>)
        }
      </Subscribe>
    );
  }
}
