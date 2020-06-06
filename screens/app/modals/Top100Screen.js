/* eslint-disable no-new-object */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {getData, storeStorage} from '../../../services/helper';
import SongItem from '../../../components/SongItem';
import trackService from '../../../services/PlayerServices';
export default class Top100Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.navigation.state.params.type,
      items: [],
      playList: {},
    };
  }

  img = '';
  name = '';
  async componentDidMount() {
    let url = '';
    switch (this.state.type) {
      case '3':
        url = 'https://tuhoc247.com/crawler/top100?type=usuk';
        this.img = require('../../../assets/discover1.png');
        this.name = 'TOP 100 Nhạc US-UK';
        break;
      case '2':
        url = 'https://tuhoc247.com/crawler/top100?type=kpop';
        this.img = require('../../../assets/discover2.png');
        this.name = 'TOP 100 Nhạc KPop';
        break;
      case '1':
        url = 'https://tuhoc247.com/crawler/top100?type=vpop';
        this.img = require('../../../assets/discover3.png');
        this.name = 'TOP 100 Nhạc VPop';
        break;
      default:
        break;
    }
    getData(url).then((data) => {
      // console.log(data);
      if (data.code === 'success') {
        console.log(data.message.data.items);
        this.setState({
          items: data.message.data.items,
        });
      }
    });
  }

  getPlayList = () => {
    return {
      name: this.name,
      list: this.state.items.map(
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
    const {id, alias} = this.state.items[0];
    trackService.playSongFromURL(id, alias, this.name);
  }

  componentWillUnmount() {
    // StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    return this.state.items.length > 0 ? (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#0000"
          translucent
          barStyle="light-content"
        />
        <ImageBackground
          style={{height: 250}}
          source={this.img}
          blurRadius={Platform.OS === 'ios' ? 6 : 2}>
          <View style={styles.menuBar}>
            <Icon
              style={{color: '#FFF'}}
              name="arrow-left"
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />
            <Text style={styles.titleDiscovery}>{this.name}</Text>
          </View>
        </ImageBackground>
        <View style={styles.listContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.playRandom()}>
            <Icon style={{color: '#FFF'}} name="play" size={30} />
          </TouchableOpacity>
          <ScrollView
            ref={(ref) => {
              this.scrollListReftop = ref;
            }}>
            {this.state.items.map((song, index) => {
              return (
                <View key={index} style={styles.song}>
                  <Text style={styles.index}>{index + 1}</Text>
                  <SongItem song={song} playList={this.getPlayList()} />
                </View>
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
      <View style={styles.container}>
        {/* <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        /> */}
        <ActivityIndicator
          style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
          size="large"
        />
      </View>
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
    marginTop: -120,
    padding: 24,
    paddingRight: 20,
    paddingBottom: 0,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: -50,
    backgroundColor: '#e9446a',
    borderColor: 'transparent', // Required to show shadows on Android for some reason !?!?
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
    marginBottom: 20,
  },

  song: {
    flexDirection: 'row',
    marginBottom: 3,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 6,
  },
  index: {
    alignSelf: 'center',
    padding: 8,
    fontFamily: 'barlow-semibold',
    fontSize: 16,
  },
});
