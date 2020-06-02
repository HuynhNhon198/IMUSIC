import React, {Component} from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import GLOBAL from '../global.js';
export default class LoadingScreen extends Component {
  componentDidMount() {
    auth().onAuthStateChanged(async (user) => {
      if (user) {
        GLOBAL.user = (
          await firestore().collection('users').doc(user.uid).get()
        ).data();
        GLOBAL.user.favorite_songs = GLOBAL.user.favorite_songs || [];
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/splash.png')}
        style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ActivityIndicator size="large" />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
