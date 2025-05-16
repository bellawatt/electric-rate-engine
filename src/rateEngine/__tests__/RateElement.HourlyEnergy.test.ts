import PriceProfile from '../PriceProfile';
import LoadProfile from '../LoadProfile';
import RateElement from '../RateElement';
import { RateElementInterface } from '../types/index';
import { RateElementTypeEnum } from '../constants/index';

const YEAR = 2019;
const priceData = Array(8760).fill(0);
const ARBITRARY_HOUR_INDEX = 50;
priceData[ARBITRARY_HOUR_INDEX] = 5;

const rateElementData: RateElementInterface = {
  name: 'An hourly energy rate',
  rateElementType: RateElementTypeEnum.HourlyEnergy,
  priceProfile: priceData,
  rateComponents: []
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

    it('works with a PriceProfile for backwards compatibility', () => {
      const data: RateElementInterface = {
        name: 'A rate element with a PriceProfile',
        rateElementType: RateElementTypeEnum.HourlyEnergy,
        priceProfile: new PriceProfile(priceData, {year: YEAR}),
        rateComponents: []
      }

      const rateElement = new RateElement(data, loadProfile);

      expect(rateElement.costs()).toEqual(
        [10,0,0,0,0,0,0,0,0,0,0,0]
      )
    });
  });
});
