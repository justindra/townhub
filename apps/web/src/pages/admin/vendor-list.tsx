import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardContent,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Vendor } from '@townhub-libs/vendors';
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Button, LoadingPage } from '../../components';
import { VendorList } from '../../modules/vendors/components/vendor-list';
import { useTownhub } from '../../state';

const useVendorListStyle = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const EmptyPage: React.FC = () => {
  const classes = useVendorListStyle();

  return (
    <Container maxWidth='md' className={classes.container}>
      <Typography variant='h6'>Welcome</Typography>
      <Typography variant='subtitle1' gutterBottom>
        Add a vendor to get started
      </Typography>
      <Button
        size='large'
        variant='contained'
        color='primary'
        startIcon={<FontAwesomeIcon icon='plus' size='sm' />}>
        Add vendor
      </Button>
    </Container>
  );
};

export const VendorListPage: React.FC = () => {
  const { Vendors } = useTownhub();
  const { url } = useRouteMatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await Vendors.listByUserId();
      if (active) {
        setVendorList(res);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingPage />;

  if (!vendorList.length) return <EmptyPage />;

  return <VendorList vendors={vendorList} parentUrl={url} />;
};
