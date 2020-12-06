import React from 'react';
import { LeafletMap, MapClickDetector, MarkerGenerator } from './leaflet-map';
import { RouteStop } from '@townhub-libs/shuttles';

interface ShuttleMapProps {
  stops: RouteStop[];
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
