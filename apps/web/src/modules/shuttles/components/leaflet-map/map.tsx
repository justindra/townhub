import { useTheme } from '@material-ui/core';
import React from 'react';
import { MapContainer, TileLayer, MapContainerProps } from 'react-leaflet';

const MAP_BOX_API_KEY = process.env.REACT_APP_MAP_BOX_API_KEY ?? '';

export interface MapProps {
  /** The current route being shown */
  route: string[];
  /** List of stops in that route */
  stops: string[];
}

export const LeafletMap: React.FC<MapContainerProps> = ({
  children,
  ...props
}) => {
  const theme = useTheme();
  const mapTile =
    theme.palette.type === 'dark' ? 'mapbox/dark-v10' : 'mapbox/light-v10';
  const url = `https://api.mapbox.com/styles/v1/${mapTile}/tiles/512/{z}/{x}/{y}?access_token=${MAP_BOX_API_KEY}`;
  return (
    <MapContainer
      style={{
        height: '100%',
      }}
      scrollWheelZoom={true}
      zoomControl={false}
      {...props}>
      <TileLayer
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        url={url}
      />
      {children}
    </MapContainer>
  );
};
