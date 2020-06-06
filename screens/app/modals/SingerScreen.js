/* eslint-disable no-new-object */
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import {getData, storeStorage} from '../../../services/helper';
import SongItem from '../../../components/SongItem';
import trackService from '../../../services/PlayerServices';

export default class SingerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: undefined,
    };
  }

  alias = this.props.navigation.state.params.alias;

  async componentDidMount() {
    const url = `https://tuhoc247.com/crawler/get-artist/${this.alias}`;
    getData(url).then((data) => {
      if (data.code === 'success') {
        if (
          data.cover ===
          '//static-zmp3.zadn.vn/dev/skins/zmp3-v5.2/images/default_cover.png'
        ) {
          data.cover =
            'https://ak.picdn.net/shutterstock/videos/33557143/thumb/1.jpg';
        }
        this.setState({info: data.message});
      }
    });
  }

  getPlayList = () => {
    return {
      name: this.state.info.name,
      list: this.state.info.items.map(
        (x) =>
          new Object({
            id: x.id,
            alias: x.alias,
            thumbnail: x.thumbnail,
          }),
      ),
    };
  };

  async playRandom() {
    await storeStorage('playlistOnline', this.getPlayList());
    const {id, alias} = this.state.info.items[0];
    trackService.playSongFromURL(id, alias, this.state.info.name);
  }
  render() {
    return this.state.info ? (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ImageBackground
          style={{height: 250}}
          source={{uri: this.state.info.cover}}
          blurRadius={Platform.OS === 'ios' ? 6 : 1}>
          <View style={styles.menuBar}>
            <Icon
              style={{color: '#FFF'}}
              name="arrow-left"
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.titleDiscovery}>{this.state.info.name}</Text>
          </View>
        </ImageBackground>
        <View style={styles.listContainer}>
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 150,
              justifyContent: 'center',
              alignSelf: 'center',
              borderWidth: 3,
              borderColor: 'rgba(254, 254, 254, 0.24)',
              marginTop: -100,
              marginBottom: 20,
            }}
            source={{uri: this.state.info.thumb}}
          />
          <ScrollView
            ref={(ref) => {
              this.scrollListReftop = ref;
            }}>
            {this.state.info.items.map((song, index) => {
              return (
                <TouchableOpacity key={index} style={styles.song}>
                  <SongItem song={song} playList={this.getPlayList()} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            onPress={() =>
              this.scrollListReftop.scrollTo({x: 0, y: 0, animated: true})
            }
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              position: 'absolute',
              bottom: 15,
              right: 15,
              height: 50,
              backgroundColor: '#e9446a',
              borderRadius: 50,
              elevation: 10,
            }}>
            <Icon name="arrow-up" size={30} color="#FFF" />
          </TouchableOpacity>
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
  },
  titleDiscovery: {
    fontSize: 24,
    color: '#FFF',
    marginLeft: 10,
    fontFamily: 'barlow-medium',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -82,
    padding: 24,
    paddingRight: 20,
    paddingBottom: 0,
  },

  song: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 6,
  },
});
