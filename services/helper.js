// /* eslint-disable no-alert */
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js';

export async function getData(url) {
  const data = await axios.get(url).catch((err) => {
    // alert(err);
  });
  return data?.data || undefined;
}

export async function createMiliSec() {
  return new Date().getTime();
}

export async function storeStorage(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    switch (key) {
      case 'playlistOnline':
        if (value.name !== GLOBAL.playlist_name) {
          GLOBAL.current_list = value.list;
        }
        break;
      case 'currentSong':
        GLOBAL.current_song = value;
        break;
      default:
        break;
    }
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
}

export async function getStorage(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : undefined;
  } catch (e) {
    // saving error
  }
}
