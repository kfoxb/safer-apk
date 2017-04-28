import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Picker, ListView, TouchableOpacity } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

const Item = Picker.Item
export default class AddFence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fences: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      label: 'Home',
    };
  };

  static navigationOptions = {
    title: 'Your Fences',
  };

  componentDidMount () {
    this.getFences();
  }

  componentWillUpdate () {
    if (this.state.newFence) {
      console.log('about to get new fences');
      this.getFences();
      this.setState({newFence: false});
    }
  }

  getFences() {
    AuthAxios({
      url: `/api/labels/`
    })
    .then(({data}) => {
      let fences = data;
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

  makeFence (center, address) {
    let fence = {
      coordinates: this.state.coordinates,
      address: this.state.address
    };

    fence.label = this.state.label;

    AuthAxios({
      url: '/api/labels',
      method: 'post',
      data: fence
    })
    .then(function (response) {
      alert('Fence created!');
    })
    .catch(function (error) {
      alert('There was an error creating your fence');
    })
    .done(() => {
      const {params} = this.props.navigation.state;
      const {navigate} = this.props.navigation;
      if (params && params.SignUp) {
        navigate('AddFriend', params);
      }
      this.setState({newFence: true}, () => this.componentWillUpdate());
    });
  };

  renderFence(fence) {
    return (
      <View style={styles.container}>
        <Text style={styles.settingText}>
          {fence.label}
        </Text>
        <Text style={styles.fenceAddress}>
          {fence.address}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.makeFence(this.state.coordinates)}
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>SET THIS FENCE</Text>
          </View>
        </TouchableOpacity>
        <Picker 
          selectedValue={this.state.label}
          onValueChange={this.onValueChange.bind(this)}>
          <Item 
          label='Home' 
          value='Home'
          />
          <Item 
          label='Work'
          value='Work'
          />
          <Item 
          label= 'School' 
          value='School' 
          />
          <Item 
          label= 'Gym' 
          value='Gym' 
          />
          <Item 
          label= 'Bar' 
          value='Bar' 
          />   
        </Picker>
        <View 
        style={{flexDirection: 'row'}}
        >
          <GooglePlacesAutocomplete
            placeholder='Input an address'
            minLength={2}
            autoFocus={false}
            listViewDisplayed='true'
            fetchDetails={true}
            renderDescription={(row) => row.description}
            onPress={(data, details = null) => {
              this.setState({
                address: data.description,
                coordinates: details.geometry.location
              });
            }}
            getDefaultValue={() => {
              return '';
            }}
            query={{
              key: 'AIzaSyDEG1bzKYZIfvieQnrM-SCR0wOy5N5fHG0',
              language: 'en'
            }}
            styles={{
              description: {
              fontWeight: 'bold',
            },
              predefinedPlacesDescription: {
                color: '#1faadb',
            },
        }}
            nearbyPlacesAPI='GooglePlacesSearch'
            GoogleReverseGeocodingQuery={{
            }}
            GooglePlacesSearchQuery={{
              rankby: 'distance'
            }}
            debounce={200}
        />
        </View>
        <View>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.fences}
            renderRow={this.renderFence}
            style={styles.listView}
          />
        </View>
      </View>
    );
  }
}