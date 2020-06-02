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
import GLOBAL from '../../../global.js';
import Icon from 'react-native-vector-icons/Feather';
import firestoreService from '../../../services/FirestoreService.js';
import {storeStorage} from '../../../services/helper.js';
import trackService from '../../../services/PlayerServices.js';
export default class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: GLOBAL.user.favorite_songs || [],
    };
  }

  remove = async (id) => {
    const ind = GLOBAL.user.favorite_songs.findIndex((x) => x.id === id);
    GLOBAL.user.favorite_songs.splice(ind, 1);
    await firestoreService.saveFavorites(GLOBAL.user.favorite_songs);
    this.setState({
      songs: GLOBAL.user.favorite_songs,
    });
  };
  openSong = async (id, alias) => {
    await storeStorage('playlistOnline', {
      name: 'favorites',
      list: this.state.songs,
    });
    trackService.playSongFromURL(id, alias, 'favorites');
  };

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
            <Text style={{fontFamily: 'barlow-semibold'}}>PHÁT NGẪU NHIÊN</Text>
          </ButtonPlayRandom>
          <ListContainer>
            {this.state.songs.map((song, index) => {
              return (
                <Song key={index}>
                  <Image
                    style={{width: 50, height: 50, borderRadius: 6}}
                    source={{uri: song.artwork}}
                  />
                  <SongInfo>
                    <TouchableOpacity
                      onPress={() => this.openSong(song.id, song.alias)}>
                      <Text dark main_title>
                        {song.title}
                      </Text>
                      <Text dark singer numberOfLines={1} ellipsizeMode="tail">
                        {song.artist}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.remove(song.id)}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Icon
                        name="x"
                        size={20}
                        color="#e9446a"
                        style={{marginRight: 4}}
                      />
                    </TouchableOpacity>
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
          text-transform: capitalize;
          font-family: 'barlow-semibold'
        `;
      case singer:
        return `
          font-size: 14px;
          color: rgb(179, 179, 179);
          text-transform: capitalize;
          width: 200px
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
  padding: 32px 20px;
  background-color: #fafafa;
  height: 100%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ListContainer = styled.ScrollView`
  width: 100%;
  margin-top: 20px;
`;

const Song = styled.View`
  flex-direction: row;
  margin-bottom: 3px;
  align-items: center;
  padding: 8px 5px 8px 8px;
  background-color: #fff;
  border-radius: 4px;
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
