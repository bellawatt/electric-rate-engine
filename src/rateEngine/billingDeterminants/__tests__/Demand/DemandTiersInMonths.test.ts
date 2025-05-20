import LoadProfile from '../../../LoadProfile';
import Demand from '../../Demand';

const KWS_GREATER_THAN_ONE = [2, 5, 20, 15, 12, 17, 4, 8, 30, 10, 4, 15];

const YEAR = 2019;

const loadProfileData = new Array(8760).fill(1);
const ONE_MONTH_IN_HOURS = 30 * 24;
const TEN_DAYS_IN_HOURS = 10 * 24; // one month in hours is approximate, so add a 10 day buffer at the end
KWS_GREATER_THAN_ONE.forEach((load, monthIdx) => {
  // Set these load values to some arbitrary hour in each month
  const idx = monthIdx * ONE_MONTH_IN_HOURS + TEN_DAYS_IN_HOURS;
  loadProfileData[idx] = load;
});

const loadProfile = new LoadProfile(loadProfileData, { year: YEAR });

describe('DemandTiers', () => {
  describe('non time filtered', () => {
    it('calculates a limitless tier', () => {
      const tiers = new Demand(
        {
          demandPeriod: 'monthly',
          options: {
            min: Array(12).fill(0),
            max: Array(12).fill(Infinity),
          },
        },
        loadProfile,
      );

      expect(tiers.calculate()).toEqual(KWS_GREATER_THAN_ONE);
    });

    it('calculates a lower bounded tier', () => {
      const tiers = new Demand(
        {
          demandPeriod: 'monthly',
          options: {
            min: Array(12).fill(1),
            max: Array(12).fill(Infinity),
          },
        },
        loadProfile,
      );

      expect(tiers.calculate()).toEqual(KWS_GREATER_THAN_ONE.map((load) => load - 1));
    });

    it('calculates an upper bounded tier', () => {
      const tiers = new Demand(
        {
          demandPeriod: 'monthly',
          options: {
            min: Array(12).fill(0),
            max: Array(12).fill(1),
          },
        },
        loadProfile,
      );

      expect(tiers.calculate()).toEqual(Array(12).fill(1));
    });

    it('calculates a tier bounded on both sides', () => {
      const MIN = 1;
      const MAX = 5;
      const tiers = new Demand(
        {
          demandPeriod: 'monthly',
          options: {
            min: Array(12).fill(MIN),
            max: Array(12).fill(MAX),
          },
        },
        loadProfile,
      );

      const expected = [1, 4, 4, 4, 4, 4, 3, 4, 4, 4, 3, 4];
      expect(tiers.calculate()).toEqual(expected);
    });
  });

  describe('with time specific filters', () => {
    it('calculates a limitless tier', () => {
      const tiers = new Demand(
        {
          demandPeriod: 'monthly',
          options: {
            min: Array(12).fill(0),
            max: Array(12).fill(Infinity),
            filters: {
              months: [0, 1],
            },
          },
        },
        loadProfile,
      );

      expect(tiers.calculate()).toEqual([KWS_GREATER_THAN_ONE[0], KWS_GREATER_THAN_ONE[1], ...Array(10).fill(0)]);
    });
  });
});
