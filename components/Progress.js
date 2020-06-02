/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTrackPlayerProgress} from 'react-native-track-player';

export default function ProgressBarComponent(props) {
  const progress = useTrackPlayerProgress();
  const showSecond = props.showSecond;
  const {position, bufferedPosition, duration} = useTrackPlayerProgress();
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={{flex: progress.position, backgroundColor: '#e9446a'}} />
        <View
          style={{
            flex: progress.duration - progress.position,
            backgroundColor: '#EEE',
          }}
        />
      </View>
      {showSecond && position > 0 ? (
        <View
          style={{
            // marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // marginHorizontal: 20,
          }}>
          <Text style={styles.duration}>{convertToTimeView(position)}</Text>
          <Text style={styles.duration}>{convertToTimeView(props.total)}</Text>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}

function convertToTimeView(sec) {
  sec = +sec.toFixed(0);
  const quotient = Math.floor(sec / 60);
  const remainder = sec % 60;
  const newRemainder = remainder < 10 ? '0' + remainder : remainder;
  return `${quotient}:${newRemainder}`;
}
const styles = new StyleSheet.create({
  progress: {
    height: 3,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
  },
  duration: {
    fontFamily: 'barlow-medium',
    color: 'rgb(97, 97, 97)',
    marginTop: 20,
  },
});
