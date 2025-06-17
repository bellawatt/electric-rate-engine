import LoadProfile from '../../LoadProfile';
import times from 'lodash.times';
import BlockedTiersInDays from '../BlockedTiersInDays';

// For reference: the number of hours in each month:
// [ 744, 672, 743, 720, 744, 720, 744, 744, 720, 744, 721, 744 ]

const getLoadProfileOfOnes = () => times(8760, () => 1);

describe('BlockedTiersInMonths', () => {
  let loadProfile: LoadProfile;
  let min: Array<number>;
  let max: Array<number>;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), {year: 2018});
    min = [ 0, 0, 0,10,10,10,700,700,700,750,750,750];
    max = [10,10,10,15,15,15,725,725,725, 55, 55, 55];
  });

  describe('calculate', () => {
    it('calculates blocked tiers in days', () => {
      const result = new BlockedTiersInDays({
        min,
        max,
      }, loadProfile).calculate();

      // This is a handcrafted™ array to test various min/max scenarios.
      expect(result).toEqual([310,280,310,150,155,150,0,0,0,0,0,0]);
    });
  });

  describe('filtered by months', () => {
    it('calculates blocked tiers in days', () => {
      const result = new BlockedTiersInDays({
        min,
        max,
        months: [0]
      }, loadProfile).calculate();

      expect(result).toEqual([310,0,0,0,0,0,0,0,0,0,0,0]);
    });
  })
});
