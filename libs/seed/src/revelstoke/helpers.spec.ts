import { hasSameStops } from './helpers';

describe('helpers', () => {
  describe('hasSameStops', () => {
    it('should return true if same stops and in the same order', () => {
      const stopListA = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(true);
    });
    it('should return false if same stops but different order', () => {
      const stopListA = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-21', legMinutes: 8 },
        { stopId: 'stop-1', legMinutes: 7 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
    it('should return false if same stops, same order but different leg times', () => {
      const stopListA = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 18 },
      ];
      const stopListB = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
    it('should return false if different stops', () => {
      const stopListA = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-1', legMinutes: 7 },
        { stopId: 'stop-3', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'stop-2', legMinutes: 0 },
        { stopId: 'stop-5', legMinutes: 7 },
        { stopId: 'stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
  });
});
