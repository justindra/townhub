import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { Email, Place, Facebook, Public, Phone } from '@material-ui/icons';
import { LINK_TYPES, Vendor } from '@townhub-libs/vendors/web';
import React from 'react';

type ContactItemProps = {
  Icon: React.ElementType;
  primaryText: string;
  secondaryText: string;
  href: string;
};

const ContactItem: React.FC<ContactItemProps> = ({
  Icon,
  primaryText,
  secondaryText,
  href,
}) => {
  return (
    <Link href={href} variant='inherit' color='inherit' underline='none'>
      <ListItem alignItems='flex-start'>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={primaryText} secondary={secondaryText} />
      </ListItem>
    </Link>
  );
};

export const ContactTab: React.FC<Vendor> = ({
  email,
  phone,
  address,
  links,
}) => {
  const website = links.find((val) => val.type === LINK_TYPES.WEBSITE);
  const items: ContactItemProps[] = [
    ...(Boolean(website)
      ? [
          {
            Icon: Public,
            primaryText: 'Website',
            secondaryText: website?.url || '',
            href: website?.url || '',
          },
        ]
      : []),
    {
      Icon: Phone,
      primaryText: 'Phone',
      secondaryText: phone,
      href: `tel:${phone}`,
    },
    {
      Icon: Place,
      primaryText: 'Address',
      secondaryText: address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
    },
    {
      Icon: Email,
      primaryText: 'Email',
      secondaryText: email,
      href: `mailto:${email}`,
    },
    ...links
      .filter((val) => val.type !== LINK_TYPES.WEBSITE)
      .map((link) => {
        let Icon: React.ElementType;
        switch (link.type) {
          case LINK_TYPES.FACEBOOK:
            Icon = () => (
              <FontAwesomeIcon icon={['fab', 'facebook']} size='lg' />
            );
            break;
          case LINK_TYPES.INSTAGRAM:
            Icon = () => (
              <FontAwesomeIcon icon={['fab', 'instagram']} size='lg' />
            );
            break;
          default:
            Icon = Public;
            break;
        }
        return {
          Icon,
          primaryText: link.name,
          secondaryText: link.url,
          href: link.url,
        };
      }),
  ];
  return (
    <CardContent>
      <List>
        {items.map((item, index) => (
          <ContactItem key={index} {...item} />
        ))}
      </List>
    </CardContent>
  );
};
