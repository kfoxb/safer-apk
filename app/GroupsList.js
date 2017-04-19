import React, { Component } from 'react';
import { endpoint } from './endpoint.js';
import { Button, View, Text, StyleSheet, ListView, TouchableOpacity } from 'react-native';
import AuthAxios from './AuthAxios.js';

export default class GroupsList extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      groups: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentWillMount () {
    console.log('getgroups')
    fetch(`${endpoint}/api/groups`)
    .then(response => {
      return response.json();
    })
    .then(groups => {
      console.log(groups);
      this.setState({
        groups: this.state.groups.cloneWithRows(groups)
      });
    })
    .catch(err => {
      console.log('There was error in getting groups', err);
    })
  }

  static navigationOptions = {
    title: 'Groups'
  };

  render() {
    const params = this.props.navigation.state.params;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => navigate('CreateGroup',{
            title: "Create Group"
          })
        }
        title="Create Group"
        />
        <ListView
          dataSource={this.state.groups}
          renderRow={(rowData) => (
            <TouchableOpacity 
              onPress={() => navigate('GroupMap', {
                data: rowData
              })
            }
            >
              <View style={{marginTop: 10}}>
                <Text style={{textAlign: 'center', fontSize: 20}}>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}