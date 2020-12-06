import { getDate, getDayDateRange } from './datetime';

describe('datetime helpers', () => {
  describe('getDayDateRange', () => {
    it('should return the correct time when in the default timezone', () => {
      const timestamp = 1602369473215;
      const {
        startOfDayValue,
        middleOfDayValue,
        endOfDayValue,
      } = getDayDateRange(timestamp);
      expect(startOfDayValue).toEqual(1602313200000);
      expect(middleOfDayValue).toEqual(1602356400000);
      expect(endOfDayValue).toEqual(1602399599999);
    });

    it('should return the correct time when in a different timezone', () => {
      const timestamp = 1602369473215;
      const {
        startOfDayValue,
        middleOfDayValue,
        endOfDayValue,
      } = getDayDateRange(timestamp, 'Australia/Brisbane');
      expect(startOfDayValue).toEqual(1602338400000);
      expect(middleOfDayValue).toEqual(1602381600000);
      expect(endOfDayValue).toEqual(1602424799999);
    });
  });

  describe('getData', () => {
    it('should return the date correctly', () => {
      const timestamp = 1602369473215;
      expect(getDate(timestamp)).toEqual('2020-10-10');
    });
  });
});
