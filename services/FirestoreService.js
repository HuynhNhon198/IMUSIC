/* eslint-disable no-alert */
import GLOBAL from '../global.js';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

class FirestoreService {
  async setData(col, id, data) {
    await firestore().collection(col).doc(id).set(data, {merge: true});
  }

  async saveFavorites(favorite_songs) {
    await this.setData('users', GLOBAL.user.uid, {
      favorite_songs,
    }).catch((err) => {
      alert(err);
    });
    GLOBAL.user.favorite_songs = favorite_songs;
    Snackbar.show({
      text: 'ĐÃ LƯU.',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
}

const firestoreService = new FirestoreService();
export default firestoreService;
