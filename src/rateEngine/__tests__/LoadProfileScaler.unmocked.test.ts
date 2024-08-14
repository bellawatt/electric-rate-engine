import LoadProfileScaler from '../LoadProfileScaler';
import times from 'lodash/times';
import sum from 'lodash/sum';
import LoadProfile from '../LoadProfile';
import e1 from '../__mocks__/rates/e-1';
import RateCalculator from '../RateCalculator';
import type { RateInterface } from '../types';

const getLoadProfileOfOnes = () => times(8760, () => 1);

const dummyRate: RateInterface = {
  name: 'some rate',
  title: 'that will not converge',
  rateElements: [
    {
      rateElementType: 'FixedPerMonth',
      name: 'Customer Charge',
      rateComponents: [
        {
          charge: 500,
          name: 'Customer Charge',
        },
      ],
    },
    {
      rateElementType: 'MonthlyDemand',
      name: 'Demand Charge',
      rateComponents: [
        {
          charge: 20,
          name: 'Demand Charge',
        },
      ],
    },
    {
      rateElementType: 'MonthlyEnergy',
      name: 'Energy Charge',
      rateComponents: [
        {
          charge: 0.18999,
          name: 'Energy Charge',
        },
      ],
    },
  ],
};

describe('LoadProfileScaler', () => {
  const initialLoadProfile = new LoadProfile(getLoadProfileOfOnes(), { year: 2019 });
  let loadProfileScaler;

  beforeEach(() => {
    loadProfileScaler = new LoadProfileScaler(initialLoadProfile);
  });

  describe('toAverageMonthlyBill', () => {
    afterEach(() => {
      jest.resetModules();
    });

    describe('without a mock', () => {
      beforeEach(() => {
        jest.dontMock('goal-seek');
      });

      it('returns a LoadProfile', () => {
        const scaledLoadProfile = loadProfileScaler.toAverageMonthlyBill(100, e1);
        expect(scaledLoadProfile).toBeInstanceOf(LoadProfile);
      });

      it('converges with a large bill amount', () => {
        const billAmount = 10000;
        const scaledLoadProfile = loadProfileScaler.toAverageMonthlyBill(billAmount, dummyRate);

        const rateCalculator = new RateCalculator({
          ...dummyRate,
          loadProfile: scaledLoadProfile,
        });
        expect(rateCalculator.annualCost() / 12).toBeCloseTo(billAmount);
      });
    });
  });

  describe('optional debugging', () => {
    it('prints things to the console', () => {
      console.log = jest.fn();
      const scaler = new LoadProfileScaler(initialLoadProfile, { debug: true });
      const avgMonthlyBill = scaler.toAverageMonthlyBill(100, e1);
      expect(console.log).toHaveBeenCalled();
    });
  });
});
