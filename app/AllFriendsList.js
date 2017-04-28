import FriendMap from './FriendMap.js';
import React, { Component } from 'react';
import Contacts from 'react-native-contacts';
import { View, Text, StyleSheet, Button, ListView, TouchableOpacity } from 'react-native';
import AuthAxios from './AuthAxios.js';
import PushController from './FCM/PushController.js';
import styles from './styles.js';

export default class AllFriendsList extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      friends: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
      privacy: '',
    };
    this.getFriends = this.getFriends.bind(this);
  };

  static navigationOptions = ({navigation}) => ({
    title: 'Friends'
  });

  componentWillMount() {
    this.getFriends();
  }

  newFriendRequest() {
    this.getFriends();
  }

  getFriends() {
    AuthAxios({
      url: '/api/friends'
    })
    .then(({data}) => {
      this.setState({
        friends: this.state.friends.cloneWithRows(data),
        loaded: true
      });
    })
    .catch((error) => {
      console.log('There was an error in fetching your data: ', error);
      return error;
    });
  }

  render() {
    const params = this.props.navigation.state.params;

    if(this.state.loaded === true) {
      return this.renderContactList();
    }

    return (
      <View style={styles.container}>
        <PushController friendRequest={this.newFriendRequest}/>
        <Text>Loading Friends...</Text>
      </View>
    );
  }

  renderContactList() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.friends}
        renderRow={(rowData) => this.renderContacts(rowData)}
        style={styles.listView}
      />
    )
  }

  renderContacts(friend) {
    const { navigate } = this.props.navigation;
    let privacy = friend.showSetting;
    let label = friend.currentLabel;
    if (privacy === 'request' || privacy === 'pending') {
      label = privacy.charAt(0).toUpperCase() + privacy.slice(1);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigate('FriendMap', {data: friend}) }
        >
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{friend.first} {friend.last}</Text>
            <Text style={styles.label}>{label}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
};