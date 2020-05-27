/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, ImageBackground} from 'react-native';
import * as firebase from 'firebase';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '136005534027-f7pfcja68uov748h62rm9ad15al8hb00.apps.googleusercontent.com',
});
export default class LoginScreen extends Component {
  // static navigationOptions = {
  //   headerStyle: {display: 'none'},
  //   header: null,
  // };

  state = {
    email: '',
    password: '',
    errorMessage: null,
  };

  handleLogin = () => {
    const {email, password} = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        alert(err.message);
      });
  };

  googleSignInHandle = async () => {
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
    );

    // Sign-in the user with the credential
    return firebase.auth().signInWithCredential(googleCredential);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* <ImageBackground
          source={require('../assets/music_girl.png')}
          style={{width: '100%', height: '100%'}}> */}
        {/* <View> */}
        <Text style={styles.greeting}>{'IMUSIC'}</Text>
        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              style={styles.input}
              textContentType="emailAddress"
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
          </View>

          <View style={{marginTop: 32}}>
            <Text style={styles.inputTitle}>Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text
            style={{
              fontWeight: '500',
              color: '#FFF',
              textTransform: 'uppercase',
            }}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>

        <Text style={{alignSelf: 'center', marginTop: 16, marginBottom: 16}}>
          Hoặc
        </Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#2196f3'}]}
          onPress={this.googleSignInHandle}>
          <Text
            style={{
              fontWeight: '500',
              color: '#FFF',
              textTransform: 'uppercase',
            }}>
            <Icon name="google-plus" size={14} /> Đăng Nhập Bằng Google
          </Text>
        </TouchableOpacity>
        <ImageBackground
          source={require('../../assets/music_girl.png')}
          style={{
            width: '100%',
            height: '60.5%',
            bottom: 0,
            position: 'relative',
            marginTop: 32,
          }}
        />
        {/* </View> */}
        {/* </ImageBackground> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  greeting: {
    marginTop: 80,
    marginBottom: 32,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E9446A',
    fontFamily: 'monospace',
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 48,
    fontSize: 15,
    color: '#161F3D',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#E9446A',
    borderRadius: 25,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    elevation: 6,
    shadowRadius: 1,
    shadowOffset: {width: 1, height: 2},
  },
  image: {
    // width: '100%',
    // flex: 1,
    // resizeMode: 'cover',
  },
});
