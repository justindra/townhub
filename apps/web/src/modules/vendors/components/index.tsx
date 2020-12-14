import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, Typography, makeStyles } from '@material-ui/core';
import { useTownhub } from '../../../state';
import { Vendor } from '@townhub-libs/vendors';

const useCardHeaderStyles = makeStyles((theme) => ({
  content: {
    overflow: 'hidden'
  }
}))

export const VendorsModule: React.FC = () => {

  const cardHeaderClasses = useCardHeaderStyles();
  const { Vendors } = useTownhub();
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await Vendors.list();
      if (active) {
        setVendorList(res);
      }

    })()
    return () => { active = false; }
  }, [])
  return (
    <div style={{
      padding: 16,
      height: '100%',
      overflowY: 'auto'
    }}>
      <Typography variant='h6' gutterBottom>Vendors</Typography>
      {vendorList.map(vendor => (
      <Card key={vendor.id} variant='outlined' style={{
        marginBottom: 16
      }}>
        <CardHeader
        classes={cardHeaderClasses}
        avatar={
          <Avatar src={`${vendor.logo}?id=${vendor.id}`} variant="rounded">RA</Avatar>
        }
        title={vendor.name}
        subheader={vendor.description}
        subheaderTypographyProps={{
          noWrap: true
        }}
        />
          
      </Card>

      ))}
    </div>
  )
}