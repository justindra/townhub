import React from 'react';
import { Marker, useMap, useMapEvent } from 'react-leaflet';
import { Map } from '../../../components';
import { RouteStop } from '@townhub-libs/core';

interface ShuttleMapProps {
  stops: RouteStop[];
  onStopClick?: (stopId: string) => void;
  onMapClick?: () => void;
}

interface Marker {
  id: string;
  point: { lat: number; lng: number }
}

export const MapClickDetector: React.FC<{ onMapClick: () => void }> = ({
  onMapClick,
}) => {
  useMapEvent('click', (evt) => {
    onMapClick();
  });
  return null;
};

export const MarkerGenerator: React.FC<{
  markers?: Marker[];
  onMarkerClick: (id: string) => void;
}> = ({ markers = [], onMarkerClick }) => {
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
      {markers.map((val) => (
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
  stops,
  onStopClick = () => {},
  onMapClick = () => {},
}) => {
  return (
    <Map>
      <MapClickDetector onMapClick={onMapClick} />
      <MarkerGenerator onMarkerClick={onStopClick} markers={stops} />
    </Map>
  );
};
