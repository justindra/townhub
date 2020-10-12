import { sortNumberAscending } from './sort';

describe('sort helpers', () => {
  describe('sortNumberAscending', () => {
    it('should sort a set of numbers by ascending order', () => {
      const input = [8, 10, 2, 2, 1, 20, 13];
      const result = input.sort(sortNumberAscending);
      const expected = [1, 2, 2, 8, 10, 13, 20];

      expect(result).toEqual(expected);
    });
  });
});
