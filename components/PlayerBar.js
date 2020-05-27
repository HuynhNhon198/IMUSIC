/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Feather';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import trackService from '../services/PlayerServices';
import {current_queue_name} from '../global.js';
export default function PlayerBar(props) {
  const song = props.song;
  const [status, setStatus] = useState(0);
  const [icon, setIcon] = useState(1);

  useEffect(() => {
    setIcon(['play', '#e9446a', 'white']);
  }, []);

  const playbackState = usePlaybackState();
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
      <ProgressBar
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          marginVertical: 30,
        }}
        borderWidth={0}
        unfilledColor="#EEE"
        color="#e9446a"
        progress={0}
        width={300}
      />
      <View
        style={{
          marginBottom: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 22,
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
          style={[styles.buttonPause, {backgroundColor: icon[1]}]}
          onPress={async () => {
            await trackService.togglePlayback(playbackState, {
              id: song.id,
              alias: song.alias,
              typeName: current_queue_name,
            });
            console.log(+playbackState);
            switch (+playbackState) {
              case 1:
                setIcon(['pause', '#FFF', '#e9446a']);
                break;
              case 3:
                setIcon(['play', '#e9446a', 'white']);
                break;
              case 2:
                setIcon(['pause', '#FFF', '#e9446a']);
                break;
              default:
                setIcon(['play', '#e9446a', 'white']);
                break;
            }
          }}>
          <Icon name={icon[0]} color={icon[2]} size={30} />
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

const styles = new StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
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
    marginHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'barlow-semibold',
    width: 250,
  },
});
