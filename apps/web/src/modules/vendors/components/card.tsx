import {
  Avatar,
  CardContent,
  CardHeader,
  GridList,
  GridListTile,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { Vendor } from '@townhub-libs/vendors';
import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingPage } from '../../../components';

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(8),
    height: theme.spacing(8)
  },
  rounded: {
    borderRadius: theme.spacing(1)
  }
}))

const useTabsStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    top: -theme.spacing(2),
    left: 0,
    right: 0,
    background: theme.palette.background.paper
  }
}))

export const VendorCard: React.FC<{ vendors: Vendor[] }> = ({ vendors }) => {
  const avatarClasses = useAvatarStyles();
  const tabsClasses = useTabsStyles();

  const { vendorId } = useParams<{ vendorId: string }>();

  const currentVendor = vendors.find((val) => val.id === vendorId);
  if (!currentVendor) return <LoadingPage />;
  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            src={`${currentVendor.logo}?id=${currentVendor.id}`}
            variant='rounded'
            classes={avatarClasses}>
            RA
          </Avatar>
        }
        title={currentVendor.name}
        titleTypographyProps={{
          gutterBottom: true,
          variant: 'body1'
        }}
      />
      <Tabs value={0} aria-label="simple tabs example" variant='fullWidth' classes={tabsClasses}>
        <Tab label="Overview"  />
        <Tab label="Contact"  />
        <Tab label="Hours" />
      </Tabs>
      <CardContent>
        <Typography variant='body1'>{currentVendor.description}</Typography>
      </CardContent>
      <GridList cellHeight={160} cols={3} spacing={16} style={{
        padding: 16
      }}>
        {currentVendor.images.map((tile, index) => (
          <GridListTile key={index} cols={(index + 1) % 4}>
            <img src={`${tile}?id=${index}`} alt={tile} />
          </GridListTile>
        ))}
      </GridList>
    </>
  );
};
