import {Container} from 'unstated';

class PlayListContainer extends Container {
  state = {
    playlist: [],
    current_song: '',
  };

  setPlayList = (playlist) => {
    this.setState({playlist: playlist}, () => {
      // do something with new state
    });
  };

  currentSong = (id) => {
    this.setState({
      currentSong: id,
    });
  };
}

export default PlayListContainer;
