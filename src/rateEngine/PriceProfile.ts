import maxBy from 'lodash.maxby';
import times from 'lodash.times';
import LoadProfileFilter from './LoadProfileFilter';
import type { DetailedPriceProfileHour, LoadProfileFilterArgs, PriceProfileOptions } from './types';
import { addDecimals } from './utils/decimals';
import expandedDates from './utils/expandedDates';

const isPriceProfileObject = (p: Array<number> | Array<DetailedPriceProfileHour> | PriceProfile): p is PriceProfile => {
  return 'expanded' in p && typeof p['expanded'] === 'function';
};

const isNumberArray = (p: Array<number> | Array<DetailedPriceProfileHour>): p is Array<number> => {
  return typeof p[0] === 'number';
};

class PriceProfile {
  private _expanded: Array<DetailedPriceProfileHour>;
  private _year: number;

  constructor(loadProfile: Array<number>, options: PriceProfileOptions);
  constructor(existingPriceProfile: PriceProfile | Array<number>, options: PriceProfileOptions);
  constructor(expandedPriceProfile: Array<DetailedPriceProfileHour>, options: PriceProfileOptions);
  constructor(
    priceProfileOrExpandedOrExisting: Array<number> | Array<DetailedPriceProfileHour> | PriceProfile,
    options: PriceProfileOptions,
  ) {
    this._year = options.year;
    
    if (isPriceProfileObject(priceProfileOrExpandedOrExisting)) {
      this._expanded = priceProfileOrExpandedOrExisting.expanded();
    } else if (isNumberArray(priceProfileOrExpandedOrExisting)) {
      this._expanded = this._buildFromNumberArray(priceProfileOrExpandedOrExisting);
    } else {
      this._expanded = priceProfileOrExpandedOrExisting;
    }
  }

  expanded(): Array<DetailedPriceProfileHour> {
    return this._expanded;
  }

  priceValues(): Array<number> {
    return this.expanded().map(({ price }) => price);
  }

  filterBy(filters: LoadProfileFilterArgs) {
    const filter = new LoadProfileFilter(filters);

    const filteredLoadProfile = this.expanded().map(({ price, ...detailedPriceProfileHour }) =>
      filter.matches(detailedPriceProfileHour) ? price : 0,
    );

    return new PriceProfile(filteredLoadProfile, { year: this._year });
  }

  maxByMonth(): Array<number> {
    const months = times(12, (i) => i);
    const expanded = this.expanded();

    return months.map((m) => {
      const monthPrices = expanded.filter(({ month }) => m === month).map(({ price }) => price);
      return Math.max(...monthPrices);
    });
  }

  sum(): number {
    return this.expanded().reduce((sum, { price }) => addDecimals(sum, price), 0);
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
    return maxBy(this.expanded(), 'price')?.price ?? 0;
  }

  _buildFromNumberArray(priceProfile: Array<number>) {
    const dates = expandedDates(this._year);

    if (dates.length !== priceProfile.length) {
      throw new Error("Price profile length didn't match annual hours length. Maybe a leap year is involved?");
    }

    return (this._expanded = priceProfile.map((price, i) => ({
      price,
      ...dates[i],
    })));
  }
}

export default PriceProfile;
