import LoadProfile from '../../LoadProfile';
import times from 'lodash/times';
import DemandTimeOfUse from '../DemandTimeOfUse';
import data from './DemandTimeOfUseData';
import type { DemandTimeOfUseArgs } from '../../types';

interface TestData {
  name: string;
  filters: DemandTimeOfUseArgs;
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
    it('calculates energy time of use with nothing filtered', () => {
      const result = new DemandTimeOfUse(
        {
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

    it('calculates energy time of use with everything filtered', () => {
      const result = new DemandTimeOfUse(
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
        const result = new DemandTimeOfUse(filters, inputLoadProfile).calculate();

        expect(result).toEqual(billingDeterminantsByMonth);
      });
    });
  });
});
