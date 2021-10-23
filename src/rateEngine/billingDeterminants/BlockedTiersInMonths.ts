import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import times from 'lodash/times';
import LoadProfile from '../LoadProfile';
import BillingDeterminants, { BillingDeterminantsUnits } from './_BillingDeterminants';
import { BlockedTiersArgs } from './BlockedTiersInDays';
import { LoadProfileFilterArgs } from '../LoadProfileFilter';
import { RateElementClassification } from '../RateElement';

class BlockedTiersInMonths extends BillingDeterminants {
  private _loadProfile: LoadProfile;
  private _min: Array<number>;
  private _max: Array<number>;
  private _filters: LoadProfileFilterArgs;

  rateElementType = 'Blocked Tier';
  rateElementClassification = RateElementClassification.ENERGY;
  units = BillingDeterminantsUnits.KWH;

  constructor({ min, max, ...filters }: BlockedTiersArgs, loadProfile: LoadProfile) {
    super();

    this._loadProfile = loadProfile;
    this._min = min;
    this._max = max;
    this._filters = filters;
  }

  filteredLoadProfile(): LoadProfile {
    return this._loadProfile.filterBy(this._filters);
  }

  calculate(): Array<number> {
    const mins = this._min;
    const maxes = this._max;

    const expandedLoadProfile = this.filteredLoadProfile().expanded();

    const monthlyExpandedLoadProfile = Object.values(groupBy(expandedLoadProfile, 'month'));
    const kwhByMonth = monthlyExpandedLoadProfile.map((loadProfiles) => sumBy(loadProfiles, 'load'));

    return times(12, i => {
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

export default BlockedTiersInMonths;
