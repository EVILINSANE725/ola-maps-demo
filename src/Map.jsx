import React, { useEffect, useRef } from 'react';
import { Map as MapLibreMap, NavigationControl, Marker } from 'maplibre-gl';
import MapLibreGlDirections, { LoadingIndicatorControl } from '@maplibre/maplibre-gl-directions';
import 'maplibre-gl/dist/maplibre-gl.css';
import Appcss from './App.css'

const Map = ({ selectedPlace, directions }) => {
  const mapRef = useRef(null);
  const directionsControlRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = new MapLibreMap({
      container: 'central-map',
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

    const nav = new NavigationControl({ visualizePitch: false, showCompass: true });
    map.addControl(nav, 'top-left');

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const { geometry } = selectedPlace;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = new Marker().setLngLat([geometry.location.lng, geometry.location.lat]).addTo(mapRef.current);
      markerRef.current = marker;

      mapRef.current.flyTo({ center: [geometry.location.lng, geometry.location.lat], zoom: 14 });
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (directions && mapRef.current) {
      if (directionsControlRef.current) {
        directionsControlRef.current.removeWaypoint([0]);
      }else{
        const directionsControl = new MapLibreGlDirections(mapRef.current);
        directionsControlRef.current = directionsControl;
        mapRef.current.addControl(new LoadingIndicatorControl(directionsControl));
      }

      directionsControlRef.current .setWaypoints([
        directions.origin, directions.destination
      ]);



    }
  }, [directions]);

  return <div id="central-map" style={{ width: '100vw', height: '99vh', overflow: 'hidden' }} />;
};

export default Map;
