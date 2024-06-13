import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './style';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
  reverseGeocodeAsync,
  LocationGeocodedAddress
} from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const [location, setLocation] = useState<LocationObject | null>(null);
  const [address, setAddress] = useState<LocationGeocodedAddress | null>(null);

  const mapRef = useRef<MapView>(null);


  async function requestLocationPermissions() {
    const { status, granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();

      setLocation(currentPosition);

      console.log('localização atual', currentPosition);

      let address = await reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude
      });
      console.log('rua', address[0].street);
      console.log('bairro', address[0].district);
      console.log('cidade', address[0].city);
      console.log('estado', address[0].region);
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
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords,
      });

    });
  }, []);

  return (
    <View style={styles.container}>

      {location &&
        <MapView
          ref={mapRef}
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

