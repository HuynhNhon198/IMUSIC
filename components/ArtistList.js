/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';

export default class ArtistList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderItem = (item, index) => {
    return (
      <View style={{marginBottom: 20}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={item.item.artists}
          renderItem={({item: artist}) => {
            return (
              <TouchableOpacity
                style={{width: 110, marginRight: 20}}
                onPress={() =>
                  this.props.navi.navigate('Singer', {
                    alias: artist.link.replace('/nghe-si/', ''),
                  })
                }>
                <Image
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 8,
                    marginBottom: 5,
                  }}
                  source={{uri: artist.thumb}}
                />
                <Text>{artist.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(i, ind) => `${ind}`}
        />
      </View>
    );
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    );
  }
}
