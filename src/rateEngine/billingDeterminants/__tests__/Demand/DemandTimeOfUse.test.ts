import LoadProfile from '../../../LoadProfile';
import times from 'lodash/times';
import data from './DemandTimeOfUseData';
import type { LoadProfileFilterArgs } from '../../../types';
import Demand from '../../Demand';

interface TestData {
  name: string;
  filters: LoadProfileFilterArgs;
  inputLoadProfileData: number[];
  billingDeterminantsByMonth: number[];
}

const getLoadProfileOfOnes = () => times(8760, () => 1);

const onesByMonth = times(12, () => 1);
const zerosByMonth = times(12, () => 0);

describe('DemandTimeOfUse', () => {
  let loadProfile: LoadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });
  });

  describe('calculate', () => {
    it('calculates demand time of use with nothing filtered and no filters argument', () => {
      const result = new Demand({ demandPeriod: 'monthly' }, loadProfile).calculate();

      expect(result).toEqual(onesByMonth);
    });

    it('calculates demand time of use with nothing filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'monthly',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: [],
          exceptForDays: [],
        },
        loadProfile,
      ).calculate();

      expect(result).toEqual(onesByMonth);
    });

    it('calculates demand time of use with everything filtered', () => {
      const result = new Demand(
        {
          demandPeriod: 'monthly',
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: ['2015-01-01'],
          exceptForDays: [],
        },
        loadProfile,
      ).calculate();

      expect(result).toEqual(zerosByMonth);
    });

    data.forEach(({ name, filters, inputLoadProfileData, billingDeterminantsByMonth }: TestData) => {
      let inputLoadProfile = new LoadProfile(inputLoadProfileData, { year: 2019 });

      it(`calculates demand time of use for ${name} filters`, () => {
        const result = new Demand(
          {
            demandPeriod: 'monthly',
            ...filters,
          },
          inputLoadProfile,
        ).calculate();

        expect(result).toEqual(billingDeterminantsByMonth);
      });
    });
  });
});
