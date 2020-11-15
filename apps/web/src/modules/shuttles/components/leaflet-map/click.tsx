import React from 'react';
import { useMapEvent } from 'react-leaflet';

export const MapClickDetector: React.FC<{ onMapClick: () => void }> = ({
  onMapClick,
}) => {
  useMapEvent('click', () => {
    onMapClick();
  });
  return null;
};