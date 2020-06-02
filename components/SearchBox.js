/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {getData} from '../services/helper';
import trackService from '../services/PlayerServices';
import {current_queue_name} from '../global';
export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.myTextInput = React.createRef();
    this.state = {
      result: [],
      loading: false,
      inputTextValue: '',
    };
  }

  search = async (text) => {
    this.setState({inputTextValue: text});
    if (text.length > 0) {
      this.setState({loading: true});
      const data = await getData(
        'https://echo.brandly.vn/api/media/search?term=' + text,
      );
      if (data && data.data) {
        this.setState({result: data.data.song});
        this.setState({loading: false});
      }
    } else {
      this.empty();
    }
  };

  empty = () => {
    this.setState({
      result: [],
      loading: false,
    });
  };
  openSong = async (id, alias) => {
    await trackService.playSongFromURL(id, alias, current_queue_name);
    this.props.hideMethod();
    // await storeStorage('currentSong', {id, alias}, this.props.navigation);
    // this.props.navigation.navigate('PlayOnline', {
    //   url: `https://echo.brandly.vn/api/media/song?name=${alias}&id=${id}`,
    // });
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.bar} />
        <View style={styles.searchbar}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              style={{
                alignSelf: 'center',
                justifyContent: 'flex-start',
                marginRight: 10,
              }}
              name="search"
              size={20}
            />
            <TextInput
              value={this.state.inputTextValue}
              onChangeText={(text) => this.search(text)}
              autoFocus
              autoCapitalize
              placeholder="Tìm Kiếm Bài Hát"
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              onPress={() => {
                this.setState({inputTextValue: ''});
                this.empty();
              }}
              name="x"
              size={20}
              color="#E9446A"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.results}>
          {this.state.result.length > 0 ? (
            <View style={{marginTop: 20}}>
              <ScrollView
                ref={(ref) => {
                  this.scrollListReftop = ref;
                }}>
                {this.state.result.map((song, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.song}
                      onPress={() => this.openSong(song.id, song.alias)}>
                      <Icon
                        style={{alignSelf: 'center'}}
                        name="music"
                        size={24}
                        color="#E9446A"
                      />
                      <View style={styles.songInfo}>
                        <Text
                          style={{
                            fontFamily: 'barlow-semibold',
                            fontSize: 17,
                            color: '#3e3e3e',
                          }}>
                          {song.title}
                        </Text>
                        <Text style={{color: '#888'}}>
                          {song.artists_names}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : this.state.loading ? (
            <ActivityIndicator
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
              size="large"
            />
          ) : (
            <View style={styles.empty}>
              <Text style={{fontFamily: 'barlow-semibold', fontSize: 20}}>
                Không Có Kết Quả Tìm Kiếm
              </Text>
              <Text style={{marginTop: 10, color: '#888'}}>
                Bạn gõ theo tên bài hát để tìm nhé
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = new StyleSheet.create({
  bar: {
    width: 100,
    height: 5,
    backgroundColor: '#DDD',
    marginVertical: 5,
    marginBottom: 10,
    borderRadius: 2,
    alignSelf: 'center',
  },
  searchbar: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: -5,
    borderColor: '#EEE',
    borderRadius: 30,
    borderWidth: 0,
    width: Dimensions.get('window').width - 40,
    // elevation: 200,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  song: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 3,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  songInfo: {
    marginLeft: 10,
  },
});
