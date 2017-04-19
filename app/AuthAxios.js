import { GoogleSignin } from 'react-native-google-signin';
import { endpoint } from './endpoint.js';
import axios from 'axios';

//for all requestConfig parameters see https://www.npmjs.com/package/axios#request-config
module.exports = (requestConfig) => {
  console.log('inside AuthAxios');

  let request = {
    baseURL: endpoint,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(GoogleSignin.currentUser())
    },
    // transformRequest: [function (data) {
    //   data = JSON.stringify(data);
    //   return data;
    // }]
  };

  console.log('this is request before being changed', request);

  for (let key in requestConfig) {
    request[key] = requestConfig[key];
  }

  console.log('this is request after being changed', request);

  // if (requestConfig.method === 'post' || requestConfig.method === 'put') {
  //   request.transformRequest = [function (data) {
  //     data = JSON.stringify(data);
  //     return data;
  //   }];
  // }

  // console.log('this is request after being changed with transformRequest if applicable', request);

  return axios(request);
};