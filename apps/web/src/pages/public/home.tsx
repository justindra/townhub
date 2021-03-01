import { Avatar, CardContent, Grid, Typography } from '@material-ui/core';
import React, { CSSProperties } from 'react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { VENDOR_CATEGORIES } from '@townhub-libs/vendors/web';
import { VENDORS_ENDPOINT } from '../../modules';

interface LinkItemProps {
  title: string;
  href: string;
  icon: FontAwesomeIconProps['icon'];
  color: CSSProperties['backgroundColor'];
}

export const LinkItem: React.FC<LinkItemProps> = ({
  title,
  icon,
  color,
  href,
}) => {
  return (
    <Grid item xs={4} sm={3} md={2} lg={1} style={{ textAlign: 'center' }}>
      <Link
        to={href}
        style={{
          textDecoration: 'none',
        }}>
        <Avatar
          variant='rounded'
          style={{
            width: 80,
            height: 80,
            margin: 'auto',
            backgroundColor: color,
          }}>
          <FontAwesomeIcon icon={icon} size='2x' />
        </Avatar>
        <Typography
          variant='subtitle2'
          style={{ padding: 8 }}
          color='textPrimary'>
          {title}
        </Typography>
      </Link>
    </Grid>
  );
};

interface LinkListProps {
  title: string;
  items: LinkItemProps[];
}

const VendorItems: LinkItemProps[] = [
  VENDOR_CATEGORIES.ARTISAN,
  VENDOR_CATEGORIES.FOOD_DRINKS,
  VENDOR_CATEGORIES.STORE,
].map((val) => ({
  title: val.label,
  icon: val.icon as FontAwesomeIconProps['icon'],
  href: `/${VENDORS_ENDPOINT}/${val.name}`,
  color: val.color,
}));

export const LinkList: React.FC<LinkListProps> = ({ title, items }) => {
  return (
    <>
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <LinkItem key={index} {...item} />
        ))}
      </Grid>
    </>
  );
};

export const HomePage: React.FC = () => {
  return (
    <CardContent>
      <LinkList
        title='Transportation'
        items={[
          {
            title: 'Resort Shuttle',
            href: '/shuttles',
            icon: 'shuttle-van',
            color: 'blue',
          },
        ]}
      />
      <LinkList title='Vendors' items={VendorItems} />
      <Link
        to='/about'
        style={{ textAlign: 'center', display: 'block', paddingTop: 16 }}>
        About
      </Link>
    </CardContent>
  );
};
