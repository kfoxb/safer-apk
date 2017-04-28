import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AuthAxios from './AuthAxios.js';
import styles from './styles.js';

export default class AddGroupMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasPressed: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(data) {
    this.props.toAdd(data);
    this.setState({
      wasPressed: !this.state.wasPressed
    });
  } 

  render() {
    const { data } = this.props;
    return (
      <View style={styles.centerContainer}>
        <Button
          onPress={() => this.onClick(data)}
          title='Add'
          style={styles.button}
          color={this.state.wasPressed ? 'green' : 'black'}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{`${data.first} ${data.last}`}</Text>
        </View>
      </View>
    );
  }
}