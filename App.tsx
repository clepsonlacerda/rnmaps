import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './style';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject
} from 'expo-location';
import { useEffect, useState } from 'react';

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

  return (
    <View style={styles.container}>
    </View>
  );
}

