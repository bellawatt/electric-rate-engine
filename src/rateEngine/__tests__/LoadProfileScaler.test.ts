import LoadProfileScaler from '../LoadProfileScaler';
import times from 'lodash/times';
import sum from 'lodash/sum';
import LoadProfile from '../LoadProfile';
//import goalSeek from 'goal-seek';
import e1 from '../__mocks__/rates/e-1';

const getLoadProfileOfOnes = () => times(8760, () => 1);
const getLoadProfileOfTwos = () => times(8760, () => 2);

jest.mock('goal-seek', () => {
  return jest.fn()
    .mockImplementationOnce(() => 200)
    .mockImplementationOnce(() => { throw('some goal-seek error'); });
});

describe('LoadProfileScaler', () => {
  const initialLoadProfile = new LoadProfile(getLoadProfileOfOnes(), {year: 2019});
  let loadProfileScaler;

  beforeEach(() => {
    loadProfileScaler = new LoadProfileScaler(initialLoadProfile);
  });

  describe('to', () => {
    it('multiplies all entries in the load profile by the given scaler', () => {
      expect(loadProfileScaler.to(2)).toEqual(
        new LoadProfile(getLoadProfileOfTwos(), {year: 2019})
      );
    })
  });

  describe('toTotalKwh', () => {
    it('returns a loadprofile whose sum totals the given kWh', () => {
      const totalKwh = 18705;
      const loadProfile = new LoadProfile(
        times(8760, (i) => i % 10),
        {year: 2019}
      );

      expect(loadProfileScaler.toTotalKwh(totalKwh).sum()).toBeCloseTo(totalKwh);
    });
  });

  describe('toAverageMonthlyBill', () => {
    describe('with a mock', () => {
      it('scales by the scaler that goal-seek finds', () => {
        const scaledLoadProfile = loadProfileScaler.toAverageMonthlyBill(100, e1);
        expect(scaledLoadProfile).toEqual(
          new LoadProfile(getLoadProfileOfTwos(), {year: 2019})
        );
      });

      it('throws the error if goal-seek fails', () => {
        expect(
          () => loadProfileScaler.toAverageMonthlyBill(100, e1)
        ).toThrow('some goal-seek error');
      })
    });
  });

  describe('toMonthlyKwh', () => {
    it('returns a LoadProfile scaled to the monthly load', () => {
      const monthlyLoad = times(12, (i) => ((i + 1) * 100));
      const scaledLoadProfile = loadProfileScaler.toMonthlyKwh(monthlyLoad);

      scaledLoadProfile.sumByMonth().forEach((monthlyTotal, idx) => {
        expect(monthlyTotal).toBeCloseTo(monthlyLoad[idx]);
      })
    });

    it('throws an error with an array without 12 elements', () => {
      const monthlyLoad = times(11, (i) => ((i + 1) * 100));
      expect(() => loadProfileScaler.toMonthlyKwh(monthlyLoad)).toThrowError();
    });
  });
});
