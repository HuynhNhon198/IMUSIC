/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Subscribe, Provider} from 'unstated';
import PlayListContainer from '../containers/playlistContainer';

export default class SongItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  playlist = this.props.playList;
  openSong = (id, alias) => {
    this.props.navigation.navigate('PlayOnline', {
      url: `https://echo.brandly.vn/api/media/song?name=${alias}&id=${id}`,
    });
  };

  handleClick = (setPlayList) => {
    if (this.props.playList.list.length > 0) {
      setPlayList(this.props.playList.list);
    }
  };

  render() {
    const song = this.props.song;
    if (song.thumbnail) {
      song.thumbnail = {uri: song.thumbnail};
    } else {
      song.thumbnail = require('../assets/cover-song.png');
    }
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Image
          style={{width: 60, height: 60, borderRadius: 6}}
          source={song.thumbnail}
        />
        <View style={styles.songInfo}>
          <Provider>
            <Subscribe to={[PlayListContainer]}>
              {(playListContainer) => (
                <TouchableOpacity
                  onPress={() =>
                    this.handleClick(playListContainer.setPlayList)
                  }>
                  <Text
                    style={{
                      width: 200,
                      fontFamily: 'barlow-semibold',
                      fontSize: 20,
                      marginBottom: 5,
                      color: '#474747',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {song.title}
                  </Text>
                  <Text style={{color: '#7c7c7c'}}>
                    {song.artists_names || song.artist_text}
                  </Text>
                </TouchableOpacity>
              )}
            </Subscribe>
          </Provider>
          <Icon
            name="heart"
            size={20}
            color="#4f4f4f"
            style={{marginRight: 4}}
          />
        </View>
      </View>
    );
  }
}

const styles = new StyleSheet.create({
  songInfo: {
    marginLeft: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
