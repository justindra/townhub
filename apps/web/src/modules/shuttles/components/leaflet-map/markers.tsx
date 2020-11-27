import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { getCurrentGeoLocation } from './helpers';

interface Marker {
  id: string;
  point: { lat: number; lng: number }
}

export const MarkerGenerator: React.FC<{
  markers?: Marker[];
  onMarkerClick: (id: string) => void;
}> = ({ markers = [], onMarkerClick }) => {
  const map = useMap();

  useEffect(() => {
    // If a set of markers was provided, zoom to contain all the markers
    if (markers && markers.length) {
      map.fitBounds(markers.map(val => [val.point.lat, val.point.lng]), { padding: [15, 15]});
    } else {
      centreOnCurrentGeoLocation();
    }
  }, [markers]);
  
  const centreOnCurrentGeoLocation = async () => {
    const coords = await getCurrentGeoLocation();
    map.setView(coords, 14);
  }

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