import { GoogleSignin } from 'react-native-google-signin';
import { endpoint } from './endpoint.js';
import axios from 'axios';

//for all requestConfig parameters see https://www.npmjs.com/package/axios#request-config
module.exports = (requestConfig) => {

  let request = {
    baseURL: endpoint,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(GoogleSignin.currentUser())
    },
  };

  for (let key in requestConfig) {
    request[key] = requestConfig[key];
  }

  return axios(request);
};