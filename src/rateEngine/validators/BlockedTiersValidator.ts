import Validator from './_Validator';
import times from 'lodash.times';
import expandedDates from '../utils/expandedDates';
import LoadProfileFilter from '../LoadProfileFilter';
import LoadProfile from '../LoadProfile';
import type { MinMaxPair, BlockedTiersArgs } from '../types';
import convertInfinities from '../utils/convertInfinities';

class BlockedTiersValidator extends Validator {
  private _args: Array<BlockedTiersArgs>;
  private _localErrors: Array<{english: string, data: Record<string, unknown>, type: string}> = [];
  private _year: number;

  constructor (args: Array<BlockedTiersArgs>, loadProfile: LoadProfile) {
    super();

    this._args = args;
    this._year = loadProfile.year;
  }

  validate() {
    this.validateBasics();
    this.validateExpandedDates();

    if (this._localErrors.length > 0) {
      this.addError('Blocked Tiers Error', this._localErrors)
    }

    return this;
  }

  filters() {
    return this._args.map(({min, max, ...filters}) => ({
      min: convertInfinities(min),
      max: convertInfinities(max),
      filter: new LoadProfileFilter(filters),
    }));
  }

  validateExpandedDates() {
    const dates = expandedDates(this._year);
    const filters = this.filters();

    dates.forEach(expandedDate => {
      const matches = filters.filter(({filter}) => filter.matches(expandedDate));

      if (matches.length === 0) {
        this._localErrors.push({
          english: `No tiers are defined for ${JSON.stringify(expandedDate)}`,
          type: 'missing-tier',
          data: {expandedDate},
        })
        return;
      }

      this.validateOverlap(matches);
      this.validateRange(matches);
    });
  }

  protected validateBasics() {
    this._args.forEach(({min, max}: BlockedTiersArgs) => {
      if (min.length !== 12 || max.length !== 12) {
        this._localErrors.push({
          english: `Incorrect amound of arguments found in blocked tier: found ${min.length} min and ${max.length} max`,
          data: {},
          type: 'argument-length',
        });
      }
    });
  }

  protected getSortedPairs(minsAndMaxes: Array<{ min: Array<number>; max: Array<number>; }>): Array<Array<MinMaxPair>> {
    return times(12, i => {
      return minsAndMaxes.map(({min, max}) => ({min: min[i], max: max[i]})).sort((a, b) => a.min - b.min);
    });
  }

  protected validateOverlap(minsAndMaxes: Array<{ min: Array<number>; max: Array<number>; }>) {
    if (this._args.length < 2) return;

    const monthPairs = this.getSortedPairs(minsAndMaxes);

    monthPairs.forEach((pairs, month) => {
      for (let i = 1; i < pairs.length; i++) {
        if (pairs[i - 1].max > pairs[i].min) {
          this._localErrors.push({
            english: `Overlap in blocked tier min/maxes found in month ${month} between max: ${pairs[i-1].max} and min: ${pairs[i].min}`,
            data: {month, max: pairs[i-1].max, min: pairs[i].min},
            type: 'overlap',
          });
        }
      }
    });
  }

  protected validateRange(minsAndMaxes: Array<{ min: Array<number>; max: Array<number>; }>) {
    const monthPairs = this.getSortedPairs(minsAndMaxes);

    monthPairs.forEach((pairs, month) => {
      if (pairs[0].min > 0) {
        this._localErrors.push({
          english: `Lowest blocked tier min for month ${month} is ${pairs[0].min}, expected 0.`,
          data: {month, min: pairs[0].min},
          type: 'min',
        });
      }

      if (pairs.map(({max}) => max).sort()[pairs.length - 1] < Infinity) {
        this._localErrors.push({
          english: `Highest blocked tier for month ${month} is less than Infinity.`,
          data: {month},
          type: 'max',
        });
      }

      if (pairs.length > 1) {

        for (let i = 1; i < pairs.length; i++) {
          if (pairs[i - 1].max !== pairs[i].min) {
            this._localErrors.push({
              english: `Gap in blocked tier min/maxes found in month ${month} between max: ${pairs[i - 1].max} and min: ${pairs[i].min}`,
              data: {month, max: pairs[i - 1].max, min: pairs[i].min},
              type: 'gap',
            });
          }
        }
      }
    });
  }
}

export default BlockedTiersValidator;
