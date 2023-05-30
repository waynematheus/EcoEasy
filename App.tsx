import React,{useState,useEffect} from 'react';
import { View,Text, FlatList, Image, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation,useRoute } from '@react-navigation/native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location'
import MapViewDirections, {MapViewDirectionsProps} from 'react-native-maps-directions'
import {arrayLocation, locations} from './src/constants/geo-locations'
import {styles} from './style'
interface RouteParams {
  latitude: MapViewDirectionsProps | any;
  longitude: MapViewDirectionsProps | any;
}

function Map({navigation}) {
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

  const route = useRoute();
  const {latitude,longitude} = route.params as RouteParams;
   return (
    <View style={styles.container}>
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
                image={require('./src/assets/origen.png')}
            />

            <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                image={require('./src/assets/destino.png')}

            />
    
             <MapViewDirections
              origin={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              destination={{
                latitude: latitude,
                longitude: longitude,
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


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>

  <FlatList
        data={arrayLocation}
        renderItem={({ item }) => <View
        style={{
          backgroundColor: 'white',  
          borderRadius: 8,  
          paddingVertical: 45,  
          paddingHorizontal: 25,  
          width: '100%',  
          marginVertical: 10,
          shadowColor: '#52006A',  
          elevation: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{backgroundColor:'#FCCC1C', width: 80, height: 80, borderRadius: 20, marginRight: 20, paddingBottom: 40}}>
             <Image 
              source={require('./src/assets/icon.png')}
             />
          </View>
        
        <View>
            <View style={{alignItems:'center', flexDirection:'row', padding:5}}>
              <Image 
                source={require('./src/assets/pointer.png')}
                style={{marginRight: 15}}
              />
                <Text 
                style={{
                  fontWeight: '300',
                  fontSize:16
                }}
                >Distância: 3 Km</Text>
            </View>
            <View style={{alignItems:'center', flexDirection:'row', padding:5}}>
              <Image 
                source={require('./src/assets/clock.png')}
                style={{marginRight: 15}}

              />
              <Text
                style={{
                  fontWeight: '300',
                  fontSize:16
                }}
              >Tempo da viagem: 7 Min</Text>
            </View>
        </View>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderColor:'#FCCC1C',
            borderWidth: 2,
            padding: 5,
            marginTop: 30,
            borderRadius: 30,
            height:40,
            width:96
          }}
          onPress={() => {
            navigation.navigate('Mapa', {
              latitude: item.lat,
              longitude: item.long
            })

          }}
      >
        <Text
          style={{
            fontWeight: '400',
            fontSize:16
          }}
        
        >Ver rota</Text>
      </TouchableOpacity>
      </View>}
      />
      
     
    </View>
  );
}


const Stack = createNativeStackNavigator();


export default function App() {

 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mapa" component={Map} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}


