import {Container} from 'unstated';

class PlayListContainer extends Container {
  state = {
    playlist: [],
    current_song: '',
  };

  setPlayList = (playlist) => {
    // console.log(playlist);
    this.setState({playlist: playlist}, () => {
      // do something with new state
      console.log('done', this.state.playlist.length);
    });
  };

  currentSong = (id) => {
    this.setState({
      currentSong: id,
    });
  };
}

export default PlayListContainer;
