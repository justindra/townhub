import React from 'react';
import { LeafletMap, MapClickDetector, MarkerGenerator } from './leaflet-map';
import { Shuttles } from '@townhub-libs/core';

interface ShuttleMapProps {
  stops: Shuttles.RouteStop[];
  onStopClick?: (stopId: string) => void;
  onMapClick?: () => void;
}

export const ShuttleMap: React.FC<ShuttleMapProps> = ({
  stops,
  onStopClick = () => {},
  onMapClick = () => {},
}) => {
  return (
    <LeafletMap>
      <MapClickDetector onMapClick={onMapClick} />
      <MarkerGenerator onMarkerClick={onStopClick} markers={stops as any} />
    </LeafletMap>
  );
};
