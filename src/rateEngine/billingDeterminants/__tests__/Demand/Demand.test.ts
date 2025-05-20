import LoadProfile from '../../../LoadProfile';
import times from 'lodash/times';
import Demand from '../../Demand';

const getLoadProfileOfOnes = () => times(8760, () => 1);

describe('Demand', () => {
  describe('calculate', () => {
    it('throws an error for invalid demand period and averaging period', () => {
      const loadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });

      expect(() => {
        new Demand(
          {
            demandPeriod: 'monthly',
            options: {
              averagingQty: 3,
              averagingPeriod: 'monthly',
            },
          },
          loadProfile,
        ).calculate();
      }).toThrow('Averaging period (monthly) must be less granular than demand period (monthly).');
    });

    it('calculates demand with filters, averaging, and tiers applied', () => {
      const loads = getLoadProfileOfOnes();

      loads[12] = 5; // Jan 1
      loads[36] = 10; // Jan 2
      loads[60] = 15; // Jan 3
      loads[84] = 20; // Jan 4
      loads[108] = 25; // Jan 5

      loads[1074] = 20; // Feb 14 (filtered out)
      loads[1374] = 20; // Feb 27 (filtered out)

      loads[1441] = 30; // Mar 2
      loads[1465] = 40; // Mar 3

      const loadProfile = new LoadProfile(loads, { year: 2019 });

      const result = new Demand(
        {
          demandPeriod: 'daily',
          options: {
            filters: {
              months: [0, 2], // Only Jan and Mar
              daysOfWeek: [],
              hourStarts: [],
              onlyOnDays: [],
              exceptForDays: [],
            },
            averagingPeriod: 'monthly',
            averagingQty: 3, // Top 3 days per month
            min: [10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Min demand per month
            max: [
              20,
              'Infinity',
              35,
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
              'Infinity',
            ], // Max demand per month
          },
        },
        loadProfile,
      ).calculate();

      // January
      // Apply tiers (min=10, max=20):
      //    => [0, 0, 5, 10, 10, 0, ...]
      // Pick top 3 => [5, 10, 10]
      //   => mean = 8.33

      // March
      // Apply tiers (min=10, max=35):
      //    => [0, 20, 25, 0, ...]
      // Pick top 3 => [20, 25, 0]
      //   => mean = 15

      const expected = [8.33, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      result.forEach((val, i) => {
        expect(val).toBeCloseTo(expected[i], 2);
      });
    });
  });
});
