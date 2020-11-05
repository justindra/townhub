import { makeStyles, rgbToHex, Slide } from '@material-ui/core';
import React, { useState } from 'react';
import { Button } from '../../components';
import { HorizontalList } from '../../components/horizontal-list';
import { CardSummary } from './card-summary';
import { ShuttleMap } from './map';

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
  stopCard: {
    position: 'absolute',
    bottom: theme.spacing(3),
    left: 0,
    right: 0,
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ShuttleModule: React.FC = () => {
  const shuttlePageClasses = useShuttlePageStyles();

  const [openedStopId, setOpenedStopId] = useState<string>('');

  const handleStopClick = (id: string) => {
    setOpenedStopId(`${id} - asdasd`);
  };

  const handleMapClick = () => {
    setOpenedStopId('');
  };
  return (
    <div className={shuttlePageClasses.container}>
      <div className={shuttlePageClasses.map}>
        <ShuttleMap
          stops={[]}
          onStopClick={handleStopClick}
          onMapClick={handleMapClick}
        />
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
      <Slide in={!!openedStopId} direction='up' mountOnEnter unmountOnExit>
        <div className={shuttlePageClasses.stopCard}>
          <CardSummary title='Dose Cafe' subtitle='100 1st St' minutes={20} />
        </div>
      </Slide>
    </div>
  );
};
