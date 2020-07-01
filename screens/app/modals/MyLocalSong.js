/* eslint-disable no-new-object */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import MusicFiles from 'react-native-get-music-files';
import Permissions from 'react-native-permissions';

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
                id: i,
                url: x.path,
                title: x.fileName.replace('.mp3', ''),
                artist: 'Unknown',
                artwork: '../assets/cover-song.png',
                duration: x.duration,
              }),
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  songs = [
    {
      name: 'Có tất cả nhưng thiếu em',
      singer: 'Erik',
      cover: 'https://i1.sndcdn.com/artworks-000573867131-n0z3pd-t500x500.jpg',
      time: '3:21',
    },
    {
      name: 'Có em nhưng thiếu tất cả',
      singer: 'Karik',
      cover:
        'https://d2tml28x3t0b85.cloudfront.net/tracks/audio/original_artwork/1c076940e73911e8b0ed5909629489a2/1d40fab0e73911e889e067bd6812e100.jpg',
      time: '4:01',
    },
    {
      name: 'Có tiền nhưng thiếu em',
      singer: 'Erik, Min',
      cover: 'https://i1.sndcdn.com/artworks-000605216068-as8f7i-t500x500.jpg',
      time: '3:41',
    },
    {
      name: 'Không em, không tiền',
      singer: 'Huin Nhọn',
      cover:
        'https://i0.wp.com/inc42.com/wp-content/uploads/2020/04/OTT-Music.jpg?fit=1360%2C1020&ssl=1',
      time: '2:51',
    },
    {
      name: 'Có tất cả nhưng thiếu em',
      singer: 'Erik',
      cover: 'https://i1.sndcdn.com/artworks-000573867131-n0z3pd-t500x500.jpg',
      time: '3:21',
    },
    {
      name: 'Có em nhưng thiếu tất cả',
      singer: 'Karik',
      cover:
        'https://d2tml28x3t0b85.cloudfront.net/tracks/audio/original_artwork/1c076940e73911e8b0ed5909629489a2/1d40fab0e73911e889e067bd6812e100.jpg',
      time: '4:01',
    },
    {
      name: 'Có tiền nhưng thiếu em',
      singer: 'Erik, Min',
      cover: 'https://i1.sndcdn.com/artworks-000605216068-as8f7i-t500x500.jpg',
      time: '3:41',
    },
    {
      name: 'Không em, không tiền',
      singer: 'Huin Nhọn',
      cover:
        'https://i0.wp.com/inc42.com/wp-content/uploads/2020/04/OTT-Music.jpg?fit=1360%2C1020&ssl=1',
      time: '2:51',
    },
  ];

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
          <ListContainer>
            {this.state.tracks.map((song, index) => {
              return (
                <Song key={index}>
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
                        {this.convertToTimeView(
                          Math.floor(song.duration / 1000),
                        )}
                      </Text>
                    </View>
                  </SongInfo>
                </Song>
              );
            })}
          </ListContainer>
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
