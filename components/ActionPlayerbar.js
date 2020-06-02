/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import TrackPlayer from 'react-native-track-player';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import trackService from '../services/PlayerServices';
import GLOBAL, {current_queue_name} from '../global.js';
import ProgressBarComponent from './Progress';
import firestoreService from '../services/FirestoreService';

export default class ActionPlayerbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: undefined,
      icon: 'play',
      repeat: false,
      like: GLOBAL.user.favorite_songs.find((x) => x.id === this.props.song.id)
        ? true
        : false,
    };
  }

  componentDidMount() {
    this.listener = TrackPlayer.addEventListener('playback-state', (data) => {
      // data.state
      let icon = [];
      switch (+data.state) {
        case 1:
          icon = 'play';
          break;
        case 2:
          icon = 'play';
          break;
        case 3:
          icon = 'pause';
          break;
        default:
          icon = 'pause';
          break;
      }
      this.setState({status: data.state, icon: icon});
    });
  }
  convertToTimeView(sec) {
    const quotient = Math.floor(sec / 60);
    const remainder = sec % 60;
    const newRemainder = remainder < 10 ? '0' + remainder : remainder;
    return `${quotient}:${newRemainder}`;
  }
  componentWillUnmount() {
    this.listener.remove();
  }

  toogleLike = async () => {
    const status = this.state.like;
    if (status) {
      const i = GLOBAL.user.favorite_songs.findIndex(
        (x) => x.id === this.props.song.id,
      );
      GLOBAL.user.favorite_songs.splice(i, 1);
    } else {
      const {id, alias, artwork, artist, title} = this.props.song;
      GLOBAL.user.favorite_songs.push({title, id, alias, artwork, artist});
    }
    await firestoreService.saveFavorites(GLOBAL.user.favorite_songs);
    this.setState({like: !status});
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.song !== this.props.song) {
      this.setState({
        like: GLOBAL.user.favorite_songs.find(
          (x) => x.id === this.props.song.id,
        )
          ? true
          : false,
      });
    }
  }

  render() {
    const song = this.props.song;
    const icon = this.state.icon;
    return (
      <View>
        <View style={styles.titleArea}>
          <View>
            <Text style={{color: 'rgb(97, 97, 97)'}}>{song.artist}</Text>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {song.title}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.toogleLike()}>
            <Icon
              style={{alignSelf: 'center'}}
              name="heart"
              color={this.state.like ? '#e9446a' : '#7c7c7c'}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <View style={{padding: 20}}>
          <ProgressBarComponent total={song.duration} showSecond={true} />
        </View>
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}
        />
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.buttonAction]}
            onPress={() => {
              this.setState({repeat: !this.state.repeat}, () => {
                GLOBAL.repeat = this.state.repeat;
                GLOBAL.track_repeat = song.id;
              });
            }}>
            <Icon
              name="repeat"
              size={20}
              color={this.state.repeat ? '#e9446a' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSkip]}
            onPress={() => trackService.actionTrack('previous')}>
            <Icon name="skip-back" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonPause, {backgroundColor: '#FFF'}]}
            onPress={async () => {
              await trackService.togglePlayback(this.state.status, {
                id: song.id,
                alias: song.alias,
                typeName: current_queue_name,
              });
            }}>
            <Icon name={icon} color="#e9446a" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSkip}
            onPress={() => trackService.actionTrack('next')}>
            <Icon name="skip-forward" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonAction]}
            onPress={() => trackService.actionTrack('previous')}>
            <Icon name="list" size={23} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = new StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    // backgroundColor: '#e9446a',
    borderRadius: 50,
    elevation: 10,
  },
  buttonSkip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 40,
    marginHorizontal: 35,
  },

  titleArea: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'barlow-semibold',
    width: 250,
  },
});
