/* eslint-disable no-new-object */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import MusicFiles from 'react-native-get-music-files';
import Permissions from 'react-native-permissions';
import TrackPlayer from 'react-native-track-player';
import {startTrackNoty} from '../../../services/helper';

export default class MyLocalSong extends Component {
  state = {
    storagePermission: '',
    tracks: [],
  };
  convertToTimeView(sec) {
    const quotient = Math.floor(sec / 60);
    const remainder = sec % 60;
    const newRemainder = remainder < 10 ? '0' + remainder : remainder;
    return `${quotient}:${newRemainder}`;
  }
  componentDidMount() {
    Permissions.request('storage').then((response) => {
      this.setState({storagePermission: response});
    });

    MusicFiles.getAll({})
      .then((trks) => {
        this.setState({
          tracks: trks.map(
            (x, i) =>
              new Object({
                id: i.toString(),
                url: x.path,
                title: x.fileName.replace('.mp3', ''),
                artist: 'Unknown',
                artwork: 'https://i.imgur.com/5MwRdOc.png',
                duration: Math.floor(x.duration / 1000),
              }),
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async open(song) {
    const new_q = [];
    const current_q = await TrackPlayer.getQueue();
    this.state.tracks.forEach((t) => {
      if (current_q.findIndex((x) => x.id === t.id) === -1) {
        new_q.push(t);
      }
    });
    TrackPlayer.add(new_q, null);
    TrackPlayer.skip(song.id);
    TrackPlayer.play();
    startTrackNoty(song.title);
  }

  render() {
    return (
      <Container>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <CoverBackground source={require('../../../assets/my-music-cover.png')}>
          <SafeAreaView>
            <MenuBar>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-left" size={30} />
              </TouchableOpacity>
              <Icon name="search" size={24} />
            </MenuBar>
            <MainTitle>
              <Text />
            </MainTitle>
          </SafeAreaView>
        </CoverBackground>
        <ListMain>
          <ButtonPlayRandom>
            <Text>PHÁT NGẪU NHIÊN</Text>
          </ButtonPlayRandom>
          {this.state.tracks.length > 0 ? (
            <ListContainer>
              {this.state.tracks.map((song, index) => {
                return (
                  <Song key={index} onPress={() => this.open(song)}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 6}}
                      source={require('../../../assets/cover-song.png')}
                    />
                    <SongInfo>
                      <View>
                        <Text dark main_title>
                          {song.title}
                        </Text>
                        <Text dark singer>
                          {this.convertToTimeView(song.duration)}
                        </Text>
                      </View>
                    </SongInfo>
                  </Song>
                );
              })}
            </ListContainer>
          ) : (
            <ActivityIndicator
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
              size="large"
            />
          )}
        </ListMain>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
  background-color: #f5f6f8;
`;

const Text = styled.Text`
  color: ${(props) => (props.dark ? '#000' : '#FFF')};

  ${({main_title, singer, timer}) => {
    switch (true) {
      case main_title:
        return `
          font-size: 16px;
          text-transform: capitalize
        `;
      case singer:
        return `
          font-size: 14px;
          color: rgb(179, 179, 179);
          text-transform: capitalize
        `;
      case timer:
        return `
          font-size: 14px;
          color: rgb(179, 179, 179);
          text-transform: capitalize
        `;

      default:
        break;
    }
  }}
`;

const CoverBackground = styled.ImageBackground`
  width: 100%;
`;

const MenuBar = styled.View`
  margin-top: 30px;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
`;

const MainTitle = styled.View`
  padding: 0 32px;
  margin: 75px 0 32px 0;
`;

const ListMain = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 35px;
  padding: 32px;
  background-color: #fff;
  height: 100%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ListContainer = styled.ScrollView`
  width: 100%;
  margin-top: 20px;
`;

const Song = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 15px;
  align-items: center;
  padding-right: 5px;
`;

const SongInfo = styled.View`
  flex: 1;
  margin-left: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonPlayRandom = styled.TouchableOpacity`
  background: #e9446a;
  padding: 10px 20px;
  border-radius: 25px;
  margin-top: -50px;
`;
