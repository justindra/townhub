import { makeStyles, rgbToHex } from '@material-ui/core';
import React from 'react';
import { Button, Map } from '../../components';
import { HorizontalList } from '../../components/horizontal-list';
import { CardSummary } from './card-summary';

const useShuttlePageStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  routeList: {
    position: 'absolute',
    top: theme.spacing(2),
    left: 0,
    right: 0,
    zIndex: 5,
  },
  stopList: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: 0,
    right: 0,
    zIndex: 5,
  },
}));

export const ShuttleModule: React.FC = () => {
  const shuttlePageClasses = useShuttlePageStyles();

  return (
    <div className={shuttlePageClasses.container}>
      <div className={shuttlePageClasses.map}>
        <Map />
      </div>
      <div className={shuttlePageClasses.routeList}>
        <HorizontalList>
          <Button variant='contained' color='primary'>
            Morning
          </Button>
          <Button variant='contained'>Afternoon</Button>
          <Button variant='contained'>Evening</Button>
        </HorizontalList>
      </div>
      <div className={shuttlePageClasses.stopList}>
        <HorizontalList>
          <CardSummary title='Dose Cafe' subtitle='100 1st St' minutes={20} />
          <CardSummary title='asdasd' subtitle='asdasd' minutes={20} />
          <CardSummary title='asdasd' subtitle='asdasd' minutes={20} />
        </HorizontalList>
      </div>
    </div>
  );
};
