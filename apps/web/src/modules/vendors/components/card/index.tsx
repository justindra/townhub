import { Avatar, CardHeader, makeStyles } from '@material-ui/core';
import { Vendor } from '@townhub-libs/vendors';
import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingPage, Tabs } from '../../../../components';
import { CategoryLabel } from '../category-label';
import { AboutTab } from './about';
import { ContactTab } from './contact';

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  rounded: {
    borderRadius: theme.spacing(1),
  },
}));

export const VendorCard: React.FC<{ vendors: Vendor[] }> = ({ vendors }) => {
  const avatarClasses = useAvatarStyles();

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
          variant: 'body1',
        }}
        subheader={<CategoryLabel category={currentVendor.categories[0]} />}
      />
      <Tabs
        tabs={[
          {
            label: 'About',
            Component: () => <AboutTab {...currentVendor} />,
          },
          {
            label: 'Contact',
            Component: () => <ContactTab {...currentVendor} />,
          },
          {
            label: 'Hours',
            Component: () => <div>hours</div>,
          },
        ]}
      />
    </>
  );
};
