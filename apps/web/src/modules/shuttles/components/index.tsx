import { makeStyles, Slide } from '@material-ui/core';
import { DailyData, StopSchedule, Route } from '@townhub-libs/shuttles';
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components';
import { HorizontalList } from '../../../components/horizontal-list';
import { CardSummary } from './card-summary';
import { ShuttleMap } from './map';
import ReactGA from 'react-ga';

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
  dailyData: DailyData;
}> = ({ dailyData }) => {
  const shuttlePageClasses = useShuttlePageStyles();

  const [openedStopId, setOpenedStopId] = useState<string>('');
  const [openedStop, setOpenedStop] = useState<StopSchedule | null>(
    null
  );
  const [currentRoute, setCurrentRoute] = useState<Route | null>(
    dailyData.routes[0]
  );

  useEffect(() => {
    ReactGA.pageview('/shuttles');
  }, [])

  const handleStopClick = (id: string) => {
    setOpenedStopId(id);
    const stop = dailyData.stops.find((val) => val.id === id);
    setOpenedStop(stop ?? null);
    ReactGA.event({
      category: 'stop',
      action: 'clicked',
      label: stop?.name
    });
  };

  const handleMapClick = () => {
    setOpenedStopId('');
  };

  const handleRouteClick = (id: string) => {
    const route = dailyData.routes.find((val) => val.id === id);
    setCurrentRoute(route ?? null);
    setOpenedStopId('');
    ReactGA.event({
      category: 'route',
      action: 'clicked',
      label: route?.name
    });
  };
  return (
    <div className={shuttlePageClasses.container}>
      <div className={shuttlePageClasses.map}>
        <ShuttleMap
          stops={currentRoute?.stopList ?? []}
          onStopClick={handleStopClick}
          onMapClick={handleMapClick}
        />
      </div>
      <div className={shuttlePageClasses.routeList}>
        <HorizontalList>
          {dailyData.routes.map((route) => (
            <Button
              key={route.id}
              variant='contained'
              color={route.id === currentRoute?.id ? 'primary' : 'default'}
              onClick={() => handleRouteClick(route.id)}>
              {route.name}
            </Button>
          ))}
        </HorizontalList>
      </div>
      <Slide in={!!openedStopId} direction='up' mountOnEnter unmountOnExit>
        <div className={shuttlePageClasses.stopCard}>
          <CardSummary stop={openedStop as StopSchedule} />
        </div>
      </Slide>
    </div>
  );
};
