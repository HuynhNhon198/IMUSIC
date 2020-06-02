/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import GLOBAL from '../../global.js';

import Icon from 'react-native-vector-icons/Feather';
export default class ProfileScreen extends Component {
  _isMounted = false;
  state = {
    email: '',
    displayName: '',
    photoURL: 'https://reactnative.dev/docs/assets/p_cat2.png',
  };

  alertTest = (text) => {
    alert(text);
  };

  actionOnOption(item) {
    switch (item.id) {
      case '1':
        this.props.navigation.navigate('MyLocalSong');
        break;
      case '2':
        this.props.navigation.navigate('Favorites');
        break;
      case '4':
        this.props.navigation.navigate('YtbMp3');
        break;
      case '7':
        this.signOut();
        break;

      default:
        break;
    }
  }

  options = [
    {
      id: '1',
      name: 'Nhạc của tôi',
      icon: 'music',
    },
    {
      id: '2',
      name: 'Yêu thích',
      icon: 'heart',
    },
    {
      id: '3',
      name: 'Kết nối',
      icon: 'message-square',
    },
    {
      id: '4',
      name: 'Tải nhạc Youtube',
      icon: 'youtube',
    },
    {
      id: '5',
      name: 'Cài đặt chung',
      icon: 'sliders',
    },
    {
      id: '6',
      name: 'Trợ giúp',
      icon: 'info',
    },
    {
      id: '7',
      name: 'Đăng xuất',
      icon: 'log-out',
    },
  ];

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      auth().onAuthStateChanged(async (user) => {
        if (user) {
          const {email, displayName, photoURL} = GLOBAL.user;
          this.setState({email, displayName, photoURL});
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  signOut = () => {
    auth().signOut();
    GoogleSignin.signOut();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ImageBackground
          style={{height: 170}}
          source={{uri: this.state.photoURL}}
          blurRadius={Platform.OS === 'ios' ? 6 : 1}
        />
        <View
          style={{
            backgroundColor: '#fafafa',
            borderRadius: 50,
            marginTop: -55,
          }}>
          <View style={styles.info}>
            <Image
              style={styles.avatar}
              source={{
                uri: this.state.photoURL,
              }}
            />
            <Text style={styles.name}>{this.state.displayName}</Text>
            <Text style={{color: 'rgba(149, 149, 149, 0.8)'}}>
              {this.state.email}
            </Text>
          </View>
          <FlatList
            style={styles.list}
            data={this.options}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.actionOnOption(item)}>
                <View style={styles.list_item}>
                  <Text style={styles.list_item_text}>{item.name}</Text>
                  <Icon name={item.icon} size={16} color="#E9446A" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 30,
    backgroundColor: '#fafafa',
  },
  info: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -105,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#273b30',
  },
  list: {
    padding: 10,
  },
  list_item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderLeftWidth: 3,
    // borderLeftColor: '#E9446A',
    borderRadius: 3,
  },
  list_item_text: {
    fontSize: 15,
    textTransform: 'capitalize',
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'barlow-semibold',
  },
});
