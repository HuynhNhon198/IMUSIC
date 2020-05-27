/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Feather';

export default class PlayerBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const song = this.props.song;
    return (
      <View>
        <View style={styles.titleArea}>
          <View>
            <Text style={{color: 'rgb(97, 97, 97)'}}>{song.artists_names}</Text>
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
          progress={this.state.duration}
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
          <TouchableOpacity style={[styles.buttonSkip]}>
            <Icon name="skip-back" size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPause}>
            <Icon name="pause" size={30} style={{color: '#FFF'}} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSkip}>
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
    paddingBottom: 50,
  },
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#e9446a',
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
