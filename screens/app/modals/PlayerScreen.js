/* eslint-disable react/no-string-refs */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Platform,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import GLOBAL from '../../../global.js';
import ActionPlayerbar from '../../../components/ActionPlayerbar';

// import PlayListContainer from '../../../containers/playlistContainer';
export default class PlayerScreen extends Component {
  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
  }
  // slide = new SlidingUpPanel();
  async componentDidMount() {
    this.StartImageRotateFunction();
  }

  handleHide() {
    this.props.hideMethod();
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }

  durationCount(current) {
    this.setState({duration: current / 100});
  }
  render() {
    const song = this.props.song;
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return song ? (
      <View style={styles.container}>
        <ImageBackground
          style={{height: 300}}
          source={{uri: song.artwork}}
          blurRadius={Platform.OS === 'ios' ? 6 : 3}>
          <View style={styles.menuBar}>
            <TouchableOpacity
              onPress={() => this.handleHide()}
              style={{
                backgroundColor: 'rgba(0, 15, 20, 0.52)',
                paddingHorizontal: 20,
                paddingVertical: 3,
                borderRadius: 25,
              }}>
              <Icon style={{color: '#FFF'}} name="chevron-down" size={25} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.content}>
          <Animated.Image
            style={{
              width: 300,
              height: 300,
              borderRadius: 300,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: -160,
              marginBottom: 20,
              borderWidth: 6,
              borderColor: 'rgba(254, 254, 254, 0.24)',
              transform: [{rotate: RotateData}],
            }}
            source={{uri: song.artwork}}
          />
          <ScrollView />
          <ActionPlayerbar
            navi={this.props.navi}
            typeName={GLOBAL.current_queue_name}
            song={song}
          />
          {/* <PlayerBar typeName={GLOBAL.current_queue_name} song={song} /> */}
        </View>
      </View>
    ) : (
      <ActivityIndicator
        style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}
        size="large"
      />
    );
  }
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    borderRadius: 40,
  },
  menuBar: {
    flexDirection: 'row',
    marginVertical: 35,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -60,
    padding: 24,
    paddingRight: 20,
    paddingBottom: 0,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#e9446a',
    borderRadius: 50,
    elevation: 10,
  },
  buttonSkip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 40,
    marginHorizontal: 50,
  },
  duration: {
    fontFamily: 'barlow-medium',
    color: 'rgb(97, 97, 97)',
  },
  titleArea: {
    marginHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'barlow-semibold',
    width: 250,
  },
});
