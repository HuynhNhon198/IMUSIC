/* eslint-disable no-alert */
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from './global.js';
export async function getData(url) {
  const data = await axios.get(url).catch((err) => {
    console.log(err);
    alert(err);
  });
  return data.data;
}

export async function createMiliSec() {
  return new Date().getTime();
}

export async function storeStorage(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    switch (key) {
      case 'playlistOnline':
        GLOBAL.playlistOnline = value.list;
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
    console.log(e);
  }
}

export async function getStorage(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log(jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // saving error
    console.log(e);
  }
}
