import LoadProfile from '../LoadProfile';
import RateCalculator from '../RateCalculator';
import { RateElementType } from '../BillingDeterminantFactory';
import { BillingCategory } from '../RateElement';

describe('RateCalculator', () => {
  describe('annualCost', () => {
    it('calculates annual the annual cost', () => {
      const rate = {
        name: 'a rate with multiple elements',
        rateElements: [
          {
            name: 'One fixed charge',
            billingCategory: 'supply' as BillingCategory,
            rateElementType: 'FixedPerMonth' as RateElementType,
            rateComponents: [
              {
                charge: 10,
                name: 'The first fixed charge',
              },
            ],
          },
          {
            name: 'Second fixed charge',
            billingCategory: 'delivery' as BillingCategory,
            rateElementType: 'FixedPerMonth' as RateElementType,
            rateComponents: [
              {
                charge: 20,
                name: 'The second fixed charge',
              },
            ],
          },
        ],
      };

      const loadProfile = new LoadProfile(Array(8760).fill(0), {year: 2019});
      const rateCalculator = new RateCalculator({loadProfile, ...rate});

      expect(rateCalculator.annualCost()).toEqual(360);
      expect(rateCalculator.annualCost({billingCategories: [BillingCategory.SUPPLY]})).toEqual(120);
      expect(rateCalculator.annualCost({billingCategories: [BillingCategory.DELIVERY]})).toEqual(240);
    });
  });
});
