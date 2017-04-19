import React, { Component } from 'react';
import FriendMap from './FriendMap.js';
import HomeFavorite from './HomeFavorite.js';
import { AppState, View, Button, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { endpoint, googleAuthWebClientId } from './endpoint.js';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import PushController from './FCM/PushController.js';
import GeoFencing from 'react-native-geo-fencing';
import Auth0Lock from 'react-native-lock';


var lock = new Auth0Lock({clientId: 'm1N1gYprCHFx0J7mRI2ot9pXX2xk5Hyf', domain: 'safer.auth0.com', useBrowser: true});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      phoneNumber: '',
      currentlyAt: 'Elsewhere'
    };
    this._onShowLock = this._onShowLock.bind(this);
  };


  static navigationOptions = {
    title: 'Favorites'
  };
  
  watchID: ?number = null;

  geoMonitoring() {
    var indexLocated = 0;
    var inAFence = false;

    //Getting coordinates and setting to the state
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition}, () => console.log(this.state));
        console.log('Initial position', position)
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});

      let point = {
        lat: position.coords.latitude, //position.coords.latitude
        lng: position.coords.longitude, //position.coords.longitude
      };
      console.log('This is the position to pass into the checkFences function', point);
      this.checkFences(point);
    });
  }

  checkFences(currentPoint) {
    let inFence = false;
    let phoneNumber = '1234567'
    fetch(`${endpoint}/api/labels/?id=${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      return response.json()
    })
    .then((fences) => {
      console.log('This are the fences', fences);
      var flag = false;
      // for (var fence of fences) {
      for (let i = 0; i < fences.length && !flag; i++) {
        let fence = fences[i];

        let polygon = [
          {lat: fence.latTlc, lng: fence.lngTlc}, //{lat: fence.latTlc, lng: fence.lngTlc}
          {lat: fence.latTrc, lng: fence.lngTrc},
          {lat: fence.latBrc, lng: fence.lngBrc},
          {lat: fence.latBlc, lng: fence.lngBlc},
          {lat: fence.latInit, lng: fence.lngInit},
        ];
        console.log('Transformed polygon', polygon)
        console.log('Point', currentPoint)
        GeoFencing.containsLocation(currentPoint, polygon)
        .then(() => this.setState({currentlyAt: fence.label},  () => flag = true))
        .catch(() => this.setState({currentlyAt: 'Elsewhere'}, () => console.log(this.state.currentlyAt)))
      }
    })
    .catch(function (error) {
      console.log('error retrieving current fences', error)
    })
  }


  componentDidMount() {
    this._setupGoogleSignin();

    this.geoMonitoring();
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.user && this.state.phoneNumber.length < 10) {
      return (
        <View>
          <Text style={{fontSize: 25}}>
            Please tap on 'Show Lock' to continue.
          </Text>
          <TouchableOpacity onPress={this._onShowLock}>
            <Text>Show Lock</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if (!this.state.user && this.state.phoneNumber.length === 10) {
      return (
          <View style={styles.container}>
            <Text>Your phone number: {this.state.phoneNumber}</Text>
            <GoogleSigninButton
              style={{width: 312, height: 48}}
              color={GoogleSigninButton.Color.Dark}
              size={GoogleSigninButton.Size.Wide}
              onPress={() => { this._signIn(); }}
            />
          </View>
      );
    }
    if (this.state.user) {
      return (
        <View>
          <PushController onChangeToken={(token) => {this.setState({FCMToken: token})}}/>
          <HomeFavorite />
        </View>
      )
    }
  }


  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: googleAuthWebClientId, //replace with client_id from google-services.json
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _onShowLock() {
    lock.show({
      closable: true,
      authParams: {
        scope: "openid email",
      },
    }, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      this.setState({
        token: token,
        profile: profile,
        logged: true,
      });
    });
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      console.log(user);
      this.setState({user: user});
    })
    .then(() => {
      return fetch(`${endpoint}/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify({
          id: this.state.user.id,
          name: this.state.user.name,
          email: this.state.user.email,
          photo: this.state.user.photo,
          idToken: this.state.user.idToken,
          accessToken: this.state.user.accessToken,
          phoneNumber: this.state.phoneNumber
        })
      },
      body: JSON.stringify({phoneNumber: this.state.phoneNumber})
      })
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess()
    .then(() => {
      GoogleSignin.signOut();
      console.log('Google access revoked');
    })
    .then(() => {
      this.setState({user: null});
    })
    .done();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
