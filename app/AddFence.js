import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Picker, ListView } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {endpoint} from './endpoint.js';


const Item = Picker.Item
export default class AddFence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fences: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      label: 'Home',
      user: '1234567'
    }
  }

  static navigationOptions = {
    title: 'Your fences',
  };

  componentDidMount () {
    console.log('component mounted')
    fetch(`${endpoint}/api/labels/?id=${this.state.user}`, {
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
      console.log(fences);
      this.setState({fences: this.state.fences.cloneWithRows(fences)});

    })
    .catch(function (error) {
      console.log('error retrieving current fences', error)
    })
  }

  onValueChange (label) {
    const newState = {};
    newState.label = label;
    this.setState(newState);
  }

  makeFence (center) {
    let fence = {polygon:[
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0},
    {lat: 0, lng: 0} 
  ]};

    fence.polygon[0].lat = center.lat + 100 * 90/10000000;
    fence.polygon[0].lng = center.lng + 100/2 * 90/10000000 / Math.cos(center.lat);
    fence.polygon[1].lat = center.lat + 100/2 * 90/10000000;
    fence.polygon[1].lng = center.lng - 100/2 * 90/10000000 / Math.cos(center.lat);
    fence.polygon[2].lat = center.lat - 100/2 * 90/10000000;
    fence.polygon[2].lng = center.lng + 100/2 * 90/10000000 / Math.cos(center.lat);
    fence.polygon[3].lat = center.lat - 100/2 * 90/10000000;
    fence.polygon[3].lng = center.lng - 100/2 * 90/10000000 / Math.cos(center.lat);
    fence.polygon[4].lat = center.lat + 100 * 90/10000000;
    fence.polygon[4].lng = center.lng + 100/2 * 90/10000000 / Math.cos(center.lat);



  fence.label = this.state.label;
  fence.user = this.state.user;
  console.log(fence);

fetch(`${endpoint}/api/labels`, {
  method: 'POST',
  body: JSON.stringify(fence),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
  .then(function (response) {
    alert('Fence created!');
  })
  .catch(function (error) {
    alert('There was an error creating your fence');
  })
};

renderFence(fence) {
  return (
    <View>
      <Text>
        {fence.label}
      </Text>
    </View>
  )
}

  render() {
    return (
      <View>
      <View>
        <ListView
          dataSource={this.state.fences}
          renderRow={this.renderFence}
        />
      </View>
        <Picker 
          selectedValue={this.state.label}
          onValueChange={this.onValueChange.bind(this)}>
          <Item label='Home' value='Home' />
          <Item label= 'Work' value='Work' />
          <Item label= 'School' value='School' />
          <Item label= 'Gym' value='Gym' />
          <Item label= 'Bar' value='Bar' />   
        </Picker>
        <View style={{flexDirection: 'row'}}>
          <GooglePlacesAutocomplete
            placeholder='Input an address'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            listViewDisplayed='true'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details.geometry.location)
              this.setState({coordinates: details.geometry.location}, function () {
                console.log('This is the state', this.state.coordinates);
              })
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyDEG1bzKYZIfvieQnrM-SCR0wOy5N5fHG0',
              language: 'en' // language of the results
            }}
            styles={{
              description: {
              fontWeight: 'bold',
            },
              predefinedPlacesDescription: {
              color: '#1faadb',
            },
        }}

             // Will add a 'Current location' button at the top of the predefined places list
            
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance'
            }}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
        </View>
          <Button
              title='Set this fence'
              onPress={() => this.makeFence(this.state.coordinates)}
          />
      </View>
    );
  }
}

