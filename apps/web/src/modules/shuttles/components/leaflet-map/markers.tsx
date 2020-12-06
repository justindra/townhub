import React, { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { getCurrentGeoLocation } from './helpers';
import { divIcon } from 'leaflet';
import iconUrl from './marker-icon.png';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  icon: {
    backgroundImage: `url(${iconUrl})`,
    textAlign: 'center',
    paddingTop: 3.5,
  },
}));

interface Marker {
  id: string;
  point: { lat: number; lng: number };
}

export const MarkerGenerator: React.FC<{
  markers?: Marker[];
  onMarkerClick: (id: string) => void;
}> = ({ markers = [], onMarkerClick }) => {
  const map = useMap();
  const classes = useStyles();

  useEffect(() => {
    // If a set of markers was provided, zoom to contain all the markers
    if (markers && markers.length) {
      map.fitBounds(
        markers.map((val) => [val.point.lat, val.point.lng]),
        { padding: [15, 15] }
      );
    } else {
      centreOnCurrentGeoLocation();
    }
  }, [markers]);

  const centreOnCurrentGeoLocation = async () => {
    const coords = await getCurrentGeoLocation();
    map.setView(coords, 14);
  };

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
      {markers.map((val, index) => (
        <Marker
          key={val.id}
          position={val.point}
          icon={divIcon({
            className: classes.icon,
            iconUrl,
            iconSize: [25, 38],
            iconAnchor: [10, 44],
            popupAnchor: [3, -40],
            html: (index + 1).toString(),
          })}
          eventHandlers={{
            click: () => handleMarkerClick(val),
          }}
        />
      ))}
    </>
  );
};
