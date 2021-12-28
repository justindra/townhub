import { hasSameStops } from './helpers';

describe('helpers', () => {
  describe('hasSameStops', () => {
    it('should return true if same stops and in the same order', () => {
      const stopListA = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(true);
    });
    it('should return false if same stops but different order', () => {
      const stopListA = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
    it('should return false if same stops, same order but different leg times', () => {
      const stopListA = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 18 },
      ];
      const stopListB = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
    it('should return false if different stops', () => {
      const stopListA = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-1', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-3', legMinutes: 8 },
      ];
      const stopListB = [
        { stopId: 'th-shuttle-stop|stop-2', legMinutes: 0 },
        { stopId: 'th-shuttle-stop|stop-5', legMinutes: 7 },
        { stopId: 'th-shuttle-stop|stop-21', legMinutes: 8 },
      ];
      expect(hasSameStops(stopListA, stopListB)).toEqual(false);
    });
  });
});
