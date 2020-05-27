/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import {getData, getStorage} from '../../../services/helper';
import PlayerBar from '../../../components/PlayerBar';
import playlistData from '../../../playlist.json';
// import PlayListContainer from '../../../containers/playlistContainer';
export default class PlayerScreen extends Component {
  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
    this.state = {
      song: undefined,
      duration: 0,
    };
  }

  url = this.props.navigation.state.params.url;
  // playbackState = usePlaybackState();

  componentDidMount() {
    this.StartImageRotateFunction();
    getData(this.url).then(async (data) => {
      if (data.data) {
        this.setState({song: data.data});
        const info = this.state.song;
        if (info.streaming.default) {
          // playSound('https:' + data.data.streaming.default['128'], true);
          // const playlist = await getStorage('playlistOnline');
          await TrackPlayer.reset();
          // PlayListContainer.setPlayList(playlist);
          // console.log(playlistData);
          // await TrackPlayer.add(playlistData);
          await TrackPlayer.add({
            id: info.id,
            url: 'https:' + info.streaming.default['128'],
            title: info.title,
            artist: info.artists_names,
            artwork: info.thumbnail_medium,
            duration: info.duration,
          });
          await TrackPlayer.play();

          let duration = 0;
          var timer = setInterval(() => {
            this.durationCount(duration);
            duration++;
            if (duration === 1000) {
              clearInterval(timer);
            }
          }, 1000);
        } else {
          alert('Bài hát này chỉ cho tài khoản VIP');
          this.props.navigation.goBack();
        }
      }
    });
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 6000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }

  durationCount(current) {
    this.setState({duration: current / 100});
  }
  render() {
    const song = this.state.song;
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return song ? (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ImageBackground
          style={{height: 300}}
          source={{uri: song.thumbnail_medium}}
          blurRadius={Platform.OS === 'ios' ? 6 : 3}>
          <View style={styles.menuBar}>
            <View
              style={{
                backgroundColor: 'rgba(0, 15, 20, 0.52)',
                paddingHorizontal: 20,
                paddingVertical: 3,
                borderRadius: 25,
              }}>
              <Icon
                style={{color: '#FFF'}}
                name="chevron-down"
                size={25}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.content}>
          <Animated.Image
            style={{
              width: 300,
              height: 300,
              borderRadius: 300,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: -160,
              marginBottom: 20,
              borderWidth: 6,
              borderColor: 'rgba(254, 254, 254, 0.24)',
              transform: [{rotate: RotateData}],
            }}
            source={{uri: song.thumbnail_medium}}
          />
          <ScrollView />
          <PlayerBar song={song} />
        </View>
      </View>
    ) : (
      <ActivityIndicator
        style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
        size="large"
      />
    );
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBar: {
    flexDirection: 'row',
    marginVertical: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -60,
    padding: 24,
    paddingRight: 20,
    paddingBottom: 0,
  },
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
