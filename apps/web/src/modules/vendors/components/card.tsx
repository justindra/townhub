import {
  Avatar,
  CardContent,
  CardHeader,
  Chip,
  GridList,
  GridListTile,
  IconButton,
  Typography,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { Vendor } from '@townhub-libs/vendors';
import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingPage } from '../../../components';

export const VendorCard: React.FC<{ vendors: Vendor[] }> = ({ vendors }) => {
  const { vendorId } = useParams<{ vendorId: string }>();

  const currentVendor = vendors.find((val) => val.id === vendorId);
  if (!currentVendor) return <LoadingPage />;
  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            src={`${currentVendor.logo}?id=${currentVendor.id}`}
            variant='rounded'>
            RA
          </Avatar>
        }
        title={currentVendor.name}
        titleTypographyProps={{
          gutterBottom: true
        }}
        subheader={(
          <>
          <IconButton>
            <HelpOutline/>
          </IconButton>
          </>
        )}
      />
      <CardContent>
        <Typography variant='body1'>{currentVendor.description}</Typography>
      </CardContent>
      <GridList cellHeight={160} cols={3}>
        {currentVendor.images.map((tile, index) => (
          <GridListTile key={index} cols={(index + 1) % 4}>
            <img src={`${tile}?id=${index}`} alt={tile} />
          </GridListTile>
        ))}
      </GridList>
    </>
  );
};
