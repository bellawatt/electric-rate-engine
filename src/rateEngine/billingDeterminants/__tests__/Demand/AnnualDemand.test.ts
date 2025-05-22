import LoadProfile from '../../../LoadProfile';
import times from 'lodash/times';
import Demand from '../../Demand';

const getLoadProfileOfOneThroughTen = () => times(8760, (num) => (num % 10) + 1);
const getLoadProfileWithOneNonZero = () => times(8760, (i) => (i === 1234 ? 100 : 0));

describe('AnnualDemand', () => {
  describe('calculate', () => {
    it('calculates the annual max demand for a load profile of 1 through 10', () => {
      const loadProfile = new LoadProfile(getLoadProfileOfOneThroughTen(), { year: 2019 });
      const result = new Demand({ demandPeriod: 'annual' }, loadProfile).calculate();

      expect(result).toEqual(times(12, () => 10));
    });

    it('calculates the annual max demand for a load profile with one non-zero value', () => {
      const loadProfile = new LoadProfile(getLoadProfileWithOneNonZero(), { year: 2019 });
      const result = new Demand({ demandPeriod: 'annual' }, loadProfile).calculate();

      expect(result).toEqual(times(12, () => 100));
    });
  });
});
