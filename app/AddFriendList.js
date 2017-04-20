import React, { Component } from 'react';
import {endpoint} from './endpoint.js';
import Contacts from 'react-native-contacts';
import AddFriendItem from './AddFriendItem.js';
import { View, Text, StyleSheet, Button, ListView } from 'react-native';
import AuthAxios from './AuthAxios.js';

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
    console.log("will mount in addfriend")
    this.checkPermissionAndGet();
  };

  static navigationOptions = {
    title: 'Add Friend'
  };

  checkPermissionAndGet() {
    Contacts.checkPermission( (err, permission) => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      console.log(permission)
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
          // fetch(`${endpoint}/api/contacts`, {
          //   method: 'POST',
          //   headers: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({friends: friends})
          // })
            AuthAxios({
              url: '/api/contacts',
              method: 'post',
              data: {friends: friends}
            })
            .then(function(response) {
              return response.json();
            })
            .then((friends) => {
              console.log(friends);
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
        <Text>Contacts List</Text>
        <Button
          onPress={() => console.log('get contacts')}
          title="Get Contacts"
        />
      </View>
    );
  }

  renderContactList() {
    return (
      <ListView
        dataSource={this.state.friends}
        renderRow={(rowData) => <AddFriendItem friend={rowData} /> }
        style={styles.listView}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneNumber: {
    textAlign: 'center',
  },
  button: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});