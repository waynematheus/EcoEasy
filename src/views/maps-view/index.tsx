import React,{useState,useEffect} from 'react';
import { View } from 'react-native'

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'
import {locations} from '../../constants/geo-locations'
import {styles} from './style'

export function MapViewComponents() {

  const [location, setLocation] = useState<LocationObject | null>(null)

  const requestLocationPermission = async () => {
    const { granted } = await requestForegroundPermissionsAsync()

    if(granted){
      const currentPositon = await getCurrentPositionAsync()
      setLocation(currentPositon)
    }
  }

  useEffect(() =>{
    requestLocationPermission()
  }, [])

  useEffect(() =>{
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (newLocation) => {
      setLocation(newLocation)
    }
    )
  }, [])
  
  return (
    <View>
      {
        location && 
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta:0.005,
              longitudeDelta:0.005,
            }}
          >
            <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
            />

            <Marker
                coordinate={{
                  latitude: locations.martimelo1.lat,
                  longitude: locations.martimelo1.long,
                }}
            />

            <Marker
                coordinate={{
                  latitude: locations.martimelo2.lat,
                  longitude: locations.martimelo2.long,
                }}
            />

            <Marker
                coordinate={{
                  latitude: locations.martimelo3.lat,
                  longitude: locations.martimelo3.long,
                }}
            />

          <Marker
                coordinate={{
                  latitude: locations.vivo1.lat,
                  longitude: locations.vivo1.long,
                }}
              
            />
            <Marker
                coordinate={{
                  latitude: locations.vivo2.lat,
                  longitude: locations.vivo2.long,
                }}
            />

          <Marker
                coordinate={{
                  latitude: locations.somAcessorios.lat,
                  longitude: locations.somAcessorios.long,
                }}
            />

             <MapViewDirections
              origin={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              destination={{
                latitude: locations.vivo2.lat,
                longitude: locations.vivo2.long,
              }}
              apikey='AIzaSyAsTyn8KkzxZZu7sgcN7a1rsIxQFF60oh8'
              strokeWidth={3}
              strokeColor='#04844C'
            />
          </MapView>

      }
    </View>
  )
}


