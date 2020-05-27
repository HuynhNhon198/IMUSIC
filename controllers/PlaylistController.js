// libs
import {Container} from 'unstated';

// audio
import TrackPlayer from 'Modules/Audio/TrackPlayer';

// below we define the types for the playlist controller

// we use unstated here to store the playlist
// and so we can pass it around

export const initialState = {
  playlist: [],
  playingItem: null,
};
class PlaylistController extends Container {
  /** Control and interact with items on the app playlist.
   *
   * This controller allows us to interact with the playlist-style data structure.
   *
   * It should be used for all things relating to playlist state, such as subscribing to it
   * (via the Unstated container), or modifying it (via this class directly).
   *
   * Note: this controller only deals with PlaylistItems. Whatever you add to the playlist
   * queue must already be a PlaylistItem. Conversion from other data must happen prior to
   * queuing.
   */
  state = initialState;
  constructor() {
    super();

    const trackChangeListener = TrackPlayer.addTrackChangeListener(
      this.onTrackChange,
    );
    this.removeTrackChangeListener = trackChangeListener.remove;
  }
  removeTrackChangeListener;

  // we can remove any listeners we set up here
  removeListeners() {
    this.removeTrackChangeListener();
  }

  // listener trigger to update the current playing item
  onTrackChange = async () => {
    await this.updateCurrentPlayingItem();
  };

  // here we do some error checking to ensure that we're updating as we expect
  updateCurrentPlayingItem = async () => {
    const playingItemId = await TrackPlayer.getInstance().getCurrentTrackId();
    // no playing item and therefore listener is being trigged on a abnormal situation (e.g. logging out)
    if (playingItemId === null) {
      return;
    }

    const playingItem = this.state.playlist.find(
      (item) => item.id === playingItemId,
    );

    if (!playingItem) {
      throw new Error(
        'Changed track to an item that has not been added to the playlist',
      );
    }

    this.setState({playingItem});

    return playingItem;
  };
  togglePlay = async () => {
    const trackPlayer = TrackPlayer.getInstance();
    const isPlaying = await trackPlayer.isPlaying();

    if (isPlaying) {
      trackPlayer.togglePlay();
    } else {
      await trackPlayer.togglePlay();
    }
  };

  pause = () => TrackPlayer.getInstance().pause();

  next = () => TrackPlayer.getInstance().next();

  previous = () => TrackPlayer.getInstance().previous();

  addToPlaylist = async (...items) => {
    await this.setState(({playlist}) => ({
      playlist: [...playlist, ...items],
    }));
    return Promise.all(
      items.map((item) => TrackPlayer.getInstance().appendToQueue(item.data)),
    );
  };

  addBeforePlaylist = (...items) => {
    this.setState(({playlist}) => ({
      playlist: [...items, ...playlist],
    }));
    return Promise.all(
      items.map((item) => TrackPlayer.getInstance().prependToQueue(item.data)),
    );
  };

  clearPlaylist = () => {
    this.setState(initialState);
    return TrackPlayer.getInstance().clear();
  };

  // this creates a playlist with the items
  // we access this directly to add items to the playlist
  createPlaylistFrom = async ({items, startingAtId}) => {
    const before = [];
    const after = [];

    // Split the items at the starting at item
    // so we can queue the tracks
    items.forEach((item) => {
      if (item.id === startingAtId || after.length > 0) {
        after.push(item);
      } else {
        before.push(item);
      }
    });

    await this.addToPlaylist(...after);
    await this.addBeforePlaylist(...before);
  };
}

const playlistController = new PlaylistController();
export default playlistController;
