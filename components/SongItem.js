/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {storeStorage} from '../services/helper';
import trackService from '../services/PlayerServices';
import {user} from '../global';
import firestoreService from '../services/FirestoreService';
export default class SongItem extends Component {
  // favoriteSongs = user.favorite_songs || [];
  constructor(props) {
    super(props);
    this.state = {
      like: user.favorite_songs.find((x) => x.id === this.props.song.id)
        ? true
        : false,
    };
  }

  playlist = this.props.playList;

  toogleLike = async () => {
    const status = this.state.like;
    if (status) {
      const i = user.favorite_songs.findIndex(
        (x) => x.id === this.props.song.id,
      );
      user.favorite_songs.splice(i, 1);
    } else {
      const {id, alias, thumbnail, title} = this.props.song;
      user.favorite_songs.push({
        title,
        id,
        alias,
        artwork: thumbnail,
        artist: this.props.song.artists_names || this.props.song.artist_text,
      });
    }
    await firestoreService.saveFavorites(user.favorite_songs);
    this.setState({like: !status});
  };

  openSong = async (id, alias) => {
    await storeStorage('playlistOnline', this.props.playList);
    trackService.playSongFromURL(id, alias, this.props.playList.name);
    // await storeStorage('currentSong', {id, alias}, this.props.navigation);
    // this.props.navigation.navigate('PlayOnline', {
    //   url: `https://echo.brandly.vn/api/media/song?name=${alias}&id=${id}`,
    // });
  };

  handleClick = (setPlayList) => {
    if (this.props.playList.list.length > 0) {
      setPlayList(this.props.playList.list);
    }
  };

  render() {
    const song = this.props.song;
    // if (song.thumbnail) {
    //   song.thumbnail = {uri: song.thumbnail};
    // } else {
    //   song.thumbnail = require('../assets/cover-song.png');
    // }
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Image
          style={{width: 60, height: 60, borderRadius: 6}}
          source={
            song.thumbnail
              ? {uri: song.thumbnail}
              : require('../assets/cover-song.png')
          }
        />
        <View style={styles.songInfo}>
          <TouchableOpacity onPress={() => this.openSong(song.id, song.alias)}>
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
            <Text
              style={{color: '#7c7c7c', width: 200}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {song.artists_names || song.artist_text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.toogleLike()}>
            <Icon
              name="heart"
              size={20}
              color={this.state.like ? '#e9446a' : '#7c7c7c'}
              style={{marginRight: 4}}
            />
          </TouchableOpacity>
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
