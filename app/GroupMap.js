import React, { Component } from 'react';
import { endpoint } from './endpoint.js';
import { ListView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AuthAxios from './AuthAxios.js';

export default class GroupMap extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      members: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentWillMount() {
    console.log('GROUPMAP',this.props.navigation.state.params)
    let {name} = this.props.navigation.state.params.data;
    fetch(`${endpoint}/api/groupUsers?name=${name}`)
    .then(response => {
      return response.json();
    })
    .then(members => {
      console.log(members);
      this.setState({
        members: this.state.members.cloneWithRows(members)
      });
    })
    .catch(err => {
      console.log('there was an error in fetching members', err);
    });
  };

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.name
  });

  render() {
    const params = this.props.navigation.state.params;
    return (
      <View>
        <ListView
          dataSource={this.state.members}
          renderRow={(rowData) => this.renderMembers(rowData) }
        />
      </View>
    );
  }

  renderMembers(memberData) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        onPress={() => navigate('FriendMap', {data: memberData}) }
      >
        <View>
          <Text style={{textAlign: 'left', fontSize: 23}}>{memberData.first}</Text>
          <Text style={{textAlign: 'right', fontSize: 23}}>{memberData.currentLabel ? memberData.currentLabel : 'Pending'}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}