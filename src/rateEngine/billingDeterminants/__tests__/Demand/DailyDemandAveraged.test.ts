import LoadProfile from '../../../LoadProfile';
import times from 'lodash.times';
import Demand from '../../Demand';

const getLoadProfileOfOnes = () => times(8760, () => 1);

const zerosByMonth = times(12, () => 0);

describe('DailyDemandAveraged', () => {
  let loadProfile: LoadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });
  });

  describe('calculate', () => {
    it('calculates demand per day averaged on a simple load profile with nothing filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: [],
          exceptForDays: [],
          averagingQty: 3,
          averagingPeriod: 'monthly',
        },
        loadProfile,
      ).calculate();

      result.forEach((val) => {
        expect(val).toBeCloseTo(1);
      });
    });

    it('calculates demand per day averaged on a simple load profile with everything filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: ['2015-01-01'],
          exceptForDays: [],
          averagingQty: 3,
          averagingPeriod: 'monthly',
        },
        loadProfile,
      ).calculate();

      result.forEach((val, i) => {
        expect(val).toBeCloseTo(zerosByMonth[i]);
      });
    });

    it('calculates demand per day with actual values', () => {
      const loads = getLoadProfileOfOnes();
      // jan 1
      loads[13] = 15;
      loads[14] = 20;
      // jan 2
      loads[37] = 13;
      // jan 3
      loads[61] = 12;
      // jan 4
      loads[85] = 11;

      // mar 1
      loads[1416] = 8;
      // mar 2
      loads[1440] = 7;
      loads[1441] = 9;
      // mar 3
      loads[1464] = 6;

      const loadProfile = new LoadProfile(loads, { year: 2019 });
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: [],
          exceptForDays: [],
          averagingQty: 3,
          averagingPeriod: 'monthly',
        },
        loadProfile,
      ).calculate();

      const expected = [15, 1, 7.6667, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      result.forEach((val, i) => {
        expect(val).toBeCloseTo(expected[i]);
      });
    });

    it('calculates demand per day with actual values, 4 loads averaged, and filters applied', () => {
      const loads = getLoadProfileOfOnes();
      // jan 1 (filtered out)
      loads[13] = 15;
      loads[14] = 20;
      // jan 2 (filtered out)
      loads[37] = 13;
      // jan 3 (filtered out)
      loads[61] = 12;
      // jan 4 (filtered out)
      loads[85] = 11;

      // mar 1 - hour 0 (filtered out)
      loads[1416] = 8;
      // mar 2
      loads[1441] = 7;
      loads[1442] = 9;
      // mar 3
      loads[1465] = 6;
      // mar 4
      loads[1490] = 5;
      loads[1492] = 4;
      // mar 5
      loads[1520] = 3;

      const loadProfile = new LoadProfile(loads, { year: 2019 });
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [2, 3, 4],
          daysOfWeek: [],
          hourStarts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          onlyOnDays: [],
          exceptForDays: [],
          averagingQty: 4,
          averagingPeriod: 'monthly',
        },
        loadProfile,
      ).calculate();

      const expected = [0, 0, 5.75, 1, 1, 0, 0, 0, 0, 0, 0, 0];
      result.forEach((val, i) => {
        expect(val).toBeCloseTo(expected[i]);
      });
    });
  });
});
