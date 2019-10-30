import React, { Component } from 'react';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import BaseNavigation from './src/navigation/router';
import { Root } from 'native-base';
// import { PersistGate } from 'redux-persist/es/integration/react';
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
interface Props { }

export default class App extends Component<Props> {

  async componentDidMount() {
    this.checkPermission();
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log('permission enabled', enabled);
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('get token', fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  public render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Root>
          <BaseNavigation />
        </Root>
        {/* </PersistGate> */}
      </Provider>
    );
  }
}
