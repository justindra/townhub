import { getDayDateRange } from './datetime';

describe('datetime helpers', () => {
  describe('getDayDateRange', () => {
    it('should return the correct time when in the default timezone', () => {
      const timestamp = 1602369473215;
      const { startOfDay, middleOfDay, endOfDay } = getDayDateRange(timestamp);
      expect(startOfDay).toEqual(1602313200000);
      expect(middleOfDay).toEqual(1602356400000);
      expect(endOfDay).toEqual(1602399599999);
    });

    it('should return the correct time when in a different timezone', () => {
      const timestamp = 1602369473215;
      const { startOfDay, middleOfDay, endOfDay } = getDayDateRange(
        timestamp,
        'Australia/Brisbane'
      );
      expect(startOfDay).toEqual(1602338400000);
      expect(middleOfDay).toEqual(1602381600000);
      expect(endOfDay).toEqual(1602424799999);
    });
  });
});
