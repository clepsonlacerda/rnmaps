import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './style';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const [location, setLocation] = useState<LocationObject | null>(null);


  async function requestLocationPermissions() {
    const { status, granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();

      setLocation(currentPosition);

      console.log('localização atual', currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response) => {
      console.log('nova localização', response);
      setLocation(response);


    });
  }, []);

  return (
    <View style={styles.container}>

      {location &&
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      }

    </View>
  );
}

