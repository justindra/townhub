import {
  CardContent,
  GridList,
  GridListTile,
  Typography,
} from '@material-ui/core';
import { Vendor } from '@townhub-libs/vendors';
import React from 'react';

export const AboutTab: React.FC<Vendor> = ({ description, images }) => {
  return (
    <CardContent>
      <Typography variant='body1'>{description}</Typography>
      <GridList cellHeight={160} cols={3} spacing={16}>
        {images.map((tile, index) => (
          <GridListTile key={index} cols={(index + 1) % 4}>
            <img src={`${tile}?id=${index}`} alt={tile} />
          </GridListTile>
        ))}
      </GridList>
    </CardContent>
  );
};
