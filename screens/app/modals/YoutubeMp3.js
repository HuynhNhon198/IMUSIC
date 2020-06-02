/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import {getData} from '../../../services/helper';

PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
);

export default class YoutubeMp3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: undefined,
      status: 'ds',
    };
  }

  async convert() {
    this.setState({status: 'Đang kiểm tra...'});
    const url =
      //   'https://vnno-vn-6-tf-mp3-s1-zmp3.zadn.vn/3b660c0a194df013a95c/827175346404194722?authen=exp=1591002508~acl=/3b660c0a194df013a95c/*~hmac=a4f04739d2b35c961623a374b4863c1a';
      'https://tuhoc247.com/ytb-to-mp3/' + this.state.info.id;
    const name = this.state.info.title;

    let r = await fetch(url);
    if (r.status === 404) {
      this.setState({status: 'Đang chuyển đổi...'});
      const re = await getData(
        'https://tuhoc247.com/ytb-to-mp3/convert?link=' + this.state.info.link,
      );
      if (re.code === 'success') {
        this.download(url, name);
      } else {
        this.setState({status: ''});
        alert(re.message);
      }
    } else {
      this.download(url, name);
    }
  }

  download(url, name) {
    this.setState({status: 'Đang tải nhạc...'});
    RNFetchBlob.config({
      fileCache: false,
      appendExt: 'mp3',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: name,
        path: RNFetchBlob.fs.dirs.MusicDir + `/${name}.mp3`, // Android platform
        description: 'Downloading the file',
      },
    })
      .fetch('GET', url)
      .then((res) => {
        this.setState({status: 'Hoàn Thành... Lưu tại' + res.path()});
      });
  }

  async retrieveInfo(text) {
    this.setState({info: undefined});
    this.setState({status: ''});
    var regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    if (regex.test(text)) {
      let r = await fetch(
        'https://tuhoc247.com/ytb-to-mp3/get-info?link=' + text,
      );
      r = await r.text();
      r = JSON.parse(r);
      if (r && r.id) {
        this.setState({info: r});
      }
    }
  }
  render() {
    const info = this.state.info;
    return (
      <View style={styles.container}>
        <Icon
          style={{alignSelf: 'flex-start', marginLeft: 20}}
          name="chevron-left"
          size={30}
          onPress={() => this.props.navigation.goBack()}
        />
        <Image
          source={require('../../../assets/youtube.png')}
          resizeMode="contain"
          style={{width: 100, marginBottom: 10}}
        />
        <Icon name="arrow-down" size={40} color="#c90232" />
        <ScrollView style={styles.content}>
          <TextInput
            autoFocus={true}
            onChangeText={(text) => this.retrieveInfo(text)}
            placeholder="Nhập link youtube tại đây"
            style={{
              fontSize: 20,
              marginBottom: 20,
              borderColor: '#f5393a24',
              borderWidth: 1,
              paddingHorizontal: 20,
              borderRadius: 3,
            }}
          />

          <View>
            {info ? (
              <View style={styles.preview}>
                <Icon
                  name="arrow-down"
                  size={40}
                  color="#c90232"
                  style={{marginBottom: 20, alignSelf: 'center'}}
                />

                <Image
                  source={{uri: info.thumb}}
                  // resizeMode="contain"
                  style={{
                    width: '100%',
                    height: 200,
                    marginBottom: 10,
                    borderRadius: 6,
                  }}
                />
                <Text style={{fontFamily: 'barlow-semibold', fontSize: 20}}>
                  {info.title}
                </Text>
                <Text
                  style={{fontWeight: '600', fontSize: 14, color: '#575757'}}>
                  {info.author?.name}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.convert()}>
                  <Text
                    style={{
                      color: '#c90232',
                      fontSize: 25,
                      fontFamily: 'barlow-semibold',
                    }}>
                    TẢI NHẠC
                  </Text>
                </TouchableOpacity>
                <View style={{alignSelf: 'center'}}>
                  <Text>{this.state.status}</Text>
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  content: {
    marginVertical: 20,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5393a24',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginVertical: 20,
  },
  preview: {
    marginHorizontal: 20,
  },
});
