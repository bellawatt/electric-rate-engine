import LoadProfile from '../../LoadProfile';
import times from 'lodash.times';
import EnergyTimeOfUse from '../EnergyTimeOfUse';
import data from './EnergyTimeOfUseData';
import type { EnergyTimeOfUseArgs } from '../../types';

interface TestData {
  name: string;
  filters: EnergyTimeOfUseArgs;
  inputLoadProfileData: number[];
  billingDeterminantsByMonth: number[];
}

const getLoadProfileOfOnes = () => times(8760, () => 1);

const sumByMonthNoFilters = [744, 672, 743, 720, 744, 720, 744, 744, 720, 744, 721, 744];
const zerosByMonth = times(12, () => 0);

describe('EnergyTimeOfUse', () => {
  let loadProfile: LoadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });
  });

  describe('calculate', () => {
    it('calculates energy time of use with nothing filtered', () => {
      const result = new EnergyTimeOfUse(
        {
          months: [],
          daysOfWeek: [],
          hourStarts: [],
          onlyOnDays: [],
          exceptForDays: [],
        },
        loadProfile,
      ).calculate();

      expect(result).toEqual(sumByMonthNoFilters);
    });

    it('calculates energy time of use with everything filtered', () => {
      const result = new EnergyTimeOfUse(
        {
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

      it(`calculates energy time of use for ${name} filters`, () => {
        const result = new EnergyTimeOfUse(filters, inputLoadProfile).calculate();

        expect(result).toEqual(billingDeterminantsByMonth);
      });
    });
  });
});
