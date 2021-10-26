import PriceProfile from '../PriceProfile';
import LoadProfile from '../LoadProfile';
import RateElement from '../RateElement';
import { RateElementType } from '../BillingDeterminantFactory';

const YEAR = 2019;
const priceData = Array(8760).fill(0);
const ARBITRARY_HOUR_INDEX = 50;
priceData[ARBITRARY_HOUR_INDEX] = 5;

const rateElementData = {
  name: 'An hourly energy rate',
  rateElementType: 'HourlyEnergy' as RateElementType,
  priceProfile: new PriceProfile(priceData, {year: YEAR}),
};

const loadProfile = new LoadProfile(Array(8760).fill(2), {year: YEAR})

const rateElement = new RateElement(rateElementData, loadProfile)

describe('RateElement', () => {
  describe('HourlyEnergy', () => {
    it('creates a rate component for each hour', () => {

      expect(rateElement.rateComponents().length).toEqual(8760);
    });

    it('calculates the monthly costs', () => {
      expect(rateElement.costs()).toEqual(
        [10,0,0,0,0,0,0,0,0,0,0,0]
      )
    });
  });
});
