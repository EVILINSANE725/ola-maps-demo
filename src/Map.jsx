import React, { useEffect, useRef } from 'react';
import { Map as MapLibreMap, NavigationControl, Marker } from 'maplibre-gl';
import MapLibreGlDirections, { LoadingIndicatorControl } from '@maplibre/maplibre-gl-directions';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = ({ selectedPlace, directions,  }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new MapLibreMap({
      container: 'central-map',
    //   center: [77.186332, 28.5648288],
      zoom: 14,
      style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
      
      transformRequest: (url, resourceType) => {
        url = url.replace("app.olamaps.io", "api.olamaps.io");
        if (url.includes("?")) {
          url = url + `&api_key=${import.meta.env.VITE_OLA_API_KEY}`;
        } else {
          url = url + `?api_key=${import.meta.env.VITE_OLA_API_KEY}`;
        }
        return { url, resourceType };
      },
    });

    let nav = new NavigationControl({ visualizePitch: false, showCompass: true },)

    
    map.addControl(nav,'top-left');

    
    mapRef.current = map;
    // nav._compass.onclick(()=>mapRef.current.flyTo({ center: [selectedPlace.geometry.location.lng, selectedPlace.geometry.location.lat], zoom: 14 }))

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const { geometry } = selectedPlace;
      new Marker().setLngLat([geometry.location.lng, geometry.location.lat]).addTo(mapRef.current);
      mapRef.current.flyTo({ center: [geometry.location.lng, geometry.location.lat], zoom: 14 });
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (directions && mapRef.current) {
      const directionsControl = new MapLibreGlDirections(mapRef.current
      //   ,
      //   {
      //   api:`https://api.olamaps.io/routing/v1`,
      //   makePostRequest:true,
      //   profile:`directions?api_key={api_key}&origin=${directions.origin[1]},${directions.origin[0]}&destination=${directions.destination[1]},${directions.destination[0]}`,
      // }
    
    );
      mapRef.current.addControl(new LoadingIndicatorControl(directionsControl));
      directionsControl.setWaypoints([
        directions.origin,directions.destination
      ]);
    }
  }, [directions]);

  return <div id="central-map" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
};

export default Map;
