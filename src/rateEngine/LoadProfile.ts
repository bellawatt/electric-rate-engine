import maxBy from 'lodash.maxby';
import times from 'lodash.times';
import LoadProfileFilter from './LoadProfileFilter';
import LoadProfileScaler from './LoadProfileScaler';
import type {
  DetailedLoadProfileHour,
  LoadProfileFilterArgs,
  LoadProfileOptions,
  LoadProfileScalerOptions,
} from './types';
import { addDecimals } from './utils/decimals';
import expandedDates from './utils/expandedDates';

const isLoadProfileObject = (p: Array<number> | Array<DetailedLoadProfileHour> | LoadProfile): p is LoadProfile => {
  return 'expanded' in p && typeof p['expanded'] === 'function';
};

const isNumberArray = (p: Array<number> | Array<DetailedLoadProfileHour>): p is Array<number> => {
  return typeof p[0] === 'number';
};

class LoadProfile {
  private _expanded: Array<DetailedLoadProfileHour>;
  private _year: number;

  constructor(loadProfile: Array<number>, options: LoadProfileOptions);
  constructor(existingLoadProfile: LoadProfile | Array<number>, options: LoadProfileOptions);
  constructor(expandedLoadProfile: Array<DetailedLoadProfileHour>, options: LoadProfileOptions);
  constructor(
    loadProfileOrExpandedOrExisting: Array<number> | Array<DetailedLoadProfileHour> | LoadProfile,
    options: LoadProfileOptions,
  ) {
    this._year = options.year;

    if (isLoadProfileObject(loadProfileOrExpandedOrExisting)) {
      this._expanded = loadProfileOrExpandedOrExisting.expanded();
    } else if (isNumberArray(loadProfileOrExpandedOrExisting)) {
      this._expanded = this._buildFromNumberArray(loadProfileOrExpandedOrExisting);
    } else {
      this._expanded = loadProfileOrExpandedOrExisting;
    }
  }

  expanded(): Array<DetailedLoadProfileHour> {
    return this._expanded;
  }

  loadValues(): Array<number> {
    return this.expanded().map(({ load }) => load);
  }

  filterBy(filters: LoadProfileFilterArgs) {
    const filter = new LoadProfileFilter(filters);

    const filteredLoadProfile = this.expanded().map(({ load, ...detailedLoadProfileHour }) =>
      filter.matches(detailedLoadProfileHour) ? load : 0,
    );

    return new LoadProfile(filteredLoadProfile, { year: this._year });
  }

  loadShift(amount: number, filters: LoadProfileFilterArgs) {
    const filter = new LoadProfileFilter(filters);

    const shiftedLoadProfile = this.expanded().map((detailedLoadProfileHour) =>
      filter.matches(detailedLoadProfileHour) ? detailedLoadProfileHour.load + amount : detailedLoadProfileHour.load,
    );

    return new LoadProfile(shiftedLoadProfile, { year: this._year });
  }

  sumByMonth(): Array<number> {
    const sums = times(12, () => 0);

    this.expanded().forEach(({ load, month }) => {
      sums[month] = addDecimals(sums[month], load);
    });

    return sums;
  }

  maxByMonth(): Array<number> {
    const months = times(12, (i) => i);
    const expanded = this.expanded();

    return months.map((m) => {
      const monthLoads = expanded.filter(({ month }) => m === month).map(({ load }) => load);
      return Math.max(...monthLoads);
    });
  }

  byMonth(): Array<Array<number>> {
    const months = times(12, () => []);

    this.expanded().forEach(({ load, month }) => {
      (months[month] as Array<number>).push(load);
    });

    return months;
  }

  sum(): number {
    return this.expanded().reduce((sum, { load }) => addDecimals(sum, load), 0);
  }

  count(): number {
    return this.expanded().length;
  }

  get length(): number {
    return this.count();
  }

  get year(): number {
    return this._year;
  }

  average(): number {
    return this.sum() / this.count();
  }

  max(): number {
    if (this.count() === 0) {
      return 0;
    }

    // lodash's maxBy interface returns T | undefined so we need the ?? 0 here although it should never be 0
    return maxBy(this.expanded(), 'load')?.load ?? 0;
  }

  loadFactor(): number {
    if (this.count() === 0) {
      return 0;
    }

    return this.sum() / (this.count() * this.max());
  }

  scale(options?: LoadProfileScalerOptions): LoadProfileScaler {
    return new LoadProfileScaler(this, options);
  }

  aggregate(otherLoadProfile: LoadProfile): LoadProfile {
    return new LoadProfile(
      this.expanded().map(({ load }, idx) => {
        return addDecimals(load, otherLoadProfile.expanded()[idx].load);
      }),
      { year: this._year },
    );
  }

  private _buildFromNumberArray(loadProfileNumberArray: Array<number>): Array<DetailedLoadProfileHour> {
    const dates = expandedDates(this._year);

    if (!loadProfileNumberArray.length) {
      throw new Error('Cannot build LoadProfile instance. Instantiated with an empty loadProfile array.');
    }

    if (dates.length !== loadProfileNumberArray.length) {
      const isLeapYearInvolved = Math.abs(dates.length - loadProfileNumberArray.length) === 24;
      throw new Error(
        `Load profile length didn't match annual hours length.${
          isLeapYearInvolved ? " It's likely a leap year is involved." : ' Maybe a leap year is involved.'
        }`,
      );
    }

    return loadProfileNumberArray.map((load, i) => ({
      load,
      ...dates[i],
    }));
  }
}

export default LoadProfile;
