import React, { Component } from 'react';
import { ListView, View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';
import AddGroupMember from './AddGroupMember.js';
import DeleteGroupMember from './DeleteGroupMember.js';

export default class EditGroupMap extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      nonMembers: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
  }

  componentWillMount() {
    AuthAxios({
      url: `api/nonGroupUsers?name=${this.props.name}`,
    })
    .then(({data}) => {
      this.setState({
        nonMembers: this.state.nonMembers.cloneWithRows(data),
      })
    })
    .catch(err => {
      console.log('there was an error in fetching non members', err);
    });
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Add/Delete Friends'
  });

  render() {
    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.props.members}
          renderRow={rowData => <DeleteGroupMember data={rowData} toDelete={this.props.toDelete} />}
          style={styles.listView}
        />
        <ListView
          enableEmptySections={true}
          dataSource={this.state.nonMembers}
          renderRow={rowData => <AddGroupMember data={rowData} toAdd={this.props.toAdd} />}
          style={styles.listView}
        />
      </View>
    )
  }
};