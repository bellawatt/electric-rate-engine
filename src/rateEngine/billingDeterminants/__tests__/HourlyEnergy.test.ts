import HourlyEnergy from '../HourlyEnergy';
import LoadProfile from '../../LoadProfile';

describe('HourlyEnergy', () => {
  describe('with a February hour', () => {
    it('returns an array with the kWh for that hour in the second element', () => {
      const februaryHour = 40 * 24;
      const loadProfile = new LoadProfile(Array(8760).fill(1), {year: 2019});
      const hourlyEnergy = new HourlyEnergy({hourOfYear: februaryHour}, loadProfile);
      expect(hourlyEnergy.calculate()).toEqual(
        [0,1,0,0,0,0,0,0,0,0,0,0]
      );
    });
  });
});
