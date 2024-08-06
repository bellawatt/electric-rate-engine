import times from 'lodash/times';
import maxBy from 'lodash/maxBy';
import { addDecimals } from './utils/decimals';
import LoadProfileFilter from './LoadProfileFilter';
import expandedDates from './utils/expandedDates';
import LoadProfileScaler from './LoadProfileScaler';
import type {
  DetailedLoadProfileHour,
  LoadProfileOptions,
  LoadProfileFilterArgs,
  ExpandedDate,
  LoadProfileScalerOptions,
} from './types';

const isLoadProfileObject = (p: Array<number> | Array<DetailedLoadProfileHour> | LoadProfile): p is LoadProfile => {
  return typeof p['expanded'] === 'function';
};

const isNumberArray = (p: Array<number> | Array<DetailedLoadProfileHour> | LoadProfile): p is Array<number> => {
  return typeof p[0] === 'number';
};

class LoadProfile {
  private _loadProfile?: Array<number>;
  private _expanded?: Array<DetailedLoadProfileHour>;
  private _year: number;

  constructor(loadProfile: Array<number>, options: LoadProfileOptions);
  constructor(existingLoadProfile: LoadProfile | Array<number>, options: LoadProfileOptions);
  constructor(expandedLoadProfile: Array<DetailedLoadProfileHour>, options: LoadProfileOptions);
  constructor(
    loadProfileOrExpandedOrExisting: Array<number> | Array<DetailedLoadProfileHour> | LoadProfile,
    options: LoadProfileOptions,
  ) {
    if (isLoadProfileObject(loadProfileOrExpandedOrExisting)) {
      this._expanded = loadProfileOrExpandedOrExisting.expanded();
    } else if (isNumberArray(loadProfileOrExpandedOrExisting)) {
      this._loadProfile = loadProfileOrExpandedOrExisting;
    } else {
      this._expanded = loadProfileOrExpandedOrExisting;
    }

    this._year = options.year;
  }

  expanded(): Array<DetailedLoadProfileHour> {
    if (this._expanded) {
      return this._expanded;
    }

    const dates = expandedDates(this._year);

    if (dates.length !== this._loadProfile.length) {
      throw new Error("Load profile length didn't match annual hours length. Maybe a leap year is involved?");
    }

    return (this._expanded = this._loadProfile.map((load, i) => ({
      load,
      ...dates[i],
    })));
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
    let sums = times(12, () => 0);

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
    let months = times(12, () => []);

    this.expanded().forEach(({ load, month }) => {
      months[month].push(load);
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

    return maxBy(this.expanded(), 'load').load;
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
      this._loadProfile.map((loadHour, idx) => {
        return addDecimals(loadHour, otherLoadProfile.expanded()[idx].load);
      }),
      { year: this._year },
    );
  }
}

export default LoadProfile;
