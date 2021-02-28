import React, { useEffect, useState } from 'react';
import { useTownhub } from '../../../state';
import { Vendor } from '@townhub-libs/vendors';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { VendorList } from './vendor-list';
import { VendorCard } from './card';

export const VendorsModule: React.FC = () => {
  const { Vendors } = useTownhub();
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  const { path, url } = useRouteMatch();
  const params = useParams();

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await Vendors.list();
      if (active) {
        setVendorList(res);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  console.log(params, path, url);

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
