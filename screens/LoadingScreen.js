import React, {Component} from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as firebase from 'firebase';

export default class LoadingScreen extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      setTimeout(() => {
        this.props.navigation.navigate(user ? 'App' : 'Auth');
      }, 1500);
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
