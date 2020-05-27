/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTrackPlayerProgress} from 'react-native-track-player';

export default function ProgressBarComponent() {
  const progress = useTrackPlayerProgress();

  return (
    <View style={styles.progress}>
      <View style={{flex: progress.position, backgroundColor: '#e9446a'}} />
      <View
        style={{
          flex: progress.duration - progress.position,
          backgroundColor: '#EEE',
        }}
      />
    </View>
  );
}

const styles = new StyleSheet.create({
  progress: {
    height: 3,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
  },
});
