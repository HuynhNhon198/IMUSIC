/* eslint-disable react/no-string-refs */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ArtistList from '../../components/ArtistList';
import {YellowBox} from 'react-native';
import TrackBar from '../../components/TrackBar';
import GLOBAL from '../../global.js';
import {getStorage} from '../../services/helper';
import Modal from 'react-native-modalbox';
import SearchBox from '../../components/SearchBox';

StatusBar.setBarStyle('dark-content', true);
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries_discovery: [
        {
          key: '1',
          name: 'V-Pop',
          desc: '100 Bài nhạc Việt hay nhất',
          img: require('../../assets/discover3.png'),
        },
        {
          key: '2',
          name: 'K-Pop',
          desc: '100 Bài nhạc Hàn hay nhất',
          img: require('../../assets/discover2.png'),
        },
        {
          key: '3',
          name: 'US-UK',
          desc: '100 Bài hát tổng hợp hay nhất',
          img: require('../../assets/discover1.png'),
        },
      ],
      sections: [
        {
          key: '1',
          icon: 'star',
          name: 'Nhạc Ngoại',
        },
        {
          key: '2',
          icon: 'twitter',
          name: 'Nhạc Việt',
        },
        {
          key: '3',
          icon: 'headphones',
          name: 'Châu Á',
        },
        {
          key: '4',
          icon: 'coffee',
          name: 'Hòa Tấu',
        },
      ],
      artists: [],
      popular: [],
      popular_K: [],
      popular_V: [],
    };
  }

  async UNSAFE_componentWillMount() {
    GLOBAL.current_queue_name = await getStorage('queueName');
    GLOBAL.current_song = await getStorage('currentSong');
    GLOBAL.current_list = (await getStorage('playlistOnline'))?.list || [];
  }

  async componentDidMount() {
    // const data = await getStorage('playlistOnline');
    // if (data !== null) {
    //   const pl = new PlayListContainer();
    //   pl.setPlayList(data);
    // }
    // axios.get('https://tuhoc247.com/crawler/get-artists').then((res) => {
    //   if (res.data) {
    //     console.log();

    //   }
    // });
    const res = await fetch('https://tuhoc247.com/crawler/get-artists');
    res.json().then((data) => {
      if (data.code === 'success') {
        const artists = data.message;
        this.setState({artists});
      }
    });
  }

  _renderDiscover = (rowData) => {
    return (
      <TouchableOpacity
        style={{width: 255, marginRight: 20}}
        onPress={() =>
          this.props.navigation.navigate('Top100', {
            type: rowData.key,
          })
        }>
        <ImageBackground
          style={{width: 250, height: 150}}
          imageStyle={{borderRadius: 10}}
          source={rowData.img}>
          <Text style={styles.titleDiscovery}>{rowData.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  _renderSection = (rowData) => {
    return (
      <TouchableOpacity>
        <View style={styles.sectionItem}>
          <Icon name={rowData.icon} size={20} color="#E9446A" />
          <Text
            style={{
              marginTop: 5,
              fontFamily: 'barlow-semibold',
              textTransform: 'uppercase',
              color: '#06166f',
            }}>
            {rowData.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  hideSearch = () => {
    this.refs.modal6.close();
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.StatusBar}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
        </View>
        <View style={{flex: 1, paddingLeft: 24}}>
          <ScrollView>
            <View style={styles.topBar}>
              <Text style={styles.section}>Top 100</Text>
              <TouchableOpacity onPress={() => this.refs.modal6.open()}>
                <Icon name="search" size={24} />
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.entries_discovery}
                renderItem={(item, index) => this._renderDiscover(item.item)}
              />
            </View>
            <View style={styles.topBar}>
              <Text style={styles.section}>Albums</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 30,
              }}>
              <FlatList
                data={this.state.sections}
                renderItem={({item}) => this._renderSection(item)}
                numColumns={2}
              />
            </View>
            <View style={styles.topBar}>
              <Text style={styles.section}>Nổi Bật</Text>
            </View>
            <View>
              {this.state.artists.length > 0 ? (
                <ArtistList
                  data={this.state.artists}
                  navi={this.props.navigation}
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </ScrollView>
        </View>
        <View>
          <TrackBar />
        </View>
        <Modal
          style={[styles.modal]}
          position={'bottom'}
          ref={'modal6'}
          swipeArea={100}
          backdropOpacity={0.7}>
          <SearchBox hideMethod={() => this.hideSearch()} />
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 24,
    backgroundColor: '#fafafa',
  },
  StatusBar: {
    height: StatusBar.currentHeight,
  },
  topBar: {
    paddingRight: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  titleDiscovery: {
    margin: 25,
    marginTop: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontSize: 30,
    fontFamily: 'barlow-regular',
    color: '#DDD',
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  section: {
    fontSize: 25,
    fontFamily: 'barlow-semibold',
    borderLeftWidth: 3,
    padding: 0,
    borderLeftColor: '#E9446A',
    paddingLeft: 10,
    lineHeight: 30,
  },
  sectionItem: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 6,
    margin: 8,
    width: 160,
    height: 100,
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '90.5%',
    padding: 5,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
