import 'jest-dynalite/withDb';
import { ValidationException } from '@townhub-libs/core';
import { TripsDatabase } from './database';

const TripsClient = new TripsDatabase();
const actorId = 'actorId';
const agencyId = 'agency-1';

describe('Trips Database', () => {
  describe('create', () => {
    // Unable to test this properly until jest-dynalite is fixed to handle Sort Keys
    // https://github.com/freshollie/jest-dynalite/issues/77
    it('not create the trip if there is a matching service AND route', async () => {
      await TripsClient.create(
        {
          agency_id: agencyId,
          stops: [],
          frequencies: [],
          service_id: 'service-1',
          route_id: 'route-1',
        },
        actorId
      );

      try {
        await TripsClient.create(
          {
            agency_id: agencyId,
            stops: [],
            frequencies: [],
            service_id: 'service-1',
            route_id: 'route-1',
          },
          actorId
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
      }

      const res = await TripsClient.create(
        {
          agency_id: agencyId,
          stops: [],
          frequencies: [],
          service_id: 'service-1',
          route_id: 'route-2',
        },
        actorId
      );

      expect(res).not.toBeUndefined();
    });
  });

  describe('getAllTripsForServices', () => {
    it('should return all trips with services given in the list', async () => {
      await Promise.all(
        [
          { service_id: 'service-1', route_id: 'route-1' },
          { service_id: 'service-2', route_id: 'route-2' },
          { service_id: 'service-3', route_id: 'route-1' },
        ].map(async (val) => {
          await TripsClient.create(
            {
              agency_id: agencyId,
              stops: [],
              frequencies: [],
              ...val,
            },
            actorId
          );
        })
      );

      const res = await TripsClient.getAllTripsForServices(agencyId, [
        'service-1',
        'service-3',
      ]);

      expect(res.length).toEqual(2);
      expect(
        res.find((val) => val.service_id === 'service-1')
      ).not.toBeUndefined();
      expect(res.find((val) => val.service_id === 'service-2')).toBeUndefined();
      expect(
        res.find((val) => val.service_id === 'service-3')
      ).not.toBeUndefined();
    });
  });
});
