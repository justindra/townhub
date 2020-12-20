import React from 'react';
import { Vendor } from '@townhub-libs/vendors';
import {
  Avatar,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useCardHeaderStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  content: {
    overflow: 'hidden',
  },
}));

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  rounded: {
    borderRadius: theme.spacing(1)
  }
}))

export const VendorList: React.FC<{ vendors: Vendor[], parentUrl: string }> = ({ vendors, parentUrl }) => {
  const cardHeaderClasses = useCardHeaderStyles();
  const avatarClasses = useAvatarStyles();

  const history = useHistory();

  const handleCardClick = (id: string) => {
    history.push(`${parentUrl}/${id}`);
  }

  return (
    <div>
      <Grid container spacing={2}>
        {vendors.map((vendor) => (
          <Grid item key={vendor.id} xs={12} sm={6} md={4} lg={3}>
            <Card elevation={0}>
              <CardActionArea onClick={() => handleCardClick(vendor.id)}>
                <CardHeader
                  classes={cardHeaderClasses}
                  avatar={
                    <Avatar
                      src={`${vendor.logo}?id=${vendor.id}`}
                      variant='rounded'
                      classes={avatarClasses}
                      >
                      RA
                    </Avatar>
                  }
                  title={vendor.name}
                  subheader={vendor.description}
                  subheaderTypographyProps={{
                    noWrap: true,
                  }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
