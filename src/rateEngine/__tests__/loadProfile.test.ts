import LoadProfile from '../LoadProfile';
import times from 'lodash.times';
import LoadProfileScaler from '../LoadProfileScaler';

const getLoadProfileOfOnes = () => times(8760, () => 1);
const options = {year: 2018};

describe('Load Profile', () => {
  let loadProfile: LoadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(getLoadProfileOfOnes(), options);
  });

  describe('instantiation', () => {
    it('can be instantiated with another load profile', () => {
      const newLoadProfile = new LoadProfile(loadProfile, options);
      const expanded = newLoadProfile.expanded();

      expect(expanded[0]).toEqual({
        load: 1,
        month: 0,
        dayOfWeek: 1,
        hourOfYear: 0,
        hourStart: 0,
        date: '2018-01-01',
      });
    });
  });

  describe('expanded', () => {
    it('creates an expanded load profile', () => {
      const expanded = loadProfile.expanded();

      expect(expanded[0]).toEqual({
        load: 1,
        month: 0,
        dayOfWeek: 1,
        hourOfYear: 0,
        hourStart: 0,
        date: '2018-01-01',
      });
    })
  });

  describe('filterBy', () => {
    it('filters by month', () => {
      const filteredByMonth = loadProfile.filterBy({months: [0]});

      expect(filteredByMonth.expanded().map(({load}) => load)).toEqual(
        (new Array(31*24).fill(1)).concat((new Array(8760 - (31*24))).fill(0))
      );
    });
  });

  describe('sum', () => {
    it('sums the load profile values', () => {
      expect(loadProfile.sum()).toEqual(8760);
      expect(loadProfile.filterBy({months: [0]}).sum()).toEqual(31 * 24);
    });
  });

  describe('leap year', () => {
    it('handles leap year load profiles', () => {
      const leapYearLoadProfile = new LoadProfile(times(8784, () => 1), {year: 2020});

      expect(leapYearLoadProfile.sum()).toEqual(8784);
      expect(leapYearLoadProfile.filterBy({months: [1]}).sum()).toEqual(29 * 24);
    });

    it('raises an error when the data and the expected year hours dont match up', () => {
      expect(() => new LoadProfile(getLoadProfileOfOnes(), {year: 2020})).toThrow("Load profile length didn't match annual hours length. It's likely a leap year is involved.");
      expect(() => new LoadProfile(times(8784, () => 1), {year: 2019})).toThrow("Load profile length didn't match annual hours length. It's likely a leap year is involved.");
    });
  });

  describe('count', () => {
    it('returns the count', () => {
      expect(loadProfile.count()).toEqual(8760);
    });

    it('allows a length property too', () => {
      expect(loadProfile.length).toEqual(8760);
    });
  });

  describe('average', () => {
    it('calculates the average load', () => {
      expect(loadProfile.average()).toEqual(1);
    });
  });

  describe('max', () => {
    it('returns the max load', () => {
      const maxLoadData = getLoadProfileOfOnes();
      maxLoadData[83] = 4; // set some arbitrary element to somethign bigger than a 1
      loadProfile = new LoadProfile(maxLoadData, options);

      expect(loadProfile.max()).toEqual(4);
    });

    it('works empty', () => {
      loadProfile = new LoadProfile([], {year: 2018});

      expect(loadProfile.max()).toEqual(0);
    });
  });

  describe('sumByMonth', () => {
    it('returns a monthly array of summed load', () => {
      const loadProfile = new LoadProfile(getLoadProfileOfOnes(), options);
      expect(loadProfile.sumByMonth()).toEqual(
        [744, 672, 743, 720, 744, 720, 744, 744, 720, 744, 721, 744]
      )
    });
  });

  describe('maxByMonth', () => {
    it('returns a monthly array of max load', () => {
      const loadProfileData = getLoadProfileOfOnes();
      const loadProfileOfOnes = new LoadProfile(getLoadProfileOfOnes(), options);

      // This gets the index of the first Wednesday of each month
      // so that we can set a max value for each month that is > 1.
      const maxhours = times(12).map((monthIdx) => {
        const hourOfMonth = loadProfileOfOnes.expanded().find(({month, dayOfWeek}) => (
          month === monthIdx && dayOfWeek === 3
        )) 

        // .find's interface returns T | undefined so we need the ?? 0 here although it should never be 0
        return hourOfMonth?.hourOfYear ?? 0
      });

      const maxes = [13,14,15,16,17,18,19,20,21,22,23,24];
      maxhours.forEach((hour, idx) => {
        loadProfileData[hour] = maxes[idx];
      });
      
      expect(new LoadProfile(loadProfileData, options).maxByMonth()).toEqual(maxes);
    })
  })

  describe('loadFactor', () => {
    it('returns one from our load profile of ones', () => {
      expect(loadProfile.loadFactor()).toEqual(1);
    });

    it('returns nearly 0 for a load profile with just one 1', () => {
      loadProfile = new LoadProfile([1, ...times(8759, () => 0)], options);
      expect(loadProfile.loadFactor()).toBeCloseTo(0);
    });

    it('returns .5 for a half and half load profile', () => {
      loadProfile = new LoadProfile([...times(4380, () => 10), ...times(4380, () => 0)], options);
      expect(loadProfile.loadFactor()).toEqual(.5);
    });

    it('works empty', () => {
      const lp = new LoadProfile([], {year: 2018});

      expect(lp.loadFactor()).toEqual(0);
    });
  });

  describe('scale', () => {
    it('returns a LoadProfileScaler instance', () => {
      expect(loadProfile.scale()).toEqual(
        new LoadProfileScaler(loadProfile)
      );
    });
  });

  describe('loadShift', () => {
    it('returns a shifted load profile instance', () => {
     const shiftedLoadProfile = loadProfile.loadShift(1, {months: [0]});

     expect(shiftedLoadProfile).toEqual(
        new LoadProfile(
          (new Array(31*24).fill(2)).concat((new Array(8760 - (31*24))).fill(1)),
          options
        )
      )
    }); 
  });

  describe('aggregate', () => {
    it('sums the load profiles by indexes', () => {
      expect(loadProfile.aggregate(loadProfile)).toEqual(
        new LoadProfile(
          (new Array(8760).fill(2)),
          options
        )
      );
    });
  });

  describe('loadValues', () => {
    it('returns an array of load values', () => {
      expect(loadProfile.loadValues()).toEqual(getLoadProfileOfOnes());
    });
  });
});
