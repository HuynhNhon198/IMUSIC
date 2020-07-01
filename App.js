import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// import * as firebase from 'firebase';
// import 'firebase/firestore';
import firebase from '@react-native-firebase/app';
import HomeScreen from './screens/app/HomeScreen';
import ProfileScreen from './screens/app/ProfileScreen';
import Top100Screen from './screens/app/modals/Top100Screen';
import SingerScreen from './screens/app/modals/SingerScreen';
import PlayerScreen from './screens/app/modals/PlayerScreen';
import LoginScreen from './screens/auth/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';

import PLaylistScreen from './screens/app/modals/PLaylistScreen';
import MyLocalSong from './screens/app/modals/MyLocalSong';
import YoutubeMp3 from './screens/app/modals/YoutubeMp3';
import Favorites from './screens/app/modals/Favorites.js';

var firebaseConfig = {
  apiKey: 'AIzaSyB0PR3_Z-1jInWRanOGr5XYkf5BdvbYFag',
  authDomain: 'btl-mobile-app.firebaseapp.com',
  projectId: 'btl-mobile-app',
  appId: '1:136005534027:web:1ef9cdfd9f46891358a8ce',
  databaseURL: 'https://btl-mobile-app.firebaseio.com',
  messagingSenderId: '136005534027',
  // storageBucket: 'btl-mobile-app.appspot.com',
};
// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({experimentalForceLongPolling: true});
// auth().onAuthStateChanged(async (user) => {
//   if (user && user !== null) {
//     console.log(user);
//     // GLOBAL.user = (
//     //   await firebase.firestore().collection('users').doc(user.uid).get()
//     // ).data();
//   }
// });
// TrackPlayer.getInstance();

const AppContainer = createStackNavigator(
  {
    // default: createBottomTabNavigator(
    //   {
    //     Home: {
    //       screen: HomeScreen,
    //       navigationOptions: {
    //         tabBarIcon: ({tintColor}) => (
    //           <Icon name="music" size={25} color={tintColor} />
    //         ),
    //         headerShown: false,
    //       },
    //     },
    //     Play: {
    //       screen: HomeScreen,
    //       navigationOptions: {
    //         tabBarIcon: () => (
    //           <View style={styles.iconCenter}>
    //             <Icon name="activity" size={25} color="#fff" />
    //           </View>
    //         ),
    //         headerShown: false,
    //       },
    //     },
    //     Profile: {
    //       screen: ProfileScreen,
    //       navigationOptions: {
    //         tabBarIcon: ({tintColor}) => (
    //           <Icon name="user" size={25} color={tintColor} />
    //         ),
    //         headerShown: false,
    //       },
    //     },
    //   },
    //   {
    //     tabBarOptions: {
    //       showLabel: false,
    //       style: {
    //         borderRadius: 5,
    //         height: 80,
    //         borderTopColor: '#EEE',
    //       },
    //     },
    //   },
    // ),
    default: {
      screen: HomeScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Top100: {
      screen: Top100Screen,
    },
    Singer: {
      screen: SingerScreen,
    },
    PlayOnline: {
      screen: PlayerScreen,
    },
    Playlist: {
      screen: PLaylistScreen,
    },
    MyLocalSong: {
      screen: MyLocalSong,
    },
    YtbMp3: {
      screen: YoutubeMp3,
    },
    Favorites: {
      screen: Favorites,
    },
    Home: {
      screen: HomeScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: {
        screen: AppContainer,
      },
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);

const styles = new StyleSheet.create({
  iconCenter: {
    backgroundColor: '#E9446A',
    padding: 15,
    borderRadius: 30,
    color: '#FFF',
  },
});
