import React, { useEffect, useState } from 'react';
import { useTownhub } from '../../../state';
import { Vendor } from '@townhub-libs/vendors';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { VendorList } from './vendor-list';
import { VendorCard } from './card';
import { LoadingPage } from '../../../components';

type RouteParams = {
  category?: string;
};

export const VendorsModule: React.FC = () => {
  const { Vendors } = useTownhub();
  const [loading, setLoading] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  const { path, url } = useRouteMatch();
  const params = useParams<RouteParams>();
  const category = params.category || '';

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await Vendors.listByCategory(category);
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

  if (!vendorList.length)
    return <div>No vendors found in the category: {category}</div>;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
      }}>
      <Switch>
        <Route exact path={path}>
          <VendorList vendors={vendorList} parentUrl={url} />
        </Route>
        <Route path={`${path}/:vendorId`}>
          <VendorCard vendors={vendorList} />
        </Route>
      </Switch>
    </div>
  );
};
