import React, { Component } from 'react';
import { ListView, View, Text, StyleSheet, TouchableOpacity, Button, Switch } from 'react-native';
import AuthAxios from './AuthAxios.js';
import EditGroupMap from './EditGroupMap.js';
import styles from './styles.js';

export default class GroupMap extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      members: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      nonMembers: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      membersToAdd: [],
      membersToDelete: [],
      showLabel: false,
      addAndDelete: false
    };
    this.changeToEditGroup = this.changeToEditGroup.bind(this);
    this.updateGroupMembers = this.updateGroupMembers.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.updateGroupMembers = this.updateGroupMembers.bind(this);
    this.switchChange = this.switchChange.bind(this);
  }

  componentWillMount() {
    let {name, privacy} = this.props.navigation.state.params.data;
    let showLabel = (privacy === 'label' ? true : false);
    AuthAxios({
      url: `/api/groupUsers?name=${name}`
    })
    .then(({data}) => {
      let newDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      });
      this.setState({
        members: newDataSource.cloneWithRows(data),
        membersToAdd: [],
        membersToDelete: [],
        showLabel: showLabel,
        addAndDelete: false
      });
    })
    .catch(err => {
      console.log('there was an error in fetching members', err);
    });
  };

  changeToEditGroup() {
    this.setState({
      addAndDelete: !this.state.addAndDelete
    })
  }

  updateGroupMembers() {
    let groupChanges = {
      toAdd: this.state.membersToAdd,
      toDelete: this.state.membersToDelete,
    }
    let {name} = this.props.navigation.state.params.data;
    AuthAxios({
      url: `/api/groupUsers?name=${name}`,
      method: 'put',
      data: JSON.stringify(groupChanges),
    })
    .then(({data}) => {
      this.componentWillMount();
    })
    .catch(err => {
      console.log(err);
    })
  }

  addMember(friendData) {
    let membersToAdd = this.state.membersToAdd;
    let index = membersToAdd.indexOf(friendData);
    if(index === -1) {
      membersToAdd.push(friendData);
    } else {
      membersToAdd.splice(index, 1);
    }
    this.setState({
      membersToAdd: membersToAdd
    })
  }

  removeMember(friendData) {
    let membersToDelete = this.state.membersToDelete;
    let index = membersToDelete.indexOf(friendData);
    if(index === -1) {
      membersToDelete.push(friendData);
    } else {
      membersToDelete.splice(index, 1);
    }
    this.setState({
      membersToDelete: membersToDelete
    })
  }

  switchChange() {
    this.setState({
      showLabel: !this.state.showLabel
    });
    let {name} = this.props.navigation.state.params.data;
    let privacy = (this.state.showLabel ? 'GPS' : 'label');
    AuthAxios({
      url: `/api/groups?name=${name}`,
      method: 'put',
      data: {privacy: privacy}
    })
    .then(({data}) => {
    })
    .catch(err => {
      console.log('there was an error in fetching members', err);
    });
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.name
  });

  render() {
    const { data } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => !this.state.addAndDelete ? this.changeToEditGroup() : this.updateGroupMembers() }
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{ !this.state.addAndDelete ? 'ADD/DELETE FRIENDS' : 'CONFIRM'}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Switch
            onValueChange={this.switchChange}
            value={this.state.showLabel}
          />
          <Text style={styles.switchText}>{this.state.showLabel ? 'Show Only Label' : 'Show GPS'}</Text>
        </View>
        {this.state.addAndDelete ? <EditGroupMap members={this.state.members} name={data.name} toAdd={this.addMember} toDelete={this.removeMember} /> : this.renderNoChangeList()}
      </View>
    );
  }

  renderNoChangeList() {
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.members}
        renderRow={(rowData) => this.renderMembers(rowData) }
        style={styles.listView}
      />
    )
  }

  renderMembers(memberData) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        onPress={() => navigate('FriendMap', {data: memberData}) }
      >
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{memberData.first}</Text>
          <Text style={styles.label}>{memberData.currentLabel ? memberData.currentLabel : 'Pending'}</Text>
        </View>
      </TouchableOpacity>
    )
  }
};