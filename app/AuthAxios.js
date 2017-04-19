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
    transformRequest: [function (data) {
      data = JSON.stringify(data);
      return data;
    }]
  };

  for (let key of requestConfig) {
    request[key] = requestConfig[key];
  }

  // if (requestConfig.method === 'post' || requestConfig.method === 'put') {
  //   request.transformRequest = [function (data) {
  //     data = JSON.stringify(data);
  //     return data;
  //   }];
  // }

  return fetch(request);
};