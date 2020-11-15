import { makeStyles, Slide } from '@material-ui/core';
import { DailyData, Route } from '@townhub-libs/core';
import React, { useState } from 'react';
import { Button } from '../../../components';
import { HorizontalList } from '../../../components/horizontal-list';
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

export const ShuttleModule: React.FC<{
  dailyData: DailyData
}> = ({
  dailyData
}) => {
  const shuttlePageClasses = useShuttlePageStyles();

  const [openedStopId, setOpenedStopId] = useState<string>('');
  const [currentRoute, setCurrentRoute] = useState<Route>(dailyData.routes[0]);

  const handleStopClick = (id: string) => {
    setOpenedStopId(id);
  };

  const handleMapClick = () => {
    setOpenedStopId('');
  };
  return (
    <div className={shuttlePageClasses.container}>
      <div className={shuttlePageClasses.map}>
        <ShuttleMap
          stops={currentRoute.stopList}
          onStopClick={handleStopClick}
          onMapClick={handleMapClick}
        />
      </div>
      <div className={shuttlePageClasses.routeList}>
        <HorizontalList>
          {dailyData.routes.map(route => (
          <Button key={route.id} variant='contained' color='primary'>
            {route.name}
          </Button>
          ))}
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
