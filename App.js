import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import * as firebase from 'firebase';
import HomeScreen from './screens/app/HomeScreen';
import ProfileScreen from './screens/app/ProfileScreen';
import Top100Screen from './screens/app/modals/Top100Screen';
import SingerScreen from './screens/app/modals/SingerScreen';
import PlayerScreen from './screens/app/modals/PlayerScreen';
import LoginScreen from './screens/auth/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import TrackPlayer from './services/TrackPlayer';
import PLaylistScreen from './screens/app/modals/PLaylistScreen';

var firebaseConfig = {
  apiKey: 'AIzaSyB0PR3_Z-1jInWRanOGr5XYkf5BdvbYFag',
  authDomain: 'btl-mobile-app.firebaseapp.com',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// TrackPlayer.getInstance();
const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({tintColor}) => (
              <Icon name="home" size={25} color={tintColor} />
            ),
            headerShown: false,
          },
        },
        Play: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({tintColor}) => (
              <View style={styles.iconCenter}>
                <Icon name="activity" size={25} color="#fff" />
              </View>
            ),
            headerShown: false,
          },
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: ({tintColor}) => (
              <Icon name="user" size={26} color={tintColor} />
            ),
            headerShown: false,
          },
        },
      },
      {
        tabBarOptions: {
          showLabel: false,
          style: {
            borderRadius: 5,
            height: 80,
            borderTopColor: '#EEE',
          },
        },
      },
    ),
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
