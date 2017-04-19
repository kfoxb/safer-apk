import React, { Component } from 'react';
import { View, Button, Text, Picker, Switch, StyleSheet } from 'react-native';
import { endpoint } from './endpoint.js';
import FriendMap from './FriendMap.js';
import AuthAxios from './AuthAxios.js';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    // TODO: grab logged in userId (for SQL table)
    // and pass it along in the req.body
    // currently hard coded to 1
    this.state = {
      userId: 1, 
      selected: 'GPS', //TODO: set this to the privacy setting grabbed from the sql database
      incognito: false,
      error: false
    };
    this.pickerChange = this.pickerChange.bind(this);
    this.switchChange = this.switchChange.bind(this);
  };

  static navigationOptions = {
    title: 'Settings'
  };

  pickerChange(privacySetting) {
    fetch(endpoint + '/api/privacySettings', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.userId,
        privacy: privacySetting
      })

    }).then((response) => {
      if (response.err) {
        this.setState({
          error: true
        });
      }      
    }).catch((err) => {
      this.setState({
        error: true
      });
    });

    this.setState({
      selected: privacySetting,
    });
  }

  switchChange(value) {
    console.log('value in switch change: ', value);
    fetch(endpoint + '/api/privacySettings', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.userId,
        incognito: value
      })

    }).then((response) => {
      if (response.err) {
        this.setState({
          error: true
        });
      }
    }).catch((err) => {
      this.setState({
        error: true
      });
    });

    this.setState({
      incognito: !this.state.incognito
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <Text style={styles.text}>Default Privacy Settings</Text>
        <Text style={styles.description}>This is the default information presented to your connections</Text>
        <Text style={styles.description}>You can edit individual privacy settings from their location details screen</Text>
        <Picker 
          style={{width: 200}} 
          selectedValue={this.state.selected}
          onValueChange={this.pickerChange} >
          <Picker.Item label='Label' value='label'/>
          <Picker.Item label='GPS' value='gps' />
        </Picker>

        <Text style={styles.text}>Incognito Mode - Stop sharing your location</Text>
        <Switch
          onValueChange={this.switchChange}
          style={{marginBottom: 10}}
          value={this.state.incognito} />

        {this.state.error &&
          (<Text>There was an error updating your privacy settings. Please try again later.</Text>)}
          
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'auto'
  },
  description: {
    fontSize: 14,
    textAlign: 'auto'
  }

});

