import React, { Component } from 'react';
import CheckBox from 'react-native-checkbox';
import { endpoint } from './endpoint.js';
import { View, Text, StyleSheet, TextInput, ListView, Picker, Button } from 'react-native';
import AuthAxios from './AuthAxios.js';

export default class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state =  { 
      friends: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      groupName: '',
      users: [],
      privacy: 'label',
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.submitGroup = this.submitGroup.bind(this);
  }

  componentWillMount() {
    fetch(`${endpoint}/api/friends?groups=true`, {
      method: 'GET',
    })
      .then(function(response) {
        return response.json();
      })
      .then((friends) => {
        console.log(friends);
        this.setState({
          friends: this.state.friends.cloneWithRows(friends),
        });
      })
      .catch((error) => {
        console.log('There was an error in fetching your data: ', error);
        return error;
      });
  }

  submitGroup() {
    let groupSettings = {
      groupName: this.state.groupName,
      users: this.state.users,
      privacy: this.state.privacy,
    };

    fetch(`${endpoint}/api/groups`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({groupSettings: groupSettings})
    })
      .then(function(response) {
        return response.json();
      })
      .then((friends) => {
        console.log(friends);
      })
      .catch((error) => {
        console.log('There was an error in fetching your data: ', error);
        return error;
      });
    const { navigate } = this.props.navigation;
    navigate('GroupsList');
  }

  handleUserChange(userObj) {
    let userArr = this.state.users;
    let index = userArr.indexOf(userObj);
    console.log(userArr, index, userObj);
    if(index === -1) {
      userArr.push(userObj);
    } else {
      userArr.splice(index, 1);
    }

    this.setState({
      users: userArr
    })
    console.log(this.state);
  }

  // static navigationOptions = {
  //   title: ({state}) => (state.params.title)
  // };

  static navigationOptions = ({ navigation }) => {
    title: navigation.state.params.title
  }

  render() {
    const params = this.props.navigation.state.params;
    return (
      <View>
        <Text style={styles.button}>Create Group:</Text>
        <TextInput
          style={{fontSize: 18}}
          onChangeText={(text) => this.setState( {groupName: text} )}
          placeholder='Insert Group Name'
          value={this.state.text}
        />
        <Text style={styles.button}>Members:</Text>
        <ListView
          dataSource={this.state.friends}
          renderRow={(rowData) => (
            <CheckBox
              label={rowData.first}
              onChange={() => this.handleUserChange(rowData)}
              underlayColor='transparent'
            />
          )}
        />
        <Text style={styles.button}>Privacy Setting:</Text>
        <Picker
          selectedValue={this.state.privacy}
          onValueChange={(privacy) => this.setState({ privacy: privacy })}
        >
          <Picker.Item label='Label' value='label' />
          <Picker.Item label='GPS' value='gps' />
        </Picker>
        <Button 
          title="Create Group"
          onPress={this.submitGroup}
        />
      </View>
    );
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
    fontSize: 20,
    // width: 53,
    // height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});