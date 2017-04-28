import React, { Component } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      dbUser: {created: false},
      phoneNumber: '',
    };
  };

  static navigationOptions = {
    headerVisible: false
  };

  saveLocation () {
    let position = this.props.navigation.state.params.location;
    let location = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };

    AuthAxios({
      url: `/api/user/location`,
      method: 'put',
      data: location
    })
    .catch((err) => {
      console.log('location failed to update: ', err);
    });
  }

  _signIn() {
    const { navigate } = this.props.navigation;
    GoogleSignin.signIn()
    .then((user) => {
      this.setState({user: user});
      return AuthAxios({
        url: '/api/user'
      })
    })
    .then(({data}) => {
      this.setState({dbUser: data});
      if (data.created === false) {
        navigate('HomePageTabs');
      }
      this.saveLocation();
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  savePhoneNumber() {
    const { navigate } = this.props.navigation;
    AuthAxios({
      url: '/api/user/',
      method: 'put',
      data: {phoneNumber: this.state.phoneNumber}
    })
    .then((result) => {
      navigate('AddFence', {SignUp: true});
    })
    .catch((err) => {
      console.log('There was an error saving phone number: ', err);
    })

  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.signUpContainer}>
        <Image 
          style={{width: 250, height: 250, alignSelf: 'center'}}
          source={require('./Image/safer.png')}
        />
        <Text style={styles.splashScreenText}> SAFER </Text>
          {!this.state.dbUser.created && (
            <View style={styles.googleContainer}>
              <GoogleSigninButton
                style={{width: 312, height: 48, alignItems: 'center'}}
                color={GoogleSigninButton.Color.Dark}
                size={GoogleSigninButton.Size.Wide}
                onPress={() => { this._signIn(); }}
              />
            </View> 
          )}
        {this.state.dbUser.created && (
          <View>
            <Text style={styles.signUpText}>
              Please enter your phone number
            </Text>
            <TextInput
              style={styles.signUpText}
              onChangeText={(text) => this.setState( {phoneNumber: text} )}
              maxLength = {10}
              value={this.state.text}
              underlineColorAndroid={'black'}/>
          </View>
        )}
        {(this.state.phoneNumber.length === 10) && (
          <TouchableOpacity
            onPress={() => this.savePhoneNumber()}
          >
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>NEXT</Text>
            </View>
          </TouchableOpacity>)}
      </View>
    )
  }
};
