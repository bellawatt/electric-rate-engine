import groupBy from 'lodash.groupby';
import sumBy from 'lodash.sumby';
import times from 'lodash.times';
import LoadProfile from '../LoadProfile';
import BillingDeterminants from './_BillingDeterminants';
import {  } from '../LoadProfileFilter';
import { daysPerMonth } from '../utils/assumptions';
import convertInfinities from '../utils/convertInfinities';
import { RateElementClassification, BillingDeterminantsUnits, RateElementTypeEnum } from '../constants';
import type { BlockedTiersArgs, LoadProfileFilterArgs } from '../types';

class BlockedTiersInDays extends BillingDeterminants {
  private _loadProfile: LoadProfile;
  private _min: Array<number>;
  private _max: Array<number>;
  private _filters: LoadProfileFilterArgs;

  rateElementType = RateElementTypeEnum.BlockedTiersInDays;
  rateElementClassification = RateElementClassification.ENERGY;
  units = BillingDeterminantsUnits.KWH;

  constructor({ min, max, ...filters }: BlockedTiersArgs, loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
    this._min = convertInfinities(min);
    this._max = convertInfinities(max);
    this._filters = filters;
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    const mins = daysPerMonth(this._loadProfile.year).map((days, i) => days * this._min[i]);
    const maxes = daysPerMonth(this._loadProfile.year).map((days, i) => days * this._max[i]);

    const expandedLoadProfile = this.filteredLoadProfile().expanded();

    const monthlyExpandedLoadProfile = Object.values(groupBy(expandedLoadProfile, 'month'));
    const kwhByMonth = monthlyExpandedLoadProfile.map((loadProfiles) => sumBy(loadProfiles, 'load'));

    return times(12, (i) => {
      const kwh = kwhByMonth[i] || 0;
      if (kwh < mins[i]) {
        return 0;
      }
      if (kwh > maxes[i]) {
        return maxes[i] - mins[i];
      }
      return kwh - mins[i];
    });
  }
}

export default BlockedTiersInDays;
