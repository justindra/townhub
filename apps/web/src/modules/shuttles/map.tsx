import React from 'react';
import { Marker, useMap, useMapEvent, ZoomControl } from 'react-leaflet';
import { Map } from '../../components';

interface ShuttleMapProps {
  stops: any[];
  onStopClick?: (stopId: string) => void;
  onMapClick?: () => void;
}

const Markers = [
  { id: '1', point: { lat: 50.982802914144614, lng: -118.17143440246583 } },
  { id: '2', point: { lat: 50.98091164990174, lng: -118.16619873046876 } },
  { id: '3', point: { lat: 50.99101551077011, lng: -118.16259384155275 } },
];

export const MapClickDetector: React.FC<{onMapClick: () => void}> = ({
  onMapClick
}) => {
  useMapEvent('click', (evt) => {
    onMapClick();
  });
  return null;
};

export const MarkerGenerator: React.FC<{
  onMarkerClick: (id: string) => void;
}> = ({ onMarkerClick }) => {
  const map = useMap();

  const handleMarkerClick = (marker: {
    id: string;
    point: { lat: number; lng: number };
  }) => {
    // Send to parent
    onMarkerClick(marker.id);
    // Centre the map onto that marker
    map.setView(marker.point, map.getZoom());
  };
  return (
    <>
      {Markers.map((val) => (
        <Marker
          key={val.id}
          position={val.point}
          eventHandlers={{
            click: () => handleMarkerClick(val),
          }}
        />
      ))}
    </>
  );
};

export const ShuttleMap: React.FC<ShuttleMapProps> = ({
  onStopClick = () => {},
  onMapClick = () => {}
}) => {
  return (
    <Map>
      <MapClickDetector onMapClick={onMapClick} />  
      <MarkerGenerator onMarkerClick={onStopClick} />
    </Map>
  );
};
