import React, { Component } from 'react';
import { endpoint } from './endpoint.js';
import { Button, View, Text, StyleSheet, ListView, TouchableOpacity } from 'react-native';
import AuthAxios from './AuthAxios.js';

export default class HomeFavorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentWillMount() {
    console.log('HOME FAVORITE')
    // let {name} = this.props.navigation.state.params.data;
    fetch(`${endpoint}/api/groupUsers?name=FAVORITES`)
    .then(response => {
      return response.json();
    })
    .then(members => {
      this.setState({
        members: this.state.members.cloneWithRows(members)
      });
    })
    .catch(err => {
      console.log('there was an error in fetching members', err);
    });
  };

  render() {
    // const params = this.props.navigation.state.params;
    // const { navigate } = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => console.log("PRESSED")}
        title="Add Member To Favorite"
        />
        <ListView
          dataSource={this.state.members}
          renderRow={(rowData) => <Text style={{textAlign: 'center', fontSize: 20}}>{rowData.first}</Text>}
        />
      </View>
    );
  }
}