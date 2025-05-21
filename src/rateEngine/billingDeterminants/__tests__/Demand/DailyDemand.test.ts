import LoadProfile from '../../../LoadProfile';
import times from 'lodash/times';
import data from './DailyDemandData';
import { daysPerMonth } from '../../../utils/assumptions';
import type { LoadProfileFilterArgs } from '../../../types';
import Demand from '../../Demand';

interface TestData {
  name: string;
  filters: LoadProfileFilterArgs;
  inputLoadProfileData: number[];
  billingDeterminantsByMonth: number[];
}

const getLoadProfileOfOnes = () => times(8760, () => 1);

const zerosByMonth = times(12, () => 0);

describe('DailyDemand', () => {
  let loadProfile: LoadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });
  });

  describe('calculate', () => {
    it('calculates demand per day with nothing filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: [],
          exceptForDays: [],
        },
        loadProfile,
      ).calculate();

      result.forEach((val, i) => {
        expect(val).toBeCloseTo(daysPerMonth(loadProfile.year)[i]);
      });
    });

    it('calculates demand per day with everything filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'daily',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: ['2015-01-01'],
          exceptForDays: [],
        },
        loadProfile,
      ).calculate();

      result.forEach((val, i) => {
        expect(val).toBeCloseTo(zerosByMonth[i]);
      });
    });

    data.forEach(({ name, filters, inputLoadProfileData, billingDeterminantsByMonth }: TestData) => {
      let inputLoadProfile = new LoadProfile(inputLoadProfileData, { year: 2019 });

      it(`calculates demand per day for ${name}`, () => {
        const result = new Demand({ demandPeriod: 'daily', ...filters }, inputLoadProfile).calculate();

        result.forEach((val, i) => {
          expect(val).toBeCloseTo(billingDeterminantsByMonth[i]);
        });
      });
    });
  });
});
