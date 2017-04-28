import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, ListView, TouchableOpacity } from 'react-native';

import PushController from './FCM/PushController.js';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  };

  componentWillMount() {
    AuthAxios({
      url: `/api/groupUsers?name=FAVORITES`
    })
    .then(({data}) => {
      let members = data;
      this.setState({members: this.state.members.cloneWithRows(members)});
    })
    .catch(err => {
      console.log('There was an error fetching members', err);
    });
  }

  static navigationOptions = {
    title: 'Favorites'
  };
  render() {
    return (
      <View style={styles.container}>
        <PushController />
        <ListView
          enableEmptySections={true}
          dataSource={this.state.members}
          style={styles.listView}
          renderRow={(rowData) => this.renderMembers(rowData) }
        />
      </View>
    );
  }

  renderMembers(memberData) {
    const { navigate } = this.props.navigation;
    let privacy = memberData.showSetting;
    let label = memberData.currentLabel;
    if (privacy === 'request' || privacy === 'pending') {
      label = privacy.charAt(0).toUpperCase() + privacy.slice(1);
    }

    return (
      <TouchableOpacity
        onPress={() => navigate('FriendMap', {data: memberData}) }
      >
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{memberData.first} {memberData.last}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
