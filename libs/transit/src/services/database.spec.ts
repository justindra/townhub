import 'jest-dynalite/withDb';
import { DateTime } from 'luxon';
import { ServiceAvailability } from '.';
import { ServicesDatabase } from './database';

const ServicesClient = new ServicesDatabase();
const actorId = 'actorId';
const agencyId = 'agency-1';

describe('Services Database', () => {
  describe('getServicesBetweenRange', () => {
    it('should return the right services during a particular range', async () => {
      await Promise.all(
        [
          { start_date: '2021-12-12', end_date: '2021-12-21', id: 'service-a' },
          { start_date: '2021-12-20', end_date: '2021-12-25', id: 'service-b' },
          { start_date: '2021-12-12', end_date: '2021-12-18', id: 'service-c' },
        ].map(async (val) => {
          await ServicesClient.create(
            {
              agency_id: agencyId,
              monday: ServiceAvailability.Available,
              tuesday: ServiceAvailability.Available,
              wednesday: ServiceAvailability.Available,
              thursday: ServiceAvailability.Available,
              friday: ServiceAvailability.Available,
              saturday: ServiceAvailability.Available,
              sunday: ServiceAvailability.Available,
              exceptions: [],
              ...val,
            },
            actorId
          );
        })
      );

      const res = await ServicesClient.getServicesBetweenRange(
        agencyId,
        DateTime.fromISO('2021-12-20'),
        DateTime.fromISO('2021-12-21')
      );

      expect(res.length).toEqual(2);
      expect(res.map((val) => val.id).sort()).toEqual([
        'service-a',
        'service-b',
      ]);
    });
  });
});
