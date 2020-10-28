import React from 'react';
import {GoogleApiWrapper, Map as GMap, IProvidedProps} from 'google-maps-react';
 
 
export const MapContainer: React.FC<IProvidedProps> = ({
  google,
  children
}) => {
return (
  <GMap google={google}>
    {children}
      </GMap>
)
} 
 
export const Map = GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY ?? ''
})(MapContainer)