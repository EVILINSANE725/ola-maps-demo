import React, { useState, useEffect } from 'react';
import Map from './Map';
import Search from './Search';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setTimeout(()=>{
            setCurrentLocation(location);
            setSelectedPlace({ geometry: { location } }); 
          },[1000])
      
        },
        (error) => {
          console.error('Error fetching current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleGetDirections = async (place) => {
    if (!currentLocation) {
      console.error('Current location is not available.');
      return;
    }

    const origin = { lng: currentLocation.lng, lat: currentLocation.lat }; 
    const destination = place.geometry.location;

    try {
      // const response = await fetch(`https://api.olamaps.io/routing/v1/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&api_key={api_key}`, {
      //   method: 'post'
      // });

      // const data = await response.json();

      setDirections({
        origin: [origin.lng, origin.lat],
        destination: [destination.lng, destination.lat]
      });
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
    <div style={{width:"100vw",height:"100vh",padding:0}}>
      <Search onPlaceSelect={handlePlaceSelect} onGetDirections={handleGetDirections} />
      <Map 
        selectedPlace={selectedPlace} 
        directions={directions} 
        currentLocation={currentLocation} 
        onGetDirections={handleGetDirections} 
      />
    </div>
  );
}

export default App;
