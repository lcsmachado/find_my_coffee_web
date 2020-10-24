import React, { Fragment, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import Establishment from './components/establishment';
import EstablishmentsService from './services/establishment_service';
import StoreService from './services/store';
import NearstCoffees from './components/establishment/nearestCoffees';

const App = () => {

  const [latitude,setLatitude] = useState(0);
  const [longitude,setLongitude] = useState(0);
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState({});

  const { REACT_APP_GOOGLE_API_KEY } = process.env;
  
  useEffect( () => {
    setCurrentLocation()
  }, []);

  async function loadCoffeeShops() {
    const response = await EstablishmentsService.index(latitude, longitude);
    setLocations(response.data.results);
  }

  async function setCurrentLocation() {
    try {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
      loadCoffeeShops();
    } catch (error) {
      alert('Habilite a localização para utilizar o aplicativo!');
    }
  }

  return(
    <Fragment>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={{ height: "100vh", width: "100%" }}
        zoom={15}
        center={(selected.geometry) ? undefined : { lat: latitude, lng: longitude }}>
        {
          locations.map((item, index) => {
            return (
              <Marker key={index} icon='/images/coffee-pin.png' title={item.name} animation="4"
                position={{ lat: item.geometry.location.lat, lng: item.geometry.location.lng }}
                onClick={() => setSelected(item)}
              />
            )
          })
        }
        {
          selected.place_id && (
            <Establishment place={selected} />
          )
        }
        <Marker key='my location' icon='/images/my-location-pin.png' title="Seu Local" animation="2"
          position={{ lat: latitude, lng: longitude }}
        />
        {(latitude != 0 && longitude != 0) &&
          <NearstCoffees latitude={latitude} longitude={longitude}/>
        }
      </GoogleMap>
      </LoadScript>
    </Fragment>
  );
}

export default App;
