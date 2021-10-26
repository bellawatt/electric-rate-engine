import times from 'lodash/times';
import maxBy from 'lodash/maxBy';
import { addDecimals } from './utils/decimals';
import LoadProfileFilter, { LoadProfileFilterArgs } from './LoadProfileFilter';
import expandedDates, { ExpandedDate } from './utils/expandedDates';
import LoadProfileScaler from './LoadProfileScaler';

export interface DetailedPriceProfileHour extends ExpandedDate {
  price: number;
}

interface Options {
  year: number;
}

class PriceProfile {
  private _priceProfile?: Array<number>;
  private _expanded?: Array<DetailedPriceProfileHour>;
  private _year: number;

  constructor(loadProfile: Array<number>, options: Options);
  constructor(existingPriceProfile: PriceProfile | Array<number>, options: Options);
  constructor(expandedPriceProfile: Array<DetailedPriceProfileHour>, options: Options);
  constructor(
    priceProfileOrExpandedOrExisting: Array<number> | Array<DetailedPriceProfileHour> | PriceProfile,
    options: Options,
  ) {
    if (typeof priceProfileOrExpandedOrExisting['expanded'] === 'function') {
      this._expanded = (priceProfileOrExpandedOrExisting as PriceProfile).expanded();
    } else if (typeof priceProfileOrExpandedOrExisting[0] === 'number') {
      this._priceProfile = priceProfileOrExpandedOrExisting as Array<number>;
    } else {
      this._expanded = priceProfileOrExpandedOrExisting as Array<DetailedPriceProfileHour>;
    }

    this._year = options.year;
  }

  expanded(): Array<DetailedPriceProfileHour> {
    if (this._expanded) {
      return this._expanded;
    }

    const dates = expandedDates(this._year);

    if (dates.length !== this._priceProfile.length) {
      throw new Error("Price profile length didn't match annual hours length. Maybe a leap year is involved?");
    }

    return (this._expanded = this._priceProfile.map((price, i) => ({
      price,
      ...dates[i],
    })));
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

    return maxBy(this.expanded(), 'price').price;
  }
}

export default PriceProfile;
