import { makeStyles, Slide } from '@material-ui/core';
import { DailyData, StopSchedule, Route } from '@townhub-libs/shuttles';
import React, { useEffect, useState } from 'react';
import { Button, LoadingPage } from '../../../components';
import { HorizontalList } from '../../../components/horizontal-list';
import { CardSummary } from './card-summary';
import { ShuttleMap } from './map';
import ReactGA from 'react-ga';
import { useTownhub } from '../../../state';

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
    bottom: theme.spacing(2),
    left: 0,
    right: 0,
    zIndex: 5,
    maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ShuttleModule: React.FC = () => {
  const shuttlePageClasses = useShuttlePageStyles();

  const { Shuttles } = useTownhub();

  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [openedStopId, setOpenedStopId] = useState<string>('');
  const [openedStop, setOpenedStop] = useState<StopSchedule | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  useEffect(() => {
    // TODO: Update this via the router
    ReactGA.pageview('/shuttles');

    let active = true;
    (async () => {
      // Go get the daily data for the shuttles
      const daily = await Shuttles.getDailyData();
      if (active) {
        setDailyData(daily);
        setCurrentRoute(daily.routes[0]);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dailyData) return <LoadingPage />;

  const handleStopClick = (id: string) => {
    setOpenedStopId(id);
    const stop = dailyData.stops.find((val) => val.id === id);
    setOpenedStop(stop ?? null);
    ReactGA.event({
      category: 'stop',
      action: 'clicked',
      label: stop?.name,
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
      label: route?.name,
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
