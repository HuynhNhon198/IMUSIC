import RNTrackPlayer from 'react-native-track-player';

class TrackPlayer {
  /** A wrapper API around RNTrackPlayer
   *
   * This API simplifies using RNTrackPlayer by exposing methods to do common things.
   */
  instance;

  // this allows us to get a current instance, or make an instance of the player
  // and stops us reinitialising the player
  static getInstance() {
    if (!TrackPlayer.instance) {
      TrackPlayer.instance = new TrackPlayer();
      TrackPlayer.instance.init();
      return TrackPlayer.instance;
    }

    return TrackPlayer.instance;
  }

  init() {
    // set up the player so we can use it
    RNTrackPlayer.setupPlayer({
      iosCategoryMode: 'spokenAudio',
    });

    // add support for capabilities
    const capabilities = [
      RNTrackPlayer.CAPABILITY_PLAY,
      RNTrackPlayer.CAPABILITY_PAUSE,
      RNTrackPlayer.CAPABILITY_SEEK_TO,
    ];

    // list of options for the player
    const options = {
      stopWithApp: true,
      // An array of media controls capabilities
      capabilities,
      // An array of capabilities that will show up when the notification is in the compact form
      compactCapabilities: capabilities,
    };

    // update the options
    RNTrackPlayer.updateOptions(options);
  }

  createTrack = (item) => {
    const {url, title, id, artwork, artist} = item;
    const track = {
      id,
      url,
      title,
      artist,
      artwork,
      // here we use the voice algorithm, as it improves the quality of speech audio
      pitchAlgorithm: RNTrackPlayer.PITCH_ALGORITHM_VOICE,
    };

    return track;
  };

  pause = () => RNTrackPlayer.pause();

  isPlaying = async () => {
    const currentState = await RNTrackPlayer.getState();
    return currentState === RNTrackPlayer.STATE_PLAYING;
  };

  togglePlay = async () => {
    const isPlaying = await this.isPlaying();

    if (isPlaying) {
      return RNTrackPlayer.pause();
    } else {
      return RNTrackPlayer.play();
    }
  };

  next = () => RNTrackPlayer.skipToNext();
  previous = () => RNTrackPlayer.skipToPrevious();

  // add before the current playing item
  // the types here simply specify that we're expecting either
  // an array of items we can play, or a single item we can play
  prependToQueue = async (playables) => {
    const audioFiles = Array.isArray(playables)
      ? playables.map((item) => this.createTrack(item))
      : this.createTrack(playables);

    const currentTrackId = await this.getCurrentTrackId();
    RNTrackPlayer.add(audioFiles, currentTrackId);
  };

  // add after the current playing item
  appendToQueue = (playables) => {
    const audioFiles = Array.isArray(playables)
      ? playables.map((item) => this.createTrack(item))
      : this.createTrack(playables);
    RNTrackPlayer.add(audioFiles);
  };

  addTrackChangeListener = (callback) =>
    RNTrackPlayer.addEventListener('playback-track-changed', callback);
}

export default TrackPlayer;
