/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import TrackPlayer from 'react-native-track-player';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import trackService from '../services/PlayerServices';
import {current_queue_name} from '../global.js';
import ProgressBarComponent from './Progress';

export default class ActionPlayerbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: undefined,
      icon: 'play',
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

  componentWillUnmount() {
    this.listener.remove();
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
          <Icon style={{alignSelf: 'center'}} name="heart" size={25} />
        </View>
        <View style={{padding: 20}}>
          <ProgressBarComponent />
        </View>
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <Text style={styles.duration}>0:00</Text>
          <Text style={styles.duration}>4:20</Text>
        </View>
        <View style={styles.actionBar}>
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
    paddingBottom: 20,
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
    marginHorizontal: 50,
  },
  duration: {
    fontFamily: 'barlow-medium',
    color: 'rgb(97, 97, 97)',
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
