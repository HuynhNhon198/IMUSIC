/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {getStorage, storeStorage} from '../services/helper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import PlayerScreen from '../screens/app/modals/PlayerScreen';

import TrackPlayer from 'react-native-track-player';
import trackService from '../services/PlayerServices';
import {current_queue_name} from '../global.js';
import ProgressBarComponent from './Progress';
export default class TrackBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_song: undefined,
    };
    getStorage('currentSong').then((current) => {
      if (current) {
        this.setState({current_song: current});
      }
    });
  }

  async componentDidMount() {
    this.onTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      async (data) => {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        if (track !== null) {
          console.log(track);
          trackService.saveNextToQueue(track.id, current_queue_name);
          storeStorage('currentSong', track);
          this.setState({current_song: track});
        } else {
        }
      },
    );
  }

  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove();
  }

  render() {
    const song = this.state.current_song;
    return song ? (
      <View>
        <TouchableOpacity
          style={styles.track}
          onPress={() => this._panel.show()}>
          <View style={styles.info}>
            <Text
              style={{fontFamily: 'barlow-semibold', fontSize: 25, width: 250}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {song.title}
            </Text>
            <Text style={{color: '#7c7c7c'}}>{song.artist}</Text>
          </View>
          <Image
            style={{width: 60, height: 60, borderRadius: 60}}
            source={{uri: song.artwork}}
          />
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 20,
            alignSelf: 'center',
            width: Dimensions.get('window').width - 40,
            backgroundColor: '#FFF',
          }}>
          {/* <ProgressBar
            borderWidth={0}
            unfilledColor="#EEE"
            color="#e9446a"
            progress={0.4}
            width={Dimensions.get('window').width - 40}
          /> */}
          <ProgressBarComponent />
        </View>
        <SlidingUpPanel ref={(c) => (this._panel = c)}>
          <PlayerScreen song={song} hide={this.hideMethod} />
        </SlidingUpPanel>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = new StyleSheet.create({
  track: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
  },
});
