import { Typography, Link } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';

export const AboutPage: React.FC<{
  townName: string;
}> = ({
  townName
}) => {
  return (
    <div
      style={{
        padding: 16,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <RouterLink to='/shuttles'>
        <Link variant='body2' color='textPrimary' paragraph>
          Back to Shuttles
        </Link>
      </RouterLink>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingTop: 16
      }}>
        <Typography variant='h6' gutterBottom>
          About Townhub
        </Typography>
        <Typography variant='body1' paragraph>
          Townhub is an open-source project intended to collate different
          information about a town to help both visitors and locals to navigate
          their way around town.
        </Typography>
        <Typography variant='body1' paragraph>
          Currently the main feature is of a ski shuttle timetable. Feedback and
          suggestions on other features is most welcome. Please contact me via{' '}
          <Link href='mailto:hello@justinrahardjo.com'>
            hello@justinrahardjo.com
          </Link>
          .
        </Typography>
        <Typography variant='caption' paragraph align='center'>
        <Link color='inherit' href='https://github.com/justindra/townhub' target='_blank'>
          Made with{' '}
          <FavoriteIcon
            fontSize='small'
            color='error'
            style={{ marginBottom: '-0.25em' }}
          />{' '}
          for {townName}</Link>
        </Typography>

      </div>
    </div>
  );
};
