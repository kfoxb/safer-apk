import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, ListView, TouchableOpacity } from 'react-native';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

export default class GroupsList extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      groups: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  static navigationOptions = {
    title: 'Groups'
  };

  componentWillMount () {
    this.getGroups();
  }

  componentWillUpdate () {
    console.log('in componentWillUpdate');
    var params = this.props.navigation.state.params;
    if (params) {
      if (params.newGroup) {
        this.getGroups();
        params.newGroup = false;
      }
    }
  }

  getGroups() {
    AuthAxios({
      url: `/api/groups`
    })
    .then(({data}) => {
      let groups = data;
      this.setState({
        groups: this.state.groups.cloneWithRows(groups)
      });
    })
    .catch(err => {
      console.log('There was an error in getting groups', err)
    })    
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigate('CreateGroup', {
            title: 'Create Group'
          })}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>CREATE GROUP</Text>
          </View>
        </TouchableOpacity>
        <ListView
          enableEmptySections={true}
          style={styles.listView}
          dataSource={this.state.groups}
          renderRow={(rowData) => (
            <TouchableOpacity 
              onPress={() => navigate('GroupMap', {
                data: rowData
              })
            }
            >
              <View style={styles.nameContainer}>
                <Text style={styles.groupName}>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}