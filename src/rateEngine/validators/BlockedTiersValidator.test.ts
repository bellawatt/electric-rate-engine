import BlockedTiersValidator from "./BlockedTiersValidator";
import LoadProfile from '../LoadProfile';
import RateCalculator from '../RateCalculator';

describe('BlockedTiersValidator', () => {
  let loadProfile;

  beforeEach(() => {
    loadProfile = new LoadProfile(new Array(8760).fill(1), {year: 2018})
  });

  describe('a non filtered blocked tier definition', () => {
    it('passes validation', () => {
      const blockedTiers = [
        {
          min: new Array(12).fill(0),
          max: new Array(12).fill(Infinity)
        },
      ];

      const validator = new BlockedTiersValidator(blockedTiers, loadProfile);
      validator.validate();
      expect(validator.hasErrors()).toBe(false);
    });
  });

  describe('a filtered blocked tier definition', () => {
    it('passes validation', () => {
      const blockedTiers = [
        {
          min: new Array(12).fill(0),
          max: new Array(12).fill(Infinity),
          daysOfWeek: [1,2,3,4,5],
        },
        {
          min: new Array(12).fill(0),
          max: new Array(12).fill(Infinity),
          daysOfWeek: [6,0],
        },
      ];

      const validator = new BlockedTiersValidator(blockedTiers, loadProfile);
      validator.validate();
      expect(validator.hasErrors()).toBe(false);
    });

    describe('with a missing weekday', () => {
      it('fails validation', () => {
        const blockedTiers = [
          {
            min: new Array(12).fill(0),
            max: new Array(12).fill(Infinity),
            daysOfWeek: [1,2,3,4,5],
          },
          {
            min: new Array(12).fill(0),
            max: new Array(12).fill(Infinity),
            daysOfWeek: [6],
          },
        ];

        const validator = new BlockedTiersValidator(blockedTiers, loadProfile);
        validator.validate();
        expect(validator.hasErrors()).toBe(true);
        const SUNDAYS_IN_2018 = 52;
        const HOURS_IN_DAY = 24;
        expect(validator.allErrors().length).toBe(SUNDAYS_IN_2018 * HOURS_IN_DAY);
      });
    });

    describe('with a weekday defined more than once', () => {
      it('fails validation', () => {
        const blockedTiers = [
          {
            min: new Array(12).fill(0),
            max: new Array(12).fill(Infinity),
            daysOfWeek: [1,2,3,4,5,0],
          },
          {
            min: new Array(12).fill(0),
            max: new Array(12).fill(Infinity),
            daysOfWeek: [6,0],
          },
        ];

        const validator = new BlockedTiersValidator(blockedTiers, loadProfile);
        validator.validate();
        expect(validator.hasErrors()).toBe(true);
        const SUNDAYS_IN_2018 = 52;
        const HOURS_IN_DAY = 24;
        const MONTHS_IN_YEAR = 12;

        expect(validator.allErrors().length).toBe(SUNDAYS_IN_2018 * HOURS_IN_DAY * (MONTHS_IN_YEAR * 2));
      });
    });
  })
});
