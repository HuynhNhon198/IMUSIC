/* eslint-disable no-alert */
import TrackPlayer from 'react-native-track-player';
import {getStorage, storeStorage, getData, startTrackNoty} from './helper';
import GLOBAL from '../global.js';
class TrackService {
  async setup() {
    await TrackPlayer.setupPlayer({});
    TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  }
  async playSongFromURL(id, alias, typeName) {
    const re = await this.PlaySongInQueue(id, typeName);
    if (!re) {
      let song = await this.getSongFromServer(id, alias);
      if (song) {
        song = this.getInfoOfServerToSave(song);
        await this.addSongToQueue(song, typeName);
        await this.PlaySongInQueue(id, typeName, 1);
        await this.saveNextToQueue(id, typeName, 1);
      } else {
        alert('Bạn phải là thành viên VIP mới nghe được bài này');
      }
    }
    await this.saveNextToQueue(id, typeName, 1);
  }

  async getQueue() {
    return await TrackPlayer.getQueue();
  }

  getSongFromServer(id, alias) {
    const url = `https://tuhoc247.com/crawler/get-song?alias=${alias}&id=${id}`;
    return new Promise((r, j) => {
      getData(url).then(async (data) => {
        if (data.code === 'success') {
          const info = data.message.data;
          if (info) {
            r(info);
          } else {
            r(null);
          }
        }
      });
    });
  }

  async getQueueFromStorage(typeName) {
    const data = await getStorage(`queues-${typeName}`);
    if (data) {
      await this.saveQueueToGlobal(typeName, data);
    }
    return data;
  }

  async saveQueueToGlobal(typeName, queues) {
    await new Promise((r) => {
      let currents = GLOBAL.currentQueue || [];
      const ind = currents.findIndex((x) => x.typeName === typeName);
      ind === -1
        ? (currents = [
            ...currents,
            {
              typeName,
              queues,
            },
          ])
        : (currents[ind].queues = queues);
      GLOBAL.currentQueue = currents;
      r();
    });
  }

  async addSongToQueue(song, typeName) {
    let queues = await this.getQueue();
    const ind = queues.findIndex((x) => x.id === song.id);
    if (ind === -1) {
      TrackPlayer.add([song], null);
      queues = [...queues, song];
      await this.saveQueueToStorage(queues, typeName);
      return true;
    }
    return undefined;
  }

  async saveQueueToStorage(queues, typeName) {
    await storeStorage(`queues-${typeName}`, queues);
    await this.saveQueueToGlobal(typeName, queues);
  }

  getInfoOfServerToSave(song) {
    return {
      id: song.id,
      url: `http://api.mp3.zing.vn/api/streaming/audio/${song.id}/128`,
      title: song.title,
      artist: song.artists_names,
      artwork: song.thumbnail.replace('w94_r1x1', 'w500_r1x1'),
      duration: song.duration,
      alias: song.alias,
    };
  }

  current_idi = '';
  inG = 1;
  async saveNextToQueue(current_id, typeName, i) {
    this.current_idi = current_id;
    const ind = GLOBAL.current_list.findIndex((x) => x.id === current_id);
    if (ind > -1) {
      const next = GLOBAL.current_list[ind + (i ? i : 1)];
      if (next) {
        const check = await this.checkSongInQueue(next.id);
        if (!check) {
          let song = await this.getSongFromServer(next.id, next.alias);
          if (song) {
            song = this.getInfoOfServerToSave(song);
            await this.addSongToQueue(song, typeName);
            this.inG = 1;
            return true;
          } else if (song === null) {
            this.inG += 1;
            await this.saveNextToQueue(current_id, typeName, this.inG);
          }
        }
      } else {
        await this.saveNextToQueue(GLOBAL.current_list[0].id, typeName, 1);
      }
    } else {
      await this.saveNextToQueue(GLOBAL.current_list[0].id, typeName, 1);
    }
    return;
  }

  async checkSongInQueue(id) {
    const queues = await this.getQueue();
    return queues.find((x) => x.id === id) ? true : false;
  }

  async PlaySongInQueue(id, typeName) {
    if (GLOBAL.current_queue_name !== typeName) {
      storeStorage('queueName', typeName);
    }
    const queues = GLOBAL.currentQueue.find((x) => x.typeName === typeName);
    if (queues) {
      const song = queues.queues.find((x) => x.id === id);
      if (song) {
        this.setup();
        TrackPlayer.reset();
        await TrackPlayer.add(queues.queues);
        await TrackPlayer.skip(id);
        await TrackPlayer.play();
        startTrackNoty(song.title);
        GLOBAL.current_queue_name = typeName;
        await storeStorage('currentSong', song);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async togglePlayback(playbackState, url) {
    const {id, alias, typeName} = url;
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await this.playSongFromURL(id, alias, typeName);
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }

  async actionTrack(action) {
    // const id = GLOBAL.current_song.id || '';
    // const typeName = GLOBAL.current_queue_name;
    try {
      switch (action) {
        case 'next':
          try {
            await TrackPlayer.skipToNext();
            // await this.saveNextToQueue(id, typeName, 1);
          } catch (error) {}
          break;
        case 'previous':
          try {
            await TrackPlayer.skipToPrevious();
          } catch (error) {}
          break;

        default:
          break;
      }
    } catch (error) {}
  }
}
const trackService = new TrackService();
export default trackService;
