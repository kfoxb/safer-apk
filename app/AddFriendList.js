import React, { Component } from 'react';
import Contacts from 'react-native-contacts';
import AddFriendItem from './AddFriendItem.js';
import { View, Text, StyleSheet, Button, ListView } from 'react-native';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

export default class AddFriendList extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      friends: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    };
    this.checkPermissionAndGet = this.checkPermissionAndGet.bind(this);
  };

  componentWillMount(){
    this.checkPermissionAndGet();
  };

  static navigationOptions = ({navigation}) => ({
    title: 'Add Friend',
    headerRight: navigation.state.params && navigation.state.params.SignUp && <View style={{marginRight: 10}} ><Button color='black' onPress={() => navigation.navigate('CreateGroup', {SignUp: true})} title='Next' /></View>
  });

  checkPermissionAndGet() {
    Contacts.checkPermission( (err, permission) => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if(permission === 'undefined'){
        Contacts.requestPermission( (err, permission) => {
          // ...
        })
      }
      if(permission === 'authorized'){
        // yay!
        Contacts.getAll((err, contacts) => {
          let friends = [];
          contacts.map((contact) => {
            let phoneNumbers = contact.phoneNumbers;
            if(phoneNumbers.length > 0) {
              let newFriend = {
                name: contact.givenName,
                phoneNumber: contact.phoneNumbers[0].number
              };
              friends.push(newFriend);
            }
          });
            AuthAxios({
              url: '/api/contacts',
              method: 'post',
              data: {friends: friends}
            })
            .then(({data}) => {
              let friends = data
              friends.sort((a, b) => {
                if (a.hasApp && b.hasApp) {
                  if (a.name > b.name) { return 1; }
                  if (a.name < b.name) { return -1; }
                }
                if (a.hasApp && b.hasApp === undefined) { return -1; }
                if (a.hasApp === undefined && b.hasApp) { return 1; }
                if (a.hasApp === undefined && b.hasApp === undefined) {
                  if (a.name > b.name) { return 1; }
                  if (a.name < b.name) { return -1; }
                }
                return 0;
              })
              this.setState({
                friends: this.state.friends.cloneWithRows(friends),
                loaded: true
              });
            })
            .catch((error) => {
              console.log('There was an error in fetching your data: ', error);
              return error;
            });
        })
      }
      if(permission === 'denied'){
        // x.x
      }
    })
  };

  render() {
    const params = this.props.navigation.state.params;

    if(this.state.loaded === true) {
      return this.renderContactList();
    }

    return (
      <View style={styles.container}>
      </View>
    );
  }

  renderContactList() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.friends}
        renderRow={(rowData) => <AddFriendItem friend={rowData} /> }
        style={styles.listView}
      />
    )
  }
};