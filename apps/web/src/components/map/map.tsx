import { useTheme } from '@material-ui/core';
import React, { useEffect } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  MapContainerProps,
  useMap,
} from 'react-leaflet';
import { getCurrentGeoLocation } from './helpers';

const MAP_BOX_API_KEY = process.env.REACT_APP_MAP_BOX_API_KEY ?? '';

const MapControls: React.FC = () => {
  const map = useMap();
  // Centre the map in the middle based on the current geo location
  // TODO: We should set the map to fit all the markers instead of relying on geolocation
  // But we should display our location on the map as a marker
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const coords = await getCurrentGeoLocation();
        if (active) {
          map.setView(coords, 14);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);
  return null;
};

export interface MapProps {
  /** The current route being shown */
  route: string[];
  /** List of stops in that route */
  stops: string[];
}

export const Map: React.FC<MapContainerProps> = ({ children, ...props }) => {
  const theme = useTheme();
  const mapTile =
    theme.palette.type === 'dark' ? 'mapbox/dark-v10' : 'mapbox/light-v10';
  const url = `https://api.mapbox.com/styles/v1/${mapTile}/tiles/512/{z}/{x}/{y}?access_token=${MAP_BOX_API_KEY}`;
  return (
    <MapContainer
      style={{
        height: '100%',
      }}
      scrollWheelZoom={false}
      zoomControl={false}
      {...props}>
      <MapControls />
      <TileLayer
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        url={url}
      />
      <ZoomControl position='bottomright' />
      {children}
    </MapContainer>
  );
};
