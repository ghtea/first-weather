import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Loading from './Loading'
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weaather';

const API_KEY = '750bac5e554109ad1e24ce1c5e55351d';

export default class extends React.Component {
  state={
    isLoading: true,

  };
  getWeather = async (lat, lon) => {
    const {data} = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`);
    console.log(data)
    this.setState({isLoading: false, temp: data.main.temp, condition: data.weather[0].main})
  }

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const location = await Location.getCurrentPositionAsync();
      // send location info to weather api
      console.log(location);
      /*
      {
        "coords": Object {
          "accuracy": 5,
          "altitude": 0,
          "altitudeAccuracy": -1,
          "heading": -1,
          "latitude": 37.785834,
          "longitude": -122.406417,
          "speed": -1,
        },
        "timestamp": 1613719761395.458,
      }
      */
      this.getWeather(location.coords.latitude, location.coords.longitude);
    }
    catch(e){
      Alert.alert('Can find you.', 'So sad')
    }
  }
  componentDidMount(){
    this.getLocation();
  }

  render(){
    const {isLoading, temp, condition} = this.state
    return (
      isLoading 
        ? <Loading />
        : <Weather 
          temp={Math.round(temp)}
        />
    );
  }
};

